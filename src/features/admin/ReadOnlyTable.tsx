"use client";

import { useEffect, useState } from "react";
import { listReadOnlyRows } from "@/features/admin/content-actions";

export function ReadOnlyTable({
  title,
  table,
  columns,
}: {
  title: string;
  table: string;
  columns: string[];
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setRows((await listReadOnlyRows(table)) as Record<string, unknown>[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, [table]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No rows yet.</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={String(row.id ?? i)}>
                  {columns.map((c) => (
                    <td key={c}>{String(row[c] ?? "")}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
