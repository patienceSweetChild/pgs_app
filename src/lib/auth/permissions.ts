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
  "ai.analyze",
] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export type ProductRoleKey =
  | "super_admin"
  | "admin"
  | "mentor"
  | "viewer"
  | "guardian"
  | "student";

export type StaffRoleKey = Exclude<ProductRoleKey, "guardian" | "student">;

export const PRODUCT_ROLE_KEYS: ProductRoleKey[] = [
  "super_admin",
  "admin",
  "mentor",
  "viewer",
  "guardian",
  "student",
];

export const STAFF_ROLE_KEYS: StaffRoleKey[] = [
  "viewer",
  "mentor",
  "admin",
  "super_admin",
];

export const STAFF_ASSIGNABLE_ROLES: StaffRoleKey[] = [
  "admin",
  "mentor",
  "viewer",
];

export function normalizeRoleKey(value: string | null | undefined): string {
  if (value === "read_only_staff" || value === "viewer") return "viewer";
  return value ?? "";
}

export function isProductRoleKey(value: string): value is ProductRoleKey {
  return (PRODUCT_ROLE_KEYS as readonly string[]).includes(normalizeRoleKey(value));
}

export function isStaffRoleKey(value: string): value is StaffRoleKey {
  return (STAFF_ROLE_KEYS as readonly string[]).includes(normalizeRoleKey(value));
}

export function isStaffAssignableRole(value: string): value is StaffRoleKey {
  return (STAFF_ASSIGNABLE_ROLES as readonly string[]).includes(normalizeRoleKey(value));
}
