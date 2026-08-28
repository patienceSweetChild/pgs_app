"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { StaffAccessSummary } from "@/features/operations/components/StaffAccessSummary";
import {
  manageStaffAccessAction,
} from "@/features/operations/actions";
import {
  assignmentLossWarning,
  isStaffRoleKey,
  staffAccessPreview,
  staffCapabilityRows,
  staffRoleLabel,
  staffStatusLabel,
  staffSurfaceAccess,
  SUSPENDED_STAFF_ACCESS,
  type StaffAccessDetail,
} from "@/lib/operations/staff-access";
import type { StaffRoleKey } from "@/lib/auth/permissions";

type HistoryEvent = {
  id: string;
  occurred_at: string;
  event_type: string;
  outcome: string;
  metadata: Record<string, unknown> | null;
};

type PendingAction = "role" | "suspend" | "reactivate" | "revoke" | null;

export function StaffAccessDetailPanel({
  detail,
  canManage,
  email,
  history,
}: {
  detail: StaffAccessDetail;
  canManage: boolean;
  email: string | null;
  history: HistoryEvent[];
}) {
  const router = useRouter();
  const [role, setRole] = useState<StaffRoleKey>(detail.role_key);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<PendingAction>(null);
  const currentAccess = staffSurfaceAccess(detail.permission_keys, detail.role_key);
  const capabilities = staffCapabilityRows(detail.permission_keys, detail.role_key);
  const nextAccess = staffAccessPreview(role);

  async function applyChange(input: {
    role: string;
    active: boolean;
    status: string;
    reason?: string;
  }) {
    startTransition(async () => {
      try {
        await manageStaffAccessAction({
          userId: detail.user_id,
          role: input.role,
          active: input.active,
          status: input.status,
          displayName: detail.display_name,
          reason: input.reason,
        });
        setAction(null);
        setMessage("Staff access was updated.");
        router.refresh();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Unable to change staff access.");
      }
    });
  }

  const suspendWarning =
    detail.status === "active" && detail.assigned_student_count > 0
      ? assignmentLossWarning(detail.assigned_student_count)
      : undefined;

  return (
    <div className="pgs-ops__detail-stack">
      <section className="pgs-ops__detail-panel" aria-labelledby="staff-identity-heading">
        <h2 id="staff-identity-heading">Staff identity</h2>
        {detail.has_student_profile ? (
          <p className="pgs-ops__note">
            Also a PGS student. Student login and PGS ID remain.
          </p>
        ) : null}
        <dl className="pgs-ops__facts">
          {email ? (
            <div>
              <dt>Email</dt>
              <dd>{email}</dd>
            </div>
          ) : null}
          <div>
            <dt>Status</dt>
            <dd>{staffStatusLabel(detail.status, detail.invite_pending)}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{staffRoleLabel(detail.role_key)}</dd>
          </div>
          <div>
            <dt>Assigned students</dt>
            <dd>{detail.assigned_student_count}</dd>
          </div>
        </dl>
      </section>

      <StaffAccessSummary access={currentAccess} />

      <section className="pgs-ops__detail-panel" aria-labelledby="staff-capabilities-heading">
        <h2 id="staff-capabilities-heading">Capabilities</h2>
        <dl className="pgs-ops__facts">
          {capabilities.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {history.length ? (
        <section className="pgs-ops__detail-panel" aria-labelledby="staff-history-heading">
          <h2 id="staff-history-heading">Recent access history</h2>
          <div className="pgs-ops__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                  <th>Outcome</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {history.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <time dateTime={event.occurred_at}>
                        {new Date(event.occurred_at).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </td>
                    <td>{event.event_type}</td>
                    <td>{event.outcome}</td>
                    <td>
                      {[event.metadata?.previous_role, event.metadata?.new_role]
                        .filter(Boolean)
                        .join(" → ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {canManage ? (
        <section className="pgs-ops__detail-panel" aria-labelledby="staff-actions-heading">
          <h2 id="staff-actions-heading">Access management</h2>
          {message ? (
            <p className="pgs-ops__status" role="status">
              {message}
            </p>
          ) : null}
          <label className="pgs-ops__field">
            <span>Role</span>
            <select
              onChange={(event) => {
                if (isStaffRoleKey(event.target.value)) setRole(event.target.value);
              }}
              value={role}
            >
              <option value="read_only_staff">Read-only Staff</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>
          <div className="pgs-ops__inline-actions" style={{ marginTop: "0.75rem" }}>
            <button
              className="pgs-ops__btn"
              disabled={pending || role === detail.role_key}
              onClick={() => setAction("role")}
              type="button"
            >
              Change role
            </button>
            {detail.status === "active" ? (
              <button
                className="pgs-ops__btn pgs-ops__btn--danger"
                disabled={pending}
                onClick={() => setAction("suspend")}
                type="button"
              >
                Suspend staff access
              </button>
            ) : (
              <button
                className="pgs-ops__btn"
                disabled={pending}
                onClick={() => setAction("reactivate")}
                type="button"
              >
                Reactivate staff access
              </button>
            )}
            {detail.status !== "ended" ? (
              <button
                className="pgs-ops__btn pgs-ops__btn--danger"
                disabled={pending}
                onClick={() => setAction("revoke")}
                type="button"
              >
                Revoke staff access
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {action ? (
        <div className="pgs-ops__modal-backdrop">
          <div className="pgs-ops__modal" role="dialog" aria-modal="true">
            <h2>Confirm staff access change</h2>
            <p className="pgs-ops__note">
              Review the access change before it is applied. The server still authorizes this
              with roles.manage.
            </p>
            <StaffAccessSummary access={currentAccess} heading="Current access" />
            <StaffAccessSummary
              access={
                action === "role" || action === "reactivate"
                  ? nextAccess
                  : action === "revoke" || action === "suspend"
                    ? SUSPENDED_STAFF_ACCESS
                    : currentAccess
              }
              heading="After change"
            />
            {action === "suspend" && suspendWarning ? (
              <p className="pgs-ops__alert">{suspendWarning}</p>
            ) : null}
            {action === "revoke" ? (
              <p className="pgs-ops__alert">
                Auth and any student account remain. Staff access ends.
              </p>
            ) : null}
            <div className="pgs-ops__inline-actions">
              <button
                className="pgs-ops__btn"
                disabled={pending}
                onClick={() => {
                  if (action === "role") {
                    void applyChange({
                      role,
                      active: true,
                      status: detail.status === "ended" ? "active" : detail.status,
                    });
                  } else if (action === "suspend") {
                    void applyChange({
                      role: detail.role_key,
                      active: true,
                      status: "suspended",
                      reason: "Suspended from operations portal",
                    });
                  } else if (action === "reactivate") {
                    void applyChange({
                      role,
                      active: true,
                      status: "active",
                      reason: "Reactivated from operations portal",
                    });
                  } else if (action === "revoke") {
                    void applyChange({
                      role: detail.role_key,
                      active: false,
                      status: "ended",
                      reason: "Revoked from operations portal",
                    });
                  }
                }}
                type="button"
              >
                {action === "suspend"
                  ? "Suspend staff access"
                  : action === "revoke"
                    ? "Revoke staff access"
                    : action === "reactivate"
                      ? "Reactivate staff access"
                      : "Change role"}
              </button>
              <button
                className="pgs-ops__btn pgs-ops__btn--ghost"
                disabled={pending}
                onClick={() => setAction(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
