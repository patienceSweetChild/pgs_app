export const STAFF_PERMISSIONS = [
  "overview.read",
  "catalog.manage",
  "cms.publish",
  "students.read",
  "students.manage",
  "students.manage_assigned",
  "premium.manage",
  "leads.manage",
  "staff.manage",
  "audit.read",
  "guardians.manage",
  "documents.manage",
  "workspace.manage",
  "notifications.manage",
  "content.manage",
  "student_workspace.read_all",
  "student_workspace.manage_all",
  "student_workspace.read",
  "student_workspace.manage",
  "mentor_assignments.manage",
  "roles.manage",
  "staff.read",
  "staff_targets.read",
  "staff_targets.manage",
  "staff_targets.manage_all",
] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export type StaffRoleKey =
  | "super_admin"
  | "admin"
  | "mentor"
  | "read_only_staff";

export const STAFF_ROLE_KEYS: StaffRoleKey[] = [
  "read_only_staff",
  "mentor",
  "admin",
  "super_admin",
];
