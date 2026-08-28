"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  createCatalogTag,
  listCatalogTags,
  type CatalogTagRow,
  type EventTagKind,
} from "./tag-actions";

type Props = {
  label: string;
  kind: EventTagKind;
  /** Single: one label. Multi: newline-separated labels. */
  value: string;
  onChange: (next: string) => void;
  /** 1 for mode/badge; omit for multi tags. */
  maxTags?: number;
  /** Prefix selected labels with # (mode/tags). */
  hashPrefix?: boolean;
};

function stripHash(raw: string): string {
  return raw.trim().replace(/^#+/, "").trim();
}

function withHash(label: string, hashPrefix: boolean): string {
  const clean = stripHash(label);
  if (!clean) return "";
  return hashPrefix ? `#${clean}` : clean;
}

function parseSelected(value: string, maxTags: number | undefined): string[] {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (maxTags === 1) {
    const first = lines[0] ?? value.trim();
    return first ? [first] : [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const key = stripHash(line).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

function serialize(
  tags: string[],
  maxTags: number | undefined,
  hashPrefix: boolean,
): string {
  const normalized = tags
    .map((t) => withHash(t, hashPrefix))
    .filter(Boolean);
  if (maxTags === 1) return normalized[0] ?? "";
  return normalized.join("\n");
}

export function TagPickerField({
  label,
  kind,
  value,
  onChange,
  maxTags,
  hashPrefix = true,
}: Props) {
  const [options, setOptions] = useState<CatalogTagRow[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => parseSelected(value, maxTags),
    [value, maxTags],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await listCatalogTags(kind);
        if (!cancelled) setOptions(rows);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load tags");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = stripHash(query).toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q),
    );
  }, [options, query]);

  const exactMatch = useMemo(() => {
    const q = stripHash(query).toLowerCase();
    if (!q) return null;
    return (
      options.find((o) => stripHash(o.name).toLowerCase() === q) ?? null
    );
  }, [options, query]);

  function commitLabel(rawLabel: string) {
    const display = withHash(rawLabel, hashPrefix);
    if (!display) return;
    const key = stripHash(display).toLowerCase();
    if (maxTags === 1) {
      onChange(serialize([display], maxTags, hashPrefix));
    } else {
      if (selected.some((s) => stripHash(s).toLowerCase() === key)) {
        setQuery("");
        setOpen(false);
        return;
      }
      onChange(serialize([...selected, display], maxTags, hashPrefix));
    }
    setQuery("");
    setOpen(false);
  }

  async function createAndSelect(raw: string) {
    const clean = stripHash(raw);
    if (!clean || busy) return;
    setBusy(true);
    setError(null);
    try {
      const row = await createCatalogTag({ label: clean, kind });
      setOptions((prev) =>
        prev.some((o) => o.id === row.id) ? prev : [...prev, row],
      );
      commitLabel(row.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setBusy(false);
    }
  }

  function removeAt(index: number) {
    const next = selected.filter((_, i) => i !== index);
    onChange(serialize(next, maxTags, hashPrefix));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = stripHash(query);
      if (!q) return;
      if (exactMatch) {
        commitLabel(exactMatch.name);
        return;
      }
      if (filtered[0]) {
        commitLabel(filtered[0].name);
        return;
      }
      void createAndSelect(q);
      return;
    }
    if (e.key === "Backspace" && !query && selected.length > 0) {
      removeAt(selected.length - 1);
    }
    if (e.key === "Escape") setOpen(false);
  }

  const showCreate =
    stripHash(query) &&
    !exactMatch &&
    !filtered.some(
      (o) => stripHash(o.name).toLowerCase() === stripHash(query).toLowerCase(),
    );

  return (
    <div
      className="pgs-admin-tags pgs-admin-tag-picker"
      ref={rootRef}
      style={{ padding: "14px 16px" }}
    >
      <div className="pgs-admin-tags__head">
        <strong>{label}</strong>
      </div>
      <div
        className="pgs-admin-tags__box pgs-admin-tag-picker__box"
        style={{ padding: "10px 12px" }}
        onClick={() => setOpen(true)}
      >
        {selected.map((tag, index) => (
          <span key={`${tag}-${index}`} className="pgs-admin-tags__chip">
            {withHash(tag, hashPrefix) || tag}
            <button
              type="button"
              className="pgs-admin-tags__remove"
              aria-label={`Remove ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                removeAt(index);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="pgs-admin-tags__input pgs-admin-tag-picker__input"
          value={query}
          placeholder={
            selected.length === 0
              ? maxTags === 1
                ? "Search or create…"
                : "Add tags…"
              : maxTags === 1
                ? "Replace…"
                : "Add another…"
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          disabled={busy}
        />
      </div>
      {open ? (
        <ul className="pgs-admin-tag-picker__menu" role="listbox">
          {filtered.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className="pgs-admin-tag-picker__option"
                onClick={() => commitLabel(opt.name)}
              >
                {withHash(opt.name, hashPrefix)}
              </button>
            </li>
          ))}
          {showCreate ? (
            <li>
              <button
                type="button"
                className="pgs-admin-tag-picker__option pgs-admin-tag-picker__option--create"
                onClick={() => void createAndSelect(query)}
                disabled={busy}
              >
                Create &quot;{stripHash(query)}&quot;
              </button>
            </li>
          ) : null}
          {filtered.length === 0 && !showCreate ? (
            <li className="pgs-admin-tag-picker__empty">No matches</li>
          ) : null}
        </ul>
      ) : null}
      {error ? (
        <p className="pgs-admin-tag-picker__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
