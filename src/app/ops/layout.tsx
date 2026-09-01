import { redirect } from "next/navigation";
import { loginPathForSurface, opsHref } from "@pgs/shared";
import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStaffPreviewContext } from "@/lib/operations/staff-preview-server";
import { OpsShell } from "@/features/operations/OpsShell";
import { loadOperationsNotificationUnreadCount } from "@/lib/operations/notifications-server";

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
    redirect(loginPathForSurface("ops", opsHref("/ops")));
  }

  if (
    !staffHasPermission(actor.staff, "overview.read") &&
    !staffHasPermission(actor.staff, "students.read") &&
    !staffHasPermission(actor.staff, "student_workspace.read") &&
    !staffHasPermission(actor.staff, "student_workspace.read_all")
  ) {
    redirect("/");
  }

  const [preview, notificationUnreadCount] = await Promise.all([
    getStaffPreviewContext(actor.staff),
    loadOperationsNotificationUnreadCount().catch(() => 0),
  ]);
  const showCmsLink =
    staffHasPermission(actor.staff, "catalog.manage") ||
    staffHasPermission(actor.staff, "cms.publish") ||
    staffHasPermission(actor.staff, "content.manage");
  const showDashLink =
    staffHasPermission(actor.staff, "students.read") ||
    staffHasPermission(actor.staff, "student_workspace.read") ||
    staffHasPermission(actor.staff, "student_workspace.read_all");

  return (
    <OpsShell
      staffName={actor.staff.displayName || actor.email || "Staff"}
      roleKey={actor.staff.roleKey}
      permissions={actor.staff.permissions}
      showCmsLink={showCmsLink}
      showDashLink={showDashLink}
      notificationUnreadCount={notificationUnreadCount}
      aiEnabled={staffHasPermission(actor.staff, "ai.analyze")}
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
