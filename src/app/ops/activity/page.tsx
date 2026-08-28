import { ActivityFeed } from "@/features/operations/components/ActivityFeed";
import { loadActivityFeed } from "@/lib/operations/activity-server";

export default async function OpsActivityPage() {
  const events = await loadActivityFeed();

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Audit trail</p>
          <h1>Activity</h1>
          <p className="pgs-ops__page-meta">Recent operations audit events.</p>
        </div>
      </div>
      <ActivityFeed events={events} />
    </div>
  );
}
