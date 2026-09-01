import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { PgsSurface } from "../surfaces";
import {
  mergeSupabaseCookieOptions,
  PGS_AUTH_SURFACE_HEADER,
  resolveAuthSurface,
  supabaseAuthCookieOptions,
} from "./cookie-options";

export type SessionMiddlewareConfig = {
  /** Deploy surface — drives isolated auth cookie jar. */
  surface: PgsSurface;
  /** Require active staff_profiles row (ops, admin, cms). */
  requireStaff?: boolean;
  /** Protect guardian portal routes (web app). */
  protectPortal?: boolean;
  getSupabaseConfig: () => { url: string; key: string } | null;
};

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function loginSurfaceParam(surface: PgsSurface): string {
  if (surface === "ops") return "operations";
  if (surface === "admin") return "admin";
  if (surface === "cms") return "cms";
  return "guardian";
}

/** pgs-v3 proxy pattern + pgs_app per-surface cookies (see proxy.ts, SUBDOMAIN proposal). */
export function createSessionMiddleware(config: SessionMiddlewareConfig) {
  const { surface, requireStaff, protectPortal, getSupabaseConfig } = config;

  return async function updateSession(request: NextRequest) {
    const supabaseConfig = getSupabaseConfig();
    const pathname = request.nextUrl.pathname;
    const surfaceParam = request.nextUrl.searchParams.get("surface");
    const authSurface = supabaseConfig
      ? resolveAuthSurface(pathname, surfaceParam, process.env)
      : surface;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(PGS_AUTH_SURFACE_HEADER, authSurface);
    requestHeaders.set("x-pathname", pathname);

    let response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    if (!supabaseConfig) {
      return response;
    }

    const cookieOptions = supabaseAuthCookieOptions(
      supabaseConfig.url,
      authSurface,
    );

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.key, {
      cookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(
              name,
              value,
              mergeSupabaseCookieOptions(options ?? {}),
            );
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/_next");

    if (requireStaff && !isAuthRoute) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("surface", loginSurfaceParam(surface));
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      try {
        const { data: staff } = await supabase
          .from("staff_profiles")
          .select("user_id, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!staff) {
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("surface", loginSurfaceParam(surface));
          url.searchParams.set("error", "not_staff");
          return NextResponse.redirect(url);
        }
      } catch {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    if (protectPortal && pathname.startsWith("/portal") && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("surface", "guardian");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && safeRedirectPath(redirectParam) !== redirectParam) {
      const url = request.nextUrl.clone();
      url.searchParams.set("redirect", "/");
      return NextResponse.redirect(url);
    }

    return response;
  };
}
