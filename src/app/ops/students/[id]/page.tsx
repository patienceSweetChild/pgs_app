import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentCrmIdentityPanel } from "@/features/operations/components/StudentCrmIdentityPanel";
import { StudentDetailActions } from "@/features/operations/components/StudentDetailActions";
import { StudentGuardiansPanel } from "@/features/operations/components/StudentGuardiansPanel";
import {
  loadStaffStudentCrmProfile,
  loadStudentCrmTags,
} from "@/lib/operations/student-crm-server";
import {
  loadMentorOptions,
  registryShowsOpenColumn,
} from "@/lib/operations/student-registry-server";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CRM_STAGE_LABELS } from "@/lib/operations/student-crm";

export default async function OpsStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireStaffPermission("overview.read");
  if (!actor.staff || !registryShowsOpenColumn(actor.staff)) notFound();

  const [crm, availableTags, mentors, guardiansResult, workspaceResult] =
    await Promise.all([
      loadStaffStudentCrmProfile(id),
      loadStudentCrmTags(),
      loadMentorOptions().catch(() => []),
      createSupabaseServerClient()
        .then((supabase) =>
          supabase
            .from("student_guardian_relationships")
            .select("id, student_id, guardian_email, relationship_label, status, created_at")
            .eq("student_id", id)
            .order("created_at", { ascending: false }),
        )
        .then(({ data }) => data ?? []),
      createSupabaseServerClient()
        .then((supabase) =>
          supabase
            .from("premium_workspace_profiles")
            .select("*")
            .eq("student_id", id)
            .maybeSingle(),
        )
        .then(({ data }) => data),
    ]);

  if (!crm) notFound();

  const canManageGuardians = staffHasPermission(
    actor.staff,
    "student_workspace.manage_all",
  );

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Student profile</p>
          <h1>{crm.fullName}</h1>
          <p className="pgs-ops__page-meta">
            Registry record for this student. Use access controls to grant premium,
            assign a handler, or open the workspace when authorized.
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          <Link href="/ops/students">← Registry</Link>
          <Link href={`/admin/users/${id}`}>CMS record</Link>
          {crm.canOpenWorkspace ? (
            <Link className="is-primary" href={`/ops/students/${id}/workspace`}>
              Open workspace
            </Link>
          ) : null}
        </div>
      </div>

      <div className="pgs-ops__grid">
        <div className="pgs-ops__card pgs-ops__stat-card">
          <p>Plan</p>
          <h3>{crm.plan}</h3>
        </div>
        <div className="pgs-ops__card pgs-ops__stat-card">
          <p>CRM stage</p>
          <h3>{CRM_STAGE_LABELS[crm.stage]}</h3>
        </div>
        <div className="pgs-ops__card pgs-ops__stat-card">
          <p>Handler</p>
          <h3>{crm.mentorName}</h3>
        </div>
        <div className="pgs-ops__card pgs-ops__stat-card">
          <p>Workspace</p>
          <h3>{crm.canOpenWorkspace ? "Authorized" : "No access"}</h3>
        </div>
      </div>

      <div className="pgs-ops__profile-layout">
        <div className="pgs-ops__profile-main">
          <StudentCrmIdentityPanel
            availableTags={availableTags}
            canCreateTags={staffHasPermission(
              actor.staff,
              "student_workspace.manage_all",
            )}
            profile={crm}
          />
          <StudentGuardiansPanel
            canManage={canManageGuardians}
            initialGuardians={guardiansResult}
            studentId={id}
          />
          {workspaceResult ? (
            <section className="pgs-ops__detail-panel">
              <h2>Workspace snapshot</h2>
              <dl className="pgs-ops__facts">
                <div>
                  <dt>Pathway</dt>
                  <dd>{workspaceResult.pathway_label || "Not set"}</dd>
                </div>
                <div>
                  <dt>Applied</dt>
                  <dd>{workspaceResult.universities_applied ?? 0}</dd>
                </div>
                <div>
                  <dt>Offers</dt>
                  <dd>{workspaceResult.offers_received ?? 0}</dd>
                </div>
                <div>
                  <dt>Onboarding</dt>
                  <dd>{workspaceResult.onboarding_percentage ?? "—"}%</dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>

        <aside className="pgs-ops__profile-aside">
          <StudentDetailActions
            canOpenWorkspace={crm.canOpenWorkspace}
            isPremium={crm.plan === "Premium"}
            mentors={mentors}
            studentId={id}
            studentName={crm.fullName}
          />
        </aside>
      </div>
    </div>
  );
}
