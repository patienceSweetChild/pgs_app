import { PremiumAppsClient } from "@/features/admin/PremiumAppsClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPremiumPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("premium_applications")
    .select(
      "id, status, plan_code, created_at, student_id, profiles(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <PremiumAppsClient
      rows={(data ?? []).map((row) => {
        const profile = row.profiles as
          | { full_name: string }
          | { full_name: string }[]
          | null;
        const name = Array.isArray(profile)
          ? profile[0]?.full_name
          : profile?.full_name;
        return {
          id: row.id,
          status: row.status,
          plan_code: row.plan_code,
          created_at: row.created_at,
          student_id: row.student_id,
          full_name: name || "—",
        };
      })}
    />
  );
}
