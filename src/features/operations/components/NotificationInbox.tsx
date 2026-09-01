"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OperationsNotification } from "@/lib/operations/notifications";

export function NotificationInbox({
  initialItems,
}: {
  initialItems: OperationsNotification[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  async function update(id: string, action: "read" | "archive") {
    await fetch(`/api/staff/notifications/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setItems((list) =>
      action === "archive"
        ? list.filter((item) => item.id !== id)
        : list.map((item) =>
            item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
          ),
    );
    router.refresh();
  }

  if (!items.length) {
    return (
      <section className="pgs-ops__detail-panel">
        <p>No notifications in this view.</p>
      </section>
    );
  }

  return (
    <div className="pgs-ops__table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>When</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.title}</strong>
                <div className="pgs-ops__note">{item.body}</div>
                {item.destinationPath ? (
                  <a href={item.destinationPath}>{item.destinationPath}</a>
                ) : null}
              </td>
              <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("en-GB") : "—"}</td>
              <td>
                <div className="pgs-ops__inline-actions">
                  {!item.readAt ? (
                    <button
                      type="button"
                      className="pgs-ops__btn pgs-ops__btn--ghost"
                      onClick={() => void update(item.id, "read")}
                    >
                      Mark read
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="pgs-ops__btn pgs-ops__btn--ghost"
                    onClick={() => void update(item.id, "archive")}
                  >
                    Archive
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
