import "server-only";

import { notFound } from "next/navigation";
import { staffHasPermission, type ActorContext } from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STAFF_PERMISSIONS, type StaffPermission } from "@/lib/auth/permissions";
import type {
  StaffAccessDetail,
  StaffDirectoryRow,
} from "@/lib/operations/staff-access";
import { isStaffRoleKey, normalizeRoleKey } from "@/lib/operations/staff-access";
import { rpcMissing } from "@/lib/operations/role-matrix";

function asDirectoryRow(row: Record<string, unknown>): StaffDirectoryRow | null {
  const roleKey = normalizeRoleKey(String(row.role_key ?? row.role ?? ""));
  if (!isStaffRoleKey(roleKey)) return null;
  const status = row.status;
  if (status !== "active" && status !== "suspended" && status !== "ended") return null;
  return {
    user_id: String(row.user_id),
    display_name: String(row.display_name || "Staff"),
    status: status as StaffDirectoryRow["status"],
    role_key: roleKey as StaffDirectoryRow["role_key"],
    assigned_student_count: Number(row.assigned_student_count ?? 0),
    invite_pending: Boolean(row.invite_pending),
    has_student_profile: Boolean(row.has_student_profile),
    created_at: String(row.created_at ?? ""),
  };
}

function permissionKeys(value: unknown): StaffPermission[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (key): key is StaffPermission =>
      typeof key === "string" && (STAFF_PERMISSIONS as readonly string[]).includes(key),
  );
}

async function loadDirectoryFromTables(): Promise<StaffDirectoryRow[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: profiles }, { data: assignments }] = await Promise.all([
    supabase
      .from("staff_profiles")
      .select("user_id, display_name, status, role_key, created_at")
      .order("display_name"),
    supabase.from("mentor_assignments").select("mentor_id").eq("status", "active"),
  ]);
  const counts = new Map<string, number>();
  for (const row of assignments ?? []) {
    const mentorId = String(row.mentor_id ?? "");
    if (!mentorId) continue;
    counts.set(mentorId, (counts.get(mentorId) ?? 0) + 1);
  }
  return (profiles ?? [])
    .map((row) =>
      asDirectoryRow({
        ...row,
        assigned_student_count: counts.get(row.user_id) ?? 0,
      }),
    )
    .filter((row): row is StaffDirectoryRow => Boolean(row));
}

export async function loadStaffDirectory(): Promise<StaffDirectoryRow[]> {
  await requireStaffPermission("staff.read");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_people_directory");
  if (!error) {
    return ((data ?? []) as unknown[])
      .map((row) => asDirectoryRow(row as Record<string, unknown>))
      .filter((row): row is StaffDirectoryRow => Boolean(row));
  }
  if (!rpcMissing(error)) throw new Error(error.message);
  return loadDirectoryFromTables();
}

export async function loadStaffAccessDetail(
  userId: string,
): Promise<StaffAccessDetail | null> {
  await requireStaffPermission("staff.read");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_access_detail", {
    target_user: userId,
  });
  if (!error) {
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    const directory = asDirectoryRow(row as Record<string, unknown>);
    if (!directory) return null;
    return {
      ...directory,
      permission_keys: permissionKeys((row as { permission_keys?: unknown }).permission_keys),
    };
  }
  if (!rpcMissing(error)) throw new Error(error.message);

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("user_id, display_name, status, role_key, created_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (!profile) return null;
  const directory = asDirectoryRow(profile as Record<string, unknown>);
  if (!directory) return null;
  const roleKey = normalizeRoleKey(profile.role_key);
  const { data: links } = await supabase
    .from("staff_role_permissions")
    .select("staff_permissions(key), staff_roles!inner(key)")
    .eq("staff_roles.key", roleKey);
  const keys = (links ?? [])
    .map((row) => {
      const perm = row.staff_permissions as { key: string } | { key: string }[] | null;
      return Array.isArray(perm) ? perm[0]?.key : perm?.key;
    })
    .filter(Boolean);
  const { count } = await supabase
    .from("mentor_assignments")
    .select("*", { count: "exact", head: true })
    .eq("mentor_id", userId)
    .eq("status", "active");
  const { data: student } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  return {
    ...directory,
    assigned_student_count: count ?? 0,
    has_student_profile: Boolean(student),
    permission_keys: permissionKeys(keys),
  };
}

export async function applyStaffAccessChange(input: {
  userId: string;
  role: string;
  displayName: string;
  active: boolean;
  status: string;
  reason?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const rpc = await supabase.rpc("manage_staff_access", {
    target_user: input.userId,
    target_role: input.role,
    target_active: input.active,
    target_status: input.status,
    target_display_name: input.displayName,
    event_reason: input.reason ?? "Updated from operations",
  });
  if (!rpc.error) return;
  if (!rpcMissing(rpc.error)) throw new Error(rpc.error.message);

  const { error } = await supabase.from("staff_profiles").upsert(
    {
      user_id: input.userId,
      role_key: input.role,
      display_name: input.displayName,
      status: input.active ? input.status : "ended",
    },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
}

export async function requireStaffAccessDetail(userId: string) {
  const detail = await loadStaffAccessDetail(userId);
  if (!detail) notFound();
  return detail;
}

export async function loadStaffAuthEmail(
  actor: ActorContext,
  userId: string,
): Promise<string | null> {
  if (!actor.staff || !staffHasPermission(actor.staff, "roles.manage")) return null;
  const { data, error } = await createSupabaseAdminClient().auth.admin.getUserById(
    userId,
  );
  if (error) return null;
  return data.user?.email ?? null;
}

export async function loadStaffAccessHistory(actor: ActorContext, userId: string) {
  if (!actor.staff || !staffHasPermission(actor.staff, "audit.read")) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("audit_events")
    .select("id,occurred_at,event_type,outcome,metadata")
    .eq("target_id", userId)
    .in("source_subsystem", ["operations", "staff"])
    .order("occurred_at", { ascending: false })
    .limit(12);
  return (data ?? []) as Array<{
    id: string;
    occurred_at: string;
    event_type: string;
    outcome: string;
    metadata: Record<string, unknown> | null;
  }>;
}

export type StaffMemberTargetSummary = {
  assignedStudents: number;
  openTargets: number;
  dueSoon: number;
  overdue: number;
  completedRecently: number;
};

export async function loadStaffMemberTargetSummary(
  staffUserId: string,
): Promise<StaffMemberTargetSummary> {
  await requireStaffPermission("staff_targets.read");
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(weekAhead.getDate() + 7);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: targets } = await supabase
    .from("staff_targets")
    .select("status,due_at,updated_at")
    .eq("staff_user_id", staffUserId);

  const rows = targets ?? [];
  const open = rows.filter((row) => row.status !== "completed" && row.status !== "cancelled");

  return {
    assignedStudents: 0,
    openTargets: open.length,
    dueSoon: open.filter(
      (row) =>
        row.due_at &&
        new Date(row.due_at) >= now &&
        new Date(row.due_at) <= weekAhead,
    ).length,
    overdue: open.filter((row) => row.due_at && new Date(row.due_at) < now).length,
    completedRecently: rows.filter(
      (row) =>
        row.status === "completed" &&
        row.updated_at &&
        new Date(row.updated_at) >= weekAgo,
    ).length,
  };
}
