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

export type CreatePgsNextConfigOptions = {
  surface: PgsSurface;
  /** Extra redirects (e.g. legacy public URLs on web app). */
  redirects?: NextConfig["redirects"];
};

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
    ...(redirects ? { redirects } : {}),
    webpack: (config) => {
      config.resolve ??= {};
      config.resolve.alias ??= {};
      config.resolve.alias["@"] = path.join(repoRoot, "src");
      return config;
    },
  };
}

export function pgsDevPort(surface: PgsSurface): number {
  return LOCAL_PORTS[surface];
}

export { repoRoot };
