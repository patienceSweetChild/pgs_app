import { crossSurfaceLink } from "./surfaces";
import { resolveCurrentSurface, type PgsSurface } from "./surfaces";

/** Monolith URL prefix when all surfaces share one origin. */
const MONOLITH_PREFIX: Record<Exclude<PgsSurface, "web">, string> = {
  ops: "/ops",
  admin: "/admin",
  cms: "/dash",
};

export function isSplitDeploy(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.NEXT_PUBLIC_PGS_SURFACE ?? env.PGS_SURFACE);
}

/** Strip monolith prefix when running as a dedicated surface deploy. */
export function stripMonolithPrefix(
  surface: Exclude<PgsSurface, "web">,
  pathname: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const prefix = MONOLITH_PREFIX[surface];
  if (resolveCurrentSurface(env) !== surface) {
    return pathname;
  }
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

/** Resolve in-app href for ops (monolith `/ops/*` vs split `/`). */
export function opsHref(pathname: string, env: NodeJS.ProcessEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("ops", pathname, env);
}

export function adminHref(pathname: string, env: NodeJS.ProcessEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("admin", pathname, env);
}

export function cmsHref(pathname: string, env: NodeJS.ProcessEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("cms", pathname, env);
}

/** Cross-surface staff portal links (ops → admin/cms subdomains). */
export function staffPortalLink(
  target: "admin" | "cms",
  path = "/",
  env: NodeJS.ProcessEnv = process.env,
): string {
  if (!isSplitDeploy(env)) {
    return target === "admin" ? "/admin" : "/dash";
  }
  return crossSurfaceLink(target, path, env);
}

/** Login redirect path for a surface (split vs monolith). */
export function loginPathForSurface(
  surface: PgsSurface,
  redirectTo: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const surfaceParam =
    surface === "ops"
      ? "operations"
      : surface === "admin"
        ? "admin"
        : surface === "cms"
          ? "cms"
          : "";

  const loginBase = isSplitDeploy(env) ? "/login" : "/login";
  const params = new URLSearchParams();
  if (surfaceParam) params.set("surface", surfaceParam);
  params.set("redirect", redirectTo);
  return `${loginBase}?${params.toString()}`;
}
