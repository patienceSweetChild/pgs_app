import Link from "next/link";
import { opsHref } from "@pgs/shared";
import { StudentRegistry } from "@/features/operations/components/StudentRegistry";
import {
  canQueryStudentRegistry,
  isMentorScopedRegistry,
  loadMentorOptions,
  loadRegistrySavedViews,
  loadStaffStudentRegistry,
  registryQueryCapabilities,
  registryShowsMentorColumn,
  registryShowsOpenColumn,
  resolveRegistryQueryFromRequest,
} from "@/lib/operations/student-registry-server";
import { loadStudentCrmTags } from "@/lib/operations/student-crm-server";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import {
  canAssignStudents,
  canStartStaffPreview,
  getStaffPreviewContext,
} from "@/lib/operations/staff-preview-server";

export default async function OpsStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await resolveActorContext();
  if (!actor.staff) return null;
  const preview = await getStaffPreviewContext(actor.staff);
  const raw = await searchParams;
  const mentorPreview = preview?.mode === "mentor";
  const mentorScoped = isMentorScopedRegistry(actor.staff) || mentorPreview;
  const capabilities = mentorPreview ? { allowOrgFilters: false } : registryQueryCapabilities(actor.staff);
  const [savedViews, mentors, tags] = await Promise.all([
    loadRegistrySavedViews(actor.staff),
    loadMentorOptions().catch(() => []),
    loadStudentCrmTags().catch(() => []),
  ]);
  let query = resolveRegistryQueryFromRequest(raw, capabilities, savedViews);
  if (mentorPreview && preview) query = { ...query, mentor: preview.targetId, joined: null };
  const result = canQueryStudentRegistry(actor.staff)
    ? await loadStaffStudentRegistry(actor.staff, query)
    : { rows: [], totalCount: 0, page: query.page, pageSize: 25, error: false };

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Students</p>
          <h1>{mentorScoped ? "My Students" : "Student Registry"}</h1>
          <p className="pgs-ops__page-meta">
            {mentorScoped
              ? "Only students currently assigned to you are shown."
              : "Search the authorized student registry and open permitted workspaces."}
          </p>
        </div>
        {staffHasPermission(actor.staff, "premium.manage") && !preview ? (
          <div className="pgs-ops__header-actions">
            <Link className="is-primary" href={opsHref("/ops/access")}>
              Premium & mentor controls
            </Link>
          </div>
        ) : null}
      </div>
      <StudentRegistry
        result={result}
        mentors={mentors}
        tags={tags}
        query={query}
        savedViews={savedViews}
        allowOrgFilters={capabilities.allowOrgFilters}
        showMentor={registryShowsMentorColumn(actor.staff) && !mentorPreview}
        showOpen={registryShowsOpenColumn(actor.staff)}
        canManageAssignments={canAssignStudents(actor.staff, preview)}
        canPreviewStudent={canStartStaffPreview(actor.staff, preview)}
      />
    </div>
  );
}
