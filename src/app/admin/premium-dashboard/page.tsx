"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsStudentHref, opsPortalLink } from "@pgs/shared";
import { listPremiumWorkspaces } from "@/features/admin/content-actions";

export default function PremiumDashboardListPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setRows((await listPremiumWorkspaces()) as Record<string, unknown>[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Premium Dashboard</h1>
      <p style={{ color: "#6b6280" }}>
        Students with premium workspace profiles.{" "}
        <Link href={`${opsPortalLink("/ops/students")}?plan=premium`}>Manage in Operations</Link>
      </p>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Pathway</th>
              <th>Applied</th>
              <th>Offers</th>
              <th>Onboarding</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>No premium workspaces yet.</td>
              </tr>
            ) : (
              rows.map((row) => {
                const profile = row.profiles as
                  | { full_name?: string }
                  | { full_name?: string }[]
                  | null;
                const name = Array.isArray(profile)
                  ? profile[0]?.full_name
                  : profile?.full_name;
                return (
                  <tr key={String(row.student_id)}>
                    <td>{name || "—"}</td>
                    <td>{String(row.pathway_label ?? "")}</td>
                    <td>{String(row.universities_applied ?? 0)}</td>
                    <td>{String(row.offers_received ?? 0)}</td>
                    <td>{String(row.onboarding_percentage ?? "—")}%</td>
                    <td>
                      {row.updated_at
                        ? new Date(String(row.updated_at)).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <Link href={cmsStudentHref(String(row.student_id))}>Edit dashboard</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
