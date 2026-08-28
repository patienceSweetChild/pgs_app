"use client";

export type KeyValueColumn = {
  key: string;
  label: string;
  multiline?: boolean;
};

type Props<T extends Record<string, string>> = {
  label: string;
  columns: KeyValueColumn[];
  value: T[];
  onChange: (next: T[]) => void;
  emptyRow: () => T;
  itemLabel?: string;
};

export function KeyValueTableField<T extends Record<string, string>>({
  label,
  columns,
  value,
  onChange,
  emptyRow,
  itemLabel = "Row",
}: Props<T>) {
  const rows = value.length > 0 ? value : [emptyRow()];

  function patchAt(index: number, key: string, nextVal: string) {
    onChange(
      rows.map((row, i) =>
        i === index ? ({ ...row, [key]: nextVal } as T) : row,
      ),
    );
  }

  function removeAt(index: number) {
    const next = rows.filter((_, i) => i !== index);
    onChange(next.length ? next : []);
  }

  function addRow() {
    onChange([...rows.filter((r) => columns.some((c) => r[c.key]?.trim())), emptyRow()]);
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
        <span>{rows.filter((r) => columns.some((c) => r[c.key]?.trim())).length} rows</span>
      </div>
      {rows.map((row, i) => (
        <div key={`kv-row-${i}`} className="pgs-admin-line-items__row">
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
          {columns.map((col) => (
            <label key={col.key}>
              {col.label}
              {col.multiline ? (
                <textarea
                  className="pgs-admin-control"
                  rows={3}
                  value={row[col.key] ?? ""}
                  onChange={(e) => patchAt(i, col.key, e.target.value)}
                />
              ) : (
                <input
                  className="pgs-admin-control"
                  value={row[col.key] ?? ""}
                  onChange={(e) => patchAt(i, col.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      ))}
      <button type="button" className="pgs-admin__btn pgs-admin__btn--ghost" onClick={addRow}>
        Add row
      </button>
    </div>
  );
}
