import "server-only";

import { cookies } from "next/headers";
import type { StaffContext } from "@/lib/auth/actor-context";

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

export function isPreviewMutationBlocked(
  preview: StaffPreviewContext | null,
): boolean {
  return preview?.mode === "student";
}

export async function assertStaffPreviewWritable() {
  const { resolveActorContext } = await import("@/lib/auth/actor-context");
  const actor = await resolveActorContext();
  if (!actor.staff) throw new Error("Forbidden");
  const preview = await getStaffPreviewContext(actor.staff);
  if (isPreviewMutationBlocked(preview)) {
    throw new Error("Mutations are blocked while previewing as a student.");
  }
}

export { PREVIEW_COOKIE };
