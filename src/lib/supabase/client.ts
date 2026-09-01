import { createBrowserClient } from "@supabase/ssr";
import {
  resolveAuthSurface,
  supabaseAuthCookieOptions,
  type PgsSurface,
} from "@pgs/shared";
import { getSupabasePublicConfig } from "./config";

function detectBrowserSurface(override?: PgsSurface): PgsSurface {
  if (override) return override;
  if (typeof window === "undefined") {
    return resolveAuthSurface("/", null);
  }
  return resolveAuthSurface(
    window.location.pathname,
    new URLSearchParams(window.location.search).get("surface"),
  );
}

export function createSupabaseBrowserClient(surface?: PgsSurface) {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase is not configured.");
  }

  const authSurface = detectBrowserSurface(surface);
  const cookieOptions = supabaseAuthCookieOptions(config.url, authSurface);

  return createBrowserClient(config.url, config.key, { cookieOptions });
}
