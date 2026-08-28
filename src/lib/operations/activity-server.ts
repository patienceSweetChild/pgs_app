import "server-only";

import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function loadActivityFeed(limit = 50): Promise<AuditEventRow[]> {
  await requireStaffPermission("audit.read");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("audit_events")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AuditEventRow[];
}
