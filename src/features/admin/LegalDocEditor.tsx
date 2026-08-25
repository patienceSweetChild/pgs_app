"use client";

import { useEffect, useState } from "react";
import {
  getLegalDocument,
  saveLegalDocument,
} from "@/features/admin/content-actions";

export function LegalDocEditor({
  documentType,
  heading,
}: {
  documentType: "privacy" | "terms" | "refund";
  heading: string;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "unpublished">(
    "draft",
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const row = await getLegalDocument(documentType);
        if (row) {
          setTitle(String(row.title ?? ""));
          setBody(String(row.body ?? ""));
          setStatus((row.status as typeof status) || "draft");
        } else {
          setTitle(heading);
          setBody("");
          setStatus("draft");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [documentType, heading]);

  async function save() {
    setError(null);
    setMessage(null);
    try {
      await saveLegalDocument(documentType, title, body, status);
      setMessage("Saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{heading}</h1>
      {loading ? <p>Loading…</p> : null}
      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {message ? <p>{message}</p> : null}
      <div className="pgs-admin__form" style={{ maxWidth: 720 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </label>
        <label>
          Body
          <textarea
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <button type="button" className="pgs-admin__btn" onClick={() => void save()}>
          Save
        </button>
      </div>
    </div>
  );
}
