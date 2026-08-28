"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createStaffTargetAction,
  updateStaffTargetStatusAction,
} from "@/features/operations/actions";
import type { StaffTarget } from "@/lib/operations/staff-targets-server";

export function StaffTargetsPanel({ targets }: { targets: StaffTarget[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form
        className="pgs-ops__filters"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          startTransition(async () => {
            await createStaffTargetAction({ title: title.trim() });
            setTitle("");
            router.refresh();
          });
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New target title"
        />
        <button type="submit" className="pgs-ops__btn" disabled={pending}>
          Add target
        </button>
      </form>

      <div className="pgs-ops__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {targets.length === 0 ? (
              <tr>
                <td colSpan={4}>No targets yet.</td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id}>
                  <td>{target.title}</td>
                  <td>{target.status}</td>
                  <td>
                    {target.due_at
                      ? new Date(target.due_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {target.status !== "done" ? (
                      <button
                        type="button"
                        className="pgs-ops__btn pgs-ops__btn--ghost"
                        disabled={pending}
                        onClick={() => {
                          startTransition(async () => {
                            await updateStaffTargetStatusAction(target.id, "done");
                            router.refresh();
                          });
                        }}
                      >
                        Mark done
                      </button>
                    ) : null}
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
