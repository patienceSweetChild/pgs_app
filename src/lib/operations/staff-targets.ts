export const STAFF_TARGET_STATUSES = ["pending", "in_progress", "completed", "cancelled"] as const;
export const STAFF_TARGET_FILTERS = [
  "open",
  "due_soon",
  "overdue",
  ...STAFF_TARGET_STATUSES,
] as const;
export const STAFF_TARGET_TIME_ZONE = "Asia/Kolkata";

export type StaffTargetStatus = (typeof STAFF_TARGET_STATUSES)[number];
export type StaffTargetFilter = (typeof STAFF_TARGET_FILTERS)[number];
export type StaffTargetsScope = "organization" | "my_work" | "restricted";

export type StaffTarget = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority?: string;
  assignedStaffId: string;
  assigneeName?: string;
  studentId?: string | null;
  studentName?: string | null;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StaffTargetSummary = {
  assignedStudents: number;
  openTargets: number;
  pendingTargets: number;
  inProgressTargets: number;
  dueSoon: number;
  overdue: number;
  completedRecently: number;
};

export function normalizeStaffTargetFilter(value: unknown): StaffTargetFilter | null {
  return typeof value === "string" && (STAFF_TARGET_FILTERS as readonly string[]).includes(value)
    ? (value as StaffTargetFilter)
    : null;
}

export function resolveStaffTargetsScope(staff: {
  roleKey: string;
  permissions: string[];
}): StaffTargetsScope {
  const perms = new Set(staff.permissions);
  if (
    perms.has("staff_targets.manage_all") &&
    (staff.roleKey === "admin" || staff.roleKey === "super_admin")
  ) {
    return "organization";
  }
  if (perms.has("staff_targets.read") && staff.roleKey === "mentor") return "my_work";
  if (perms.has("staff_targets.read")) return "my_work";
  return "restricted";
}

export function dueAtFromKolkataDate(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return `${value}T18:29:59.000Z`;
}
