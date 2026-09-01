import "server-only";

import { staffHasPermission, type StaffContext } from "@/lib/auth/actor-context";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCrmStage, isCrmStream, parseCrmTargetYear } from "@/lib/operations/student-crm";
import { rpcMissing } from "@/lib/operations/role-matrix";
import {
  REGISTRY_PAGE_SIZE,
  formatRegistryJoinedAt,
  parseRegistryQuery,
  parseSavedRegistryQuery,
  type NormalizedRegistryQuery,
  type RegistryMentorOption,
  type RegistrySavedView,
  type StudentRegistryResult,
  type StudentRegistryRow,
} from "@/lib/operations/student-registry";

export function registryShowsOpenColumn(staff: StaffContext): boolean {
  return (
    staffHasPermission(staff, "student_workspace.read_all") ||
    staffHasPermission(staff, "student_workspace.read")
  );
}

export function canQueryStudentRegistry(staff: StaffContext): boolean {
  return (
    staffHasPermission(staff, "students.read") ||
    staffHasPermission(staff, "student_workspace.read") ||
    staffHasPermission(staff, "student_workspace.read_all")
  );
}

export function isMentorScopedRegistry(staff: StaffContext): boolean {
  return staff.roleKey === "mentor" && !staffHasPermission(staff, "student_workspace.read_all");
}

export function registryShowsMentorColumn(staff: StaffContext): boolean {
  return staffHasPermission(staff, "student_workspace.read_all");
}

export function registryQueryCapabilities(staff: StaffContext) {
  return { allowOrgFilters: staffHasPermission(staff, "student_workspace.read_all") };
}

function emptyResult(page: number, error = false): StudentRegistryResult {
  return { rows: [], totalCount: 0, page, pageSize: REGISTRY_PAGE_SIZE, error };
}

function mapRow(row: Record<string, unknown>): StudentRegistryRow {
  return {
    id: String(row.id),
    pgsCode: String(row.pgs_code ?? row.pgsCode ?? "").slice(0, 12) || String(row.id).slice(0, 8),
    fullName: String(row.full_name ?? row.fullName ?? "Student"),
    studyLevel: (row.study_level as string | null) ?? null,
    stream: isCrmStream(row.crm_stream as string) ? (row.crm_stream as StudentRegistryRow["stream"]) : null,
    targetYear: parseCrmTargetYear(row.crm_target_year as number | null),
    stage: isCrmStage(row.crm_stage as string) ? (row.crm_stage as StudentRegistryRow["stage"]) : "new",
    plan: row.plan === "Premium" || row.plan === "premium" ? "Premium" : "Standard",
    mentorName: String(row.mentor_name ?? row.mentorName ?? "Unassigned"),
    mentorId: (row.mentor_id as string | null) ?? null,
    joinedAt: formatRegistryJoinedAt(String(row.created_at ?? row.joinedAt ?? new Date().toISOString())),
    completion: row.profile_completed_at || row.completion === "Complete" ? "Complete" : "Incomplete",
    canOpenWorkspace: Boolean(row.can_open_workspace ?? row.canOpenWorkspace),
    totalCount: Number(row.total_count ?? 0),
    preferredStudyCountry: (row.preferred_study_country as string | null) ?? null,
  };
}

export async function loadStaffStudentRegistry(
  staff: StaffContext,
  query: NormalizedRegistryQuery,
): Promise<StudentRegistryResult> {
  if (!canQueryStudentRegistry(staff)) return emptyResult(query.page);
  const supabase = await createSupabaseServerClient();
  const offset = (query.page - 1) * REGISTRY_PAGE_SIZE;

  const v2 = await supabase.rpc("staff_student_registry_v2", {
    search_text: query.q,
    plan_filter: query.plan,
    mentor_filter: query.mentor,
    study_level_filter: query.studyLevel,
    completion_filter: query.completion,
    joined_filter: query.joined,
    sort_key: query.sort,
    page_offset: offset,
    page_size: REGISTRY_PAGE_SIZE,
    stream_filter: query.stream,
    target_year_filter: query.targetYear ? String(query.targetYear) : null,
    stage_filter: query.stage,
    tag_filter: query.tag,
  });

  if (!v2.error && v2.data) {
    const rows = (v2.data as Record<string, unknown>[]).map(mapRow);
    return {
      rows,
      totalCount: rows[0]?.totalCount ?? rows.length,
      page: query.page,
      pageSize: REGISTRY_PAGE_SIZE,
      error: false,
    };
  }

  const v1 = await supabase.rpc("staff_student_registry", {
    search_text: query.q ?? null,
    plan_filter: query.plan ?? null,
    mentor_filter: query.mentor ?? null,
    crm_stage_filter: query.stage ?? null,
    page_offset: offset,
    page_size: REGISTRY_PAGE_SIZE,
  });

  if (v1.error || !v1.data) {
    return emptyResult(query.page, true);
  }

  let rows = (v1.data as Record<string, unknown>[]).map(mapRow);
  if (query.stream) rows = rows.filter((row) => row.stream === query.stream);
  if (query.studyLevel) rows = rows.filter((row) => row.studyLevel === query.studyLevel);
  if (query.completion) {
    rows = rows.filter((row) =>
      query.completion === "complete" ? row.completion === "Complete" : row.completion === "Incomplete",
    );
  }
  return {
    rows,
    totalCount: rows[0]?.totalCount ?? rows.length,
    page: query.page,
    pageSize: REGISTRY_PAGE_SIZE,
    error: false,
  };
}

/** @deprecated use loadStaffStudentRegistry */
export async function loadStudentRegistry(query: {
  search?: string;
  plan?: string;
  mentor?: string;
  crmStage?: string;
  page?: number;
  pageSize?: number;
}): Promise<StudentRegistryRow[]> {
  await requireStaffPermission("overview.read");
  const supabase = await createSupabaseServerClient();
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 25;
  const { data, error } = await supabase.rpc("staff_student_registry", {
    search_text: query.search ?? null,
    plan_filter: query.plan && query.plan !== "all" ? query.plan : null,
    mentor_filter: query.mentor && query.mentor !== "all" ? query.mentor : null,
    crm_stage_filter: query.crmStage && query.crmStage !== "all" ? query.crmStage : null,
    page_offset: (page - 1) * pageSize,
    page_size: pageSize,
  });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function loadMentorOptions(): Promise<RegistryMentorOption[]> {
  const supabase = await createSupabaseServerClient();
  const rpc = await supabase.rpc("staff_registry_mentor_options");
  if (!rpc.error && rpc.data) {
    return (rpc.data as Array<{ id?: string; user_id?: string; display_name: string; role_key?: string }>).map(
      (row) => ({
        id: row.id ?? row.user_id ?? "",
        displayName: row.display_name,
        roleKey: row.role_key ?? null,
      }),
    );
  }
  const { data } = await supabase
    .from("staff_profiles")
    .select("user_id, display_name, role_key")
    .eq("status", "active")
    .in("role_key", ["mentor", "admin", "super_admin"])
    .order("display_name");
  return (data ?? []).map((row) => ({
    id: row.user_id,
    displayName: row.display_name,
    roleKey: row.role_key,
  }));
}

export async function loadRegistrySavedViews(staff: StaffContext): Promise<RegistrySavedView[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("staff_registry_saved_views")
    .select("id, name, query")
    .eq("staff_user_id", staff.userId)
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error || rpcMissing(error)) return [];
  const capabilities = registryQueryCapabilities(staff);
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    query: parseSavedRegistryQuery(row.query, capabilities),
  }));
}

export function resolveRegistryQueryFromRequest(
  raw: Record<string, string | string[] | undefined>,
  capabilities: ReturnType<typeof registryQueryCapabilities>,
  savedViews: RegistrySavedView[],
) {
  let query = parseRegistryQuery(raw, capabilities);
  if (query.view) {
    const saved = savedViews.find((view) => view.id === query.view);
    if (saved) query = { ...saved.query, page: query.page, view: query.view };
  }
  return query;
}
