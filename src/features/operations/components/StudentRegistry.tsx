"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { assignMentorAction } from "@/features/operations/actions";
import type { StudentRegistryRow } from "@/lib/operations/student-registry";
import { registryHref } from "@/lib/operations/student-registry";

type Mentor = { user_id: string; display_name: string; role_key: string };

export function StudentRegistry({
  rows,
  mentors,
  filters,
}: {
  rows: StudentRegistryRow[];
  mentors: Mentor[];
  filters: {
    q: string;
    plan: string;
    mentor: string;
    stage: string;
    page: number;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const total = rows[0]?.total_count ?? rows.length;

  return (
    <div>
      <div className="pgs-ops__page-header">
        <div>
          <h1>Students</h1>
          <p className="pgs-ops__page-meta">Manage caseload, mentors, and workspace access.</p>
        </div>
        <span className="pgs-ops__page-meta">{total} total</span>
      </div>

      <form
        className="pgs-ops__filters"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          router.push(
            registryHref({
              search: String(fd.get("q") ?? ""),
              plan: String(fd.get("plan") ?? "all"),
              mentor: String(fd.get("mentor") ?? "all"),
              crmStage: String(fd.get("stage") ?? "all"),
            }),
          );
        }}
      >
        <input name="q" defaultValue={filters.q} placeholder="Search name or country" />
        <select name="plan" defaultValue={filters.plan}>
          <option value="all">All plans</option>
          <option value="premium">Premium</option>
          <option value="standard">Standard</option>
        </select>
        <select name="mentor" defaultValue={filters.mentor}>
          <option value="all">All mentors</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
          {mentors.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.display_name || m.user_id}
            </option>
          ))}
        </select>
        <select name="stage" defaultValue={filters.stage}>
          <option value="all">All stages</option>
          <option value="new">New</option>
          <option value="active">Active</option>
          <option value="on_hold">On hold</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" className="pgs-ops__btn">
          Filter
        </button>
      </form>

      {message ? <p>{message}</p> : null}

      <div className="pgs-ops__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stage</th>
              <th>Plan</th>
              <th>Mentor</th>
              <th>Workspace</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>No students found.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link href={`/ops/students/${row.id}`}>
                      {row.full_name || "—"}
                    </Link>
                  </td>
                  <td>{row.crm_stage}</td>
                  <td>{row.plan}</td>
                  <td>{row.mentor_name}</td>
                  <td>{row.can_open_workspace ? "Yes" : "No"}</td>
                  <td>
                    <div className="pgs-ops__inline-actions">
                      <Link href={`/ops/students/${row.id}`}>Open</Link>
                      {mentors.length > 0 ? (
                        <select
                          defaultValue={row.mentor_id ?? ""}
                          disabled={pending}
                          onChange={(e) => {
                            const mentorId = e.target.value;
                            if (!mentorId) return;
                            startTransition(async () => {
                              try {
                                await assignMentorAction(row.id, mentorId);
                                setMessage("Mentor assigned.");
                                router.refresh();
                              } catch (err) {
                                setMessage(
                                  err instanceof Error ? err.message : "Failed",
                                );
                              }
                            });
                          }}
                        >
                          <option value="">Assign mentor</option>
                          {mentors.map((m) => (
                            <option key={m.user_id} value={m.user_id}>
                              {m.display_name}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      {row.can_open_workspace ? (
                        <form action="/api/ops/preview" method="post">
                          <input type="hidden" name="action" value="set" />
                          <input type="hidden" name="mode" value="student" />
                          <input type="hidden" name="targetId" value={row.id} />
                          <input
                            type="hidden"
                            name="targetName"
                            value={row.full_name || "Student"}
                          />
                          <button type="submit" className="pgs-ops__btn pgs-ops__btn--ghost">
                            View as
                          </button>
                        </form>
                      ) : null}
                    </div>
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
