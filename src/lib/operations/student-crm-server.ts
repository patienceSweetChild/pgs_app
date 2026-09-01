import "server-only";

import {
  crmJoinYear,
  formatRegistryJoinedAt,
  isCrmStage,
  isCrmStream,
  parseCrmTargetYear,
  type StudentCrmProfile,
  type StudentCrmTag,
} from "@/lib/operations/student-crm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDisplayPgsId } from "@/lib/operations/student-registry";

type CrmProfileRpcRow = {
  id: string;
  pgs_code: string;
  full_name: string;
  study_level: string | null;
  preferred_study_country: string | null;
  crm_stream: string | null;
  crm_target_year: number | null;
  crm_stage: string;
  created_at: string;
  plan: string;
  mentor_name: string;
  mentor_id: string | null;
  can_open_workspace: boolean;
  can_mutate_crm: boolean;
  tags: StudentCrmTag[] | string | null;
};

function parseTags(value: CrmProfileRpcRow["tags"]): StudentCrmTag[] {
  const parsed = typeof value === "string" ? (JSON.parse(value) as unknown) : value;
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (
      typeof row.id !== "string" ||
      typeof row.name !== "string" ||
      typeof row.slug !== "string"
    ) {
      return [];
    }
    return [{ id: row.id, name: row.name, slug: row.slug }];
  });
}

function mapCrmRow(row: CrmProfileRpcRow): StudentCrmProfile {
  return {
    id: row.id,
    pgsCode: formatDisplayPgsId({ pgsCode: row.pgs_code, createdAt: row.created_at }),
    fullName: row.full_name || "Student",
    studyLevel: row.study_level,
    preferredStudyCountry: row.preferred_study_country,
    stream: isCrmStream(row.crm_stream) ? row.crm_stream : null,
    targetYear: parseCrmTargetYear(row.crm_target_year),
    stage: isCrmStage(row.crm_stage) ? row.crm_stage : "new",
    joinedAt: formatRegistryJoinedAt(row.created_at),
    joinYear: crmJoinYear(row.created_at),
    plan: row.plan === "Premium" ? "Premium" : "Standard",
    mentorName: row.mentor_name || "Unassigned",
    mentorId: row.mentor_id || null,
    canOpenWorkspace: Boolean(row.can_open_workspace),
    canMutate: Boolean(row.can_mutate_crm),
    tags: parseTags(row.tags),
  };
}

async function loadCrmProfileFallback(
  studentId: string,
): Promise<StudentCrmProfile | null> {
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, premiumResult, mentorResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", studentId).maybeSingle(),
    supabase.rpc("student_has_active_premium", { uid: studentId }),
    supabase
      .from("mentor_assignments")
      .select("mentor_id, staff_profiles!mentor_assignments_mentor_id_fkey(display_name)")
      .eq("student_id", studentId)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  if (!profile) return null;

  const mentorRelation = mentorResult.data?.staff_profiles as
    | { display_name: string }
    | { display_name: string }[]
    | null;
  const mentorName = Array.isArray(mentorRelation)
    ? mentorRelation[0]?.display_name
    : mentorRelation?.display_name;

  return {
    id: profile.id,
    pgsCode: formatDisplayPgsId({ pgsCode: profile.pgs_code, createdAt: profile.created_at }),
    fullName: profile.full_name || "Student",
    studyLevel: profile.study_level ?? null,
    preferredStudyCountry: profile.preferred_study_country ?? null,
    stream: isCrmStream(profile.crm_stream) ? profile.crm_stream : null,
    targetYear: parseCrmTargetYear(profile.crm_target_year),
    stage: isCrmStage(profile.crm_stage) ? profile.crm_stage : "new",
    joinedAt: formatRegistryJoinedAt(profile.created_at),
    joinYear: crmJoinYear(profile.created_at),
    plan: premiumResult.data ? "Premium" : "Standard",
    mentorName: mentorName || "Unassigned",
    mentorId: mentorResult.data?.mentor_id ?? null,
    canOpenWorkspace: Boolean(premiumResult.data),
    canMutate: false,
    tags: [],
  };
}

export async function loadStaffStudentCrmProfile(
  studentId: string,
): Promise<StudentCrmProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_student_crm_profile", {
    target_student: studentId,
  });

  if (error) {
    if (
      error.message.includes("Could not find the function") ||
      error.message.includes("does not exist")
    ) {
      return loadCrmProfileFallback(studentId);
    }
    if (error.message.includes("not authorized")) return null;
    throw new Error(error.message);
  }

  const rows = Array.isArray(data)
    ? (data as CrmProfileRpcRow[])
    : data
      ? [data as CrmProfileRpcRow]
      : [];
  if (!rows.length) return null;
  return mapCrmRow(rows[0]);
}

export async function loadStudentCrmTags(): Promise<StudentCrmTag[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("staff_list_student_crm_tags");
  if (error) return [];
  return (data ?? []) as StudentCrmTag[];
}
