"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { reviewPremiumApplication } from "./crm-actions";

type Row = {
  id: string;
  status: string;
  plan_code: string;
  created_at: string;
  student_id: string;
  full_name: string;
};

export function PremiumAppsClient({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function review(id: string, decision: "approved" | "rejected") {
    setPendingId(id);
    try {
      await reviewPremiumApplication(id, decision);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Premium Applications</h1>
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.full_name}</td>
                <td>{row.plan_code}</td>
                <td>
                  <span
                    className={`pgs-admin__badge pgs-admin__badge--${row.status}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td>
                  {row.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        className="pgs-admin__btn"
                        disabled={pendingId === row.id}
                        onClick={() => void review(row.id, "approved")}
                      >
                        Approve
                      </button>{" "}
                      <button
                        type="button"
                        className="pgs-admin__btn pgs-admin__btn--ghost"
                        disabled={pendingId === row.id}
                        onClick={() => void review(row.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
