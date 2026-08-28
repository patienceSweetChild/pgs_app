import { redirect } from "next/navigation";
import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStaffPreviewContext } from "@/lib/operations/staff-preview-server";
import { OpsShell } from "@/features/operations/OpsShell";

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pgs-ops__content">
        <h1>Operations</h1>
        <p>Supabase is not configured.</p>
      </div>
    );
  }

  const actor = await resolveActorContext();
  if (!actor.userId || !actor.isStaff || !actor.staff) {
    redirect("/login?surface=operations&redirect=/ops");
  }

  if (!staffHasPermission(actor.staff, "overview.read")) {
    redirect("/");
  }

  const preview = await getStaffPreviewContext(actor.staff);
  const showCmsLink =
    staffHasPermission(actor.staff, "catalog.manage") ||
    staffHasPermission(actor.staff, "cms.publish") ||
    staffHasPermission(actor.staff, "content.manage");

  return (
    <OpsShell
      staffName={actor.staff.displayName || actor.email || "Staff"}
      roleKey={actor.staff.roleKey}
      permissions={actor.staff.permissions}
      showCmsLink={showCmsLink}
      preview={
        preview
          ? { mode: preview.mode, targetName: preview.targetName }
          : null
      }
    >
      {children}
    </OpsShell>
  );
}
