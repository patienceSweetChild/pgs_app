import { createServerClient } from "@supabase/ssr";
import {
  mergeSupabaseCookieOptions,
  PGS_AUTH_SURFACE_HEADER,
  resolveAuthSurface,
  supabaseAuthCookieOptions,
} from "@pgs/shared";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { isDashCmsPath } from "@/lib/dash-cms-path";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function updateSession(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const pathname = request.nextUrl.pathname;
  const surfaceParam = request.nextUrl.searchParams.get("surface");
  const authSurface = config
    ? resolveAuthSurface(pathname, surfaceParam)
    : null;

  const requestHeaders = new Headers(request.headers);
  if (authSurface) {
    requestHeaders.set(PGS_AUTH_SURFACE_HEADER, authSurface);
  }

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!config || !authSurface) {
    return response;
  }

  const cookieOptions = supabaseAuthCookieOptions(config.url, authSurface);

  const supabase = createServerClient(config.url, config.key, {
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
          response.cookies.set(name, value, mergeSupabaseCookieOptions(options ?? {}));
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("surface", "admin");
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
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/ops") || isDashCmsPath(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set(
        "surface",
        isDashCmsPath(pathname) ? "cms" : "operations",
      );
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
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/portal")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("surface", "guardian");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  const redirectParam = request.nextUrl.searchParams.get("redirect");
  if (redirectParam && safeRedirectPath(redirectParam) !== redirectParam) {
    const url = request.nextUrl.clone();
    url.searchParams.set("redirect", "/");
    return NextResponse.redirect(url);
  }

  return response;
}
