import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  requireStudentViewer,
  StudentAccessError,
  type StudentViewerActor,
} from "@/lib/auth/student-access";

export type PremiumStatus = "active" | "revoked" | "expired" | "none";
export type WorkspaceActor = StudentViewerActor;
export { StudentAccessError as WorkspaceAccessError };

export type BoardColumn = {
  id: string;
  key: string;
  title: string;
  sort_order: number;
};
export type StudentTask = {
  id: string;
  column_id: string;
  title: string;
  details: string;
  sort_order: number;
  due_at: string | null;
  created_at?: string;
  updated_at?: string;
};
export type DocumentRequirement = {
  id: string;
  document_type: string;
  requirement_kind: string;
  status: string;
  instructions: string;
  sort_order: number;
  student_documents?: StudentDocument[];
};
export type StudentDocument = {
  id: string;
  requirement_id: string;
  original_filename: string;
  mime_type: string;
  byte_size: number;
  version: number;
  qc_status: string;
  scan_status: string;
  uploaded_at: string;
  superseded_at?: string | null;
  archived_at?: string | null;
  purged_at?: string | null;
};
export type StaffAlert = {
  id: string;
  alert_text: string;
  severity: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
export type PremiumWorkspaceProfile = {
  pathway_label: string;
  intake_label: string;
  universities_applied: number;
  offers_received: number;
  visa_status: string;
  tuition_receipt_uploaded: boolean | null;
  onboarding_percentage: number | null;
};

export type PremiumWorkspace = {
  studentId: string;
  profile: { full_name: string; study_level: string | null } | null;
  premiumProfile: PremiumWorkspaceProfile | null;
  columns: BoardColumn[];
  tasks: StudentTask[];
  alerts: StaffAlert[];
  requirements: DocumentRequirement[];
};

const DEFAULT_BOARD_COLUMNS = [
  { key: "journey_map", title: "Journey Map", sort_order: 10 },
  { key: "in_progress", title: "In Progress", sort_order: 20 },
  { key: "draft_phase", title: "Draft Phase", sort_order: 30 },
  { key: "completed", title: "Completed", sort_order: 40 },
] as const;

export async function requirePremiumActor(
  studentId: string,
  access: "read" | "manage" = "read",
): Promise<WorkspaceActor> {
  return requireStudentViewer(studentId, access);
}

async function ensureDefaultBoard(
  client: Pick<SupabaseClient, "from">,
  studentId: string,
  actorId: string,
) {
  const { data: existing } = await client
    .from("student_board_columns")
    .select("id")
    .eq("student_id", studentId)
    .limit(1);
  if (existing?.length) return;

  await client.from("student_board_columns").insert(
    DEFAULT_BOARD_COLUMNS.map((column) => ({
      student_id: studentId,
      key: column.key,
      title: column.title,
      sort_order: column.sort_order,
      created_by: actorId,
    })),
  );
}

export async function loadPremiumWorkspaceWithClient(
  client: Pick<SupabaseClient, "from">,
  studentId: string,
  actorId: string,
): Promise<PremiumWorkspace> {
  await ensureDefaultBoard(client, studentId, actorId);

  const [profile, premiumProfile, columns, tasks, alerts, requirements] =
    await Promise.all([
      client
        .from("profiles")
        .select("full_name, study_level")
        .eq("id", studentId)
        .maybeSingle(),
      client
        .from("premium_workspace_profiles")
        .select(
          "pathway_label,intake_label,universities_applied,offers_received,visa_status,tuition_receipt_uploaded,onboarding_percentage",
        )
        .eq("student_id", studentId)
        .maybeSingle(),
      client
        .from("student_board_columns")
        .select("id,key,title,sort_order")
        .eq("student_id", studentId)
        .order("sort_order"),
      client
        .from("student_tasks")
        .select(
          "id,column_id,title,details,sort_order,due_at,created_at,updated_at",
        )
        .eq("student_id", studentId)
        .order("sort_order"),
      client
        .from("student_alerts")
        .select(
          "id,alert_text,severity,active,sort_order,created_at,updated_at",
        )
        .eq("student_id", studentId)
        .order("sort_order"),
      client
        .from("student_document_requirements")
        .select(
          "id,document_type,requirement_kind,status,instructions,sort_order,student_documents(id,requirement_id,original_filename,mime_type,byte_size,version,qc_status,scan_status,uploaded_at,superseded_at,archived_at,purged_at)",
        )
        .eq("student_id", studentId)
        .order("sort_order"),
    ]);

  return {
    studentId,
    profile: profile.data,
    premiumProfile: premiumProfile.data as PremiumWorkspaceProfile | null,
    columns: columns.data ?? [],
    tasks: tasks.data ?? [],
    alerts: (alerts.data ?? []) as StaffAlert[],
    requirements: (requirements.data ?? []) as DocumentRequirement[],
  };
}

export async function loadPremiumWorkspace(
  studentId: string,
): Promise<PremiumWorkspace> {
  const actor = await requireStudentViewer(studentId, "read");
  const client = await createSupabaseServerClient();
  return loadPremiumWorkspaceWithClient(client, studentId, actor.userId);
}

export function cleanWorkspaceText(value: unknown, max: number): string {
  if (typeof value !== "string") throw new Error("Enter a valid value.");
  const result = value.trim().replace(/\s+/g, " ");
  if (!result || result.length > max) throw new Error("Enter a valid value.");
  return result;
}
