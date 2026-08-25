"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { replyEnquiry } from "./crm-actions";

type Row = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  message: string;
  reply: boolean;
  reply_message: string;
  created_at: string;
};

export function EnquiriesClient({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function sendReply(id: number) {
    const message = (drafts[id] || "").trim();
    if (!message) return;
    setPendingId(id);
    try {
      await replyEnquiry(id, message);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Enquiries</h1>
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4}>No enquiries yet.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                    <div>{row.email}</div>
                    <div>{row.mobile}</div>
                  </td>
                  <td>{row.message}</td>
                  <td>
                    <span
                      className={`pgs-admin__badge pgs-admin__badge--${row.reply ? "approved" : "pending"}`}
                    >
                      {row.reply ? "Replied" : "Open"}
                    </span>
                  </td>
                  <td>
                    {row.reply ? (
                      row.reply_message
                    ) : (
                      <div style={{ display: "grid", gap: "0.35rem" }}>
                        <textarea
                          rows={2}
                          value={drafts[row.id] ?? ""}
                          onChange={(e) =>
                            setDrafts({ ...drafts, [row.id]: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          className="pgs-admin__btn"
                          disabled={
                            pendingId === row.id || !(drafts[row.id] || "").trim()
                          }
                          onClick={() => void sendReply(row.id)}
                        >
                          Send reply
                        </button>
                      </div>
                    )}
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
