"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignMentorAction,
  grantPremiumAction,
  revokePremiumAction,
} from "@/features/operations/actions";

type Mentor = { user_id: string; display_name: string; role_key: string };

export function AccessControlsPanel({
  students,
  mentors,
  plans,
}: {
  students: Array<{ id: string; label: string }>;
  mentors: Mentor[];
  plans: Array<{ code: string; label: string; durationMonths: number }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [mentorId, setMentorId] = useState(mentors[0]?.user_id ?? "");
  const [planCode, setPlanCode] = useState(plans[0]?.code ?? "purple_premium_12");

  return (
    <section className="pgs-ops__detail-panel">
      {message ? <p className="pgs-ops__status">{message}</p> : null}
      <div className="pgs-ops__form-grid">
        <label>
          Student
          <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Plan
          <select value={planCode} onChange={(event) => setPlanCode(event.target.value)}>
            {plans.length ? (
              plans.map((plan) => (
                <option key={plan.code} value={plan.code}>
                  {plan.label} ({plan.durationMonths} mo)
                </option>
              ))
            ) : (
              <option value="purple_premium_12">Purple Premium 12 months</option>
            )}
          </select>
        </label>
        <label>
          Mentor
          <select value={mentorId} onChange={(event) => setMentorId(event.target.value)}>
            {mentors.map((mentor) => (
              <option key={mentor.user_id} value={mentor.user_id}>
                {mentor.display_name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pgs-ops__inline-actions" style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className="pgs-ops__btn"
          disabled={pending || !studentId}
          onClick={() => {
            startTransition(async () => {
              try {
                await grantPremiumAction(studentId, planCode);
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
        <button
          type="button"
          className="pgs-ops__btn pgs-ops__btn--ghost"
          disabled={pending || !studentId}
          onClick={() => {
            startTransition(async () => {
              try {
                await revokePremiumAction(studentId);
                setMessage("Premium revoked.");
                router.refresh();
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Failed");
              }
            });
          }}
        >
          Revoke premium
        </button>
        <button
          type="button"
          className="pgs-ops__btn"
          disabled={pending || !studentId || !mentorId}
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
    </section>
  );
}
