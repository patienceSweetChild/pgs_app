"use client";

import { parseCourseFacts } from "@/features/programsfull/content";

export type FactDraftItem = {
  title: string;
  body: string;
};

type Props = {
  value: FactDraftItem[];
  onChange: (next: FactDraftItem[]) => void;
};

export function serializeCourseFacts(items: FactDraftItem[]): string {
  return items
    .map((item) => {
      const title = item.title.trim();
      const body = item.body.trim();
      if (!title && !body) return "";
      return body ? `${title}||${body}` : title;
    })
    .filter(Boolean)
    .join("\n");
}

export function parseCourseFactsDraft(raw: string): FactDraftItem[] {
  const parsed = parseCourseFacts(raw);
  return parsed.length ? parsed : [];
}

export function CourseFactsField({ value, onChange }: Props) {
  const items = value.length > 0 ? value : [{ title: "", body: "" }];

  function patchAt(index: number, partial: Partial<FactDraftItem>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  function addItem() {
    onChange([...items.filter((f) => f.title.trim() || f.body.trim()), { title: "", body: "" }]);
  }

  function removeAt(index: number) {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length ? next : []);
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Awarding body facts</strong>
        <span>
          {items.filter((f) => f.title.trim() || f.body.trim()).length} facts
        </span>
      </div>
      {items.every((f) => !f.title.trim() && !f.body.trim()) ? (
        <p className="pgs-admin-line-items__empty">
          No facts yet. Add one for each callout under the awarding body.
        </p>
      ) : null}
      {items.map((item, i) => (
        <div key={`fact-${i}`} className="pgs-admin-line-items__row pgs-admin-facts__card">
          <div className="pgs-admin-line-items__row-head">
            <span>Fact {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => removeAt(i)}
            >
              Remove
            </button>
          </div>
          <label>
            Title
            <input
              className="pgs-admin-control"
              style={{ padding: "12px 16px" }}
              value={item.title}
              onChange={(e) => patchAt(i, { title: e.target.value })}
              placeholder="e.g. Founded in 1505"
            />
          </label>
          <label>
            Body
            <textarea
              className="pgs-admin-control"
              style={{ padding: "12px 16px" }}
              rows={3}
              value={item.body}
              onChange={(e) => patchAt(i, { body: e.target.value })}
              placeholder="Optional supporting text"
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={addItem}
      >
        + Add fact
      </button>
    </div>
  );
}
