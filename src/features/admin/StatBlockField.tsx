"use client";

import type { StatBlock } from "@/features/countries/content";

type Props = {
  label?: string;
  value: StatBlock;
  onChange: (next: StatBlock) => void;
};

export function StatBlockField({ label = "Stats sidebar", value, onChange }: Props) {
  const values = value.values.length > 0 ? value.values : [{ value: "", label: "" }];

  function patchValues(next: StatBlock["values"]) {
    onChange({ ...value, values: next });
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
      </div>
      {values.map((stat, i) => (
        <div key={`stat-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Stat {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => patchValues(values.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Value
            <input
              className="pgs-admin-control"
              value={stat.value}
              onChange={(e) => {
                const copy = [...values];
                copy[i] = { ...copy[i], value: e.target.value };
                patchValues(copy);
              }}
            />
          </label>
          <label>
            Label
            <input
              className="pgs-admin-control"
              value={stat.label}
              onChange={(e) => {
                const copy = [...values];
                copy[i] = { ...copy[i], label: e.target.value };
                patchValues(copy);
              }}
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => patchValues([...values, { value: "", label: "" }])}
      >
        Add stat
      </button>
      <label>
        Caption
        <textarea
          className="pgs-admin-control"
          rows={2}
          value={value.caption}
          onChange={(e) => onChange({ ...value, caption: e.target.value })}
        />
      </label>
      <label>
        Source note
        <input
          className="pgs-admin-control"
          value={value.sourceNote}
          onChange={(e) => onChange({ ...value, sourceNote: e.target.value })}
        />
      </label>
    </div>
  );
}
