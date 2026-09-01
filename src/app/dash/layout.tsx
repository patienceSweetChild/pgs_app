import { redirect } from "next/navigation";
import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DashShell } from "@/features/dash-cms/DashShell";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <DashShell>
        <div className="pgs-admin__content">
          <h1>Dashboard CMS</h1>
          <p>Supabase is not configured.</p>
        </div>
      </DashShell>
    );
  }

  const actor = await resolveActorContext();
  if (!actor.userId || !actor.isStaff || !actor.staff) {
    redirect("/login?surface=operations&redirect=/dash");
  }

  if (
    !staffHasPermission(actor.staff, "students.read") &&
    !staffHasPermission(actor.staff, "student_workspace.read") &&
    !staffHasPermission(actor.staff, "student_workspace.read_all")
  ) {
    redirect("/");
  }

  return <DashShell>{children}</DashShell>;
}
