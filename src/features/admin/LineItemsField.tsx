"use client";

import { AdminRichTextField } from "./AdminRichTextField";

type Props = {
  label: string;
  /** Newline-separated values (DB / draft storage). */
  value: string;
  onChange: (next: string) => void;
  /** Label prefix for each row, e.g. "Benefit" → "Benefit 1". */
  itemLabel?: string;
  placeholder?: string;
  /** Multi-line textarea per item (default true). */
  multiline?: boolean;
  /** Use rich text toolbar per item. */
  rich?: boolean;
  rows?: number;
  emptyHint?: string;
};

function parseItems(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(/\r?\n/);
}

function serializeItems(items: string[]): string {
  return items.join("\n").replace(/\n+$/g, "");
}

export function LineItemsField({
  label,
  value,
  onChange,
  itemLabel = "Item",
  placeholder = "",
  multiline = true,
  rich = false,
  rows = 3,
  emptyHint = "No items yet.",
}: Props) {
  const items = parseItems(value);
  const display = items.length > 0 ? items : [""];

  function patchAt(index: number, next: string) {
    const copy = [...display];
    copy[index] = next;
    onChange(serializeItems(copy));
  }

  function addItem() {
    onChange(serializeItems([...display.filter((x) => x.trim()), ""]));
  }

  function removeAt(index: number) {
    const next = display.filter((_, i) => i !== index);
    onChange(serializeItems(next.length ? next : []));
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
        <span>{display.filter((x) => x.trim()).length} items</span>
      </div>
      {display.every((x) => !x.trim()) ? (
        <p className="pgs-admin-line-items__empty">{emptyHint}</p>
      ) : null}
      {display.map((item, i) => (
        <div key={`line-item-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>
              {itemLabel} {i + 1}
            </span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => removeAt(i)}
            >
              Remove
            </button>
          </div>
          {rich ? (
            <AdminRichTextField
              label=""
              value={item}
              onChange={(next) => patchAt(i, next)}
              rows={rows}
            />
          ) : multiline ? (
            <textarea
              className="pgs-admin-control"
              style={{ padding: "12px 16px" }}
              rows={rows}
              placeholder={placeholder}
              value={item}
              onChange={(e) => patchAt(i, e.target.value)}
            />
          ) : (
            <input
              className="pgs-admin-control"
              style={{ padding: "12px 16px" }}
              placeholder={placeholder}
              value={item}
              onChange={(e) => patchAt(i, e.target.value)}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={addItem}
      >
        + Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
