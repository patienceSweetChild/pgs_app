import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { opsHref } from "@pgs/shared";
import type { StaffContext } from "@/lib/auth/actor-context";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";

export type StaffPreviewMode = "student" | "mentor";

export type StaffPreviewContext = {
  mode: StaffPreviewMode;
  targetId: string;
  targetName: string;
  actorName: string;
};

const PREVIEW_COOKIE = "pgs_staff_preview";

export async function getStaffPreviewContext(
  staff: StaffContext,
): Promise<StaffPreviewContext | null> {
  const jar = await cookies();
  const raw = jar.get(PREVIEW_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      mode?: StaffPreviewMode;
      targetId?: string;
      targetName?: string;
    };
    if (!parsed.mode || !parsed.targetId) return null;
    return {
      mode: parsed.mode,
      targetId: parsed.targetId,
      targetName: parsed.targetName ?? "Preview",
      actorName: staff.displayName,
    };
  } catch {
    return null;
  }
}

export function isPreviewMutationBlocked(preview: StaffPreviewContext | null): boolean {
  return Boolean(preview);
}

export async function assertStaffPreviewWritable() {
  const actor = await resolveActorContext();
  if (!actor.staff) throw new Error("Forbidden");
  const preview = await getStaffPreviewContext(actor.staff);
  if (isPreviewMutationBlocked(preview)) {
    throw new Error("Preview is read-only. Exit preview to make changes.");
  }
}

export function canStartStaffPreview(
  staff: StaffContext,
  preview: StaffPreviewContext | null,
): boolean {
  return (
    (staff.roleKey === "admin" || staff.roleKey === "super_admin") && !preview
  );
}

export function canAssignStudents(
  staff: StaffContext,
  preview: StaffPreviewContext | null,
): boolean {
  return staffHasPermission(staff, "mentor_assignments.manage") && !preview;
}

export async function redirectMentorPreviewAwayFromPrivilegedPages() {
  const actor = await resolveActorContext();
  if (!actor.staff) return;
  const preview = await getStaffPreviewContext(actor.staff);
  if (preview?.mode !== "mentor") return;
  const headerStore = await headers();
  const path = headerStore.get("x-pathname") || headerStore.get("next-url") || "";
  if (
    path.includes("/ops/team") ||
    path.includes("/ops/activity") ||
    path.includes("/ops/access") ||
    path === "/team" ||
    path.startsWith("/team/") ||
    path === "/activity" ||
    path.startsWith("/activity/") ||
    path === "/access" ||
    path.startsWith("/access/")
  ) {
    redirect(opsHref("/ops/students"));
  }
}

export { PREVIEW_COOKIE };
