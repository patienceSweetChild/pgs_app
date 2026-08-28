"use client";

import { useState, type KeyboardEvent } from "react";
import { splitCmsLines } from "@/components/CmsHtml";

type Props = {
  label?: string;
  hint?: string;
  /** Newline-separated tags (CMS `tags_text` storage). */
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

function normalizeTag(raw: string): string {
  const trimmed = raw.trim().replace(/^#+/, "").trim();
  if (!trimmed) return "";
  return `#${trimmed}`;
}

function parseTags(value: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of splitCmsLines(value)) {
    const tag = normalizeTag(line);
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out;
}

function serializeTags(tags: string[]): string {
  return tags.join("\n");
}

/** Chip-style multi-tag input (Enter / comma to add), stored as newline text. */
export function TagsField({
  label = "Tags",
  hint = "Type a tag and press Enter. Use country or pathway names (e.g. UK, USMLE) so items can appear on those pages later.",
  value,
  onChange,
  placeholder = "e.g. UK, USMLE, Engineering",
}: Props) {
  const tags = parseTags(value);
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const parts = raw
      .split(/[,]+/)
      .map(normalizeTag)
      .filter(Boolean);
    if (parts.length === 0) return;
    const seen = new Set(tags.map((t) => t.toLowerCase()));
    const next = [...tags];
    for (const tag of parts) {
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      next.push(tag);
    }
    onChange(serializeTags(next));
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(serializeTags(tags.filter((_, i) => i !== index)));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
      return;
    }
    if (e.key === "Backspace" && !draft && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  }

  return (
    <div className="pgs-admin-tags">
      <div className="pgs-admin-tags__head">
        <strong>{label}</strong>
        {hint ? <span>{hint}</span> : null}
      </div>
      <div className="pgs-admin-tags__box">
        {tags.map((tag, index) => (
          <span key={`${tag}-${index}`} className="pgs-admin-tags__chip">
            {tag}
            <button
              type="button"
              className="pgs-admin-tags__remove"
              aria-label={`Remove ${tag}`}
              onClick={() => removeAt(index)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="pgs-admin-tags__input"
          value={draft}
          placeholder={tags.length === 0 ? placeholder : "Add another…"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) commit(draft);
          }}
        />
      </div>
      {tags.length === 0 ? (
        <p className="pgs-admin-tags__empty">No tags yet. Add one or more above.</p>
      ) : null}
    </div>
  );
}
