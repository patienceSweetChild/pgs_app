"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { opsPortalLink } from "@pgs/shared";
import { assignMentor, inviteGuardian } from "./crm-actions";

type Mentor = { user_id: string; display_name: string; role_key: string };
type Guardian = {
  id: string;
  guardian_email: string;
  relationship_label: string;
  status: string;
};

export function UserDetailClient({
  user,
  mentors,
  guardians,
  isPremium,
}: {
  user: Record<string, unknown>;
  mentors: Mentor[];
  guardians: Guardian[];
  isPremium: boolean;
}) {
  const router = useRouter();
  const [mentorId, setMentorId] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>{String(user.full_name || "Student")}</h1>
        <a href={opsPortalLink(`/ops/students/${String(user.id)}`)}>Open in Operations</a>
      </div>
      <div className="pgs-admin__grid">
        <div className="pgs-admin__card">
          <p>Stage</p>
          <h3 style={{ fontSize: "1rem" }}>{String(user.crm_stage)}</h3>
        </div>
        <div className="pgs-admin__card">
          <p>Premium</p>
          <h3 style={{ fontSize: "1rem" }}>{isPremium ? "Active" : "No"}</h3>
        </div>
        <div className="pgs-admin__card">
          <p>Study country</p>
          <h3 style={{ fontSize: "1rem" }}>
            {String(user.preferred_study_country || "—")}
          </h3>
        </div>
      </div>

      <div className="pgs-admin__card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Assign mentor</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <select
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
          <button
            type="button"
            className="pgs-admin__btn"
            disabled={!mentorId || pending}
            onClick={() => {
              void (async () => {
                setPending(true);
                try {
                  await assignMentor(String(user.id), mentorId);
                  setMessage("Mentor assigned.");
                  router.refresh();
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Failed");
                } finally {
                  setPending(false);
                }
              })();
            }}
          >
            Assign
          </button>
        </div>
      </div>

      <div className="pgs-admin__card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.05rem" }}>Guardians</h2>
        <ul>
          {guardians.map((g) => (
            <li key={g.id}>
              {g.guardian_email} — {g.relationship_label} ({g.status})
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            placeholder="guardian@email.com"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
          />
          <button
            type="button"
            className="pgs-admin__btn"
            disabled={!guardianEmail || pending}
            onClick={() => {
              void (async () => {
                setPending(true);
                try {
                  await inviteGuardian(String(user.id), guardianEmail);
                  setGuardianEmail("");
                  setMessage("Guardian invited.");
                  router.refresh();
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Failed");
                } finally {
                  setPending(false);
                }
              })();
            }}
          >
            Invite guardian
          </button>
        </div>
      </div>

      {message ? <p>{message}</p> : null}
    </div>
  );
}
