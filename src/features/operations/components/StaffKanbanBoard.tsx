"use client";

import { useState } from "react";
import type { BoardColumn, StudentTask } from "@/lib/premium-workspace";
import { canonicalBoardColumnOrder } from "@/lib/student-operations";
import { requestStaffWorkspace } from "@/features/operations/staff-workspace-request";

function lastChanged(task: StudentTask) {
  const value = task.updated_at || task.created_at;
  if (!value) return "Last changed time is not recorded.";
  return `Last changed ${new Date(value).toLocaleString("en-GB")}`;
}

export function StaffKanbanBoard({
  studentId,
  columns,
  tasks,
  canManage,
}: {
  studentId: string;
  columns: BoardColumn[];
  tasks: StudentTask[];
  canManage: boolean;
}) {
  const [message, setMessage] = useState("");
  const ordered = [...columns].sort(
    (left, right) =>
      canonicalBoardColumnOrder(left.key) - canonicalBoardColumnOrder(right.key) ||
      left.sort_order - right.sort_order,
  );

  async function save(
    method: "POST" | "PATCH" | "DELETE",
    values: Record<string, unknown>,
  ) {
    setMessage("Saving…");
    const error = await requestStaffWorkspace(studentId, "tasks", method, values);
    if (error) setMessage(error);
  }

  return (
    <section className="pgs-ops__workspace-panel" aria-label="Student loopboard">
      <h2>Progress / Loopboard</h2>
      {message ? (
        <p className="pgs-ops__status" role="status">
          {message}
        </p>
      ) : null}

      {canManage ? (
        <form
          className="pgs-ops__form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void save("POST", {
              title: data.get("title"),
              details: data.get("details"),
              column_id: data.get("column_id"),
              sort_order: Number(data.get("sort_order")),
            });
          }}
        >
          <label>
            <span>New card title</span>
            <input name="title" required maxLength={255} />
          </label>
          <label>
            <span>Details</span>
            <textarea name="details" maxLength={6000} rows={2} />
          </label>
          <label>
            <span>Stage</span>
            <select name="column_id" required>
              {ordered.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Order</span>
            <input name="sort_order" type="number" min="0" defaultValue="0" />
          </label>
          <button className="pgs-ops__btn" type="submit">
            Add card
          </button>
        </form>
      ) : (
        <p className="pgs-ops__note">Loopboard is read-only for your role.</p>
      )}

      <div className="pgs-ops__kanban">
        {ordered.map((column) => {
          const columnTasks = tasks.filter((task) => task.column_id === column.id);
          return (
            <div key={column.id} className="pgs-ops__kanban-column">
              <h3>{column.title}</h3>
              {columnTasks.map((task) => (
                <article key={task.id} className="pgs-ops__kanban-card">
                  <strong>{task.title}</strong>
                  {task.details ? <p>{task.details}</p> : null}
                  <p className="pgs-ops__note">{lastChanged(task)}</p>
                  {task.due_at ? (
                    <p className="pgs-ops__note">
                      Due {new Date(task.due_at).toLocaleDateString("en-GB")}
                    </p>
                  ) : null}
                  {canManage ? (
                    <form
                      className="pgs-ops__form-grid"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const data = new FormData(event.currentTarget);
                        void save("PATCH", {
                          id: task.id,
                          title: data.get("title"),
                          details: data.get("details"),
                          due_at: data.get("due_at"),
                          column_id: data.get("column_id"),
                          sort_order: Number(data.get("sort_order")),
                        });
                      }}
                    >
                      <label>
                        <span>Title</span>
                        <input
                          name="title"
                          required
                          maxLength={255}
                          defaultValue={task.title}
                        />
                      </label>
                      <label>
                        <span>Details</span>
                        <textarea
                          name="details"
                          maxLength={6000}
                          defaultValue={task.details}
                          rows={2}
                        />
                      </label>
                      <label>
                        <span>Due date</span>
                        <input
                          name="due_at"
                          type="date"
                          defaultValue={task.due_at?.slice(0, 10) ?? ""}
                        />
                      </label>
                      <label>
                        <span>Stage</span>
                        <select name="column_id" defaultValue={task.column_id}>
                          {ordered.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span>Order</span>
                        <input
                          name="sort_order"
                          type="number"
                          min="0"
                          defaultValue={task.sort_order}
                        />
                      </label>
                      <div className="pgs-ops__inline-actions">
                        <button className="pgs-ops__btn" type="submit">
                          Save task
                        </button>
                        <button
                          className="pgs-ops__btn pgs-ops__btn--danger"
                          onClick={() => void save("DELETE", { id: task.id })}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  ) : null}
                </article>
              ))}
              {!columnTasks.length ? (
                <p className="pgs-ops__note">No cards in this stage.</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
