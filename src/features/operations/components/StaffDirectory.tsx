"use client";

import Link from "next/link";
import { opsHref } from "@pgs/shared";
import type { StaffDirectoryRow } from "@/lib/operations/staff-access";
import { roleLabel, staffDirectoryActionLabel } from "@/lib/operations/staff-access";

export function StaffDirectory({
  rows,
  canManage = false,
}: {
  rows: StaffDirectoryRow[];
  canManage?: boolean;
}) {
  return (
    <div className="pgs-ops__table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Students</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.user_id}>
              <td>
                <Link href={opsHref(`/ops/team/${row.user_id}`)}>
                  {row.display_name || "—"}
                </Link>
              </td>
              <td>{roleLabel(row.role_key)}</td>
              <td>{row.status}</td>
              <td>{row.assigned_student_count}</td>
              <td>
                <Link href={opsHref(`/ops/team/${row.user_id}`)}>
                  {staffDirectoryActionLabel(canManage)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
