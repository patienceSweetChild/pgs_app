"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { opsStudentHref } from "@pgs/shared";
import { useState, useTransition } from "react";
import { assignMentorAction } from "@/features/operations/actions";
import {
  omitRegistryFilter,
  registryHref,
  registryJoinYearOptions,
  type NormalizedRegistryQuery,
  type RegistryMentorOption,
  type RegistrySavedView,
  type StudentRegistryResult,
} from "@/lib/operations/student-registry";
import { CRM_STAGE_LABELS } from "@/lib/operations/student-crm";
import type { StudentCrmTag } from "@/lib/operations/student-crm";

export function StudentRegistry({
  result,
  mentors,
  tags,
  query,
  savedViews,
  allowOrgFilters,
  showMentor,
  showOpen,
  canManageAssignments,
  canPreviewStudent,
}: {
  result: StudentRegistryResult;
  mentors: RegistryMentorOption[];
  tags: StudentCrmTag[];
  query: NormalizedRegistryQuery;
  savedViews: RegistrySavedView[];
  allowOrgFilters: boolean;
  showMentor: boolean;
  showOpen: boolean;
  canManageAssignments: boolean;
  canPreviewStudent: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [viewName, setViewName] = useState("");

  const chips: Array<{ key: keyof NormalizedRegistryQuery; label: string }> = [];
  if (query.q) chips.push({ key: "q", label: `Search: ${query.q}` });
  if (query.plan) chips.push({ key: "plan", label: query.plan });
  if (query.mentor) chips.push({ key: "mentor", label: `Mentor: ${query.mentor}` });
  if (query.stage) chips.push({ key: "stage", label: query.stage });
  if (query.stream) chips.push({ key: "stream", label: query.stream });

  return (
    <div>
      <form
        className="pgs-ops__filters"
        onSubmit={(event) => {
          event.preventDefault();
          const fd = new FormData(event.currentTarget);
          router.push(
            registryHref({
              ...query,
              q: String(fd.get("q") ?? "").trim() || null,
              plan: (String(fd.get("plan") ?? "") as NormalizedRegistryQuery["plan"]) || null,
              mentor: String(fd.get("mentor") ?? "") || null,
              stage: (String(fd.get("stage") ?? "") as NormalizedRegistryQuery["stage"]) || null,
              stream: (String(fd.get("stream") ?? "") as NormalizedRegistryQuery["stream"]) || null,
              studyLevel:
                (String(fd.get("study_level") ?? "") as NormalizedRegistryQuery["studyLevel"]) ||
                null,
              joined: String(fd.get("joined") ?? "") || null,
              page: 1,
              view: null,
            }),
          );
        }}
      >
        <input name="q" defaultValue={query.q ?? ""} placeholder="Search name or ID (20261101)" />
        <select name="plan" defaultValue={query.plan ?? ""}>
          <option value="">All plans</option>
          <option value="premium">Premium</option>
          <option value="standard">Standard</option>
        </select>
        {allowOrgFilters ? (
          <select name="mentor" defaultValue={query.mentor ?? ""}>
            <option value="">All mentors</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.displayName}
              </option>
            ))}
          </select>
        ) : null}
        <select name="stage" defaultValue={query.stage ?? ""}>
          <option value="">All stages</option>
          {Object.entries(CRM_STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="stream" defaultValue={query.stream ?? ""}>
          <option value="">All streams</option>
          <option value="USMLE">USMLE</option>
          <option value="PLAB">PLAB</option>
          <option value="AMC">AMC</option>
          <option value="STEM">STEM</option>
          <option value="MBA">MBA</option>
          <option value="Other">Other</option>
        </select>
        {allowOrgFilters ? (
          <select name="joined" defaultValue={query.joined ?? ""}>
            <option value="">Joined any time</option>
            <option value="this_month">This month</option>
            {registryJoinYearOptions().map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        ) : null}
        {tags.length ? (
          <select name="tag" defaultValue={query.tag ?? ""}>
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        ) : null}
        <button type="submit" className="pgs-ops__btn">
          Filter
        </button>
      </form>

      {chips.length ? (
        <div className="pgs-ops__chip-row">
          {chips.map((chip) => (
            <button
              key={String(chip.key)}
              type="button"
              className="pgs-ops__chip"
              onClick={() => router.push(registryHref(omitRegistryFilter(query, chip.key)))}
            >
              {chip.label} ×
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="pgs-ops__filters"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            await fetch("/api/ops/registry-views", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name: viewName, query }),
            });
            setViewName("");
            router.refresh();
          });
        }}
      >
        <input
          value={viewName}
          onChange={(event) => setViewName(event.target.value)}
          placeholder="Save current view"
        />
        <button className="pgs-ops__btn pgs-ops__btn--ghost" type="submit" disabled={!viewName.trim()}>
          Save view
        </button>
        {savedViews.map((view) => (
          <Link key={view.id} href={registryHref({ ...view.query, view: view.id, page: 1 })}>
            {view.name}
          </Link>
        ))}
      </form>

      {message ? <p className="pgs-ops__status">{message}</p> : null}

      <div className="pgs-ops__table-wrap">
        <table>
          <thead>
            <tr>
              <th>PGS ID</th>
              <th>Student</th>
              <th>Level</th>
              <th>Stream</th>
              <th>Stage</th>
              <th>Plan</th>
              {showMentor ? <th>Mentor</th> : null}
              <th>Joined</th>
              {showOpen ? <th>Open</th> : null}
              <th />
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 ? (
              <tr>
                <td colSpan={10}>{result.error ? "The registry could not be loaded." : "No students found."}</td>
              </tr>
            ) : (
              result.rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <code className="pgs-ops__code">{row.pgsCode}</code>
                  </td>
                  <td>
                    <Link href={opsStudentHref(row.id)}>{row.fullName}</Link>
                  </td>
                  <td>{row.studyLevel || "—"}</td>
                  <td>{row.stream || "—"}</td>
                  <td>{CRM_STAGE_LABELS[row.stage]}</td>
                  <td>
                    <span className={row.plan === "Premium" ? "pgs-ops__badge pgs-ops__badge--accent" : "pgs-ops__badge"}>
                      {row.plan}
                    </span>
                  </td>
                  {showMentor ? <td>{row.mentorName}</td> : null}
                  <td>{row.joinedAt}</td>
                  {showOpen ? <td>{row.canOpenWorkspace ? "Yes" : "No"}</td> : null}
                  <td>
                    <div className="pgs-ops__inline-actions">
                      <Link href={opsStudentHref(row.id)}>Open</Link>
                      {canManageAssignments && mentors.length ? (
                        <select
                          defaultValue={row.mentorId ?? ""}
                          disabled={pending}
                          onChange={(event) => {
                            const mentorId = event.target.value;
                            if (!mentorId) return;
                            startTransition(async () => {
                              try {
                                await assignMentorAction(row.id, mentorId);
                                setMessage("Mentor assigned.");
                                router.refresh();
                              } catch (err) {
                                setMessage(err instanceof Error ? err.message : "Failed");
                              }
                            });
                          }}
                        >
                          <option value="">Assign mentor</option>
                          {mentors.map((mentor) => (
                            <option key={mentor.id} value={mentor.id}>
                              {mentor.displayName}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      {canPreviewStudent ? (
                        <form action="/api/ops/preview" method="post">
                          <input type="hidden" name="action" value="set" />
                          <input type="hidden" name="mode" value="student" />
                          <input type="hidden" name="targetId" value={row.id} />
                          <input type="hidden" name="targetName" value={row.fullName} />
                          <button type="submit" className="pgs-ops__btn pgs-ops__btn--ghost">
                            View as
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="pgs-ops__page-meta">{result.totalCount} total</p>
    </div>
  );
}
