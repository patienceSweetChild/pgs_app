import { opsHref } from "@pgs/shared";
import "server-only";

import { staffHasPermission, type StaffContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { convertStoredPgsCodeToDisplay } from "@/lib/operations/student-registry";

export const STAFF_SEARCH_MIN_LENGTH = 2;

export type StaffSearchGroup = {
  domain: string;
  label: string;
  results: Array<{ id: string; label: string; description: string; href: string }>;
};

export async function searchOperations(
  staff: StaffContext,
  query: string,
): Promise<StaffSearchGroup[]> {
  const needle = query.trim().slice(0, 80);
  if (needle.length < STAFF_SEARCH_MIN_LENGTH) return [];
  const supabase = await createSupabaseServerClient();
  const groups: StaffSearchGroup[] = [];
  const like = `%${needle.replace(/[%_]/g, "")}%`;

  if (
    staffHasPermission(staff, "students.read") ||
    staffHasPermission(staff, "student_workspace.read") ||
    staffHasPermission(staff, "student_workspace.read_all")
  ) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, pgs_code")
      .or(`full_name.ilike.${like},pgs_code.ilike.${like}`)
      .limit(8);
    if (data?.length) {
      groups.push({
        domain: "students",
        label: "Students",
        results: data.map((row) => ({
          id: row.id,
          label: row.full_name || "Student",
          description: convertStoredPgsCodeToDisplay(row.pgs_code) || "",
          href: opsHref(`/ops/students/${row.id}`),
        })),
      });
    }
  }

  if (staffHasPermission(staff, "staff.read")) {
    const { data } = await supabase
      .from("staff_profiles")
      .select("user_id, display_name, role_key")
      .ilike("display_name", like)
      .limit(8);
    if (data?.length) {
      groups.push({
        domain: "staff",
        label: "Staff",
        results: data.map((row) => ({
          id: row.user_id,
          label: row.display_name || "Staff",
          description: row.role_key,
          href: opsHref(`/ops/team/${row.user_id}`),
        })),
      });
    }
  }

  if (staffHasPermission(staff, "staff_targets.read")) {
    const { data } = await supabase
      .from("staff_targets")
      .select("id, title, status")
      .ilike("title", like)
      .limit(8);
    if (data?.length) {
      groups.push({
        domain: "work",
        label: "Work",
        results: data.map((row) => ({
          id: row.id,
          label: row.title,
          description: row.status,
          href: `${opsHref("/ops/work")}?target=${row.id}`,
        })),
      });
    }
  }

  return groups;
}
