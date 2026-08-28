import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function signOutAndRedirect(request: Request) {
  const origin = new URL(request.url).origin;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/", origin));
}

export async function POST(request: Request) {
  return signOutAndRedirect(request);
}

export async function GET(request: Request) {
  return signOutAndRedirect(request);
}
