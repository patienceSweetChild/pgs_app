import Link from "next/link";
import { notFound } from "next/navigation";
import { cmsStudentHref, opsHref } from "@pgs/shared";
import { StudentCrmIdentityPanel } from "@/features/operations/components/StudentCrmIdentityPanel";
import { StudentDetailActions } from "@/features/operations/components/StudentDetailActions";
import { StudentGuardiansPanel } from "@/features/operations/components/StudentGuardiansPanel";
import { StaffAlertsPanel } from "@/features/operations/components/StaffAlertsPanel";
import { StaffDocumentsPanel } from "@/features/operations/components/StaffDocumentsPanel";
import { StaffKanbanBoard } from "@/features/operations/components/StaffKanbanBoard";
import { StaffWorkspaceExtras } from "@/features/operations/components/StaffWorkspaceExtras";
import {
  loadStaffStudentCrmProfile,
  loadStudentCrmTags,
} from "@/lib/operations/student-crm-server";
import {
  canQueryStudentRegistry,
  loadMentorOptions,
} from "@/lib/operations/student-registry-server";
import { staffHasPermission, resolveActorContext } from "@/lib/auth/actor-context";
import { canViewStudent } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CRM_STAGE_LABELS } from "@/lib/operations/student-crm";
import {
  loadPremiumWorkspace,
  WorkspaceAccessError,
} from "@/lib/premium-workspace";

export default async function OpsStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await resolveActorContext();
  if (!actor.staff || !canQueryStudentRegistry(actor.staff)) notFound();

  const [crm, availableTags, mentors, guardiansResult] = await Promise.all([
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
  ]);

  if (!crm) notFound();

  let workspace = null;
  let canManage = false;
  if (crm.canOpenWorkspace) {
    try {
      workspace = await loadPremiumWorkspace(id);
      const manageDecision = await canViewStudent(id, "manage");
      canManage = manageDecision.allowed && manageDecision.actor.kind !== "student";
    } catch (error) {
      if (!(error instanceof WorkspaceAccessError)) throw error;
    }
  }

  const canEditDashboard =
    crm.plan === "Premium" &&
    (canManage ||
      staffHasPermission(actor.staff, "student_workspace.manage_all") ||
      staffHasPermission(actor.staff, "students.manage"));
  const canManageGuardians = staffHasPermission(actor.staff, "student_workspace.manage_all");
  const universityOptions = workspace
    ? (
        await createSupabaseServerClient().then((supabase) =>
          supabase.from("universities").select("id,name").order("name").limit(300),
        )
      ).data ?? []
    : [];

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">{workspace ? "Student workspace" : "Student profile"}</p>
          <h1>{crm.fullName}</h1>
          <p className="pgs-ops__page-meta">
            {workspace
              ? "CRM identity and the shared premium workspace."
              : "Registry record for this student. Workspace opens when entitlement and permission both allow it."}
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          <Link href={opsHref("/ops/students")}>← Registry</Link>
          {canEditDashboard ? (
            <Link href={cmsStudentHref(id)}>Edit dashboard</Link>
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
            canCreateTags={staffHasPermission(actor.staff, "student_workspace.manage_all")}
            profile={crm}
          />
          <StudentGuardiansPanel
            canManage={canManageGuardians}
            initialGuardians={guardiansResult}
            studentId={id}
          />
          {workspace ? (
            <>
              <StaffWorkspaceExtras
                studentId={id}
                canManage={canManage}
                premiumProfile={workspace.premiumProfile}
                comments={workspace.comments}
                notes={workspace.notes}
                reviews={workspace.reviews}
                universities={workspace.universities}
                universityOptions={universityOptions}
              />
              <StaffKanbanBoard
                canManage={canManage}
                columns={workspace.columns}
                studentId={id}
                tasks={workspace.tasks}
              />
              <StaffAlertsPanel alerts={workspace.alerts} canManage={canManage} studentId={id} />
              <StaffDocumentsPanel
                canManage={canManage}
                requirements={workspace.requirements}
                studentId={id}
              />
            </>
          ) : null}
        </div>
        <aside className="pgs-ops__profile-aside">
          <StudentDetailActions
            canOpenWorkspace={crm.canOpenWorkspace}
            isPremium={crm.plan === "Premium"}
            mentors={mentors.map((mentor) => ({
              user_id: mentor.id,
              display_name: mentor.displayName,
              role_key: mentor.roleKey ?? "mentor",
            }))}
            studentId={id}
            studentName={crm.fullName}
          />
        </aside>
      </div>
    </div>
  );
}
