import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffAccessDetailPanel } from "@/features/operations/components/StaffAccessDetail";
import { StaffTargetsPanel } from "@/features/operations/components/StaffTargetsPanel";
import {
  loadStaffAccessHistory,
  loadStaffAuthEmail,
  loadStaffMemberTargetSummary,
  requireStaffAccessDetail,
} from "@/lib/operations/staff-access-server";
import { loadStaffTargets } from "@/lib/operations/staff-targets-server";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { validUuid } from "@/lib/http";

export default async function OpsTeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffPermission("staff.read");
  const { id } = await params;
  if (!validUuid(id)) notFound();

  const actor = await resolveActorContext();
  const detail = await requireStaffAccessDetail(id);
  const [email, history, targetSummary, targets] = await Promise.all([
    loadStaffAuthEmail(actor, id),
    loadStaffAccessHistory(actor, id),
    loadStaffMemberTargetSummary(id),
    loadStaffTargets(actor).then((rows) =>
      rows.filter((row) => row.staff_user_id === id).slice(0, 25),
    ),
  ]);

  const canManage = staffHasPermission(actor.staff, "roles.manage");

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Staff profile</p>
          <h1>{detail.display_name || "Staff member"}</h1>
          <p className="pgs-ops__page-meta">
            Effective access comes from the active role assignment. This is not an HR profile.
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          <Link href="/ops/team">← Team directory</Link>
          <Link href={`/ops/work?staff=${id}`}>Manage targets</Link>
        </div>
      </div>

      <section className="pgs-ops__detail-panel" aria-labelledby="staff-targets-heading">
        <h2 id="staff-targets-heading">Staff responsibility</h2>
        <p className="pgs-ops__note">
          Current operational work assigned to this staff member.
        </p>
        <dl className="pgs-ops__facts">
          <div>
            <dt>Open targets</dt>
            <dd>{targetSummary.openTargets}</dd>
          </div>
          <div>
            <dt>Due soon</dt>
            <dd>{targetSummary.dueSoon}</dd>
          </div>
          <div>
            <dt>Overdue</dt>
            <dd>{targetSummary.overdue}</dd>
          </div>
          <div>
            <dt>Completed recently</dt>
            <dd>{targetSummary.completedRecently}</dd>
          </div>
        </dl>
        {targets.length ? (
          <div style={{ marginTop: "1rem" }}>
            <StaffTargetsPanel targets={targets} />
          </div>
        ) : null}
      </section>

      <StaffAccessDetailPanel
        canManage={canManage}
        detail={detail}
        email={email}
        history={history}
      />
    </div>
  );
}
