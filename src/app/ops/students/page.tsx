import { StudentRegistry } from "@/features/operations/components/StudentRegistry";
import { loadMentorOptions, loadStudentRegistry } from "@/lib/operations/student-registry-server";

export default async function OpsStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const plan = typeof params.plan === "string" ? params.plan : "all";
  const mentor = typeof params.mentor === "string" ? params.mentor : "all";
  const stage = typeof params.stage === "string" ? params.stage : "all";
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;

  const [rows, mentors] = await Promise.all([
    loadStudentRegistry({ search: q, plan, mentor, crmStage: stage, page }),
    loadMentorOptions().catch(() => []),
  ]);

  return (
    <div className="pgs-ops__detail-page">
      <StudentRegistry
        rows={rows}
        mentors={mentors}
        filters={{ q, plan, mentor, stage, page }}
      />
    </div>
  );
}
