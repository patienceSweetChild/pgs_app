import type { AuditEventRow } from "@/lib/operations/activity-server";

export function ActivityFeed({ events }: { events: AuditEventRow[] }) {
  return (
    <div className="pgs-ops__table-wrap">
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>Event</th>
            <th>Target</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={4}>No activity yet.</td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id}>
                <td>{new Date(event.occurred_at).toLocaleString()}</td>
                <td>{event.event_type}</td>
                <td>
                  {event.target_type ?? "—"}
                  {event.target_id ? ` · ${event.target_id}` : ""}
                </td>
                <td>{event.outcome}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
