import "server-only";

import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rpcMissing } from "@/lib/operations/role-matrix";
import {
  operationsActivityEventLabel,
  type OperationsActivityDomain,
  type OperationsActivityItem,
} from "@/lib/operations/activity";
import { isSupabaseUuid } from "@/lib/operations/student-registry";
import { loadStudentDisplayIdMap } from "@/lib/operations/student-registry-server";

export type AuditEventRow = {
  id: string;
  occurred_at: string;
  event_type: string;
  actor_user_id: string | null;
  actor_kind: string;
  target_type: string | null;
  target_id: string | null;
  outcome: string;
  source_subsystem: string;
  metadata: Record<string, unknown>;
};

export async function loadOperationsActivity(
  domain: OperationsActivityDomain | null,
  limit = 150,
): Promise<OperationsActivityItem[]> {
  await requireStaffPermission("audit.read");
  const supabase = await createSupabaseServerClient();
  const rpc = await supabase.rpc("staff_operations_activity", {
    domain_filter: domain,
    result_limit: limit,
  });
  if (!rpc.error && rpc.data) {
    return decorateActivityTargets(
      (rpc.data as Array<Record<string, unknown>>).map((row) => ({
        id: String(row.id),
        occurredAt: String(row.occurred_at),
        eventType: String(row.event_type),
        eventLabel: operationsActivityEventLabel(String(row.event_type)),
        actorLabel: String(row.actor_label ?? "Staff"),
        targetLabel: String(row.target_label ?? row.target_id ?? ""),
        targetType: (row.target_type as string | null) ?? null,
        outcome: String(row.outcome ?? ""),
        sourceSubsystem: String(row.source_subsystem ?? ""),
        destinationPath: (row.destination_path as string | null) ?? null,
      })),
    );
  }

  let query = supabase
    .from("audit_events")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(limit);
  if (domain) query = query.eq("source_subsystem", domain);
  const { data, error } = await query;
  if (error && !rpcMissing(error)) throw new Error(error.message);
  return decorateActivityTargets(
    ((data ?? []) as AuditEventRow[]).map((row) => ({
      id: row.id,
      occurredAt: row.occurred_at,
      eventType: row.event_type,
      eventLabel: operationsActivityEventLabel(row.event_type),
      actorLabel: row.actor_kind,
      targetLabel: row.target_id ?? "",
      targetType: row.target_type,
      outcome: row.outcome,
      sourceSubsystem: row.source_subsystem,
      destinationPath: null,
    })),
  );
}

const UUID_IN_TEXT =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

function collectUuids(...values: Array<string | null | undefined>): string[] {
  const ids: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (isSupabaseUuid(value)) ids.push(value);
    const matches = value.match(UUID_IN_TEXT);
    if (matches) ids.push(...matches);
  }
  return ids;
}

function replaceUuids(value: string, displayById: Map<string, string>): string {
  if (!value) return value;
  if (isSupabaseUuid(value)) {
    return displayById.get(value) ?? displayById.get(value.toLowerCase()) ?? "";
  }
  return value
    .replace(UUID_IN_TEXT, (id) => displayById.get(id) ?? displayById.get(id.toLowerCase()) ?? "")
    .replace(/[ ·]+/g, " ")
    .trim();
}

async function decorateActivityTargets(
  items: OperationsActivityItem[],
): Promise<OperationsActivityItem[]> {
  const ids = items.flatMap((item) => collectUuids(item.targetLabel, item.destinationPath));
  const displayById = await loadStudentDisplayIdMap(ids);
  return items.map((item) => ({
    ...item,
    targetLabel: replaceUuids(item.targetLabel, displayById),
  }));
}

export async function loadActivityFeed(limit = 50): Promise<AuditEventRow[]> {
  const items = await loadOperationsActivity(null, limit);
  return items.map((item) => ({
    id: item.id,
    occurred_at: item.occurredAt,
    event_type: item.eventType,
    actor_user_id: null,
    actor_kind: item.actorLabel,
    target_type: item.targetType,
    target_id: item.targetLabel,
    outcome: item.outcome,
    source_subsystem: item.sourceSubsystem,
    metadata: {},
  }));
}
