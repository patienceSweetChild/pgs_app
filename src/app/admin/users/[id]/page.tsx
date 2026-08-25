import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserDetailClient } from "@/features/admin/UserDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: user }, { data: mentors }, { data: guardians }, { data: premium }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("staff_profiles")
        .select("user_id, display_name, role_key")
        .eq("role_key", "mentor")
        .eq("status", "active"),
      supabase
        .from("student_guardian_relationships")
        .select("id, guardian_email, relationship_label, status")
        .eq("student_id", id)
        .order("created_at", { ascending: false }),
      supabase.rpc("student_has_active_premium", { uid: id }),
    ]);

  if (!user) notFound();

  return (
    <UserDetailClient
      user={user}
      mentors={mentors ?? []}
      guardians={guardians ?? []}
      isPremium={Boolean(premium)}
    />
  );
}
