import { createServerClient } from "@supabase/ssr";
import {
  mergeSupabaseCookieOptions,
  normalizeSurface,
  PGS_AUTH_SURFACE_HEADER,
  resolveAuthSurface,
  supabaseAuthCookieOptions,
} from "@pgs/shared";
import { cookies, headers } from "next/headers";
import { requireSupabasePublicConfig } from "./config";

export async function createSupabaseServerClient() {
  const { url, key } = requireSupabasePublicConfig();
  const cookieStore = await cookies();
  const headerStore = await headers();
  const surfaceFromMiddleware = headerStore.get(PGS_AUTH_SURFACE_HEADER);
  const surface = surfaceFromMiddleware
    ? normalizeSurface(surfaceFromMiddleware)
    : resolveAuthSurface("/", null);
  const cookieOptions = supabaseAuthCookieOptions(url, surface);

  return createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, mergeSupabaseCookieOptions(options ?? {}));
          });
        } catch {
          // Server Components cannot set cookies; middleware refreshes sessions.
        }
      },
    },
  });
}
