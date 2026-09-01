import { createSessionMiddleware } from "@pgs/shared";
import type { NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const handleSession = createSessionMiddleware({
  surface: "cms",
  requireStaff: true,
  getSupabaseConfig: getSupabasePublicConfig,
});

export async function middleware(request: NextRequest) {
  return handleSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map|woff2?)$).*)",
  ],
};
