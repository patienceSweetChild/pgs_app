import { redirect } from "next/navigation";
import Link from "next/link";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "@/features/admin/admin.css";

export default async function PortalHomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pgs-portal">
        <div className="pgs-portal__content">
          <h1>Guardian portal</h1>
          <p>Supabase is not configured yet.</p>
        </div>
      </div>
    );
  }

  const actor = await resolveActorContext();
  if (!actor.userId) {
    redirect("/login?surface=guardian&redirect=/portal");
  }
  if (actor.isStaff) {
    redirect("/admin");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.rpc("accept_pending_guardian_relationships");
  const { data: students, error } = await supabase.rpc("guardian_list_students");

  if (error) {
    return (
      <div className="pgs-portal">
        <div className="pgs-portal__bar">
          <strong>Guardian portal</strong>
          <span>{actor.email}</span>
        </div>
        <div className="pgs-portal__content">
          <p role="alert">{error.message}</p>
        </div>
      </div>
    );
  }

  const list = (students ?? []) as Array<{
    relationship_id: string;
    student_id: string;
    full_name: string;
    relationship_label: string;
    is_premium: boolean;
  }>;

  if (list.length === 1) {
    redirect(`/portal/students/${list[0].student_id}`);
  }

  return (
    <div className="pgs-portal">
      <div className="pgs-portal__bar">
        <strong>Guardian portal</strong>
        <span>{actor.email}</span>
      </div>
      <div className="pgs-portal__content">
        <h1>Your students</h1>
        {list.length === 0 ? (
          <div className="pgs-portal__card">
            No active guardian relationships yet. Accept an invite email, or ask
            staff to invite you.
          </div>
        ) : (
          list.map((s) => (
            <Link
              key={s.relationship_id}
              href={`/portal/students/${s.student_id}`}
              className="pgs-portal__card"
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <strong>{s.full_name || "Student"}</strong>
              <div>
                {s.relationship_label}
                {s.is_premium ? " · Premium" : ""}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
