import "server-only";

import { requireStaffPermission } from "@/lib/auth/student-access";
import { staffHasPermission, type ActorContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rpcMissing } from "@/lib/operations/role-matrix";
import {
  resolveStaffTargetsScope,
  type StaffTarget,
  type StaffTargetFilter,
  type StaffTargetSummary,
} from "@/lib/operations/staff-targets";

export type { StaffTarget };

const EMPTY_SUMMARY: StaffTargetSummary = {
  assignedStudents: 0,
  openTargets: 0,
  pendingTargets: 0,
  inProgressTargets: 0,
  dueSoon: 0,
  overdue: 0,
  completedRecently: 0,
};

function mapRow(row: Record<string, unknown>): StaffTarget {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    status: String(row.status ?? "pending"),
    priority: String(row.priority ?? "normal"),
    assignedStaffId: String(row.assigned_staff_id ?? row.staff_user_id ?? ""),
    assigneeName: (row.assignee_name as string | undefined) ?? undefined,
    studentId: (row.student_id as string | null) ?? null,
    studentName: (row.student_name as string | null) ?? null,
    dueAt: (row.due_at as string | null) ?? null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function matchesFilter(target: StaffTarget, status: StaffTargetFilter | null): boolean {
  if (!status) return true;
  const now = Date.now();
  const due = target.dueAt ? new Date(target.dueAt).getTime() : null;
  const week = 7 * 24 * 60 * 60 * 1000;
  if (status === "open") return !["completed", "cancelled", "done"].includes(target.status);
  if (status === "overdue") {
    return Boolean(due && due < now && !["completed", "cancelled", "done"].includes(target.status));
  }
  if (status === "due_soon") {
    return Boolean(
      due && due >= now && due <= now + week && !["completed", "cancelled", "done"].includes(target.status),
    );
  }
  if (status === "completed") return target.status === "completed" || target.status === "done";
  return target.status === status;
}

export async function loadStaffTargets(
  actor: ActorContext,
  options: {
    assigneeId?: string | null;
    status?: StaffTargetFilter | null;
    targetId?: string | null;
    limit?: number;
  } = {},
): Promise<StaffTarget[]> {
  await requireStaffPermission("staff_targets.read");
  if (!actor.staff || resolveStaffTargetsScope(actor.staff) === "restricted") return [];
  const supabase = await createSupabaseServerClient();

  const rpc = await supabase.rpc("staff_targets_list", {
    target_assignee: options.assigneeId ?? null,
    status_filter: options.status ?? null,
    result_limit: options.limit ?? 100,
  });
  if (!rpc.error && rpc.data) {
    let rows = (rpc.data as Record<string, unknown>[]).map(mapRow);
    if (options.targetId) rows = rows.filter((row) => row.id === options.targetId);
    return rows;
  }

  let query = supabase.from("staff_targets").select("*").order("updated_at", { ascending: false }).limit(100);
  if (!staffHasPermission(actor.staff, "staff_targets.manage_all") && actor.userId) {
    query = query.eq("staff_user_id", actor.userId);
  }
  if (options.assigneeId) query = query.eq("staff_user_id", options.assigneeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, unknown>[])
    .map(mapRow)
    .filter((row) => matchesFilter(row, options.status ?? null))
    .filter((row) => (options.targetId ? row.id === options.targetId : true));
}

export async function loadStaffTargetSummary(
  actor: ActorContext,
  assigneeId?: string | null,
): Promise<StaffTargetSummary> {
  const targets = await loadStaffTargets(actor, { assigneeId, limit: 100 });
  if (!targets.length) return EMPTY_SUMMARY;
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const open = targets.filter((row) => !["completed", "cancelled", "done"].includes(row.status));
  return {
    assignedStudents: new Set(targets.map((row) => row.studentId).filter(Boolean)).size,
    openTargets: open.length,
    pendingTargets: targets.filter((row) => row.status === "pending").length,
    inProgressTargets: targets.filter((row) => row.status === "in_progress").length,
    dueSoon: open.filter((row) => {
      if (!row.dueAt) return false;
      const due = new Date(row.dueAt).getTime();
      return due >= now && due <= now + week;
    }).length,
    overdue: open.filter((row) => row.dueAt && new Date(row.dueAt).getTime() < now).length,
    completedRecently: targets.filter((row) => row.status === "completed" || row.status === "done").length,
  };
}

export async function loadStaffTargetOptions(actor: ActorContext) {
  const supabase = await createSupabaseServerClient();
  const scope = actor.staff ? resolveStaffTargetsScope(actor.staff) : "restricted";
  const assignees =
    scope === "organization"
      ? (
          await supabase
            .from("staff_profiles")
            .select("user_id, display_name, role_key")
            .eq("status", "active")
            .order("display_name")
        ).data ?? []
      : [];
  const students =
    (
      await supabase
        .from("profiles")
        .select("id, full_name, pgs_code")
        .order("full_name")
        .limit(300)
    ).data ?? [];
  return {
    assignees: assignees.map((row) => ({
      id: row.user_id,
      name: row.display_name || "Staff",
      role: row.role_key,
    })),
    students: students.map((row) => ({
      id: row.id,
      name: row.full_name || "Student",
      pgsCode: row.pgs_code || "",
    })),
  };
}
