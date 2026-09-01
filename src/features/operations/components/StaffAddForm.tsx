"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  STAFF_ASSIGNABLE_ROLES,
  existingStudentStaffGrantCopy,
  isValidStaffEmail,
  normalizeStaffEmail,
  staffAccessPreview,
  staffRoleLabel,
  type StaffInviteIdentity,
} from "@/lib/operations/staff-access";
import { staffCapabilityRows } from "@/lib/operations/staff-access";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/operations/role-matrix";
import type { StaffRoleKey } from "@/lib/auth/permissions";

export function StaffAddForm() {
  const router = useRouter();
  const [tab, setTab] = useState<"invite" | "create">("invite");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<StaffRoleKey>("mentor");
  const [identity, setIdentity] = useState<StaffInviteIdentity | null | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const preview = staffAccessPreview(role);
  const capabilities = staffCapabilityRows(DEFAULT_ROLE_PERMISSIONS[role], role);

  async function submit(action: "invite" | "create") {
    setPending(true);
    setMessage("Saving…");
    if (!isValidStaffEmail(email) || !displayName.trim()) {
      setPending(false);
      setMessage("Name and a valid email are required.");
      return;
    }
    const response = await fetch("/api/ops/staff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action,
        email: normalizeStaffEmail(email),
        display_name: displayName,
        role,
      }),
    });
    const result = (await response.json()) as {
      ok?: boolean;
      user_id?: string;
      message?: string;
      setup_link?: string | null;
    };
    setPending(false);
    if (response.status === 409 && result.user_id) {
      setMessage("This person already has staff access.");
      router.push(`/ops/team/${result.user_id}`);
      return;
    }
    if (!response.ok) {
      setMessage(result.message ?? "Unable to continue.");
      return;
    }
    if (result.setup_link) {
      setMessage(`Staff created. Setup link: ${result.setup_link}`);
    }
    if (result.user_id) router.push(`/ops/team/${result.user_id}`);
  }

  async function resolve() {
    setMessage("");
    const response = await fetch("/api/ops/staff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "resolve", email: normalizeStaffEmail(email) }),
    });
    const result = (await response.json()) as { identity?: StaffInviteIdentity | null; message?: string };
    if (!response.ok) {
      setMessage(result.message ?? "Unable to check this email.");
      return;
    }
    setIdentity(result.identity ?? null);
  }

  return (
    <section className="pgs-ops__detail-panel">
      <div className="pgs-ops__chip-row">
        <button
          type="button"
          className={tab === "invite" ? "pgs-ops__chip is-active" : "pgs-ops__chip"}
          onClick={() => setTab("invite")}
        >
          Invite
        </button>
        <button
          type="button"
          className={tab === "create" ? "pgs-ops__chip is-active" : "pgs-ops__chip"}
          onClick={() => setTab("create")}
        >
          Add new staff
        </button>
      </div>

      <div className="pgs-ops__form-grid" style={{ marginTop: "1rem" }}>
        <label>
          Display name
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => {
              if (isValidStaffEmail(email)) void resolve();
            }}
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as StaffRoleKey)}>
            {STAFF_ASSIGNABLE_ROLES.map((item) => (
              <option key={item} value={item}>
                {staffRoleLabel(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {identity?.has_student_profile && !identity.has_staff_profile ? (
        <p className="pgs-ops__note">{existingStudentStaffGrantCopy()}</p>
      ) : null}

      <dl className="pgs-ops__facts" style={{ marginTop: "1rem" }}>
        <div>
          <dt>Operations</dt>
          <dd>{preview.operations}</dd>
        </div>
        <div>
          <dt>Student scope</dt>
          <dd>{preview.studentScope}</dd>
        </div>
        <div>
          <dt>CMS</dt>
          <dd>{preview.cms}</dd>
        </div>
        <div>
          <dt>AI</dt>
          <dd>{preview.ai}</dd>
        </div>
      </dl>
      <ul className="pgs-ops__list">
        {capabilities.map((row) => (
          <li key={row.label} className="pgs-ops__list-row">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pgs-ops__btn"
        disabled={pending}
        onClick={() => void submit(tab === "invite" ? "invite" : "create")}
      >
        {tab === "invite" ? "Send invite" : "Create staff now"}
      </button>
      {message ? <p className="pgs-ops__status">{message}</p> : null}
    </section>
  );
}
