"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requirePerm(key: string) {
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, key)) {
    throw new Error("Forbidden");
  }
  return actor;
}

export async function reviewPremiumApplication(
  applicationId: string,
  decision: "approved" | "rejected",
) {
  const actor = await requirePerm("premium.manage");
  const supabase = await createSupabaseServerClient();

  const { data: app, error } = await supabase
    .from("premium_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !app) throw new Error(error?.message || "Not found");

  const { error: updError } = await supabase
    .from("premium_applications")
    .update({
      status: decision,
      reviewed_by: actor.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updError) throw new Error(updError.message);

  if (decision === "approved") {
    const starts = new Date();
    const ends = new Date();
    ends.setMonth(ends.getMonth() + (app.duration_months ?? 12));

    const { data: plan } = await supabase
      .from("premium_plans")
      .select("duration_months")
      .eq("code", app.plan_code)
      .maybeSingle();

    const months = plan?.duration_months ?? 12;
    ends.setTime(starts.getTime());
    ends.setMonth(ends.getMonth() + months);

    await supabase.from("premium_entitlements").insert({
      student_id: app.student_id,
      status: "active",
      source: "admin_grant",
      plan_code: app.plan_code,
      duration_months: months,
      approved_at: starts.toISOString(),
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      updated_by: actor.userId,
    });
  }

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.userId,
    actor_role: actor.staff?.roleKey,
    target_user_id: app.student_id,
    entity: "premium_application",
    entity_id: applicationId,
    action: decision === "approved" ? "approve" : "reject",
    description: `${decision} PurplePremium application`,
  });

  revalidatePath("/admin/premium");
  revalidatePath("/admin");
  revalidatePath("/admin/premium-dashboard");
  revalidatePath("/ops/students");
  revalidatePath("/ops/access");
}

export async function assignMentor(studentId: string, mentorId: string) {
  const actor = await requirePerm("students.manage");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("set_mentor_assignment", {
    target_student: studentId,
    target_mentor: mentorId,
    target_active: true,
    event_reason: "Assigned from CMS admin",
  });
  if (error) throw new Error(error.message);

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.userId,
    actor_role: actor.staff?.roleKey,
    target_user_id: studentId,
    entity: "user_profile",
    entity_id: studentId,
    action: "update",
    description: "Updated mentor assignment",
    changes: { mentor_id: mentorId },
  });

  revalidatePath("/admin/users");
}

export async function replyEnquiry(id: number, replyMessage: string) {
  await requirePerm("leads.manage");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ reply: true, reply_message: replyMessage })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/enquiries");
}

export async function inviteGuardian(
  studentId: string,
  email: string,
  label = "Guardian",
) {
  await requirePerm("guardians.manage");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_invite_guardian", {
    p_student_id: studentId,
    p_email: email,
    p_label: label,
  });
  if (error) throw new Error(error.message);

  try {
    const { createSupabaseAdminClient } = await import(
      "@/lib/supabase/admin"
    );
    const admin = createSupabaseAdminClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect=/portal`,
      data: { pgs_context: "guardian", invited_for: "pgs_guardian" },
    });
  } catch {
    // Relationship row still created; email invite may need dashboard fallback
  }

  revalidatePath(`/admin/users/${studentId}`);
  return data as string;
}
