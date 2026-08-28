import type { StaffContext } from "@/lib/auth/actor-context";
import { staffHasPermission } from "@/lib/auth/actor-context";

export type OperationsScoreboardScope =
  | "organization"
  | "assigned_students"
  | "restricted";

export function canViewOperationsScoreboard(staff: StaffContext | null): boolean {
  return staffHasPermission(staff, "overview.read");
}

export function resolveOperationsScoreboardScope(
  staff: StaffContext | null,
): OperationsScoreboardScope {
  if (!staff) return "restricted";

  if (
    (staff.roleKey === "admin" || staff.roleKey === "super_admin") &&
    staffHasPermission(staff, "students.read") &&
    staffHasPermission(staff, "student_workspace.read_all")
  ) {
    return "organization";
  }

  if (
    staff.roleKey === "mentor" &&
    staffHasPermission(staff, "student_workspace.read")
  ) {
    return "assigned_students";
  }

  return "restricted";
}

export function canAccessOpsNav(
  staff: StaffContext | null,
  permission: string,
): boolean {
  return staffHasPermission(staff, permission);
}
