import { NotificationInbox } from "@/features/operations/components/NotificationInbox";
import { loadOperationsNotifications } from "@/lib/operations/notifications-server";
import {
  STAFF_NOTIFICATION_FILTERS,
  normalizeStaffNotificationFilter,
  staffNotificationFilterLabel,
} from "@/lib/operations/notifications";

export default async function OpsNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const query = await searchParams;
  const filter = normalizeStaffNotificationFilter(
    Array.isArray(query.view) ? query.view[0] : query.view,
  );
  const notifications = await loadOperationsNotifications(filter);

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Notifications</p>
          <h1>Staff notifications</h1>
          <p className="pgs-ops__page-meta">
            Actionable updates addressed to you. Opening a destination still requires its normal
            permission.
          </p>
        </div>
      </div>
      <form className="pgs-ops__filters" method="get">
        <label>
          View
          <select name="view" defaultValue={filter}>
            {STAFF_NOTIFICATION_FILTERS.map((option) => (
              <option key={option} value={option}>
                {staffNotificationFilterLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <button className="pgs-ops__btn" type="submit">
          Apply
        </button>
      </form>
      <NotificationInbox initialItems={notifications} />
    </div>
  );
}
