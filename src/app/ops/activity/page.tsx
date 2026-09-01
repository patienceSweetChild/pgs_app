import { ActivityFeed } from "@/features/operations/components/ActivityFeed";
import { loadOperationsActivity } from "@/lib/operations/activity-server";
import {
  OPERATIONS_ACTIVITY_DOMAINS,
  normalizeOperationsActivityDomain,
  operationsActivityDomainLabel,
} from "@/lib/operations/activity";
import { redirectMentorPreviewAwayFromPrivilegedPages } from "@/lib/operations/staff-preview-server";

export default async function OpsActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string | string[] }>;
}) {
  await redirectMentorPreviewAwayFromPrivilegedPages();
  const filters = await searchParams;
  const domain = normalizeOperationsActivityDomain(
    Array.isArray(filters.domain) ? filters.domain[0] : filters.domain,
  );
  const events = await loadOperationsActivity(domain);

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Audit trail</p>
          <h1>Activity</h1>
          <p className="pgs-ops__page-meta">Human-readable authorized history.</p>
        </div>
      </div>
      <form className="pgs-ops__filters" method="get">
        <label>
          Activity domain
          <select name="domain" defaultValue={domain ?? ""}>
            <option value="">All domains</option>
            {OPERATIONS_ACTIVITY_DOMAINS.map((option) => (
              <option key={option} value={option}>
                {operationsActivityDomainLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <button className="pgs-ops__btn" type="submit">
          Filter activity
        </button>
      </form>
      <ActivityFeed
        events={events.map((item) => ({
          id: item.id,
          occurred_at: item.occurredAt,
          event_type: item.eventLabel,
          actor_user_id: null,
          actor_kind: item.actorLabel,
          target_type: item.targetType,
          target_id: item.targetLabel,
          outcome: item.outcome,
          source_subsystem: item.sourceSubsystem,
          metadata: {},
        }))}
      />
    </div>
  );
}
