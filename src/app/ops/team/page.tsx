import { StaffDirectory } from "@/features/operations/components/StaffDirectory";
import { loadStaffDirectory } from "@/lib/operations/staff-access-server";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";

export default async function OpsTeamPage() {
  const actor = await resolveActorContext();
  const rows = await loadStaffDirectory();
  const canManage = staffHasPermission(actor.staff, "roles.manage");

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">People & access</p>
          <h1>Team</h1>
          <p className="pgs-ops__page-meta">
            Staff directory, roles, and assigned student counts. Open a profile to see
            effective access and history.
          </p>
        </div>
      </div>
      <StaffDirectory rows={rows} canManage={canManage} />
    </div>
  );
}
