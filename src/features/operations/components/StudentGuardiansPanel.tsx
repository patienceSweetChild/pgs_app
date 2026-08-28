"use client";

import { useState, useTransition } from "react";
import {
  GUARDIAN_RELATIONSHIP_LABELS,
  type GuardianRelationshipLabel,
  type GuardianRelationshipRow,
} from "@/lib/guardian-portal";
import {
  inviteGuardianAction,
  revokeGuardianAction,
} from "@/features/operations/actions";

type Props = {
  studentId: string;
  initialGuardians: GuardianRelationshipRow[];
  canManage: boolean;
};

function statusLabel(status: string): string {
  if (status === "invited") return "Invited — awaiting acceptance";
  if (status === "active") return "Active";
  if (status === "revoked") return "Revoked";
  return status;
}

export function StudentGuardiansPanel({
  studentId,
  initialGuardians,
  canManage,
}: Props) {
  const [guardians, setGuardians] =
    useState<GuardianRelationshipRow[]>(initialGuardians);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLabel, setInviteLabel] = useState<GuardianRelationshipLabel>("Guardian");

  async function handleInvite(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await inviteGuardianAction(studentId, inviteEmail, inviteLabel);
        setInviteEmail("");
        const res = await fetch(`/api/staff/students/${studentId}/guardians`);
        if (res.ok) {
          const data = (await res.json()) as { guardians: GuardianRelationshipRow[] };
          setGuardians(data.guardians ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send invitation.");
      }
    });
  }

  async function handleRevoke(relationshipId: string, guardianEmail: string) {
    setError("");
    if (
      !confirm(`Revoke guardian access for ${guardianEmail}? This takes effect immediately.`)
    ) {
      return;
    }
    startTransition(async () => {
      try {
        await revokeGuardianAction(relationshipId, studentId);
        setGuardians((rows) =>
          rows.map((row) =>
            row.id === relationshipId ? { ...row, status: "revoked" } : row,
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to revoke guardian.");
      }
    });
  }

  const active = guardians.filter((g) => g.status !== "revoked");
  const revoked = guardians.filter((g) => g.status === "revoked");

  return (
    <section className="pgs-ops__detail-panel" aria-labelledby="guardians-panel-heading">
      <h2 id="guardians-panel-heading">Guardians / Parents</h2>
      <p className="pgs-ops__note">
        Explicit guardian relationships for this student. Each guardian authenticates with
        their own identity.
      </p>

      {error ? (
        <p className="pgs-ops__alert" role="alert">
          {error}
        </p>
      ) : null}

      {active.length === 0 ? (
        <p className="pgs-ops__note">No active or pending guardians.</p>
      ) : (
        <ul className="pgs-ops__list">
          {active.map((g) => (
            <li key={g.id} className="pgs-ops__list-row">
              <div>
                <strong>{g.guardian_email}</strong>
                <span className="pgs-ops__note">
                  {" "}
                  · {g.relationship_label} · {statusLabel(g.status)}
                </span>
              </div>
              {canManage && g.status !== "revoked" ? (
                <button
                  className="pgs-ops__btn pgs-ops__btn--ghost"
                  disabled={pending}
                  onClick={() => void handleRevoke(g.id, g.guardian_email)}
                  type="button"
                >
                  Revoke
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {revoked.length ? (
        <details className="pgs-ops__detail-subsection">
          <summary>Revoked ({revoked.length})</summary>
          <ul className="pgs-ops__list">
            {revoked.map((g) => (
              <li key={g.id}>
                {g.guardian_email} — {g.relationship_label}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {canManage ? (
        <div className="pgs-ops__edit-block">
          <h3>Invite guardian</h3>
          <form className="pgs-ops__form-toolbar" onSubmit={handleInvite}>
            <label>
              <span>Email</span>
              <input
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="guardian@email.com"
                required
                type="email"
                value={inviteEmail}
              />
            </label>
            <label>
              <span>Relationship</span>
              <select
                onChange={(e) => setInviteLabel(e.target.value as GuardianRelationshipLabel)}
                value={inviteLabel}
              >
                {GUARDIAN_RELATIONSHIP_LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button className="pgs-ops__btn" disabled={pending} type="submit">
              {pending ? "Sending…" : "Send invite"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
