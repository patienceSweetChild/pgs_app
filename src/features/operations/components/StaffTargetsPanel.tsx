"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createStaffTargetAction,
  updateStaffTargetStatusAction,
} from "@/features/operations/actions";
import type { StaffTarget } from "@/lib/operations/staff-targets";

export function StaffTargetsPanel({
  targets,
  canCreate = true,
  assignees = [],
  students = [],
}: {
  targets: StaffTarget[];
  canCreate?: boolean;
  assignees?: Array<{ id: string; name: string }>;
  students?: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      {canCreate ? (
        <form
          className="pgs-ops__filters"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            const fd = new FormData(event.currentTarget);
            startTransition(async () => {
              await createStaffTargetAction({
                title: title.trim(),
                dueAt: String(fd.get("dueAt") || "") || null,
                staffUserId: String(fd.get("staffUserId") || "") || undefined,
                studentId: String(fd.get("studentId") || "") || null,
              });
              setTitle("");
              router.refresh();
            });
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="New target title"
          />
          <input type="date" name="dueAt" />
          {assignees.length ? (
            <select name="staffUserId">
              <option value="">Assign to me / default</option>
              {assignees.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          ) : null}
          {students.length ? (
            <select name="studentId">
              <option value="">No student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          ) : null}
          <button type="submit" className="pgs-ops__btn" disabled={pending}>
            Add target
          </button>
        </form>
      ) : null}

      <div className="pgs-ops__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Student</th>
              <th>Due</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {targets.length === 0 ? (
              <tr>
                <td colSpan={5}>No targets yet.</td>
              </tr>
            ) : (
              targets.map((target) => (
                <tr key={target.id}>
                  <td>{target.title}</td>
                  <td>{target.status}</td>
                  <td>{target.studentName || "—"}</td>
                  <td>{target.dueAt ? new Date(target.dueAt).toLocaleDateString() : "—"}</td>
                  <td>
                    {!["completed", "cancelled", "done"].includes(target.status) ? (
                      <button
                        type="button"
                        className="pgs-ops__btn pgs-ops__btn--ghost"
                        disabled={pending}
                        onClick={() => {
                          startTransition(async () => {
                            await updateStaffTargetStatusAction(target.id, "completed");
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
