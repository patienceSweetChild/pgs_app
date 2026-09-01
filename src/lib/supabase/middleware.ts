import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { isDashCmsPath } from "@/lib/dash-cms-path";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = getSupabasePublicConfig();

  if (!config) {
    return response;
  }

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

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
      url.searchParams.set("surface", "operations");
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

  // Preserve redirect query sanity for login links leaving middleware
  const redirectParam = request.nextUrl.searchParams.get("redirect");
  if (redirectParam && safeRedirectPath(redirectParam) !== redirectParam) {
    const url = request.nextUrl.clone();
    url.searchParams.set("redirect", "/");
    return NextResponse.redirect(url);
  }

  return response;
}
