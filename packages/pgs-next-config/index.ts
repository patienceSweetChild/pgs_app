import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import type { PgsSurface } from "@pgs/shared";

const repoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const LOCAL_PORTS: Record<PgsSurface, number> = {
  web: 3000,
  ops: 3001,
  admin: 3002,
  cms: 3003,
};

const srcAlias = path.join(repoRoot, "src");

export type CreatePgsNextConfigOptions = {
  surface: PgsSurface;
  /** Extra redirects (e.g. legacy public URLs on web app). */
  redirects?: NextConfig["redirects"];
};

type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

/** Map monolith `/ops`, `/admin`, `/dash` paths to split-deploy routes. */
export function legacySurfaceRedirects(surface: PgsSurface): RedirectRule[] {
  if (surface === "ops") {
    return [
      { source: "/ops", destination: "/", permanent: false },
      { source: "/ops/:path*", destination: "/:path*", permanent: false },
    ];
  }

  if (surface === "admin") {
    return [
      { source: "/admin", destination: "/", permanent: false },
      { source: "/admin/:path*", destination: "/:path*", permanent: false },
    ];
  }

  if (surface === "cms") {
    return [
      { source: "/dash", destination: "/", permanent: false },
      { source: "/dash/:path*", destination: "/:path*", permanent: false },
    ];
  }

  const ops =
    process.env.NEXT_PUBLIC_OPS_SITE_URL ??
    `http://localhost:${LOCAL_PORTS.ops}`;
  const admin =
    process.env.NEXT_PUBLIC_ADMIN_SITE_URL ??
    `http://localhost:${LOCAL_PORTS.admin}`;
  const cms =
    process.env.NEXT_PUBLIC_CMS_SITE_URL ??
    `http://localhost:${LOCAL_PORTS.cms}`;

  return [
    { source: "/ops", destination: ops.replace(/\/+$/, ""), permanent: false },
    {
      source: "/ops/:path*",
      destination: `${ops.replace(/\/+$/, "")}/:path*`,
      permanent: false,
    },
    {
      source: "/admin",
      destination: admin.replace(/\/+$/, ""),
      permanent: false,
    },
    {
      source: "/admin/:path*",
      destination: `${admin.replace(/\/+$/, "")}/:path*`,
      permanent: false,
    },
    { source: "/dash", destination: cms.replace(/\/+$/, ""), permanent: false },
    {
      source: "/dash/:path*",
      destination: `${cms.replace(/\/+$/, "")}/:path*`,
      permanent: false,
    },
  ];
}

/** Turborepo / Cal.com pattern: shared next config factory per deployable. */
export function createPgsNextConfig(
  options: CreatePgsNextConfigOptions,
): NextConfig {
  const { surface, redirects } = options;

  return {
    reactStrictMode: true,
    transpilePackages: ["@pgs/shared"],
    outputFileTracingRoot: repoRoot,
    env: {
      NEXT_PUBLIC_PGS_SURFACE: surface,
    },
    redirects: async () => {
      const legacy = legacySurfaceRedirects(surface);
      const extra = redirects ? await redirects() : [];
      return [...legacy, ...extra];
    },
    experimental: {
      turbo: {
        resolveAlias: {
          "@": srcAlias,
        },
      },
    },
    webpack: (config) => {
      config.resolve ??= {};
      config.resolve.alias ??= {};
      config.resolve.alias["@"] = srcAlias;
      return config;
    },
  };
}

export function pgsDevPort(surface: PgsSurface): number {
  return LOCAL_PORTS[surface];
}

export { repoRoot };
