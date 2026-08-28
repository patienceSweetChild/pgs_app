"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadMediaAsset } from "@/lib/supabase/storage";
import {
  getMediaAssetPreview,
  registerCmsMediaAsset,
  type MediaAssetPreview,
} from "./media-actions";

type AcceptKind = "image" | "document";

type Props = {
  label: string;
  value: string | null | undefined;
  onChange: (assetId: string | null) => void;
  /** image = photos only; document = images + PDF (brochures) */
  accept?: AcceptKind;
  folder?: string;
};

const ACCEPT: Record<AcceptKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  document:
    "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf",
};

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export function MediaAssetField({
  label,
  value,
  onChange,
  accept = "image",
  folder = "cms",
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<MediaAssetPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = value ? String(value) : "";
    if (!id) {
      setPreview(null);
      return;
    }
    void (async () => {
      try {
        const next = await getMediaAssetPreview(id);
        if (!cancelled) setPreview(next);
      } catch (err) {
        if (!cancelled) {
          setPreview(null);
          setError(err instanceof Error ? err.message : "Failed to load media");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value]);

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded = await uploadMediaAsset(supabase, file, folder, {
        imagesOnly: accept === "image",
      });
      const registered = await registerCmsMediaAsset({
        path: uploaded.path,
        mimeType: file.type,
        byteSize: file.size,
        altText: label,
      });
      setPreview(registered);
      onChange(registered.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    setPreview(null);
    setError(null);
    onChange(null);
  }

  const showImage = preview && isImageMime(preview.mimeType) && preview.publicUrl;

  return (
    <div className="pgs-admin__media-field">
      <div className="pgs-admin__media-field-label">{label}</div>
      <div className="pgs-admin__media-field-body">
        {showImage ? (
          <img
            src={preview.publicUrl}
            alt=""
            className="pgs-admin__media-field-preview"
          />
        ) : preview ? (
          <div className="pgs-admin__media-field-file">
            <span>{preview.path.split("/").pop()}</span>
            {preview.publicUrl ? (
              <a href={preview.publicUrl} target="_blank" rel="noreferrer">
                Open
              </a>
            ) : null}
          </div>
        ) : (
          <div className="pgs-admin__media-field-empty">No file yet</div>
        )}

        <div className="pgs-admin__media-field-actions">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPT[accept]}
            hidden
            disabled={busy}
            onChange={(e) => void onFileChange(e.target.files?.[0])}
          />
          <label htmlFor={inputId} className="pgs-admin__btn pgs-admin__btn--ghost">
            {busy ? "Uploading…" : preview ? "Replace" : "Upload"}
          </label>
          {preview ? (
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              disabled={busy}
              onClick={clear}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p className="pgs-admin__media-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
