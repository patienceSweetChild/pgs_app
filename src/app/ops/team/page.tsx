import Link from "next/link";
import { opsHref } from "@pgs/shared";
import { StaffDirectory } from "@/features/operations/components/StaffDirectory";
import { loadStaffDirectory } from "@/lib/operations/staff-access-server";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { redirectMentorPreviewAwayFromPrivilegedPages } from "@/lib/operations/staff-preview-server";

export default async function OpsTeamPage() {
  await redirectMentorPreviewAwayFromPrivilegedPages();
  const actor = await resolveActorContext();
  const rows = await loadStaffDirectory();
  const canManage = staffHasPermission(actor.staff, "roles.manage");
  const isSuperAdmin = actor.staff?.roleKey === "super_admin";

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">People & access</p>
          <h1>Team</h1>
          <p className="pgs-ops__page-meta">
            Staff directory, roles, and assigned student counts. Invite or add staff, then open a
            profile to inspect effective access.
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          {canManage ? (
            <Link className="is-primary" href={opsHref("/ops/team/add")}>
              Invite / add staff
            </Link>
          ) : null}
          {isSuperAdmin ? <Link href={opsHref("/ops/team/roles")}>Permission matrix</Link> : null}
        </div>
      </div>
      <StaffDirectory rows={rows} canManage={canManage} />
    </div>
  );
}
