import "server-only";

import {
  resolveActorContext,
  staffHasPermission,
  type ActorContext,
  type StaffContext,
} from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStaffPreviewContext } from "@/lib/operations/staff-preview-server";

export type StudentWorkspaceAccess = "read" | "manage";
export type StudentViewerKind = "student" | "mentor" | "admin" | "super_admin";

export type StudentViewerActor = {
  userId: string;
  kind: StudentViewerKind;
  studentId: string;
};

export type StudentAccessDecision =
  | { allowed: true; actor: StudentViewerActor }
  | {
      allowed: false;
      actor: ActorContext;
      status: 401 | 403;
      message: string;
    };

export class StudentAccessError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
  }
}

function viewerKind(staff: StaffContext): StudentViewerKind {
  if (staff.roleKey === "super_admin") return "super_admin";
  if (staff.roleKey === "admin") return "admin";
  return "mentor";
}

async function hasActivePremium(studentId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("student_has_active_premium", {
    uid: studentId,
  });
  return Boolean(data);
}

async function isAssigned(studentId: string, userId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("student_id", studentId)
    .eq("mentor_id", userId)
    .eq("status", "active")
    .maybeSingle();
  return Boolean(data);
}

function hasGlobalAccess(
  staff: StaffContext,
  access: StudentWorkspaceAccess,
): boolean {
  if (access === "read") {
    return (
      staffHasPermission(staff, "student_workspace.read_all") ||
      staffHasPermission(staff, "students.manage") ||
      staffHasPermission(staff, "students.read")
    );
  }
  return (
    staffHasPermission(staff, "student_workspace.manage_all") ||
    staffHasPermission(staff, "students.manage")
  );
}

function hasAssignedAccess(
  staff: StaffContext,
  access: StudentWorkspaceAccess,
): boolean {
  if (access === "read") {
    return (
      staffHasPermission(staff, "student_workspace.read") ||
      staffHasPermission(staff, "students.manage_assigned")
    );
  }
  return (
    staffHasPermission(staff, "student_workspace.manage") ||
    staffHasPermission(staff, "students.manage_assigned")
  );
}

export async function canViewStudent(
  studentId: string,
  access: StudentWorkspaceAccess = "read",
): Promise<StudentAccessDecision> {
  const actor = await resolveActorContext();
  if (!actor.userId) {
    return {
      allowed: false,
      actor,
      status: 401,
      message: "Please log in.",
    };
  }

  const preview = actor.staff
    ? await getStaffPreviewContext(actor.staff)
    : null;
  const targetStudent =
    preview?.mode === "student" ? preview.targetId : studentId;

  if (!(await hasActivePremium(targetStudent))) {
    return {
      allowed: false,
      actor,
      status: 403,
      message: "An active PurplePremium entitlement is required.",
    };
  }

  if (targetStudent === actor.userId) {
    return {
      allowed: true,
      actor: { userId: actor.userId, kind: "student", studentId: targetStudent },
    };
  }

  if (!actor.staff) {
    return {
      allowed: false,
      actor,
      status: 403,
      message: "Staff access required.",
    };
  }

  if (preview?.mode === "student") {
    return {
      allowed: true,
      actor: {
        userId: actor.userId,
        kind: viewerKind(actor.staff),
        studentId: targetStudent,
      },
    };
  }

  if (hasGlobalAccess(actor.staff, access)) {
    return {
      allowed: true,
      actor: {
        userId: actor.userId,
        kind: viewerKind(actor.staff),
        studentId: targetStudent,
      },
    };
  }

  if (
    hasAssignedAccess(actor.staff, access) &&
    (await isAssigned(targetStudent, actor.userId))
  ) {
    return {
      allowed: true,
      actor: {
        userId: actor.userId,
        kind: "mentor",
        studentId: targetStudent,
      },
    };
  }

  return {
    allowed: false,
    actor,
    status: 403,
    message: "You do not have access to this student workspace.",
  };
}

export async function requireStudentViewer(
  studentId: string,
  access: StudentWorkspaceAccess = "read",
): Promise<StudentViewerActor> {
  const decision = await canViewStudent(studentId, access);
  if (!decision.allowed) {
    throw new StudentAccessError(decision.status, decision.message);
  }
  return decision.actor;
}

export async function requireStaffPermission(key: string): Promise<ActorContext> {
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, key)) {
    throw new Error("Forbidden");
  }
  return actor;
}
