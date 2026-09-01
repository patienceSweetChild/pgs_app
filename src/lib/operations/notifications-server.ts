import "server-only";

import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rpcMissing } from "@/lib/operations/role-matrix";
import type {
  OperationsNotification,
  StaffNotificationFilter,
} from "@/lib/operations/notifications";

function mapRow(row: Record<string, unknown>): OperationsNotification {
  return {
    id: String(row.id),
    eventType: String(row.event_type ?? "notice"),
    title: String(row.title ?? row.event_type ?? "Notification"),
    body: String(row.body ?? ""),
    studentId: (row.student_id as string | null) ?? null,
    destinationPath: (row.destination_path as string | null) ?? null,
    readAt: (row.read_at as string | null) ?? null,
    archivedAt: (row.archived_at as string | null) ?? null,
    createdAt: String(row.created_at ?? ""),
  };
}

export async function loadOperationsNotifications(
  filter: StaffNotificationFilter,
): Promise<OperationsNotification[]> {
  const actor = await resolveActorContext();
  if (!actor.staff || !actor.userId) return [];
  if (
    !staffHasPermission(actor.staff, "overview.read") &&
    !staffHasPermission(actor.staff, "notifications.manage")
  ) {
    return [];
  }
  const supabase = await createSupabaseServerClient();
  const rpc = await supabase.rpc("staff_notifications_list", {
    view_filter: filter,
    result_limit: 80,
  });
  if (!rpc.error && rpc.data) {
    return (rpc.data as Record<string, unknown>[]).map(mapRow);
  }

  let query = supabase
    .from("staff_notifications")
    .select("*")
    .eq("recipient_user_id", actor.userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(80);
  if (filter === "unread") query = query.is("read_at", null);
  if (filter === "read") query = query.not("read_at", "is", null);
  if (filter === "recent") {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    query = query.gte("created_at", since.toISOString());
  }
  const { data, error } = await query;
  if (error && rpcMissing(error)) return [];
  if (error) return [];
  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function loadOperationsNotificationUnreadCount(): Promise<number> {
  const actor = await resolveActorContext();
  if (!actor.userId) return 0;
  const supabase = await createSupabaseServerClient();
  const rpc = await supabase.rpc("staff_notifications_unread_count");
  if (!rpc.error && typeof rpc.data === "number") return rpc.data;
  const { count, error } = await supabase
    .from("staff_notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_user_id", actor.userId)
    .is("read_at", null)
    .is("archived_at", null);
  if (error) return 0;
  return count ?? 0;
}
