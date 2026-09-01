import { describe, expect, it } from "vitest";
import {
  mergeSupabaseCookieOptions,
  resolveAuthCookieName,
  resolveAuthSurface,
  resolveCookieDomain,
  resolveSurfaceForRequest,
  supabaseAuthCookieOptions,
  usesSharedParentDomain,
} from "./auth/cookie-options";
import {
  crossSurfaceLink,
  loginUrlForIntent,
  resolveCurrentSurface,
  surfaceSiteUrl,
} from "./surfaces";

describe("resolveCookieDomain", () => {
  it("returns undefined by default (host-only / session isolation)", () => {
    expect(
      resolveCookieDomain({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://ops.purpleguide.study",
      }),
    ).toBeUndefined();
  });

  it("uses explicit PGS_COOKIE_DOMAIN when shared SSO is desired", () => {
    expect(resolveCookieDomain({ PGS_COOKIE_DOMAIN: "purpleguide.study" })).toBe(
      ".purpleguide.study",
    );
  });

  it("returns undefined on localhost dev", () => {
    expect(
      resolveCookieDomain({
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      }),
    ).toBeUndefined();
  });
});

describe("resolveAuthCookieName", () => {
  it("scopes cookies per surface so tabs can use different users", () => {
    const url = "https://abcdefgh.supabase.co";
    expect(resolveAuthCookieName(url, "web")).toBe(
      "sb-abcdefgh-auth-token-pgs-web",
    );
    expect(resolveAuthCookieName(url, "ops")).toBe(
      "sb-abcdefgh-auth-token-pgs-ops",
    );
    expect(resolveAuthCookieName(url, "cms")).toBe(
      "sb-abcdefgh-auth-token-pgs-cms",
    );
  });
});

describe("resolveSurfaceForRequest", () => {
  it("maps staff paths to isolated surfaces", () => {
    expect(resolveSurfaceForRequest("/ops/students")).toBe("ops");
    expect(resolveSurfaceForRequest("/admin/countries")).toBe("admin");
    expect(resolveSurfaceForRequest("/dash/abc")).toBe("cms");
    expect(resolveSurfaceForRequest("/userprofile")).toBe("web");
  });

  it("uses login surface query on auth routes", () => {
    expect(resolveSurfaceForRequest("/login", "operations")).toBe("ops");
    expect(resolveSurfaceForRequest("/login", "admin")).toBe("admin");
    expect(resolveSurfaceForRequest("/login", null)).toBe("web");
  });
});

describe("resolveAuthSurface", () => {
  it("prefers deploy surface when split into separate apps", () => {
    expect(
      resolveAuthSurface("/admin", null, { NEXT_PUBLIC_PGS_SURFACE: "ops" }),
    ).toBe("ops");
  });
});

describe("mergeSupabaseCookieOptions", () => {
  it("sets domain only when explicitly configured", () => {
    const merged = mergeSupabaseCookieOptions(
      { maxAge: 3600 },
      {
        NODE_ENV: "production",
        PGS_COOKIE_DOMAIN: ".purpleguide.study",
      },
    );
    expect(merged.domain).toBe(".purpleguide.study");
    expect(merged.secure).toBe(true);
  });

  it("leaves options unchanged when host-only (default)", () => {
    const merged = mergeSupabaseCookieOptions(
      { maxAge: 1 },
      { NODE_ENV: "production" },
    );
    expect(merged.domain).toBeUndefined();
  });
});

describe("supabaseAuthCookieOptions", () => {
  it("combines per-surface name with optional shared domain", () => {
    const opts = supabaseAuthCookieOptions(
      "https://xyz.supabase.co",
      "admin",
      { PGS_COOKIE_DOMAIN: ".purpleguide.study", NODE_ENV: "production" },
    );
    expect(opts.name).toBe("sb-xyz-auth-token-pgs-admin");
    expect(opts.domain).toBe(".purpleguide.study");
  });
});

describe("usesSharedParentDomain", () => {
  it("is false by default", () => {
    expect(usesSharedParentDomain({ NODE_ENV: "production" })).toBe(false);
  });

  it("is true only when PGS_COOKIE_DOMAIN is set", () => {
    expect(
      usesSharedParentDomain({ PGS_COOKIE_DOMAIN: ".purpleguide.study" }),
    ).toBe(true);
  });
});

describe("surfaceSiteUrl", () => {
  it("uses per-surface env override", () => {
    expect(
      surfaceSiteUrl("ops", {
        NEXT_PUBLIC_OPS_SITE_URL: "https://ops.purpleguide.study",
      }),
    ).toBe("https://ops.purpleguide.study");
  });

  it("uses apex domain for student frontend in production", () => {
    expect(surfaceSiteUrl("web", { NODE_ENV: "production" })).toBe(
      "https://purpleguide.study",
    );
  });

  it("uses localhost ports in dev", () => {
    expect(surfaceSiteUrl("admin", { NODE_ENV: "development" })).toBe(
      "http://localhost:3002",
    );
  });
});

describe("resolveCurrentSurface", () => {
  it("reads NEXT_PUBLIC_PGS_SURFACE", () => {
    expect(resolveCurrentSurface({ NEXT_PUBLIC_PGS_SURFACE: "cms" })).toBe("cms");
  });

  it("maps legacy dash surface to cms", () => {
    expect(resolveCurrentSurface({ NEXT_PUBLIC_PGS_SURFACE: "dash" })).toBe("cms");
  });
});

describe("crossSurfaceLink", () => {
  it("builds absolute admin link from ops env", () => {
    expect(
      crossSurfaceLink("admin", "/countries", {
        NEXT_PUBLIC_ADMIN_SITE_URL: "https://admin.purpleguide.study",
      }),
    ).toBe("https://admin.purpleguide.study/countries");
  });
});

describe("loginUrlForIntent", () => {
  it("sends operations login to ops subdomain", () => {
    const url = loginUrlForIntent("operations", "/students", {
      NEXT_PUBLIC_OPS_SITE_URL: "https://ops.purpleguide.study",
    });
    expect(url).toBe(
      "https://ops.purpleguide.study/login?surface=operations&redirect=%2Fstudents",
    );
  });
});
