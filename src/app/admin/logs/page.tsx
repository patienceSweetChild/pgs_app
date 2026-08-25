"use client";

import { useEffect, useState } from "react";
import { listAuditLogs } from "@/features/admin/content-actions";

export default function AdminLogsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setRows((await listAuditLogs()) as Record<string, unknown>[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Logs</h1>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Description</th>
              <th>Actor</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>No audit logs yet.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  <td>
                    {row.created_at
                      ? new Date(String(row.created_at)).toLocaleString()
                      : "—"}
                  </td>
                  <td>{String(row.action ?? "")}</td>
                  <td>
                    {String(row.entity ?? row.entity_type ?? "")}
                    {row.entity_id ? ` #${row.entity_id}` : ""}
                  </td>
                  <td>{String(row.description ?? row.reason ?? "")}</td>
                  <td>
                    <code>{String(row.actor_id ?? "").slice(0, 8)}</code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
