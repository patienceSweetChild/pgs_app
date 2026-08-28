import { StaffTargetsPanel } from "@/features/operations/components/StaffTargetsPanel";
import { loadStaffTargets } from "@/lib/operations/staff-targets-server";
import { resolveActorContext } from "@/lib/auth/actor-context";

export default async function OpsWorkPage() {
  const actor = await resolveActorContext();
  const targets = await loadStaffTargets(actor);

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Operational work</p>
          <h1>Work</h1>
          <p className="pgs-ops__page-meta">
            Staff targets and operational follow-ups.
          </p>
        </div>
      </div>
      <StaffTargetsPanel targets={targets} />
    </div>
  );
}
