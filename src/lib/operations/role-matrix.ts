import type { ProductRoleKey, StaffPermission } from "@/lib/auth/permissions";

export type MatrixAction = "view" | "create" | "edit" | "delete";

export type RoleMatrixModule = {
  id: string;
  label: string;
  hint?: string;
  actions: Partial<Record<MatrixAction, StaffPermission | StaffPermission[]>>;
};

export const ROLE_MATRIX_MODULES: RoleMatrixModule[] = [
  {
    id: "scoreboard",
    label: "Scoreboard",
    actions: { view: "overview.read" },
  },
  {
    id: "students",
    label: "Students (registry / CRM)",
    actions: {
      view: "students.read",
      create: "students.manage",
      edit: "students.manage",
      delete: "students.manage",
    },
  },
  {
    id: "workspace",
    label: "Student workspace",
    hint: "Assigned vs organization is controlled by read / read_all",
    actions: {
      view: ["student_workspace.read", "student_workspace.read_all"],
      create: ["student_workspace.manage", "student_workspace.manage_all"],
      edit: ["student_workspace.manage", "student_workspace.manage_all"],
      delete: ["student_workspace.manage", "student_workspace.manage_all"],
    },
  },
  {
    id: "premium",
    label: "Premium and mentor access",
    actions: {
      view: "premium.manage",
      create: "premium.manage",
      edit: "mentor_assignments.manage",
      delete: "premium.manage",
    },
  },
  {
    id: "work",
    label: "Work targets",
    actions: {
      view: "staff_targets.read",
      create: "staff_targets.manage",
      edit: "staff_targets.manage",
      delete: "staff_targets.manage_all",
    },
  },
  {
    id: "team",
    label: "Team / people",
    actions: {
      view: "staff.read",
      create: "roles.manage",
      edit: "roles.manage",
      delete: "roles.manage",
    },
  },
  {
    id: "notifications",
    label: "Notifications",
    actions: {
      view: "overview.read",
      edit: "notifications.manage",
    },
  },
  {
    id: "activity",
    label: "Activity",
    actions: { view: "audit.read" },
  },
  {
    id: "cms",
    label: "CMS Admin",
    actions: {
      view: "content.manage",
      create: "catalog.manage",
      edit: "cms.publish",
      delete: "content.manage",
    },
  },
  {
    id: "ai",
    label: "AI analysis",
    hint: "Use only — Groq reads authorized ops data",
    actions: { view: "ai.analyze" },
  },
];

const SHARED_STUDENT_FACING: StaffPermission[] = [
  "student_workspace.read",
  "documents.manage",
  "notifications.manage",
];

export const DEFAULT_ROLE_PERMISSIONS: Record<ProductRoleKey, StaffPermission[]> = {
  super_admin: [
    "overview.read",
    "students.read",
    "students.manage",
    "student_workspace.read",
    "student_workspace.read_all",
    "student_workspace.manage",
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
    "documents.manage",
    "workspace.manage",
    "notifications.manage",
    "ai.analyze",
  ],
  admin: [
    "overview.read",
    "students.read",
    "students.manage",
    "student_workspace.read",
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
    "documents.manage",
    "workspace.manage",
    "notifications.manage",
    "ai.analyze",
  ],
  mentor: [
    "overview.read",
    "student_workspace.read",
    "student_workspace.manage",
    "staff_targets.read",
    "staff_targets.manage",
    "documents.manage",
    "workspace.manage",
  ],
  viewer: [...SHARED_STUDENT_FACING],
  guardian: [...SHARED_STUDENT_FACING],
  student: [...SHARED_STUDENT_FACING],
};

export const SUPER_ADMIN_LOCKED_KEYS: StaffPermission[] = ["roles.manage", "overview.read"];

export function matrixCellChecked(
  permissions: Iterable<string>,
  module: RoleMatrixModule,
  action: MatrixAction,
): boolean {
  const required = module.actions[action];
  if (!required) return false;
  const set = permissions instanceof Set ? permissions : new Set(permissions);
  const keys = Array.isArray(required) ? required : [required];
  return keys.some((key) => set.has(key));
}

export function toggleMatrixPermission(
  current: StaffPermission[],
  module: RoleMatrixModule,
  action: MatrixAction,
  enabled: boolean,
): StaffPermission[] {
  const required = module.actions[action];
  if (!required) return current;
  const keys = Array.isArray(required) ? required : [required];
  const next = new Set(current);
  if (enabled) {
    next.add(keys[0]);
  } else {
    for (const key of keys) next.delete(key);
  }
  return [...next];
}

export type RoleMatrixRow = {
  key: ProductRoleKey;
  label: string;
  kind: "staff" | "portal" | "student";
  system: boolean;
  permissions: StaffPermission[];
};

export function roleKind(role: ProductRoleKey): "staff" | "portal" | "student" {
  if (role === "guardian") return "portal";
  if (role === "student") return "student";
  return "staff";
}

export function rpcMissing(error: { message?: string } | null | undefined): boolean {
  const message = error?.message?.toLowerCase() ?? "";
  return (
    message.includes("could not find the function") ||
    message.includes("does not exist") ||
    message.includes("schema cache")
  );
}
