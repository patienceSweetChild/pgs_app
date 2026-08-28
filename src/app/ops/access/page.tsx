import { AccessControlsPanel } from "@/features/operations/components/AccessControlsPanel";
import { loadMentorOptions, loadStudentRegistry } from "@/lib/operations/student-registry-server";

export default async function OpsAccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : "premium";

  const [rows, mentors] = await Promise.all([
    loadStudentRegistry({ plan, pageSize: 50 }),
    loadMentorOptions(),
  ]);

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Access control</p>
          <h1>Access</h1>
          <p className="pgs-ops__page-meta">
            Grant premium access and assign mentors to control student dashboard access.
          </p>
        </div>
      </div>
      <AccessControlsPanel rows={rows} mentors={mentors} />
    </div>
  );
}
