import type { StaffPermission, StaffRoleKey, ProductRoleKey } from "@/lib/auth/permissions";
import {
  isStaffAssignableRole,
  isStaffRoleKey,
  isProductRoleKey,
  normalizeRoleKey,
  STAFF_ASSIGNABLE_ROLES,
  STAFF_ROLE_KEYS,
} from "@/lib/auth/permissions";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/operations/role-matrix";

export { STAFF_ROLE_KEYS, STAFF_ASSIGNABLE_ROLES, isStaffRoleKey, isStaffAssignableRole, isProductRoleKey, normalizeRoleKey };
export type { StaffRoleKey, ProductRoleKey, StaffPermission };

export type StaffProfileStatus = "active" | "suspended" | "ended";

export type StaffInviteIdentity = {
  user_id: string;
  has_student_profile: boolean;
  has_staff_profile: boolean;
  staff_status: StaffProfileStatus | null;
  staff_role: StaffRoleKey | null;
  email_confirmed: boolean;
  has_signed_in: boolean;
  invite_pending: boolean;
};

export type StaffSurfaceAccess = {
  operations: "Allowed" | "Not granted";
  studentScope: string;
  cms: "Allowed" | "Not granted";
  audit: "Allowed" | "Not granted";
  staffManagement: "Allowed" | "Not granted";
  ai: "Allowed" | "Not granted";
};

export type StaffCapabilityRow = {
  label: string;
  value: string;
};

const OPS_PERMISSIONS: StaffPermission[] = [
  "overview.read",
  "students.read",
  "student_workspace.read",
  "student_workspace.read_all",
  "student_workspace.manage",
  "student_workspace.manage_all",
  "premium.manage",
  "mentor_assignments.manage",
  "staff.read",
  "roles.manage",
  "audit.read",
  "staff_targets.read",
  "staff_targets.manage",
  "staff_targets.manage_all",
];

const CMS_PERMISSIONS: StaffPermission[] = [
  "catalog.manage",
  "cms.publish",
  "content.manage",
  "leads.manage",
  "staff.manage",
];

export type StaffDirectoryRow = {
  user_id: string;
  display_name: string;
  status: StaffProfileStatus;
  role_key: StaffRoleKey;
  assigned_student_count: number;
  invite_pending: boolean;
  has_student_profile: boolean;
  created_at: string;
};

export type StaffAccessDetail = StaffDirectoryRow & {
  permission_keys: StaffPermission[];
};

export const STAFF_ROLE_PERMISSION_PREVIEW: Record<ProductRoleKey, StaffPermission[]> =
  DEFAULT_ROLE_PERMISSIONS;

export function roleLabel(role: string): string {
  switch (normalizeRoleKey(role)) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "mentor":
      return "Mentor";
    case "viewer":
      return "Viewer";
    case "guardian":
      return "Guardian";
    case "student":
      return "Student";
    default:
      return role;
  }
}

export function staffRoleLabel(role: string): string {
  return roleLabel(role);
}

export function staffStatusLabel(status: string, invitePending = false): string {
  if (invitePending) return "Invite pending";
  if (status === "active") return "Active";
  if (status === "suspended") return "Suspended";
  if (status === "ended") return "Access ended";
  return status;
}

export function staffStudentScopeLabel(role: string): string {
  const key = normalizeRoleKey(role);
  if (key === "mentor") return "Assigned students only";
  if (key === "viewer" || key === "guardian" || key === "student") {
    return "Own or linked student view";
  }
  return "Organization";
}

export const SUSPENDED_STAFF_ACCESS: StaffSurfaceAccess = {
  operations: "Not granted",
  studentScope: "None",
  cms: "Not granted",
  audit: "Not granted",
  staffManagement: "Not granted",
  ai: "Not granted",
};

export function staffSurfaceAccess(
  permissions: Iterable<string>,
  role: string,
): StaffSurfaceAccess {
  const set = permissions instanceof Set ? permissions : new Set(permissions);
  const operations = OPS_PERMISSIONS.some((key) => set.has(key));
  const cms = CMS_PERMISSIONS.some((key) => set.has(key));
  return {
    operations: operations ? "Allowed" : "Not granted",
    studentScope: staffStudentScopeLabel(role),
    cms: cms ? "Allowed" : "Not granted",
    audit: set.has("audit.read") ? "Allowed" : "Not granted",
    staffManagement: set.has("roles.manage") ? "Allowed" : "Not granted",
    ai: set.has("ai.analyze") ? "Allowed" : "Not granted",
  };
}

export function staffAccessPreview(role: ProductRoleKey): StaffSurfaceAccess {
  return staffSurfaceAccess(STAFF_ROLE_PERMISSION_PREVIEW[role], role);
}

export function staffCapabilityRows(
  permissions: Iterable<string>,
  role: string,
): StaffCapabilityRow[] {
  const set = permissions instanceof Set ? permissions : new Set(permissions);
  let workspace = "No";
  if (set.has("student_workspace.read_all") || set.has("student_workspace.manage_all")) {
    workspace = "All authorized students";
  } else if (set.has("student_workspace.read") || set.has("student_workspace.manage")) {
    workspace = "Assigned or linked students";
  }
  return [
    {
      label: "Student directory",
      value: set.has("students.read") ? "Authorized directory" : "Not granted",
    },
    { label: "Workspace", value: workspace },
    { label: "Premium management", value: set.has("premium.manage") ? "Yes" : "No" },
    { label: "Staff management", value: set.has("roles.manage") ? "Yes" : "No" },
    { label: "Audit", value: set.has("audit.read") ? "Yes" : "No" },
    { label: "AI analysis", value: set.has("ai.analyze") ? "Yes" : "No" },
    { label: "Student scope", value: staffStudentScopeLabel(role) },
  ];
}

export function assignmentLossWarning(count: number): string {
  const noun = count === 1 ? "active student assignment" : "active student assignments";
  return `${count} ${noun} will become Unassigned.`;
}

export function staffDirectoryActionLabel(canManage: boolean): string {
  return canManage ? "Manage" : "View profile";
}

export function existingStudentStaffGrantCopy(): string {
  return "This email already belongs to a student. Staff access will be granted on the same Auth identity. The PGS ID is not converted or replaced.";
}

export function isPrivilegeBroadening(fromRole: string, toRole: string): boolean {
  const rank: Record<string, number> = {
    student: 0,
    guardian: 0,
    viewer: 1,
    mentor: 2,
    admin: 3,
    super_admin: 4,
  };
  return (rank[normalizeRoleKey(toRole)] ?? 0) > (rank[normalizeRoleKey(fromRole)] ?? 0);
}

export function isValidStaffEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.length <= 160;
}

export function normalizeStaffEmail(value: string): string {
  return value.trim().toLowerCase();
}
