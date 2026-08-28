"use server";

import { revalidatePath } from "next/cache";
import {
  requireStaffPermission,
} from "@/lib/auth/student-access";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getStaffPreviewContext,
  isPreviewMutationBlocked,
} from "@/lib/operations/staff-preview-server";

async function guardMutation() {
  const actor = await resolveActorContext();
  if (!actor.staff) throw new Error("Forbidden");
  const preview = await getStaffPreviewContext(actor.staff);
  if (isPreviewMutationBlocked(preview)) {
    throw new Error("Mutations are blocked while previewing as a student.");
  }
  return actor;
}

export async function assignMentorAction(
  studentId: string,
  mentorId: string,
  reason?: string,
) {
  await requireStaffPermission("mentor_assignments.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("set_mentor_assignment", {
    target_student: studentId,
    target_mentor: mentorId,
    target_active: true,
    event_reason: reason ?? "Assigned from operations portal",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/ops/students");
  revalidatePath("/ops/access");
  revalidatePath("/admin/users");
  return data;
}

export async function unassignMentorAction(
  studentId: string,
  mentorId: string,
  reason?: string,
) {
  await requireStaffPermission("mentor_assignments.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("set_mentor_assignment", {
    target_student: studentId,
    target_mentor: mentorId,
    target_active: false,
    event_reason: reason ?? "Unassigned from operations portal",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/ops/students");
  revalidatePath("/ops/access");
}

export async function manageStaffAccessAction(input: {
  userId: string;
  role: string;
  active: boolean;
  status?: string;
  displayName?: string;
  reason?: string;
}) {
  await requireStaffPermission("roles.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("manage_staff_access", {
    target_user: input.userId,
    target_role: input.role,
    target_active: input.active,
    target_status: input.status ?? "active",
    target_display_name: input.displayName ?? "",
    event_reason: input.reason ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/ops/team");
  revalidatePath(`/ops/team/${input.userId}`);
}

export async function inviteGuardianAction(
  studentId: string,
  email: string,
  label = "Guardian",
) {
  await requireStaffPermission("guardians.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("staff_invite_guardian", {
    p_student_id: studentId,
    p_email: email,
    p_label: label,
  });
  if (error) throw new Error(error.message);

  try {
    const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
    const admin = createSupabaseAdminClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect=/portal`,
      data: { pgs_context: "guardian", invited_for: "pgs_guardian" },
    });
  } catch {
    // Relationship row still created
  }

  revalidatePath(`/ops/students/${studentId}`);
}

export async function revokeGuardianAction(relationshipId: string, studentId: string) {
  await requireStaffPermission("guardians.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("student_guardian_relationships")
    .update({ status: "revoked", revoked_at: new Date().toISOString() })
    .eq("id", relationshipId)
    .eq("student_id", studentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/ops/students/${studentId}`);
}

export async function grantPremiumAction(studentId: string, months = 12) {
  await requireStaffPermission("premium.manage");
  await guardMutation();
  const actor = await resolveActorContext();
  const supabase = await createSupabaseServerClient();
  const starts = new Date();
  const ends = new Date();
  ends.setMonth(ends.getMonth() + months);

  const { error } = await supabase.from("premium_entitlements").insert({
    student_id: studentId,
    status: "active",
    source: "admin_grant",
    plan_code: "purple_premium_12",
    duration_months: months,
    approved_at: starts.toISOString(),
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    updated_by: actor.userId,
  });
  if (error) throw new Error(error.message);

  await supabase.rpc("write_ops_audit_event", {
    p_event_type: "premium.granted",
    p_actor_user_id: actor.userId,
    p_target_type: "student",
    p_target_id: studentId,
    p_outcome: "succeeded",
    p_metadata: { months },
  });

  revalidatePath("/ops/access");
  revalidatePath("/ops/students");
}

export async function revokePremiumAction(studentId: string) {
  await requireStaffPermission("premium.manage");
  await guardMutation();
  const actor = await resolveActorContext();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("premium_entitlements")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      updated_by: actor.userId,
    })
    .eq("student_id", studentId)
    .eq("status", "active");
  if (error) throw new Error(error.message);
  revalidatePath("/ops/access");
  revalidatePath("/ops/students");
}

export async function createStaffTargetAction(input: {
  title: string;
  description?: string;
  dueAt?: string | null;
  staffUserId?: string;
}) {
  await requireStaffPermission("staff_targets.manage");
  const actor = await guardMutation();
  const supabase = await createSupabaseServerClient();
  const staffUserId =
    staffHasPermission(actor.staff, "staff_targets.manage_all") &&
    input.staffUserId
      ? input.staffUserId
      : actor.userId!;

  const { error } = await supabase.from("staff_targets").insert({
    staff_user_id: staffUserId,
    title: input.title,
    description: input.description ?? "",
    due_at: input.dueAt ?? null,
    created_by: actor.userId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/ops/work");
}

export async function updateStaffTargetStatusAction(
  targetId: string,
  status: string,
) {
  await requireStaffPermission("staff_targets.manage");
  await guardMutation();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("staff_targets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", targetId);
  if (error) throw new Error(error.message);
  revalidatePath("/ops/work");
}
