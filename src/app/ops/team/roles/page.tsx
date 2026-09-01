import Link from "next/link";
import { opsHref } from "@pgs/shared";
import { RoleMatrixEditor } from "@/features/operations/components/RoleMatrixEditor";
import { loadRoleMatrix } from "@/lib/operations/role-matrix-server";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { redirect } from "next/navigation";
import { redirectMentorPreviewAwayFromPrivilegedPages } from "@/lib/operations/staff-preview-server";

export default async function OpsRolesPage() {
  await redirectMentorPreviewAwayFromPrivilegedPages();
  const actor = await resolveActorContext();
  if (actor.staff?.roleKey !== "super_admin") redirect(opsHref("/ops/team"));
  const roles = await loadRoleMatrix();
  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Team</p>
          <h1>Permission matrix</h1>
          <p className="pgs-ops__page-meta">
            Super Admin controls what each role can view, create, edit, or delete. Viewer, Guardian,
            and Student start with the same student-facing visibility.
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          <Link href={opsHref("/ops/team")}>Back to Team</Link>
        </div>
      </div>
      <RoleMatrixEditor initialRoles={roles} />
    </div>
  );
}
