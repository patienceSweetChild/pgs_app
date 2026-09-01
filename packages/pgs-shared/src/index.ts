export {
  extractSupabaseProjectRef,
  mergeSupabaseCookieOptions,
  PGS_AUTH_SURFACE_HEADER,
  resolveAuthCookieName,
  resolveAuthSurface,
  resolveCookieDomain,
  resolveSurfaceForRequest,
  supabaseAuthCookieOptions,
  usesSharedParentDomain,
  type SupabaseAuthCookieOptions,
} from "./auth/cookie-options";
export { createSessionMiddleware, type SessionMiddlewareConfig } from "./auth/session-middleware";
export {
  adminHref,
  cmsHref,
  isSplitDeploy,
  loginPathForSurface,
  opsHref,
  staffPortalLink,
  stripMonolithPrefix,
} from "./routes";
export {
  crossSurfaceLink,
  isStaffSurface,
  loginUrlForIntent,
  normalizeSiteUrl,
  normalizeSurface,
  resolveCurrentSurface,
  surfaceConfig,
  surfaceSiteUrl,
  type PgsSurface,
  type PgsSurfaceLegacy,
  type SurfaceConfig,
} from "./surfaces";
