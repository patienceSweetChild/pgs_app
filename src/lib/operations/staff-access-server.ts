import "server-only";

import { notFound } from "next/navigation";
import { staffHasPermission, type ActorContext } from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  StaffAccessDetail,
  StaffDirectoryRow,
} from "@/lib/operations/staff-access";
import { isStaffRoleKey } from "@/lib/operations/staff-access";

function asDirectoryRow(row: Record<string, unknown>): StaffDirectoryRow | null {
  if (!isStaffRoleKey(String(row.role_key ?? ""))) return null;
  const status = row.status;
  if (status !== "active" && status !== "suspended" && status !== "ended") return null;
  return {
    user_id: String(row.user_id),
    display_name: String(row.display_name || "Staff"),
    status: status as StaffDirectoryRow["status"],
    role_key: row.role_key as StaffDirectoryRow["role_key"],
    assigned_student_count: Number(row.assigned_student_count ?? 0),
    invite_pending: Boolean(row.invite_pending),
    has_student_profile: Boolean(row.has_student_profile),
    created_at: String(row.created_at ?? ""),
  };
}

export async function loadStaffDirectory(): Promise<StaffDirectoryRow[]> {
  await requireStaffPermission("staff.read");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_people_directory");
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown[])
    .map((row) => asDirectoryRow(row as Record<string, unknown>))
    .filter((row): row is StaffDirectoryRow => Boolean(row));
}

export async function loadStaffAccessDetail(
  userId: string,
): Promise<StaffAccessDetail | null> {
  await requireStaffPermission("staff.read");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_access_detail", {
    target_user: userId,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  const directory = asDirectoryRow(row as Record<string, unknown>);
  if (!directory) return null;
  const keys = Array.isArray((row as { permission_keys?: unknown }).permission_keys)
    ? (row as { permission_keys: string[] }).permission_keys.filter(
        (key): key is StaffAccessDetail["permission_keys"][number] =>
          typeof key === "string",
      )
    : [];
  return { ...directory, permission_keys: keys };
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
