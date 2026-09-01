import { AccessControlsPanel } from "@/features/operations/components/AccessControlsPanel";
import { redirectMentorPreviewAwayFromPrivilegedPages } from "@/lib/operations/staff-preview-server";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadMentorOptions } from "@/lib/operations/student-registry-server";

export default async function OpsAccessPage() {
  await redirectMentorPreviewAwayFromPrivilegedPages();
  await requireStaffPermission("premium.manage");
  const supabase = await createSupabaseServerClient();
  const [{ data: profiles }, mentors, { data: plans }, { data: events }, { data: assignments }] =
    await Promise.all([
      supabase.from("profiles").select("id,full_name").order("full_name").limit(400),
      loadMentorOptions(),
      supabase.from("premium_plans").select("code,label,duration_months").eq("is_active", true).order("sort_order"),
      supabase
        .from("premium_entitlement_events")
        .select("id,student_id,resulting_status,source,reason,occurred_at,plan_code,duration_months")
        .order("occurred_at", { ascending: false })
        .limit(40),
      supabase
        .from("mentor_assignments")
        .select("id,student_id,mentor_id,status,assigned_at,reason")
        .order("assigned_at", { ascending: false })
        .limit(40),
    ]);

  const nameById = new Map((profiles ?? []).map((row) => [row.id, row.full_name || "Student"]));
  const mentorById = new Map(mentors.map((row) => [row.id, row.displayName]));

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Access control</p>
          <h1>Premium plans and mentor assignments</h1>
          <p className="pgs-ops__page-meta">
            Premium is a time-bounded entitlement. Grants start at the server clock. Client start
            times are ignored.
          </p>
        </div>
      </div>
      <AccessControlsPanel
        students={(profiles ?? []).map((row) => ({ id: row.id, label: row.full_name || "Student" }))}
        mentors={mentors.map((row) => ({ user_id: row.id, display_name: row.displayName, role_key: row.roleKey ?? "mentor" }))}
        plans={(plans ?? []).map((plan) => ({
          code: plan.code,
          label: plan.label,
          durationMonths: plan.duration_months,
        }))}
      />
      <div className="pgs-ops__profile-layout">
        <section className="pgs-ops__detail-panel">
          <h2>Premium entitlement history</h2>
          <ul className="pgs-ops__list">
            {(events ?? []).map((event) => (
              <li key={event.id} className="pgs-ops__list-row">
                <span>
                  <span className="pgs-ops__badge">{event.resulting_status}</span>{" "}
                  {nameById.get(event.student_id) || event.student_id} · {event.plan_code || "legacy"}
                </span>
                <small>{new Date(event.occurred_at).toLocaleString("en-GB")}</small>
              </li>
            ))}
          </ul>
        </section>
        <section className="pgs-ops__detail-panel">
          <h2>Mentor assignment history</h2>
          <ul className="pgs-ops__list">
            {(assignments ?? []).map((assignment) => (
              <li key={assignment.id} className="pgs-ops__list-row">
                <span>
                  {mentorById.get(assignment.mentor_id) || "Staff"} →{" "}
                  {nameById.get(assignment.student_id) || assignment.student_id} ({assignment.status})
                </span>
                <small>{new Date(assignment.assigned_at).toLocaleString("en-GB")}</small>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
