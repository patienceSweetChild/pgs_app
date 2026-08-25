"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BumpPremiumModal,
  UNLOCK_BUMP_CONFIG,
} from "@/components/BumpPremiumModal";
import { SoftLock } from "@/components/SoftLock";
import { useExperience } from "@/lib/auth/experience";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { IMPORTANT_ALERTS, type DocStatus } from "./content";
import {
  addAdditionalDocumentRequirement,
  ensureAndLoadDocuments,
  requestDocumentDeletion,
  uploadRequirementDocument,
  viewDocument,
  type DocListItem,
} from "./documentsRepo";
import "./documents.css";

function StatusCell({ status }: { status: DocStatus }) {
  if (status === "Approved") {
    return <span className="status-approved">Approved</span>;
  }
  if (status === "InDraft") {
    return <span className="status-InDraft">InDraft</span>;
  }
  if (status === "pending") {
    return <span className="status-InDraft">Pending</span>;
  }
  return <span className="blank-dots" />;
}

function ActionButtons({
  row,
  locked,
  busy,
  onUploadPick,
  onView,
  onRequestDelete,
}: {
  row: DocListItem;
  locked: boolean;
  busy: boolean;
  onUploadPick: (requirementId: string) => void;
  onView: (row: DocListItem) => void;
  onRequestDelete: (row: DocListItem) => void;
}) {
  if (row.action === "upload") {
    return (
      <button
        type="button"
        className="btn btn-black-upload"
        disabled={locked || busy}
        onClick={() => onUploadPick(row.requirementId)}
      >
        Upload
      </button>
    );
  }

  return (
    <div className="doc-actions">
      <button
        type="button"
        className="btn btn-black-outline"
        disabled={locked || busy || !row.storagePath}
        onClick={() => onView(row)}
      >
        view
      </button>
      <button
        type="button"
        className="btn btn-black-upload"
        disabled={locked || busy}
        onClick={() => onUploadPick(row.requirementId)}
      >
        Reupload
      </button>
      <button
        type="button"
        className="btn btn-black-outline doc-action-wide"
        disabled={locked || busy || !row.documentId}
        onClick={() => onRequestDelete(row)}
      >
        Request to Delete
      </button>
    </div>
  );
}

/**
 * Documents upload — locked (!premium) / unlocked (premium).
 */
export function DocumentsPage() {
  const { isLoggedIn, isPremium, userId, ready } = useExperience();
  const router = useRouter();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [extraDoc, setExtraDoc] = useState("");
  const [rows, setRows] = useState<DocListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingRequirementId = useRef<string | null>(null);
  const locked = !isPremium;

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId || !isPremium) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const list = await ensureAndLoadDocuments(supabase, userId);
      setRows(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load documents.");
    } finally {
      setLoading(false);
    }
  }, [userId, isPremium]);

  useEffect(() => {
    if (!ready) return;
    void reload();
  }, [ready, reload]);

  function openUnlock() {
    if (!isLoggedIn) {
      router.push("/login?redirect=/upload_your_doc");
      return;
    }
    setUnlockOpen(true);
  }

  function onUploadPick(requirementId: string) {
    if (locked) {
      openUnlock();
      return;
    }
    pendingRequirementId.current = requirementId;
    fileInputRef.current?.click();
  }

  async function onFileSelected(file: File | undefined) {
    const requirementId = pendingRequirementId.current;
    pendingRequirementId.current = null;
    if (!file || !requirementId || !userId) return;

    setBusyId(requirementId);
    setError(null);
    setStatus(null);
    try {
      const supabase = createSupabaseBrowserClient();
      await uploadRequirementDocument(supabase, userId, requirementId, file);
      setStatus("Document uploaded.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusyId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onView(row: DocListItem) {
    if (!row.storagePath) return;
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      await viewDocument(supabase, row.storagePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open file.");
    }
  }

  async function onRequestDelete(row: DocListItem) {
    if (!row.documentId || !userId) return;
    setBusyId(row.requirementId);
    setError(null);
    setStatus(null);
    try {
      const supabase = createSupabaseBrowserClient();
      await requestDocumentDeletion(supabase, userId, row.documentId);
      setStatus("Deletion requested. Staff will review shortly.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function onExtraUpload() {
    if (locked) {
      openUnlock();
      return;
    }
    if (!userId) return;
    const name = extraDoc.trim();
    if (!name) {
      setError("Enter the document name first.");
      return;
    }
    setBusyId("extra");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const requirementId = await addAdditionalDocumentRequirement(
        supabase,
        userId,
        name,
      );
      setExtraDoc("");
      await reload();
      pendingRequirementId.current = requirementId;
      fileInputRef.current?.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add document.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="wrapper-content">
      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => void onFileSelected(e.target.files?.[0])}
      />

      <section className="pt-5 about-section half-section overlap-height position-relative overflow-hidden minus-5 mobile-doc-section">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-md-center align-items-center">
            <div className="col-lg-7 d-flex gap-10 align-items-center">
              <div className="w-300px d-flex align-items-center justify-content-end">
                <h1 className="text-start text-black fnt-family fw-400 fs-50 lh-full pt-0">
                  upload <br />
                  your <br />
                  docs <br />
                </h1>
              </div>
              <div className="yellow-box-style-3 w-300px position-relative">
                {locked ? <SoftLock onUnlock={openUnlock} /> : null}
                <div className="header-yellow-box-style-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/bell.gif" className="w-10" alt="" />
                  Important Alerts
                </div>
                <ol>
                  {IMPORTANT_ALERTS.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="row justify-content-md-center mt-3">
            <div className="col-lg-6">
              <p className="mb-0 text-black m-auto fs-19 lh-25 mobile-fs-14 mobile-lh-full">
                <span className="fs-22 lh-28 d-block mb-1 fw-500">
                  Make sure your file is under 5MB.
                </span>
                We accept PDF, JPG, PNG, and MS Word formats. <br />
                Hit upload when you’re ready.
              </p>
              {error ? (
                <p className="text-red mt-2" role="alert">
                  {error}
                </p>
              ) : null}
              {status ? (
                <p className="text-black mt-2" role="status">
                  {status}
                </p>
              ) : null}
              {loading && isPremium ? (
                <p className="text-black mt-2">Loading documents…</p>
              ) : null}
            </div>
          </div>

          <div className="row justify-content-md-center mt-5">
            <div className="col-lg-11">
              <div className="position-relative">
                {locked ? (
                  <SoftLock onUnlock={openUnlock} style={{ borderRadius: 10 }} />
                ) : null}

                <table className="w-100 desktop-none table border-none text-bold-table mobile-fs-14-table">
                  <thead>
                    <tr>
                      <th className="fnt-family fs-28 fw-500 w-40">
                        Resource LIST
                      </th>
                      <th className="fnt-family fs-28 fw-500 w-25">UPLOAD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <Fragment key={row.requirementId}>
                        <tr>
                          <td>
                            <span
                              className={
                                row.status === "Approved"
                                  ? "text-green"
                                  : row.status === "InDraft"
                                    ? "text-red"
                                    : ""
                              }
                            >
                              {row.name}
                            </span>
                          </td>
                          <td>
                            <span className="fs-12 lh-14 nowrap-1">
                              {row.uploadedOn ? (
                                <>
                                  {" "}
                                  UPLOADED ON{" "}
                                  <span className="fs-14">{row.uploadedOn}</span>
                                </>
                              ) : (
                                "---"
                              )}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <StatusCell status={row.status} />
                          </td>
                          <td>
                            <ActionButtons
                              row={row}
                              locked={locked}
                              busy={busyId === row.requirementId}
                              onUploadPick={onUploadPick}
                              onView={(r) => void onView(r)}
                              onRequestDelete={(r) => void onRequestDelete(r)}
                            />
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                <table className="w-100 mobile-none table border-none text-bold-table">
                  <thead>
                    <tr>
                      <th className="fnt-family fs-28 fw-500 w-30">
                        Resource Drop
                      </th>
                      <th className="fnt-family fs-28 fw-500 w-20">
                        uploaded on
                      </th>
                      <th className="fnt-family fs-28 fw-500 w-15">qc status</th>
                      <th className="fnt-family fs-28 fw-500 w-35">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.requirementId}>
                        <td>{row.name}</td>
                        <td>
                          {row.uploadedOn ?? <span className="blank-dots" />}
                        </td>
                        <td>
                          <StatusCell status={row.status} />
                        </td>
                        <td>
                          <ActionButtons
                            row={row}
                            locked={locked}
                            busy={busyId === row.requirementId}
                            onUploadPick={onUploadPick}
                            onView={(r) => void onView(r)}
                            onRequestDelete={(r) => void onRequestDelete(r)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="w-50 mt-3" style={{ padding: 10 }}>
                  <h5 className="mb-1 fs-25 lh-32 fw-500 text-black mobile-fs-14 mobile-lh-full mobile-pb-2">
                    Additional documents, if we asked for them
                  </h5>
                  <div className="upload-group-textare position-relative">
                    <textarea
                      className="form-control p-2"
                      placeholder="Enter the document name here"
                      value={extraDoc}
                      onChange={(e) => setExtraDoc(e.target.value)}
                      disabled={locked}
                    />
                    <button
                      type="button"
                      className="btn btn-black-upload"
                      disabled={locked || busyId === "extra"}
                      onClick={() => void onExtraUpload()}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div className="row mt-7 align-items-center justify-content-md-center">
                <div className="col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px">
                  <figure className="position-relative m-0 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/team-goal.png"
                      alt=""
                      className="w-100 border-radius-6px"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BumpPremiumModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        config={UNLOCK_BUMP_CONFIG}
      />
    </div>
  );
}
