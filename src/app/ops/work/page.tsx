import Link from "next/link";
import { opsHref } from "@pgs/shared";
import { StaffTargetsPanel } from "@/features/operations/components/StaffTargetsPanel";
import {
  loadStaffTargetOptions,
  loadStaffTargetSummary,
  loadStaffTargets,
} from "@/lib/operations/staff-targets-server";
import {
  normalizeStaffTargetFilter,
  resolveStaffTargetsScope,
} from "@/lib/operations/staff-targets";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { validUuid } from "@/lib/http";

export default async function OpsWorkPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await resolveActorContext();
  if (!actor.staff) return null;
  const query = await searchParams;
  const scope = resolveStaffTargetsScope(actor.staff);
  const status = normalizeStaffTargetFilter(
    Array.isArray(query.status) ? query.status[0] : query.status,
  );
  const requestedAssignee = Array.isArray(query.assignee) ? query.assignee[0] : query.assignee;
  const requestedTarget = Array.isArray(query.target) ? query.target[0] : query.target;
  const assigneeId = scope === "organization" && validUuid(requestedAssignee ?? "") ? requestedAssignee : null;
  const targetId = validUuid(requestedTarget ?? "") ? requestedTarget : null;
  const [summary, targets, options] = await Promise.all([
    loadStaffTargetSummary(actor, assigneeId),
    loadStaffTargets(actor, { assigneeId, status, targetId, limit: 100 }),
    loadStaffTargetOptions(actor),
  ]);
  const canManageAll = scope === "organization" && staffHasPermission(actor.staff, "staff_targets.manage_all");

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Operations work</p>
          <h1>{scope === "my_work" ? "My Work" : "Staff Targets"}</h1>
          <p className="pgs-ops__page-meta">
            {scope === "restricted"
              ? "Your current role does not include staff-target responsibility."
              : "Assign and inspect operational follow-ups."}
          </p>
        </div>
        {scope === "organization" ? (
          <div className="pgs-ops__header-actions">
            <Link href={opsHref("/ops/team")}>Open Team</Link>
          </div>
        ) : null}
      </div>

      {scope === "restricted" ? (
        <section className="pgs-ops__detail-panel">
          <p>No target rows are available under your current authority.</p>
        </section>
      ) : (
        <>
          <div className="pgs-ops__grid">
            <div className="pgs-ops__card">
              <p>Open</p>
              <h3>{summary.openTargets}</h3>
            </div>
            <div className="pgs-ops__card">
              <p>Due soon</p>
              <h3>{summary.dueSoon}</h3>
            </div>
            <div className="pgs-ops__card">
              <p>Overdue</p>
              <h3>{summary.overdue}</h3>
            </div>
            <div className="pgs-ops__card">
              <p>Completed</p>
              <h3>{summary.completedRecently}</h3>
            </div>
          </div>
          <form className="pgs-ops__filters" method="get">
            <select name="status" defaultValue={status ?? ""}>
              <option value="">All</option>
              <option value="open">All open</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="due_soon">Due soon</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {scope === "organization" ? (
              <select name="assignee" defaultValue={assigneeId ?? ""}>
                <option value="">All staff</option>
                {options.assignees.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button className="pgs-ops__btn" type="submit">
              Apply filters
            </button>
          </form>
          <StaffTargetsPanel
            targets={targets}
            canCreate={canManageAll || staffHasPermission(actor.staff, "staff_targets.manage")}
            assignees={canManageAll ? options.assignees : []}
            students={options.students}
          />
        </>
      )}
    </div>
  );
}
