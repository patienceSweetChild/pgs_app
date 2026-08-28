import type { StaffPermission, StaffRoleKey } from "@/lib/auth/permissions";

export const STAFF_ROLE_KEYS = [
  "read_only_staff",
  "mentor",
  "admin",
  "super_admin",
] as const;

export type StaffProfileStatus = "active" | "suspended" | "ended";

export type StaffSurfaceAccess = {
  operations: "Allowed" | "Not granted";
  studentScope: string;
  cms: "Allowed" | "Not granted";
  audit: "Allowed" | "Not granted";
  staffManagement: "Allowed" | "Not granted";
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

export const STAFF_ROLE_PERMISSION_PREVIEW: Record<
  StaffRoleKey,
  StaffPermission[]
> = {
  read_only_staff: ["overview.read", "students.read"],
  mentor: [
    "overview.read",
    "student_workspace.read",
    "student_workspace.manage",
    "staff_targets.read",
    "staff_targets.manage",
    "audit.read",
    "documents.manage",
    "workspace.manage",
  ],
  admin: [
    "overview.read",
    "students.read",
    "students.manage",
    "student_workspace.read_all",
    "student_workspace.manage_all",
    "premium.manage",
    "mentor_assignments.manage",
    "staff.read",
    "staff_targets.read",
    "staff_targets.manage",
    "staff_targets.manage_all",
    "audit.read",
    "guardians.manage",
    "catalog.manage",
    "cms.publish",
    "content.manage",
  ],
  super_admin: [
    "overview.read",
    "students.read",
    "students.manage",
    "student_workspace.read_all",
    "student_workspace.manage_all",
    "premium.manage",
    "mentor_assignments.manage",
    "roles.manage",
    "staff.read",
    "staff_targets.read",
    "staff_targets.manage",
    "staff_targets.manage_all",
    "audit.read",
    "guardians.manage",
    "catalog.manage",
    "cms.publish",
    "content.manage",
    "staff.manage",
    "leads.manage",
  ],
};

export function isStaffRoleKey(value: string): value is StaffRoleKey {
  return (STAFF_ROLE_KEYS as readonly string[]).includes(value);
}

export function roleLabel(role: StaffRoleKey): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "mentor":
      return "Mentor";
    case "read_only_staff":
      return "Read Only";
    default:
      return role;
  }
}

export function staffRoleLabel(role: string): string {
  return isStaffRoleKey(role) ? roleLabel(role) : role;
}

export function staffStatusLabel(status: string, invitePending = false): string {
  if (invitePending) return "Invite pending";
  if (status === "active") return "Active";
  if (status === "suspended") return "Suspended";
  if (status === "ended") return "Access ended";
  return status;
}

export function staffStudentScopeLabel(role: string): string {
  if (role === "mentor") return "Assigned students only";
  if (role === "read_only_staff") return "Directory only";
  return "Organization";
}

export const SUSPENDED_STAFF_ACCESS: StaffSurfaceAccess = {
  operations: "Not granted",
  studentScope: "None",
  cms: "Not granted",
  audit: "Not granted",
  staffManagement: "Not granted",
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
  };
}

export function staffAccessPreview(role: StaffRoleKey): StaffSurfaceAccess {
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
    workspace = "Assigned students";
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
