"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  fallback: string;
  onChange: (next: string) => void;
  /** Render as section heading vs field label */
  as?: "heading" | "label";
};

/**
 * Field / section title with a pen affordance so page headings stay editable.
 */
export function EditableLabelField({
  value,
  fallback,
  onChange,
  as = "heading",
}: Props) {
  const display = value.trim() || fallback;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(display);

  useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  function commit() {
    const next = draft.trim();
    onChange(next === fallback ? "" : next);
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        className={`pgs-admin-editable-label pgs-admin-editable-label--${as} is-editing`}
      >
        <input
          className="pgs-admin-control pgs-admin-editable-label__input"
          style={{ padding: "8px 12px" }}
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setDraft(display);
              setEditing(false);
            }
          }}
          aria-label="Edit label"
        />
      </div>
    );
  }

  return (
    <div
      className={`pgs-admin-editable-label pgs-admin-editable-label--${as}`}
    >
      {as === "heading" ? (
        <h3 className="pgs-event-cms__section-title">{display}</h3>
      ) : (
        <strong className="pgs-admin-editable-label__text">{display}</strong>
      )}
      <button
        type="button"
        className="pgs-admin-editable-label__pen"
        title="Edit label"
        aria-label={`Edit label: ${display}`}
        onClick={() => setEditing(true)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    </div>
  );
}
