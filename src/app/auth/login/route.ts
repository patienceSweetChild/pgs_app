import { NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildLoginUrl(
  origin: string,
  opts: { redirect: string; surface: string; error?: string },
) {
  const url = new URL("/login", origin);
  url.searchParams.set("redirect", opts.redirect);
  if (opts.surface) url.searchParams.set("surface", opts.surface);
  if (opts.error) url.searchParams.set("error", opts.error);
  return url;
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      buildLoginUrl(origin, { redirect: "/", surface: "", error: "config" }),
    );
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirect = safeRedirectPath(String(formData.get("redirect") ?? "/"));
  const surface = String(formData.get("surface") ?? "").trim();

  if (!email || !password) {
    return NextResponse.redirect(
      buildLoginUrl(origin, {
        redirect,
        surface,
        error: "Please enter email and password.",
      }),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(
      buildLoginUrl(origin, { redirect, surface, error: error.message }),
    );
  }

  return NextResponse.redirect(new URL(redirect, origin));
}
