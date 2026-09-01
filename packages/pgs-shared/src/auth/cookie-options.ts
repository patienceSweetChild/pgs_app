import type { CookieOptions } from "@supabase/ssr";
import { normalizeSurface, type PgsEnv, type PgsSurface } from "../surfaces";

export type SupabaseAuthCookieOptions = CookieOptions & { name: string };

/**
 * Parent domain for auth cookies — **opt-in only**.
 *
 * Default: host-only cookies so each subdomain (and each surface on localhost)
 * keeps an independent session. Set `PGS_COOKIE_DOMAIN=.purpleguide.study` only
 * if you explicitly want shared SSO across subdomains (not recommended for PGS).
 */
export function resolveCookieDomain(
  env: PgsEnv = process.env,
): string | undefined {
  const explicit = env.PGS_COOKIE_DOMAIN?.trim();
  if (!explicit) {
    return undefined;
  }
  return explicit.startsWith(".") ? explicit : `.${explicit}`;
}

export function extractSupabaseProjectRef(supabaseUrl: string): string {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    return hostname.split(".")[0] ?? "local";
  } catch {
    return "local";
  }
}

/** Separate cookie jar per surface — enables different users per tab/site. */
export function resolveAuthCookieName(
  supabaseUrl: string,
  surface: PgsSurface,
): string {
  const ref = extractSupabaseProjectRef(supabaseUrl);
  return `sb-${ref}-auth-token-pgs-${surface}`;
}

export function supabaseAuthCookieOptions(
  supabaseUrl: string,
  surface: PgsSurface,
  env: PgsEnv = process.env,
): SupabaseAuthCookieOptions {
  const domain = resolveCookieDomain(env);
  return {
    name: resolveAuthCookieName(supabaseUrl, surface),
    path: "/",
    sameSite: "lax",
    ...(domain
      ? { domain, secure: env.NODE_ENV === "production" }
      : {}),
  };
}

export function mergeSupabaseCookieOptions(
  options: CookieOptions,
  env: PgsEnv = process.env,
): CookieOptions {
  const domain = resolveCookieDomain(env);
  if (!domain) {
    return options;
  }

  return {
    ...options,
    domain,
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "lax",
    secure: options.secure ?? env.NODE_ENV === "production",
  };
}

/** True only when PGS_COOKIE_DOMAIN is explicitly set (shared SSO mode). */
export function usesSharedParentDomain(env: PgsEnv = process.env): boolean {
  return Boolean(resolveCookieDomain(env));
}

/** Deploy env surface, or path/query surface while monolith runs on one host. */
export function resolveAuthSurface(
  pathname: string,
  surfaceParam?: string | null,
  env: PgsEnv = process.env,
): PgsSurface {
  const deploySurface = env.NEXT_PUBLIC_PGS_SURFACE ?? env.PGS_SURFACE;
  if (deploySurface) {
    return normalizeSurface(deploySurface);
  }
  return resolveSurfaceForRequest(pathname, surfaceParam);
}

/** Map request path (+ login ?surface=) to an isolated auth cookie surface. */
export function resolveSurfaceForRequest(
  pathname: string,
  surfaceParam?: string | null,
): PgsSurface {
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    const raw = (surfaceParam ?? "").toLowerCase();
    if (raw === "operations" || raw === "ops") return "ops";
    if (raw === "admin") return "admin";
    if (raw === "cms" || raw === "dash") return "cms";
    return "web";
  }

  if (pathname.startsWith("/ops")) return "ops";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/dash")) return "cms";
  return "web";
}

export const PGS_AUTH_SURFACE_HEADER = "x-pgs-auth-surface";
