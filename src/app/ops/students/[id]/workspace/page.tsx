import Link from "next/link";
import { StaffAlertsPanel } from "@/features/operations/components/StaffAlertsPanel";
import { StaffDocumentsPanel } from "@/features/operations/components/StaffDocumentsPanel";
import { StaffKanbanBoard } from "@/features/operations/components/StaffKanbanBoard";
import { canViewStudent } from "@/lib/auth/student-access";
import {
  loadPremiumWorkspace,
  WorkspaceAccessError,
} from "@/lib/premium-workspace";

export default async function OpsStudentWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let workspace = null;
  let canManage = false;
  try {
    workspace = await loadPremiumWorkspace(id);
    const manageDecision = await canViewStudent(id, "manage");
    canManage = manageDecision.allowed && manageDecision.actor.kind !== "student";
  } catch (error) {
    if (!(error instanceof WorkspaceAccessError)) throw error;
  }

  const activeAlerts = workspace?.alerts.filter((alert) => alert.active).length ?? 0;

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Student workspace</p>
          <h1>{workspace?.profile?.full_name || "Student workspace"}</h1>
          <p className="pgs-ops__page-meta">
            Staff view of the shared premium workspace — loopboard, alerts, and documents.
          </p>
        </div>
        <div className="pgs-ops__inline-actions">
          <Link href={`/ops/students/${id}`}>← Student profile</Link>
          <Link href={`/dashboard?studentId=${id}`}>Open dashboard view</Link>
        </div>
      </div>

      {workspace ? (
        <>
          <div className="pgs-ops__grid">
            <div className="pgs-ops__card">
              <p>Pathway</p>
              <h3 style={{ fontSize: "1rem" }}>
                {workspace.premiumProfile?.pathway_label || "Not set"}
              </h3>
            </div>
            <div className="pgs-ops__card">
              <p>Documents</p>
              <h3>{workspace.requirements.length}</h3>
            </div>
            <div className="pgs-ops__card">
              <p>Active alerts</p>
              <h3>{activeAlerts}</h3>
            </div>
            <div className="pgs-ops__card">
              <p>Tasks</p>
              <h3>{workspace.tasks.length}</h3>
            </div>
          </div>

          <StaffKanbanBoard
            canManage={canManage}
            columns={workspace.columns}
            studentId={id}
            tasks={workspace.tasks}
          />
          <StaffAlertsPanel
            alerts={workspace.alerts}
            canManage={canManage}
            studentId={id}
          />
          <StaffDocumentsPanel
            canManage={canManage}
            requirements={workspace.requirements}
            studentId={id}
          />
        </>
      ) : (
        <section className="pgs-ops__detail-panel">
          <p>
            No workspace access yet. The student needs active premium and your role must allow
            workspace read access.
          </p>
        </section>
      )}
    </div>
  );
}
