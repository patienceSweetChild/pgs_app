import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createStudentDocumentSignedUrl,
  sha256Hex,
  uploadStudentDocument,
} from "@/lib/supabase/storage";
import type { DocStatus } from "./content";

export type RequirementRow = {
  id: string;
  document_type: string;
  requirement_kind: string;
  status: string;
  sort_order: number;
};

export type DocumentFileRow = {
  id: string;
  requirement_id: string;
  storage_path: string;
  original_filename: string;
  uploaded_at: string;
  qc_status: string;
  version: number;
  superseded_at: string | null;
  deletion_requested_at: string | null;
};

export type DocListItem = {
  requirementId: string;
  name: string;
  kind: string;
  uploadedOn: string | null;
  status: DocStatus;
  action: "view" | "upload";
  documentId: string | null;
  storagePath: string | null;
};

function mapQcToUi(status: string, hasFile: boolean): DocStatus {
  if (!hasFile) return "blank";
  if (status === "approved") return "Approved";
  if (status === "in_draft" || status === "rejected") return "InDraft";
  if (status === "in_review" || status === "pending") return "pending";
  return "blank";
}

function formatUploadedOn(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function ensureAndLoadDocuments(
  supabase: SupabaseClient,
  userId: string,
): Promise<DocListItem[]> {
  const { error: ensureError } = await supabase.rpc(
    "ensure_default_document_requirements",
    { uid: userId },
  );
  if (ensureError) throw new Error(ensureError.message);

  const { data: requirements, error: reqError } = await supabase
    .from("student_document_requirements")
    .select("id, document_type, requirement_kind, status, sort_order")
    .eq("student_id", userId)
    .order("sort_order", { ascending: true });

  if (reqError) throw new Error(reqError.message);

  const { data: docs, error: docsError } = await supabase
    .from("student_documents")
    .select(
      "id, requirement_id, storage_path, original_filename, uploaded_at, qc_status, version, superseded_at, deletion_requested_at",
    )
    .eq("student_id", userId)
    .is("superseded_at", null)
    .is("purged_at", null)
    .order("uploaded_at", { ascending: false });

  if (docsError) throw new Error(docsError.message);

  const latestByReq = new Map<string, DocumentFileRow>();
  for (const doc of (docs ?? []) as DocumentFileRow[]) {
    if (!latestByReq.has(doc.requirement_id)) {
      latestByReq.set(doc.requirement_id, doc);
    }
  }

  return ((requirements ?? []) as RequirementRow[]).map((req) => {
    const file = latestByReq.get(req.id) ?? null;
    const hasFile = Boolean(file);
    return {
      requirementId: req.id,
      name: req.document_type,
      kind: req.requirement_kind,
      uploadedOn: formatUploadedOn(file?.uploaded_at),
      status: mapQcToUi(file?.qc_status ?? req.status, hasFile),
      action: hasFile ? "view" : "upload",
      documentId: file?.id ?? null,
      storagePath: file?.storage_path ?? null,
    };
  });
}

export async function uploadRequirementDocument(
  supabase: SupabaseClient,
  userId: string,
  requirementId: string,
  file: File,
): Promise<void> {
  const { path } = await uploadStudentDocument(
    supabase,
    userId,
    requirementId,
    file,
    { maxBytes: 5 * 1024 * 1024 },
  );
  const hash = await sha256Hex(file);

  const { data: existing } = await supabase
    .from("student_documents")
    .select("id, version")
    .eq("requirement_id", requirementId)
    .eq("student_id", userId)
    .is("superseded_at", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existing?.version ?? 0) + 1;

  if (existing?.id) {
    await supabase
      .from("student_documents")
      .update({ superseded_at: new Date().toISOString() })
      .eq("id", existing.id);
  }

  const { error: insertError } = await supabase.from("student_documents").insert({
    student_id: userId,
    requirement_id: requirementId,
    storage_path: path,
    original_filename: file.name,
    mime_type: file.type || "application/octet-stream",
    byte_size: file.size,
    sha256: hash,
    version: nextVersion,
    uploaded_by: userId,
    qc_status: "pending",
    scan_status: "pending",
  });

  if (insertError) throw new Error(insertError.message);

  const { error: statusError } = await supabase
    .from("student_document_requirements")
    .update({ status: "uploaded", updated_at: new Date().toISOString() })
    .eq("id", requirementId)
    .eq("student_id", userId);

  if (statusError) throw new Error(statusError.message);
}

export async function addAdditionalDocumentRequirement(
  supabase: SupabaseClient,
  userId: string,
  documentName: string,
): Promise<string> {
  const name = documentName.trim();
  if (!name) throw new Error("Enter a document name first.");

  const { data, error } = await supabase
    .from("student_document_requirements")
    .insert({
      student_id: userId,
      document_type: name,
      requirement_kind: "additional",
      status: "missing",
      sort_order: 1000,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function viewDocument(
  supabase: SupabaseClient,
  storagePath: string,
): Promise<void> {
  const url = await createStudentDocumentSignedUrl(supabase, storagePath);
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function requestDocumentDeletion(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
): Promise<void> {
  const { error } = await supabase
    .from("student_documents")
    .update({
      deletion_requested_at: new Date().toISOString(),
      deletion_requested_by: userId,
    })
    .eq("id", documentId)
    .eq("student_id", userId);

  if (error) throw new Error(error.message);
}
