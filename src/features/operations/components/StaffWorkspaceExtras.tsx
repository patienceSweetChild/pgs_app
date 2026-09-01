"use client";

import { useState } from "react";
import Link from "next/link";
import { cmsStudentHref } from "@pgs/shared";
import type {
  CounselorNote,
  PremiumWorkspaceProfile,
  UniversitySelection,
  WorkspaceComment,
  WorkspaceReview,
} from "@/lib/premium-workspace";
import { requestStaffWorkspace } from "@/features/operations/staff-workspace-request";

export function StaffWorkspaceExtras({
  studentId,
  canManage,
  premiumProfile,
  comments,
  notes,
  reviews,
  universities,
  universityOptions,
}: {
  studentId: string;
  canManage: boolean;
  premiumProfile: PremiumWorkspaceProfile | null;
  comments: WorkspaceComment[];
  notes: CounselorNote[];
  reviews: WorkspaceReview[];
  universities: UniversitySelection[];
  universityOptions: Array<{ id: number; name: string }>;
}) {
  const [message, setMessage] = useState("");

  async function save(resource: string, method: "POST" | "PATCH", values: Record<string, unknown>) {
    setMessage("Saving…");
    const error = await requestStaffWorkspace(studentId, resource, method, values);
    if (error) setMessage(error);
  }

  return (
    <>
      <section className="pgs-ops__detail-panel">
        <h2>Dashboard data</h2>
        {message ? <p className="pgs-ops__status">{message}</p> : null}
        <p className="pgs-ops__note">
          Live published dashboard values. Visual edits, drafts, and publish live
          in the Dashboard CMS.
        </p>
        <dl className="pgs-ops__facts">
          <div>
            <dt>Pathway</dt>
            <dd>{premiumProfile?.pathway_label || "Not set"}</dd>
          </div>
          <div>
            <dt>Applied</dt>
            <dd>{premiumProfile?.universities_applied ?? 0}</dd>
          </div>
          <div>
            <dt>Offers</dt>
            <dd>{premiumProfile?.offers_received ?? 0}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              {premiumProfile?.dashboard_published
                ? "Live"
                : "Unpublished"}
              {premiumProfile?.cms_draft ? " · Draft pending" : ""}
            </dd>
          </div>
        </dl>
        {canManage ? (
          <p>
            <Link className="pgs-ops__btn" href={cmsStudentHref(studentId)}>
              Edit in Dashboard CMS
            </Link>
          </p>
        ) : null}
      </section>

      <section className="pgs-ops__detail-panel">
        <h2>University shortlist</h2>
        <ul className="pgs-ops__list">
          {universities.map((row) => (
            <li key={row.id} className="pgs-ops__list-row">
              <span>{row.universities?.name || "University"}</span>
              <span className="pgs-ops__badge">{row.stage}</span>
            </li>
          ))}
        </ul>
        {canManage ? (
          <form
            className="pgs-ops__form-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              void save("universities", "POST", {
                university_id: Number(data.get("university_id")),
                stage: data.get("stage"),
              });
            }}
          >
            <label>
              University
              <select name="university_id">
                {universityOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="pgs-ops__btn" type="submit">
              Add
            </button>
          </form>
        ) : null}
      </section>

      <section className="pgs-ops__detail-panel">
        <h2>Comments</h2>
        <ul className="pgs-ops__list">
          {comments.map((comment) => (
            <li key={comment.id} className="pgs-ops__list-row">
              <span>{comment.body}</span>
              <small>{new Date(comment.created_at).toLocaleString("en-GB")}</small>
            </li>
          ))}
        </ul>
        {canManage ? (
          <form
            className="pgs-ops__form-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              void save("comments", "POST", { body: data.get("body") });
            }}
          >
            <label>
              Comment
              <input name="body" required />
            </label>
            <button className="pgs-ops__btn" type="submit">
              Post
            </button>
          </form>
        ) : null}
      </section>

      <section className="pgs-ops__detail-panel">
        <h2>Counselor notes</h2>
        <ul className="pgs-ops__list">
          {notes.map((note) => (
            <li key={note.id} className="pgs-ops__list-row">
              <span>{note.body}</span>
              <span className="pgs-ops__badge">{note.visibility}</span>
            </li>
          ))}
        </ul>
        {canManage ? (
          <form
            className="pgs-ops__form-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              void save("notes", "POST", { body: data.get("body") });
            }}
          >
            <label>
              Note
              <input name="body" required />
            </label>
            <button className="pgs-ops__btn" type="submit">
              Add note
            </button>
          </form>
        ) : null}
      </section>

      <section className="pgs-ops__detail-panel">
        <h2>Review queue</h2>
        <ul className="pgs-ops__list">
          {reviews.map((review) => (
            <li key={review.id} className="pgs-ops__list-row">
              <span>{review.title}</span>
              <span className="pgs-ops__badge">{review.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
