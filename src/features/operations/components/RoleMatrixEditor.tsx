"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ROLE_MATRIX_MODULES,
  matrixCellChecked,
  toggleMatrixPermission,
  type RoleMatrixModule,
} from "@/lib/operations/role-matrix";
import type { RoleMatrixRow } from "@/lib/operations/role-matrix";
import type { MatrixAction } from "@/lib/operations/role-matrix";
import { roleKind } from "@/lib/operations/role-matrix";
import type { StaffPermission } from "@/lib/auth/permissions";

const ACTIONS: MatrixAction[] = ["view", "create", "edit", "delete"];

export function RoleMatrixEditor({ initialRoles }: { initialRoles: RoleMatrixRow[] }) {
  const router = useRouter();
  const [roles, setRoles] = useState(initialRoles);
  const [active, setActive] = useState(initialRoles[0]?.key ?? "admin");
  const [message, setMessage] = useState("");
  const current = roles.find((role) => role.key === active) ?? roles[0];

  async function save(nextPermissions: StaffPermission[]) {
    setMessage("Saving…");
    const response = await fetch("/api/ops/roles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: current.key, permissions: nextPermissions }),
    });
    const payload = (await response.json()) as { roles?: RoleMatrixRow[]; message?: string };
    if (!response.ok) {
      setMessage(payload.message ?? "Unable to save.");
      return;
    }
    if (payload.roles) setRoles(payload.roles);
    setMessage("Saved.");
    router.refresh();
  }

  function toggle(module: RoleMatrixModule, action: MatrixAction) {
    if (current.key === "super_admin" || !module.actions[action]) return;
    const enabled = !matrixCellChecked(current.permissions, module, action);
    const next = toggleMatrixPermission(current.permissions, module, action, enabled);
    setRoles((list) =>
      list.map((role) => (role.key === current.key ? { ...role, permissions: next } : role)),
    );
    void save(next);
  }

  return (
    <div className="pgs-ops__matrix-layout">
      <section className="pgs-ops__detail-panel">
        <h2>Roles</h2>
        <ul className="pgs-ops__matrix-roles">
          {roles.map((role) => (
            <li key={role.key}>
              <button
                type="button"
                className={
                  role.key === current.key ? "pgs-ops__matrix-role is-active" : "pgs-ops__matrix-role"
                }
                aria-pressed={role.key === current.key}
                onClick={() => setActive(role.key)}
              >
                <span>{role.label}</span>
                <span className="pgs-ops__badge">{roleKind(role.key)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="pgs-ops__detail-panel">
        <h2>{current.label}</h2>
        <p className="pgs-ops__note">
          {current.key === "super_admin"
            ? "Super Admin is locked and always has full access."
            : "Changes apply immediately to everyone on this role."}
        </p>
        {message ? <p className="pgs-ops__status">{message}</p> : null}
        <div className="pgs-ops__table-wrap pgs-ops__matrix">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                {ACTIONS.map((action) => (
                  <th key={action}>{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLE_MATRIX_MODULES.map((module) => (
                <tr key={module.id}>
                  <td>
                    <div className="pgs-ops__matrix-module">{module.label}</div>
                    {module.hint ? <div className="pgs-ops__note">{module.hint}</div> : null}
                  </td>
                  {ACTIONS.map((action) => (
                    <td key={action}>
                      {module.actions[action] ? (
                        <label className="pgs-ops__matrix-check">
                          <input
                            type="checkbox"
                            aria-label={`${action} ${module.label}`}
                            checked={matrixCellChecked(current.permissions, module, action)}
                            disabled={current.key === "super_admin"}
                            onChange={() => toggle(module, action)}
                          />
                        </label>
                      ) : (
                        <span className="pgs-ops__matrix-na">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
