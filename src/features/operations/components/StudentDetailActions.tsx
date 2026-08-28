"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignMentorAction,
  grantPremiumAction,
} from "@/features/operations/actions";

type Mentor = { user_id: string; display_name: string; role_key: string };

export function StudentDetailActions({
  studentId,
  studentName,
  mentors,
  isPremium,
  canOpenWorkspace,
}: {
  studentId: string;
  studentName: string;
  mentors: Mentor[];
  isPremium: boolean;
  canOpenWorkspace: boolean;
}) {
  const router = useRouter();
  const [mentorId, setMentorId] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="pgs-ops__detail-panel pgs-ops__aside-panel">
      <h2>Access controls</h2>
      <p className="pgs-ops__note">
        Premium and mentor assignment control whether this student can open the workspace
        dashboard.
      </p>

      <div className="pgs-ops__action-bar">
        {!isPremium ? (
          <button
            type="button"
            className="pgs-ops__btn"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  await grantPremiumAction(studentId);
                  setMessage("Premium granted.");
                  router.refresh();
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Failed");
                }
              });
            }}
          >
            Grant premium
          </button>
        ) : (
          <p className="pgs-ops__status">Premium is active.</p>
        )}

        <div className="pgs-ops__action-row">
          <label>
            <span>Assign mentor</span>
            <select
              disabled={!isPremium || pending}
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
            >
              <option value="">Select mentor</option>
              {mentors.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.display_name || m.user_id}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="pgs-ops__btn"
            disabled={!mentorId || pending || !isPremium}
            onClick={() => {
              startTransition(async () => {
                try {
                  await assignMentorAction(studentId, mentorId);
                  setMessage("Mentor assigned.");
                  router.refresh();
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Failed");
                }
              });
            }}
          >
            Assign mentor
          </button>
        </div>

        {canOpenWorkspace ? (
          <form action="/api/ops/preview" method="post">
            <input type="hidden" name="action" value="set" />
            <input type="hidden" name="mode" value="student" />
            <input type="hidden" name="targetId" value={studentId} />
            <input type="hidden" name="targetName" value={studentName} />
            <button type="submit" className="pgs-ops__btn pgs-ops__btn--ghost">
              View as student
            </button>
          </form>
        ) : null}
      </div>

      {message ? <p className="pgs-ops__status">{message}</p> : null}
    </section>
  );
}
