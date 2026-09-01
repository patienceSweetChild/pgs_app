"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  listDashboardStudents,
  type DashListFilter,
  type DashStudentRow,
} from "./dash-actions";

export function DashCmsTable() {
  const [rows, setRows] = useState<DashStudentRow[]>([]);
  const [filter, setFilter] = useState<DashListFilter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listDashboardStudents({ q: query, filter }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void reload();
    }, 180);
    return () => window.clearTimeout(handle);
  }, [reload]);

  return (
    <div className="pgs-admin__content">
      <div className="pgs-admin__toolbar">
        <div>
          <h1 style={{ margin: 0 }}>Student dashboards</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            Edit each student dashboard with draft / live publish, the same way
            as events.
          </p>
        </div>
        <div className="pgs-admin__tabs" role="tablist" aria-label="Status">
          {(
            [
              ["all", "All"],
              ["live", "Live"],
              ["draft", "Draft"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={filter === id ? "is-active" : undefined}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form
        className="pgs-admin__toolbar"
        onSubmit={(event) => {
          event.preventDefault();
          void reload();
        }}
      >
        <input
          className="pgs-admin-control"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search students"
          aria-label="Search students"
          style={{ maxWidth: 320 }}
        />
        <Link href="/ops" className="pgs-admin__portal-link">
          Back to Operations
        </Link>
      </form>

      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {loading ? <p style={{ color: "#6b6280" }}>Loading…</p> : null}

      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>PGS ID</th>
              <th>Pathway</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  No premium students found. Grant PurplePremium in Operations,
                  then refresh this list. A mentor assignment is not required for
                  admins.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.studentId}>
                  <td>{row.fullName}</td>
                  <td>{row.pgsCode}</td>
                  <td>{row.pathwayLabel || "—"}</td>
                  <td>
                    {row.published ? (
                      <span className="pgs-admin__badge pgs-admin__badge--live">
                        Live
                      </span>
                    ) : (
                      <span className="pgs-admin__badge">Unpublished</span>
                    )}
                    {row.hasDraft ? (
                      <span className="pgs-admin__badge"> Draft</span>
                    ) : null}
                  </td>
                  <td>
                    {row.updatedAt
                      ? new Date(row.updatedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <Link
                      href={`/dash/${row.studentId}`}
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                    >
                      Edit
                    </Link>
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
