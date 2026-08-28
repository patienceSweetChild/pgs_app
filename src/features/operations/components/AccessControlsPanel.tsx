"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignMentorAction,
  grantPremiumAction,
  revokePremiumAction,
} from "@/features/operations/actions";
import type { StudentRegistryRow } from "@/lib/operations/student-registry";

type Mentor = { user_id: string; display_name: string; role_key: string };

export function AccessControlsPanel({
  rows,
  mentors,
}: {
  rows: StudentRegistryRow[];
  mentors: Mentor[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      {message ? <p className="pgs-ops__status">{message}</p> : null}
      <div className="pgs-ops__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Plan</th>
              <th>Mentor</th>
              <th>Can open dashboard</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link href={`/ops/students/${row.id}`}>{row.full_name || "—"}</Link>
                </td>
                <td>{row.plan}</td>
                <td>{row.mentor_name}</td>
                <td>{row.can_open_workspace ? "Yes" : "No"}</td>
                <td>
                  {row.plan === "Standard" ? (
                    <button
                      type="button"
                      className="pgs-ops__btn"
                      disabled={pending}
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await grantPremiumAction(row.id);
                            setMessage("Premium granted.");
                            router.refresh();
                          } catch (err) {
                            setMessage(
                              err instanceof Error ? err.message : "Failed",
                            );
                          }
                        });
                      }}
                    >
                      Grant premium
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="pgs-ops__btn pgs-ops__btn--ghost"
                      disabled={pending}
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await revokePremiumAction(row.id);
                            setMessage("Premium revoked.");
                            router.refresh();
                          } catch (err) {
                            setMessage(
                              err instanceof Error ? err.message : "Failed",
                            );
                          }
                        });
                      }}
                    >
                      Revoke
                    </button>
                  )}
                  {" "}
                  <select
                    defaultValue={row.mentor_id ?? ""}
                    disabled={pending || row.plan !== "Premium"}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
