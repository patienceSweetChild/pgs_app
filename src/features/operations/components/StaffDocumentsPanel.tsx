"use client";

import { useState } from "react";
import type { DocumentRequirement } from "@/lib/premium-workspace";
import { CLEAN_DOCUMENT_SCAN_STATUS } from "@/lib/document-access";
import { requestStaffWorkspace } from "@/features/operations/staff-workspace-request";

function isCurrentDocument(
  document: NonNullable<DocumentRequirement["student_documents"]>[number],
) {
  return !document.superseded_at && !document.archived_at && !document.purged_at;
}

export function StaffDocumentsPanel({
  studentId,
  requirements,
  canManage,
}: {
  studentId: string;
  requirements: DocumentRequirement[];
  canManage: boolean;
}) {
  const [message, setMessage] = useState("");

  async function save(
    resource: string,
    method: "POST" | "PATCH" | "DELETE",
    values: Record<string, unknown>,
  ) {
    setMessage("Saving…");
    const error = await requestStaffWorkspace(studentId, resource, method, values);
    if (error) setMessage(error);
  }

  return (
    <section
      className="pgs-ops__workspace-panel"
      aria-labelledby="staff-documents-heading"
    >
      <h2 id="staff-documents-heading">Documents</h2>
      {message ? (
        <p className="pgs-ops__status" role="status">
          {message}
        </p>
      ) : null}

      {requirements.length ? (
        <div className="pgs-ops__stack">
          {requirements.map((item) => {
            const versions = [...(item.student_documents ?? [])].sort(
              (left, right) => right.version - left.version,
            );
            return (
              <article key={item.id} className="pgs-ops__workspace-item">
                <div className="pgs-ops__inline-actions">
                  <strong>{item.document_type}</strong>
                  <span className="pgs-ops__badge">
                    {item.requirement_kind} · {item.status.replaceAll("_", " ")}
                  </span>
                </div>
                {item.instructions ? (
                  <p className="pgs-ops__note">{item.instructions}</p>
                ) : null}

                {canManage ? (
                  <form
                    className="pgs-ops__form-grid"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      void save("requirements", "PATCH", {
                        id: item.id,
                        instructions: data.get("instructions"),
                        status: data.get("status"),
                      });
                    }}
                  >
                    <label>
                      <span>Instructions</span>
                      <textarea
                        name="instructions"
                        maxLength={2000}
                        defaultValue={item.instructions}
                        rows={2}
                      />
                    </label>
                    <label>
                      <span>Requirement status</span>
                      <select name="status" defaultValue={item.status}>
                        <option value="missing">Missing</option>
                        <option value="uploaded">Uploaded</option>
                        <option value="in_review">In review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in_draft">In draft</option>
                        <option value="waived">Waived</option>
                      </select>
                    </label>
                    <div className="pgs-ops__inline-actions">
                      <button className="pgs-ops__btn" type="submit">
                        Update requirement
                      </button>
                      <button
                        className="pgs-ops__btn pgs-ops__btn--danger"
                        onClick={() => void save("requirements", "DELETE", { id: item.id })}
                        type="button"
                      >
                        Delete requirement
                      </button>
                    </div>
                  </form>
                ) : null}

                {versions.length ? (
                  <div className="pgs-ops__table-wrap" style={{ marginTop: "0.75rem" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Version</th>
                          <th>File</th>
                          <th>Scan</th>
                          <th>QC</th>
                          <th>State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {versions.map((document) => {
                          const current = isCurrentDocument(document);
                          const canReview =
                            canManage &&
                            current &&
                            document.scan_status === CLEAN_DOCUMENT_SCAN_STATUS;
                          return (
                            <tr key={document.id}>
                              <td>v{document.version}</td>
                              <td>{document.original_filename}</td>
                              <td>{document.scan_status}</td>
                              <td>{document.qc_status.replaceAll("_", " ")}</td>
                              <td>
                                {current
                                  ? "Current"
                                  : document.superseded_at
                                    ? "Superseded"
                                    : document.archived_at
                                      ? "Archived"
                                      : "Not current"}
                                {canReview ? (
                                  <form
                                    className="pgs-ops__form-grid"
                                    style={{ marginTop: "0.5rem" }}
                                    onSubmit={(event) => {
                                      event.preventDefault();
                                      const data = new FormData(event.currentTarget);
                                      void save("documents", "PATCH", {
                                        id: document.id,
                                        qc_status: data.get("qc_status"),
                                        review_note: data.get("review_note"),
                                      });
                                    }}
                                  >
                                    <label>
                                      <span>QC status</span>
                                      <select
                                        name="qc_status"
                                        defaultValue={document.qc_status}
                                      >
                                        <option value="in_review">In review</option>
                                        <option value="in_draft">In draft</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                    </label>
                                    <label>
                                      <span>Review note</span>
                                      <textarea name="review_note" maxLength={2000} rows={2} />
                                    </label>
                                    <button className="pgs-ops__btn" type="submit">
                                      Save review
                                    </button>
                                  </form>
                                ) : null}
                                {current &&
                                document.scan_status !== CLEAN_DOCUMENT_SCAN_STATUS ? (
                                  <p className="pgs-ops__note">
                                    QC waits for a clean scan.
                                  </p>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="pgs-ops__note">No uploads yet.</p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="pgs-ops__note">No document requirements yet.</p>
      )}

      {canManage ? (
        <form
          className="pgs-ops__form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void save("requirements", "POST", {
              document_type: data.get("document_type"),
              requirement_kind: "additional",
              instructions: data.get("instructions"),
            });
          }}
        >
          <label>
            <span>Request a document</span>
            <input name="document_type" required maxLength={160} />
          </label>
          <label>
            <span>Instructions</span>
            <textarea name="instructions" maxLength={2000} rows={2} />
          </label>
          <button className="pgs-ops__btn" type="submit">
            Add requirement
          </button>
        </form>
      ) : null}
    </section>
  );
}
