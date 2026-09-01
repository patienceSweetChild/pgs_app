"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { crossSurfaceLink } from "@pgs/shared";
import {
  STAFF_LOGIN_COPY,
  type StaffLoginVariant,
} from "./copy";
import "./staff-login.css";

function normalizeError(raw: string): string {
  if (raw === "config") return "Authentication is not configured.";
  if (raw === "forbidden") {
    return "Your account is signed in but lacks permission for this portal.";
  }
  if (raw === "not_staff") {
    return "Signed in, but this account is not staff. Run the seed SQL for admin@testemail.com in Supabase, or use a staff account.";
  }
  if (raw === "forbidden") {
    return "Your account is signed in but does not have staff access. Ask an admin to add you in staff_profiles.";
  }
  return raw;
}

const STUDENT_SITE_URL =
  process.env.NEXT_PUBLIC_WEB_SITE_URL ?? "http://localhost:3000";

export function StaffLoginSurface({ variant }: { variant: StaffLoginVariant }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = STAFF_LOGIN_COPY[variant];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const raw = (searchParams.get("redirect") || "").trim();
    if (!raw || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      return copy.defaultRedirect;
    }
    return raw.startsWith("/") ? raw : `/${raw}`;
  }, [copy.defaultRedirect, searchParams]);

  const queryError = useMemo(() => {
    const raw = (searchParams.get("error") || "").trim();
    return raw ? normalizeError(raw) : null;
  }, [searchParams]);

  const error = formError ?? queryError;

  useEffect(() => {
    document.documentElement.classList.add("pgs-staff-login-html");
    return () => {
      document.documentElement.classList.remove("pgs-staff-login-html");
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    setSubmitting(true);
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (!isSupabaseConfigured()) {
        setFormError("Authentication is not configured.");
        return;
      }

      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient(variant);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setFormError(signInError.message);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="pgs-staff-login">
      <section className="pgs-staff-login__panel" aria-labelledby="staff-login-title">
        <div className="pgs-staff-login__brand">
          <span className="pgs-staff-login__mark" aria-hidden>
            P
          </span>
          <div>
            <strong>{copy.brandLine}</strong>
            <small>{copy.eyebrow}</small>
          </div>
        </div>

        <div className="pgs-staff-login__intro">
          <p className="pgs-staff-login__eyebrow">Internal staff access</p>
          <h1 id="staff-login-title" className="pgs-staff-login__title">
            {copy.title}
          </h1>
          <span className="pgs-staff-login__subtitle">{copy.subtitle}</span>
        </div>

        <form className="pgs-staff-login__form" onSubmit={onSubmit}>
          <label className="pgs-staff-login__label">
            Work email
            <input
              className="pgs-staff-login__input"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="pgs-staff-login__label">
            Password
            <input
              className="pgs-staff-login__input"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <p className="pgs-staff-login__error" role={error ? "alert" : undefined}>
            {error ?? "\u00a0"}
          </p>

          <button type="submit" className="pgs-staff-login__submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="pgs-staff-login__links">
            <Link href="/forgot_password">Forgot password?</Link>
            <Link href={STUDENT_SITE_URL}>Student site</Link>
          </div>
        </form>

        <p className="pgs-staff-login__help">{copy.help}</p>

        <p className="pgs-staff-login__help" style={{ marginTop: 12 }}>
          Other staff portals:{" "}
          <Link href={crossSurfaceLink("ops", "/login", { NEXT_PUBLIC_PGS_SURFACE: variant })}>
            Operations
          </Link>
          {" · "}
          <Link href={crossSurfaceLink("admin", "/login", { NEXT_PUBLIC_PGS_SURFACE: variant })}>
            CMS Admin
          </Link>
          {" · "}
          <Link href={crossSurfaceLink("cms", "/login", { NEXT_PUBLIC_PGS_SURFACE: variant })}>
            Dashboard CMS
          </Link>
        </p>
      </section>
    </main>
  );
}
