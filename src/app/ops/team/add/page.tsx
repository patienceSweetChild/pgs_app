import Link from "next/link";
import { StaffAddForm } from "@/features/operations/components/StaffAddForm";
import { requireStaffPermission } from "@/lib/auth/student-access";
import { redirectMentorPreviewAwayFromPrivilegedPages } from "@/lib/operations/staff-preview-server";

export default async function OpsTeamAddPage() {
  await redirectMentorPreviewAwayFromPrivilegedPages();
  await requireStaffPermission("roles.manage");
  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Team</p>
          <h1>Invite or add staff</h1>
          <p className="pgs-ops__page-meta">
            Invite reuses an existing Auth identity. Add new staff creates the account now. Student
            PGS IDs are never converted.
          </p>
        </div>
        <div className="pgs-ops__header-actions">
          <Link href="/ops/team">Back to Team</Link>
        </div>
      </div>
      <StaffAddForm />
    </div>
  );
}
