"use client";

import { useState } from "react";
import { AdminRichTextField } from "./AdminRichTextField";

export type FaqDraftItem = {
  q: string;
  a: string;
};

type Props = {
  value: FaqDraftItem[];
  onChange: (next: FaqDraftItem[]) => void;
};

export function EventFaqField({ value, onChange }: Props) {
  const [openIdx, setOpenIdx] = useState(0);

  function patchAt(index: number, partial: Partial<FaqDraftItem>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  function addItem() {
    onChange([...value, { q: "", a: "" }]);
    setOpenIdx(value.length);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
    setOpenIdx(0);
  }

  return (
    <div className="pgs-admin-faq">
      {value.length === 0 ? (
        <p className="pgs-admin-faq__empty">No FAQ items yet.</p>
      ) : null}
      {value.map((item, i) => {
        const open = openIdx === i;
        return (
          <div
            key={`faq-${i}`}
            className={`pgs-admin-faq__item${open ? " is-open" : ""}`}
          >
            <div className="pgs-admin-faq__item-head">
              <button
                type="button"
                className="pgs-admin-faq__toggle"
                onClick={() => setOpenIdx(open ? -1 : i)}
              >
                {item.q.trim() || `Question ${i + 1}`}
              </button>
              <button
                type="button"
                className="pgs-admin__btn pgs-admin__btn--ghost"
                onClick={() => removeAt(i)}
              >
                Remove
              </button>
            </div>
            {open ? (
              <div className="pgs-admin-faq__item-body">
                <label>
                  Question
                  <input
                    className="pgs-admin-control"
                    style={{ padding: "12px 16px" }}
                    value={item.q}
                    onChange={(e) => patchAt(i, { q: e.target.value })}
                  />
                </label>
                <AdminRichTextField
                  label="Answer"
                  value={item.a}
                  onChange={(next) => patchAt(i, { a: next })}
                  rows={4}
                />
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={addItem}
      >
        + Add FAQ
      </button>
    </div>
  );
}

/** Serialize FAQ draft → DB text (Question||Answer per line). */
export function serializeFaqItems(items: FaqDraftItem[]): string {
  return items
    .map((item) => {
      const q = item.q.trim();
      const a = item.a.trim();
      if (!q && !a) return "";
      return `${q}||${a}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Parse DB text → FAQ draft (supports course tabId||Q||A or Q||A). */
export function parseFaqDraft(raw: string): FaqDraftItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("||");
      if (parts.length >= 3) {
        return { q: parts[1].trim(), a: parts.slice(2).join("||").trim() };
      }
      if (parts.length === 2) {
        return { q: parts[0].trim(), a: parts[1].trim() };
      }
      return { q: line, a: "" };
    });
}
