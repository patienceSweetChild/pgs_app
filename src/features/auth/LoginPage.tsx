"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useExperience } from "@/lib/auth/experience";
import "./auth.css";
import {
  LOGIN_STATS,
  MEMBER_BENEFITS,
  PENDING_SIGNUP_KEY,
  multilineTitle,
} from "./content";
import { VerticalStatCounter } from "./VerticalStatCounter";

type Mode = "login" | "signup";

function TrustLine() {
  return (
    <div className="mt-10 mb-3">
      <span className="mb-0 gap-1 d-flex fs-20 justify-content-center text-black mobile-fs-12">
        Secure & Private ⚡️
        <span>
          <span className="text-purple text-decoration-none">98%</span> Success
          Rate
        </span>
      </span>
    </div>
  );
}

function LoginStats() {
  return (
    <section className="pt-4 pb-5">
      <div className="w-863px fs-12 m-auto">
        <div className="d-flex justify-content-space counter-style-04 mobile-grid mobile-grid-2 full-width-mobile">
          {LOGIN_STATS.map((stat) => (
            <div
              className="w-128px last-paragraph-no-margin text-center sm-mb-40px"
              key={stat.value + stat.text.slice(0, 12)}
            >
              {stat.kind === "static" ? (
                <h3 className="d-inline-flex alt-font text-green fw-700 ls-minus-3px m-0 cutsom-count-1">
                  {stat.value}
                </h3>
              ) : (
                <VerticalStatCounter to={Number(stat.value)} suffix="%" />
              )}
              <p>{stat.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-80 m-auto nowrap">
        <div className="row row-cols-4 row-cols-md-4 pt-4 pb-0 row-cols-sm-2 justify-content-end counter-style-05">
          <div className="w-313px last-paragraph-no-margin text-center sm-mb-40px">
            <div>
              <p>
                <span>*</span>Applicable to our partnered universities.
              </p>
            </div>
            <div>
              <p>
                <span>**</span>Medical professionals typically receive a salary,
                stipend.
              </p>
            </div>
            <div>
              <p>
                <span>**</span>Scholarships or assistantships for non-medical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberBenefits() {
  return (
    <section className="pt-4 pb-5">
      <div className="w-803px m-auto">
        <h5 className="mb-4 fnt-family fs-38 text-center text-black">
          What You Get as a Member
        </h5>
        <div className="row row-cols-1 row-cols-md-5 row-cols-sm-2 justify-content-start counter-style-04">
          {MEMBER_BENEFITS.map((item, idx) => (
            <div className="col-lg-4 mobile-w-50 mb-3" key={`${item.tag}-${idx}`}>
              <div className="card-half-bg">
                <div className="yellow-bg-header">
                  <small className="m-auto d-block text-end text-black">
                    {item.tag}
                  </small>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/crown.png" alt="" />
                  <h6 className="mb-0">
                    {multilineTitle(item.title).map((line, i, arr) => (
                      <span key={line}>
                        {line}
                        {i < arr.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h6>
                </div>
                <div className="card-half-content">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
        <h6 className="text-end fs-24 lh-40 fw-600 text-black">& More</h6>
      </div>
    </section>
  );
}

function QuoteBanner() {
  return (
    <section className="about-section half-section overlap-height position-relative overflow-hidden pt-10">
      <div className="overlap-gap-section p-0 w-863px m-auto">
        <div className="row align-items-center justify-content-md-center">
          <div className="col-lg-12 col-md-12">
            <div className="card card-comment">
              <h5>
                <span className="fnt-50">“</span>
                <span>
                  From your first step to your final admit or medical pathway —
                  our expert counselors guide the entire journey with you.
                  <span className="fnt-50 dot-flot-1">”</span>
                </span>
              </h5>
              <div className="tag-comment">
                <div className="tag-border">purpleguide.study</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAs, isLoggedIn, refreshSession } = useExperience();

  const initialMode: Mode = useMemo(() => {
    const raw = (searchParams.get("signup") || "").toLowerCase();
    return raw === "1" || raw === "true" || raw === "yes" ? "signup" : "login";
  }, [searchParams]);

  const initialEmail = useMemo(() => {
    const email = (searchParams.get("email") || "").trim();
    return email.includes("@") ? email : "";
  }, [searchParams]);

  const redirectTo = useMemo(() => {
    const raw = (searchParams.get("redirect") || "").trim();
    if (!raw || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
      const surface = (searchParams.get("surface") || "").toLowerCase();
      if (surface === "admin") return "/admin";
      if (surface === "operations") return "/ops";
      return "/";
    }
    return raw.startsWith("/") ? raw : `/${raw}`;
  }, [searchParams]);

  const surface = useMemo(
    () => (searchParams.get("surface") || "").toLowerCase(),
    [searchParams],
  );

  const portalTitle = useMemo(() => {
    if (surface === "admin") return "CMS Admin";
    if (surface === "operations") return "Operations Portal";
    return "Welcome";
  }, [surface]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (initialEmail) setEmail(initialEmail);
  }, [initialMode, initialEmail]);

  useEffect(() => {
    if (isLoggedIn) router.replace(redirectTo);
  }, [isLoggedIn, redirectTo, router]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (!isSupabaseConfigured()) {
        loginAs("authenticated_standard");
        router.push(redirectTo === "/" ? "/" : redirectTo);
        return;
      }
      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createSupabaseBrowserClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      await refreshSession();
      router.push(redirectTo === "/" ? "/" : redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      sessionStorage.setItem(PENDING_SIGNUP_KEY, email);
    } catch {
      /* ignore */
    }
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (!isSupabaseConfigured()) {
        router.push("/singup");
        return;
      }
      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?redirect=/singup`,
        },
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.push("/singup");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wrapper-content mobile-login-pgs pgs-auth-page">
      <section className="login-box mobile-login-box about-section half-section overlap-height position-relative overflow-hidden">
        <div className="container overlap-gap-section p-0">
          <div className="row align-items-center justify-content-md-center">
            <div className="col-lg-5 col-md-12 w-445px">
              <div
                className={`sinup-box${mode === "login" ? " active" : ""}`}
                id="loginForm"
              >
                <h5 className="fnt-family fs-35 text-black mb-3 mt-15 mobile-fs-24">
                  {portalTitle}
                </h5>

                <a
                  href="#google"
                  className="btn btn-google ht-48 fs-18 lh-24 fw-800"
                  onClick={async (e) => {
                    e.preventDefault();
                    const { isSupabaseConfigured } = await import(
                      "@/lib/supabase/config"
                    );
                    if (!isSupabaseConfigured()) {
                      loginAs("authenticated_standard");
                      router.push(redirectTo);
                      return;
                    }
                    const { createSupabaseBrowserClient } = await import(
                      "@/lib/supabase/client"
                    );
                    const supabase = createSupabaseBrowserClient();
                    const origin = window.location.origin;
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
                      },
                    });
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/google.png" alt="" />
                  Continue with Google
                </a>

                <h2 className="mb-0 text-center fs-18 text-black lh-20 mt-5">
                  OR
                </h2>

                {error && mode === "login" ? (
                  <div className="auth-alert auth-alert-danger" role="alert">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={onLogin}>
                  <div className="form-controls">
                    <label className="mb-0">Email address</label>
                    <div className="input-groups">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="form-controls mt-3">
                    <label className="mb-0">Password</label>
                    <div className="input-groups">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  <div className="form-controls d-flex gap-1 mt-3 mb-3 justify-content-space align-items-center">
                    <button
                      type="submit"
                      className="btn btn-purple w-258px fs-16 nowrap mobile-fs-14"
                      disabled={submitting}
                    >
                      {submitting ? "Signing in…" : "Access your #PGS account"}
                    </button>
                  </div>
                </form>

                <Link
                  href="/forgot_password"
                  className="text-black nowrap mobile-fs-15s"
                >
                  Forgot Password?
                </Link>
                <div className="mt-10 mb-3">
                  <h4 className="mb-0 gap-3 d-flex fs-20 justify-content-center text-black mobil-flex-align-center fw-500 mobile-fs-13">
                    Don&apos;t have an account ?{" "}
                    <button
                      type="button"
                      className="btn btn-outline-purple"
                      onClick={() => {
                        setError(null);
                        setMode("signup");
                      }}
                    >
                      Sign up
                    </button>
                  </h4>
                </div>
                <TrustLine />
              </div>

              <div
                className={`sinup-box${mode === "signup" ? " active" : ""}`}
                id="signupForm"
              >
                <h5 className="fnt-family fs-35 text-black mb-3 mt-15 mobile-fs-24">
                  create an account
                </h5>

                <a
                  href="#google"
                  className="btn btn-google ht-48 fs-18 lh-24 fw-800"
                  onClick={async (e) => {
                    e.preventDefault();
                    const { isSupabaseConfigured } = await import(
                      "@/lib/supabase/config"
                    );
                    if (!isSupabaseConfigured()) {
                      loginAs("authenticated_standard");
                      router.push(redirectTo);
                      return;
                    }
                    const { createSupabaseBrowserClient } = await import(
                      "@/lib/supabase/client"
                    );
                    const supabase = createSupabaseBrowserClient();
                    const origin = window.location.origin;
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
                      },
                    });
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/google.png" alt="" />
                  Continue with Google
                </a>

                <h2 className="mb-0 text-center fs-18 text-black lh-20 mt-5">
                  OR
                </h2>

                {error && mode === "signup" ? (
                  <div className="auth-alert auth-alert-danger" role="alert">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={onRegister} id="registerForm">
                  <div className="form-controls">
                    <label className="mb-0">Email address</label>
                    <div className="input-groups">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="form-controls mt-3">
                    <label className="mb-0">Password</label>
                    <div className="input-groups">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="form-controls mt-3">
                    <label className="mb-0">Confirm Password</label>
                    <div className="input-groups">
                      <input
                        type="password"
                        name="confirm_password"
                        className="form-control"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="form-controls d-flex gap-5 mt-3 mb-3 justify-content-start align-items-center">
                    <button
                      type="submit"
                      className="btn btn-purple w-258px"
                      disabled={submitting}
                    >
                      Create #PGS Account
                    </button>
                  </div>
                </form>

                <div className="mt-10 mb-3">
                  <h4 className="mb-0 gap-3 d-flex fs-22 justify-content-center text-black fw-500 align-items-center">
                    Already have an account ?{" "}
                    <button
                      type="button"
                      className="btn btn-outline-purple"
                      onClick={() => {
                        setError(null);
                        setMode("login");
                      }}
                    >
                      Log in
                    </button>
                  </h4>
                </div>
                <TrustLine />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginStats />
      <MemberBenefits />
      <QuoteBanner />
    </div>
  );
}
