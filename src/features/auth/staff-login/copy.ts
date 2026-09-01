import type { PgsSurface } from "@pgs/shared";

export type StaffLoginVariant = Extract<PgsSurface, "ops" | "admin" | "cms">;

export type StaffLoginCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  brandLine: string;
  help: string;
  surfaceParam: string;
  defaultRedirect: string;
};

export const STAFF_LOGIN_COPY: Record<StaffLoginVariant, StaffLoginCopy> = {
  ops: {
    eyebrow: "Operations",
    title: "Sign in to Operations",
    subtitle: "Use your authorized PGS staff identity to continue.",
    brandLine: "Purple Guide",
    help: "Access is permission-controlled and recorded in the PGS audit system.",
    surfaceParam: "operations",
    defaultRedirect: "/",
  },
  admin: {
    eyebrow: "CMS Admin",
    title: "Sign in to CMS Admin",
    subtitle: "Manage catalog content, users, and site configuration.",
    brandLine: "Purple Guide",
    help: "Staff access only. Changes are audited.",
    surfaceParam: "admin",
    defaultRedirect: "/",
  },
  cms: {
    eyebrow: "Dashboard CMS",
    title: "Sign in to Dashboard CMS",
    subtitle: "Edit student dashboards with draft and live publish.",
    brandLine: "Purple Guide",
    help: "Only staff with dashboard CMS permission can sign in here.",
    surfaceParam: "cms",
    defaultRedirect: "/",
  },
};

export function resolveStaffLoginVariant(
  raw: string | undefined,
): StaffLoginVariant | null {
  if (raw === "ops" || raw === "admin" || raw === "cms") return raw;
  return null;
}
