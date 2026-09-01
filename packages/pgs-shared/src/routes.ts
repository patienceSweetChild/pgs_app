import { crossSurfaceLink, resolveCurrentSurface, type PgsEnv, type PgsSurface } from "./surfaces";

/** Monolith URL prefix when all surfaces share one origin. */
const MONOLITH_PREFIX: Record<Exclude<PgsSurface, "web">, string> = {
  ops: "/ops",
  admin: "/admin",
  cms: "/dash",
};

export function isSplitDeploy(env: PgsEnv = process.env): boolean {
  return Boolean(env.NEXT_PUBLIC_PGS_SURFACE ?? env.PGS_SURFACE);
}

/** Strip monolith prefix when running as a dedicated surface deploy. */
export function stripMonolithPrefix(
  surface: Exclude<PgsSurface, "web">,
  pathname: string,
  env: PgsEnv = process.env,
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
export function opsHref(pathname: string, env: PgsEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("ops", pathname, env);
}

export function adminHref(pathname: string, env: PgsEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("admin", pathname, env);
}

export function cmsHref(pathname: string, env: PgsEnv = process.env): string {
  if (!isSplitDeploy(env)) return pathname;
  return stripMonolithPrefix("cms", pathname, env);
}

function opsPathOnOpsSurface(pathname: string): string {
  const monolith = pathname.startsWith("/ops")
    ? pathname
    : `/ops${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return stripMonolithPrefix("ops", monolith, { NEXT_PUBLIC_PGS_SURFACE: "ops" });
}

/** Ops link — relative in-app on ops, full URL when linking from admin/cms/web. */
export function opsPortalLink(
  pathname: string,
  env: PgsEnv = process.env,
): string {
  const monolith = pathname.startsWith("/ops")
    ? pathname
    : `/ops${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  if (!isSplitDeploy(env)) return monolith;
  const onOps = opsPathOnOpsSurface(monolith);
  if (resolveCurrentSurface(env) === "ops") return onOps;
  return crossSurfaceLink("ops", onOps, env);
}

export function opsStudentHref(studentId: string, env: PgsEnv = process.env): string {
  return opsHref(`/ops/students/${studentId}`, env);
}

/** Staff dashboard CMS editor for a student (split: cms host `/:id`). */
export function cmsStudentHref(studentId: string, env: PgsEnv = process.env): string {
  const monolith = `/dash/${studentId}`;
  if (!isSplitDeploy(env)) return monolith;
  if (resolveCurrentSurface(env) === "cms") return `/${studentId}`;
  return crossSurfaceLink("cms", `/${studentId}`, env);
}

/** Cross-surface staff portal links (ops → admin/cms subdomains). */
export function staffPortalLink(
  target: "admin" | "cms",
  path = "/",
  env: PgsEnv = process.env,
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
  env: PgsEnv = process.env,
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
