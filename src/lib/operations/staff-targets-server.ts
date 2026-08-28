import "server-only";

import { requireStaffPermission } from "@/lib/auth/student-access";
import { staffHasPermission, type ActorContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffTarget = {
  id: string;
  staff_user_id: string;
  title: string;
  description: string;
  status: string;
  due_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function loadStaffTargets(actor: ActorContext): Promise<StaffTarget[]> {
  await requireStaffPermission("staff_targets.read");
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("staff_targets")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (
    !staffHasPermission(actor.staff, "staff_targets.manage_all") &&
    actor.userId
  ) {
    query = query.eq("staff_user_id", actor.userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as StaffTarget[];
}
