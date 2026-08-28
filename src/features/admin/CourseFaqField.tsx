"use client";

import { useState } from "react";
import {
  COURSE_FAQ_TABS,
  parseCourseFaqs,
  type CourseFaqItem,
} from "@/features/programsfull/content";
import { AdminRichTextField } from "./AdminRichTextField";

export type CourseFaqDraftItem = {
  tab: string;
  q: string;
  a: string;
};

type Props = {
  value: CourseFaqDraftItem[];
  onChange: (next: CourseFaqDraftItem[]) => void;
};

const DEFAULT_TAB = COURSE_FAQ_TABS[0]?.id ?? "tab_1";

export function CourseFaqField({ value, onChange }: Props) {
  const [openIdx, setOpenIdx] = useState(0);

  function patchAt(index: number, partial: Partial<CourseFaqDraftItem>) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  function addItem() {
    onChange([...value, { tab: DEFAULT_TAB, q: "", a: "" }]);
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
            key={`course-faq-${i}`}
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
                  Tab
                  <select
                    className="pgs-admin-control"
                    style={{ padding: "12px 16px" }}
                    value={item.tab || DEFAULT_TAB}
                    onChange={(e) => patchAt(i, { tab: e.target.value })}
                  >
                    {COURSE_FAQ_TABS.map((tab) => (
                      <option key={tab.id} value={tab.id}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </label>
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

/** Serialize FAQ draft → DB text (tab||Question||Answer per line). */
export function serializeCourseFaqItems(items: CourseFaqDraftItem[]): string {
  return items
    .map((item) => {
      const tab = (item.tab || DEFAULT_TAB).trim() || DEFAULT_TAB;
      const q = item.q.trim();
      const a = item.a.trim();
      if (!q && !a) return "";
      return `${tab}||${q}||${a}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Parse DB text → FAQ draft (tabId||Q||A or Q||A). */
export function parseCourseFaqDraft(raw: string): CourseFaqDraftItem[] {
  return parseCourseFaqs(raw).map((item: CourseFaqItem) => ({
    tab: item.tab || DEFAULT_TAB,
    q: item.q,
    a: item.a,
  }));
}
