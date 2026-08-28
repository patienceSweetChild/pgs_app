import "server-only";

import { staffHasPermission, type StaffContext } from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  RegistryQuery,
  StudentRegistryRow,
} from "@/lib/operations/student-registry";

export function registryShowsOpenColumn(staff: StaffContext): boolean {
  return (
    staffHasPermission(staff, "student_workspace.read_all") ||
    staffHasPermission(staff, "student_workspace.read")
  );
}

export async function loadStudentRegistry(
  query: RegistryQuery,
): Promise<StudentRegistryRow[]> {
  await requireStaffPermission("overview.read");
  const supabase = await createSupabaseServerClient();
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 25;

  const { data, error } = await supabase.rpc("staff_student_registry", {
    search_text: query.search ?? null,
    plan_filter: query.plan ?? null,
    mentor_filter: query.mentor ?? null,
    crm_stage_filter: query.crmStage ?? null,
    page_offset: (page - 1) * pageSize,
    page_size: pageSize,
  });

  if (error) throw new Error(error.message);
  return (data ?? []) as StudentRegistryRow[];
}

export async function loadMentorOptions() {
  await requireStaffPermission("mentor_assignments.manage");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("staff_profiles")
    .select("user_id, display_name, role_key")
    .eq("status", "active")
    .in("role_key", ["mentor", "admin", "super_admin"])
    .order("display_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}
