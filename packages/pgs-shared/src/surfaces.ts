/**
 * Deployable surfaces — each maps to a Vercel project + host.
 *
 * - `web` — student frontend (apex domain, not a staff subdomain)
 * - `ops` | `admin` | `cms` — staff backend cluster
 */
export type PgsSurface = "web" | "ops" | "admin" | "cms";

/** Env bag for surface helpers — avoids requiring full NodeJS.ProcessEnv in tests. */
export type PgsEnv = Record<string, string | undefined>;

/** @deprecated Use `cms`. Kept for env vars / routes still named dash during migration. */
export type PgsSurfaceLegacy = PgsSurface | "dash";

export type SurfaceConfig = {
  surface: PgsSurface;
  /** Canonical origin, e.g. https://ops.purpleguide.study */
  siteUrl: string;
  /** Login path on this origin */
  loginPath: string;
  /** Default post-login path on this origin */
  homePath: string;
};

const DEFAULT_LOCAL_PORTS: Record<PgsSurface, number> = {
  web: 3000,
  ops: 3001,
  admin: 3002,
  cms: 3003,
};

/** Production hosts — web is apex (student frontend); others are staff backend. */
const PRODUCTION_HOSTS: Record<PgsSurface, string> = {
  web: "purpleguide.study",
  ops: "ops.purpleguide.study",
  admin: "admin.purpleguide.study",
  cms: "cms.purpleguide.study",
};

export function normalizeSurface(raw: string): PgsSurface {
  const value = raw.toLowerCase();
  if (value === "dash") return "cms";
  if (value === "ops" || value === "admin" || value === "cms" || value === "web") {
    return value;
  }
  return "web";
}

export function isStaffSurface(surface: PgsSurface): boolean {
  return surface === "ops" || surface === "admin" || surface === "cms";
}

export function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function resolveCurrentSurface(
  env: PgsEnv = process.env,
): PgsSurface {
  const raw = env.NEXT_PUBLIC_PGS_SURFACE ?? env.PGS_SURFACE ?? "web";
  return normalizeSurface(raw);
}

/** Origin for a surface — env override wins, then production host, then localhost port. */
export function surfaceSiteUrl(
  surface: PgsSurface,
  env: PgsEnv = process.env,
): string {
  const perSurfaceKey = `NEXT_PUBLIC_${surface.toUpperCase()}_SITE_URL`;
  const fromEnv = env[perSurfaceKey] ?? env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return normalizeSiteUrl(fromEnv);
  }

  if (env.NODE_ENV === "production") {
    return `https://${PRODUCTION_HOSTS[surface]}`;
  }

  const port = DEFAULT_LOCAL_PORTS[surface];
  return `http://localhost:${port}`;
}

export function surfaceConfig(
  surface: PgsSurface,
  env: PgsEnv = process.env,
): SurfaceConfig {
  const siteUrl = surfaceSiteUrl(surface, env);
  const loginPath = "/login";
  const homePath = "/";

  return { surface, siteUrl, loginPath, homePath };
}

/** Build login URL on the correct subdomain for staff/guardian/student. */
export function loginUrlForIntent(
  intent: "operations" | "admin" | "guardian" | "student",
  redirectTo: string,
  env: PgsEnv = process.env,
): string {
  let surface: PgsSurface = "web";
  let surfaceParam = "";

  if (intent === "operations") {
    surface = "ops";
    surfaceParam = "operations";
  } else if (intent === "admin") {
    surface = "admin";
    surfaceParam = "admin";
  } else if (intent === "guardian") {
    surface = "web";
    surfaceParam = "guardian";
  }

  const base = surfaceSiteUrl(surface, env);
  const url = new URL("/login", base);
  if (surfaceParam) url.searchParams.set("surface", surfaceParam);
  url.searchParams.set("redirect", redirectTo);
  return url.toString();
}

export function crossSurfaceLink(
  target: PgsSurface,
  path: string,
  env: PgsEnv = process.env,
): string {
  const base = surfaceSiteUrl(target, env);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/+$/, "")}${normalized}`;
}
