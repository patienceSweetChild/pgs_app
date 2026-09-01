"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import {
  canViewStudent,
  requireStudentViewer,
  StudentAccessError,
} from "@/lib/auth/student-access";
import {
  canQueryStudentRegistry,
  loadStaffStudentRegistry,
} from "@/lib/operations/student-registry-server";
import { assertStaffPreviewWritable } from "@/lib/operations/staff-preview-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultDashboardContent,
  normalizeDashboardContent,
  type StudentDashboardContent,
} from "@/features/dashboard/content";
import {
  loadDashboardPreviewIdentity,
} from "@/lib/dashboard-content-server";
import type { DashboardPreviewIdentity } from "@/features/dashboard/content";

export type DashListFilter = "all" | "live" | "draft";

export type DashStudentRow = {
  studentId: string;
  fullName: string;
  pgsCode: string;
  pathwayLabel: string;
  published: boolean;
  hasDraft: boolean;
  updatedAt: string | null;
  canManage: boolean;
};

export type DashCatalogOption = {
  kind: "event" | "course";
  id: string;
  title: string;
  date: string;
  time: string;
  blurb: string;
  mode: string;
  startsAt: string | null;
  label: string;
};

export type DashEditorPayload = {
  studentId: string;
  fullName: string;
  identity: DashboardPreviewIdentity;
  content: StudentDashboardContent;
  liveContent: StudentDashboardContent | null;
  published: boolean;
  hasDraft: boolean;
  canManage: boolean;
  catalogOptions: DashCatalogOption[];
};

function staffError(error: unknown): never {
  if (error instanceof StudentAccessError) {
    throw new Error(error.message);
  }
  throw error;
}

async function requireDashListStaff() {
  const actor = await resolveActorContext();
  if (!actor.staff || !canQueryStudentRegistry(actor.staff)) {
    throw new Error("Forbidden");
  }
  return actor;
}

async function requireDashStaffViewer(
  studentId: string,
  access: "read" | "manage",
) {
  await assertStaffPreviewWritable().catch((error) => {
    if (access === "manage") throw error;
  });
  try {
    const viewer = await requireStudentViewer(studentId, access);
    if (viewer.kind === "student") {
      throw new Error("Staff access is required.");
    }
    return viewer;
  } catch (error) {
    staffError(error);
  }
}

function workspaceScalars(content: StudentDashboardContent) {
  return {
    pathway_label: content.pathway_label,
    universities_applied: content.overview.universities_applied,
    offers_received: content.overview.offers_received,
    visa_status: content.overview.visa_applied ? "applied" : "not_applied",
    tuition_receipt_uploaded: content.overview.tuition_receipt_uploaded,
    onboarding_percentage: content.onboarding_percentage,
    onboarding_checklist: content.onboarding_checklist,
    feedback_session_title: content.feedback_session_title,
    feedback_session_items: content.feedback_session_items,
    documents_tracker: Object.fromEntries(
      content.documents_tracker.map((row) => [
        row.label,
        { count: Number(row.count) || 0, is_red: row.danger },
      ]),
    ),
    currently_working_on: content.currently_working_on.map((item) => item.label),
    future_tasks: content.future_tasks.map((item) => item.label),
  };
}

function isMissingDashColumn(message: string) {
  return /dashboard_published|cms_draft|dashboard_content/i.test(message);
}

type ListedStudent = { id: string; fullName: string; pgsCode: string };

function mapListedStudent(row: Record<string, unknown>): ListedStudent {
  return {
    id: String(row.id ?? row.student_id),
    fullName: String(row.full_name ?? row.fullName ?? "Student"),
    pgsCode: String(row.pgs_code ?? row.pgsCode ?? "").slice(0, 12),
  };
}

async function listPremiumStudentsFromEntitlements(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  actorUserId: string,
  assignedOnly: boolean,
  search: string | null,
): Promise<ListedStudent[]> {
  let assignedIds: string[] | null = null;
  if (assignedOnly) {
    const { data: assignments } = await supabase
      .from("mentor_assignments")
      .select("student_id")
      .eq("mentor_id", actorUserId)
      .eq("status", "active");
    assignedIds = (assignments ?? []).map((row) => String(row.student_id));
    if (assignedIds.length === 0) return [];
  }

  let entitlements = supabase
    .from("premium_entitlements")
    .select("student_id")
    .eq("status", "active")
    .limit(100);
  if (assignedIds) entitlements = entitlements.in("student_id", assignedIds);
  const { data: premiumRows, error: premiumError } = await entitlements;
  if (premiumError) throw new Error(premiumError.message);
  const ids = [...new Set((premiumRows ?? []).map((row) => String(row.student_id)))];
  if (ids.length === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, pgs_code")
    .in("id", ids);
  if (profileError) throw new Error(profileError.message);

  const needle = (search ?? "").toLowerCase();
  return (profiles ?? [])
    .map((row) => mapListedStudent(row as Record<string, unknown>))
    .filter((row) => {
      if (!needle) return true;
      return (
        row.fullName.toLowerCase().includes(needle) ||
        row.pgsCode.toLowerCase().includes(needle)
      );
    });
}

async function loadDashCmsStatus(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: string[],
) {
  const full = await supabase
    .from("premium_workspace_profiles")
    .select(
      "student_id, pathway_label, dashboard_published, cms_draft, updated_at",
    )
    .in("student_id", ids);
  if (!full.error) return full.data ?? [];

  if (!isMissingDashColumn(full.error.message)) {
    throw new Error(full.error.message);
  }

  const basic = await supabase
    .from("premium_workspace_profiles")
    .select("student_id, pathway_label, updated_at")
    .in("student_id", ids);
  if (basic.error) return [];
  return basic.data ?? [];
}

export async function listDashboardStudents(input?: {
  q?: string;
  filter?: DashListFilter;
}): Promise<DashStudentRow[]> {
  const actor = await requireDashListStaff();
  const supabase = await createSupabaseServerClient();
  const search = (input?.q ?? "").trim().slice(0, 80) || null;
  const filter = input?.filter ?? "all";
  const assignedOnly =
    actor.staff!.roleKey === "mentor" &&
    !staffHasPermission(actor.staff!, "student_workspace.read_all");

  const registry = await loadStaffStudentRegistry(actor.staff!, {
    q: search,
    plan: "premium",
    mentor: null,
    studyLevel: null,
    stream: null,
    targetYear: null,
    stage: null,
    tag: null,
    completion: null,
    joined: null,
    sort: null,
    page: 1,
    view: null,
  });

  let students: ListedStudent[] = registry.rows
    .filter((row) => row.plan === "Premium")
    .map((row) => ({
      id: row.id,
      fullName: row.fullName,
      pgsCode: row.pgsCode,
    }));

  if (students.length === 0) {
    students = await listPremiumStudentsFromEntitlements(
      supabase,
      actor.userId!,
      assignedOnly,
      search,
    );
  }

  if (students.length === 0) return [];

  const ids = students.map((row) => row.id);
  const profiles = await loadDashCmsStatus(supabase, ids);
  const byId = new Map(
    profiles.map((row) => [String(row.student_id), row as Record<string, unknown>]),
  );

  const globalManage =
    staffHasPermission(actor.staff!, "student_workspace.manage_all") ||
    staffHasPermission(actor.staff!, "students.manage");
  const assignedManage = staffHasPermission(
    actor.staff!,
    "student_workspace.manage",
  );

  const rows: DashStudentRow[] = students.map((student) => {
    const profile = byId.get(student.id);
    return {
      studentId: student.id,
      fullName: student.fullName,
      pgsCode: student.pgsCode || student.id.slice(0, 8),
      pathwayLabel: String(profile?.pathway_label ?? ""),
      published: Boolean(profile?.dashboard_published),
      hasDraft: Boolean(profile?.cms_draft),
      updatedAt: profile?.updated_at ? String(profile.updated_at) : null,
      canManage: globalManage || assignedManage,
    };
  });

  if (filter === "live") return rows.filter((row) => row.published);
  if (filter === "draft") {
    return rows.filter((row) => row.hasDraft || !row.published);
  }
  return rows;
}

function chipDate(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "TBA", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "TBA", time: "" };
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date: `${month} ${d.getDate()}`, time };
}

export async function listDashboardCatalogOptions(): Promise<DashCatalogOption[]> {
  await requireDashListStaff();
  const supabase = await createSupabaseServerClient();
  const [eventsRes, coursesRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, starts_at, summary, mode, host, top_label")
      .eq("published", true)
      .eq("lifecycle_phase", "live")
      .order("starts_at", { ascending: true })
      .limit(80),
    supabase
      .from("courses")
      .select("id, title, starts_on, short_description, mode, duration")
      .eq("published", true)
      .eq("lifecycle_phase", "live")
      .order("display_order", { ascending: true })
      .limit(80),
  ]);

  const events = (eventsRes.data ?? []).map((row) => {
    const chip = chipDate(row.starts_at);
    const title = String(row.title ?? "Event");
    return {
      kind: "event" as const,
      id: String(row.id),
      title,
      date: chip.date,
      time: chip.time,
      blurb: String(row.summary || row.top_label || row.host || ""),
      mode: String(row.mode || "Online"),
      startsAt: row.starts_at ? String(row.starts_at) : null,
      label: `Event · ${title}${chip.date !== "TBA" ? ` (${chip.date})` : ""}`,
    };
  });

  const courses = (coursesRes.data ?? []).map((row) => {
    const chip = chipDate(row.starts_on);
    const title = String(row.title ?? "Course");
    return {
      kind: "course" as const,
      id: String(row.id),
      title,
      date: chip.date,
      time: chip.time,
      blurb: String(row.short_description || row.duration || ""),
      mode: String(row.mode || "Online"),
      startsAt: row.starts_on ? String(row.starts_on) : null,
      label: `Course · ${title}${chip.date !== "TBA" ? ` (${chip.date})` : ""}`,
    };
  });

  return [...events, ...courses];
}

export async function loadDashboardEditor(
  studentId: string,
): Promise<DashEditorPayload> {
  try {
    await requireDashStaffViewer(studentId, "read");
  } catch (error) {
    staffError(error);
  }

  const [identity, manageDecision, catalogOptions] = await Promise.all([
    loadDashboardPreviewIdentity(studentId),
    canViewStudent(studentId, "manage"),
    listDashboardCatalogOptions().catch(() => [] as DashCatalogOption[]),
  ]);
  if (!identity) throw new Error("Student not found.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("premium_workspace_profiles")
    .select(
      "dashboard_content, dashboard_published, cms_draft, pathway_label",
    )
    .eq("student_id", studentId)
    .maybeSingle();
  if (error && !isMissingDashColumn(error.message)) {
    throw new Error(error.message);
  }

  const live = data?.dashboard_published
    ? normalizeDashboardContent(data.dashboard_content)
    : null;
  const storedDraft = data?.cms_draft;
  const editorSource =
    storedDraft && typeof storedDraft === "object" && !Array.isArray(storedDraft)
      ? storedDraft
      : data?.dashboard_content &&
          typeof data.dashboard_content === "object" &&
          !Array.isArray(data.dashboard_content) &&
          Object.keys(data.dashboard_content as object).length > 0
        ? data.dashboard_content
        : defaultDashboardContent();

  return {
    studentId,
    fullName: identity.name,
    identity,
    content: normalizeDashboardContent(editorSource),
    liveContent: live,
    published: Boolean(data?.dashboard_published),
    hasDraft: Boolean(storedDraft),
    canManage: manageDecision.allowed && manageDecision.actor.kind !== "student",
    catalogOptions,
  };
}

export async function saveDashboardDoc(
  studentId: string,
  content: StudentDashboardContent,
  mode: "draft" | "publish",
) {
  const viewer = await requireDashStaffViewer(studentId, "manage");
  const next = normalizeDashboardContent(content);
  const supabase = await createSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("premium_workspace_profiles")
    .select("dashboard_published")
    .eq("student_id", studentId)
    .maybeSingle();
  if (existingError && !isMissingDashColumn(existingError.message)) {
    throw new Error(existingError.message);
  }

  const currentlyPublished = Boolean(existing?.dashboard_published);

  if (mode === "draft" && currentlyPublished) {
    const { error } = await supabase
      .from("premium_workspace_profiles")
      .update({
        cms_draft: next,
        updated_by: viewer.userId,
      })
      .eq("student_id", studentId);
    if (error) throw new Error(error.message);
  } else {
    const row = {
      student_id: studentId,
      ...workspaceScalars(next),
      dashboard_content: next,
      dashboard_published: mode === "publish",
      cms_draft: null,
      updated_by: viewer.userId,
    };
    const { error } = await supabase
      .from("premium_workspace_profiles")
      .upsert(row, { onConflict: "student_id" });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dash");
  revalidatePath(`/dash/${studentId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/ops/students/${studentId}`);

  return {
    published: mode === "publish" || currentlyPublished,
    hasDraft: mode === "draft" && currentlyPublished,
  };
}

export async function discardDashboardDraft(studentId: string) {
  await requireDashStaffViewer(studentId, "manage");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("premium_workspace_profiles")
    .update({ cms_draft: null })
    .eq("student_id", studentId);
  if (error) throw new Error(error.message);
  revalidatePath("/dash");
  revalidatePath(`/dash/${studentId}`);
}
