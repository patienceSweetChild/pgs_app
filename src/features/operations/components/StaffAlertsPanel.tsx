"use client";

import { useState } from "react";
import type { StaffAlert } from "@/lib/premium-workspace";
import {
  MAX_STUDENT_ALERT_WORDS,
  studentAlertWordCount,
} from "@/lib/student-operations";
import { requestStaffWorkspace } from "@/features/operations/staff-workspace-request";

function AlertTextField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [text, setText] = useState(defaultValue ?? "");
  const words = studentAlertWordCount(text);
  return (
    <label>
      <span>Alert text</span>
      <textarea
        name={name}
        required
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={240}
        rows={2}
      />
      <small className="pgs-ops__note">
        {words} / {MAX_STUDENT_ALERT_WORDS} words
      </small>
    </label>
  );
}

export function StaffAlertsPanel({
  studentId,
  alerts,
  canManage,
}: {
  studentId: string;
  alerts: StaffAlert[];
  canManage: boolean;
}) {
  const [message, setMessage] = useState("");
  const activeAlerts = alerts.filter((alert) => alert.active).length;

  async function save(
    method: "POST" | "PATCH" | "DELETE",
    values: Record<string, unknown>,
  ) {
    setMessage("Saving…");
    const error = await requestStaffWorkspace(studentId, "alerts", method, values);
    if (error) setMessage(error);
  }

  return (
    <section className="pgs-ops__workspace-panel" aria-labelledby="staff-alerts-heading">
      <h2 id="staff-alerts-heading">Important alerts</h2>
      <p className="pgs-ops__note">
        {activeAlerts} active of 3 important alerts shown on the student dashboard.
      </p>
      {message ? (
        <p className="pgs-ops__status" role="status">
          {message}
        </p>
      ) : null}

      {alerts.length ? (
        <div className="pgs-ops__stack">
          {alerts.map((alert) => (
            <article key={alert.id} className="pgs-ops__workspace-item">
              <div className="pgs-ops__inline-actions">
                <span className="pgs-ops__badge">
                  {alert.active ? "Active" : "Dismissed"}
                </span>
                <span className="pgs-ops__badge">{alert.severity}</span>
              </div>
              <p>{alert.alert_text}</p>
              <time className="pgs-ops__note" dateTime={alert.updated_at}>
                {new Date(alert.updated_at).toLocaleString("en-GB")}
              </time>
              {canManage ? (
                <form
                  className="pgs-ops__form-grid"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    void save("PATCH", {
                      id: alert.id,
                      alert_text: data.get("alert_text"),
                      severity: data.get("severity"),
                      active: data.get("active") === "true",
                      sort_order: Number(data.get("sort_order")),
                    });
                  }}
                >
                  <AlertTextField name="alert_text" defaultValue={alert.alert_text} />
                  <label>
                    <span>Severity</span>
                    <select name="severity" defaultValue={alert.severity}>
                      <option value="important">important</option>
                      <option value="urgent">urgent</option>
                      <option value="info">info</option>
                    </select>
                  </label>
                  <label>
                    <span>State</span>
                    <select name="active" defaultValue={String(alert.active)}>
                      <option value="true">Active</option>
                      <option value="false">Dismissed</option>
                    </select>
                  </label>
                  <label>
                    <span>Order</span>
                    <input
                      name="sort_order"
                      type="number"
                      min="0"
                      defaultValue={alert.sort_order}
                    />
                  </label>
                  <div className="pgs-ops__inline-actions">
                    <button className="pgs-ops__btn" type="submit">
                      Update alert
                    </button>
                    <button
                      className="pgs-ops__btn pgs-ops__btn--danger"
                      onClick={() => void save("DELETE", { id: alert.id })}
                      type="button"
                    >
                      Delete alert
                    </button>
                  </div>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="pgs-ops__note">No alerts yet.</p>
      )}

      {canManage ? (
        <form
          className="pgs-ops__form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void save("POST", {
              alert_text: data.get("alert_text"),
              severity: data.get("severity"),
            });
          }}
        >
          <AlertTextField name="alert_text" />
          <label>
            <span>Severity</span>
            <select name="severity" defaultValue="important">
              <option value="important">important</option>
              <option value="urgent">urgent</option>
              <option value="info">info</option>
            </select>
          </label>
          <button className="pgs-ops__btn" type="submit">
            Add alert
          </button>
        </form>
      ) : null}
    </section>
  );
}
