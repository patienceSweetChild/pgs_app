import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  normalizeDashboardContent,
  type DashboardPreviewIdentity,
  type StudentDashboardContent,
} from "@/features/dashboard/content";
import { publicObjectUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";

export type { DashboardPreviewIdentity };

export async function loadPublishedDashboardContent(
  studentId: string,
): Promise<StudentDashboardContent | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("premium_workspace_profiles")
    .select("dashboard_content, dashboard_published")
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.dashboard_published) return null;
  return normalizeDashboardContent(data.dashboard_content);
}

export async function loadDashboardPreviewIdentity(
  studentId: string,
): Promise<DashboardPreviewIdentity | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_path, pgs_code, updated_at")
    .eq("id", studentId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const avatar =
    publicObjectUrl(
      supabase,
      STORAGE_BUCKETS.avatars,
      data.avatar_path as string | null,
    ) ?? "/assets/img/student-avatar.png";
  const bust = data.updated_at
    ? `${avatar.includes("?") ? "&" : "?"}v=${encodeURIComponent(String(data.updated_at))}`
    : "";

  return {
    name: String(data.full_name ?? "").trim() || "Student",
    handle: "",
    id: String(data.pgs_code ?? ""),
    avatar: `${avatar}${bust}`,
  };
}
