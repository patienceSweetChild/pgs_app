"use client";

import { useMemo } from "react";

export type DateTimeSaveState =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error";

type Props = {
  label: string;
  value: string | null;
  onChange: (iso: string | null) => void;
  saveState?: DateTimeSaveState;
  /** Minute step; defaults to 5 (0,5,…55). Use 1 for every minute. */
  minuteStep?: 1 | 5;
};

type Parts = {
  date: string;
  hour12: number;
  minute: number;
  ampm: "AM" | "PM";
};

const SAVE_LABELS: Record<DateTimeSaveState, string> = {
  idle: "",
  dirty: "Unsaved",
  saving: "Saving…",
  saved: "Saved",
  error: "Error",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function parseIso(value: string | null): Parts | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const hours24 = d.getHours();
  const ampm: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  let hour12 = hours24 % 12;
  if (hour12 === 0) hour12 = 12;
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    hour12,
    minute: d.getMinutes(),
    ampm,
  };
}

function toIso(parts: Parts): string | null {
  if (!parts.date) return null;
  const [y, m, day] = parts.date.split("-").map(Number);
  if (!y || !m || !day) return null;
  let hours24 = parts.hour12 % 12;
  if (parts.ampm === "PM") hours24 += 12;
  const d = new Date(y, m - 1, day, hours24, parts.minute, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function minuteOptions(step: 1 | 5, current: number): number[] {
  const base: number[] = [];
  for (let m = 0; m < 60; m += step) base.push(m);
  if (!base.includes(current)) {
    base.push(current);
    base.sort((a, b) => a - b);
  }
  return base;
}

export function AdminDateTimeField({
  label,
  value,
  onChange,
  saveState = "idle",
  minuteStep = 5,
}: Props) {
  const parts = useMemo(() => parseIso(value), [value]);
  const date = parts?.date ?? "";
  const hour12 = parts?.hour12 ?? 12;
  const minute = parts?.minute ?? 0;
  const ampm = parts?.ampm ?? "AM";

  function emit(next: Partial<Parts>) {
    const merged: Parts = {
      date: next.date ?? date,
      hour12: next.hour12 ?? hour12,
      minute: next.minute ?? minute,
      ampm: next.ampm ?? ampm,
    };
    if (!merged.date) {
      onChange(null);
      return;
    }
    onChange(toIso(merged));
  }

  const status = SAVE_LABELS[saveState];

  return (
    <div className="pgs-admin-datetime">
      <div className="pgs-admin-datetime__label">{label}</div>
      <div className="pgs-admin-datetime__row">
        <input
          type="date"
          className="pgs-admin-datetime__date"
          value={date}
          onChange={(e) => emit({ date: e.target.value })}
        />
        <select
          className="pgs-admin-datetime__hour"
          value={hour12}
          aria-label="Hour"
          onChange={(e) => emit({ hour12: Number(e.target.value) })}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="pgs-admin-datetime__sep" aria-hidden>
          :
        </span>
        <select
          className="pgs-admin-datetime__minute"
          value={minute}
          aria-label="Minute"
          onChange={(e) => emit({ minute: Number(e.target.value) })}
        >
          {minuteOptions(minuteStep, minute).map((m) => (
            <option key={m} value={m}>
              {pad2(m)}
            </option>
          ))}
        </select>
        <div className="pgs-admin-datetime__ampm" role="group" aria-label="A.M./P.M.">
          <button
            type="button"
            className={
              ampm === "AM"
                ? "pgs-admin-datetime__ampm-btn is-active"
                : "pgs-admin-datetime__ampm-btn"
            }
            onClick={() => emit({ ampm: "AM" })}
          >
            A.M.
          </button>
          <button
            type="button"
            className={
              ampm === "PM"
                ? "pgs-admin-datetime__ampm-btn is-active"
                : "pgs-admin-datetime__ampm-btn"
            }
            onClick={() => emit({ ampm: "PM" })}
          >
            P.M.
          </button>
        </div>
        {value ? (
          <button
            type="button"
            className="pgs-admin-datetime__clear"
            onClick={() => onChange(null)}
          >
            Clear
          </button>
        ) : null}
      </div>
      {status ? (
        <span
          className={`pgs-admin-datetime__status pgs-admin-datetime__status--${saveState}`}
        >
          {status}
        </span>
      ) : null}
    </div>
  );
}
