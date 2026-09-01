import { redirect } from "next/navigation";
import { adminHref, loginPathForSurface } from "@pgs/shared";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminShell } from "@/features/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pgs-admin__content">
        <h1>Admin</h1>
        <p>
          Supabase is not configured. Copy{" "}
          <code>.env.local.example</code> to <code>.env.local</code>, then run{" "}
          <code>supabase link</code> and <code>supabase db push</code>.
        </p>
      </div>
    );
  }

  const actor = await resolveActorContext();
  if (!actor.userId || !actor.isStaff || !actor.staff) {
    redirect(loginPathForSurface("admin", adminHref("/admin")));
  }

  if (!staffHasPermission(actor.staff, "overview.read")) {
    const canUseCms =
      staffHasPermission(actor.staff, "content.manage") ||
      staffHasPermission(actor.staff, "catalog.manage") ||
      staffHasPermission(actor.staff, "cms.publish");
    if (!canUseCms) {
      redirect("/login?error=forbidden");
    }
  }

  return (
    <AdminShell
      staffName={actor.staff.displayName || actor.email || "Admin"}
      roleKey={actor.staff.roleKey}
      permissions={actor.staff.permissions}
    >
      {children}
    </AdminShell>
  );
}
