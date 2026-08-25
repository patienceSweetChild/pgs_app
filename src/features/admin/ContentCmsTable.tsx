"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONTENT_ENTITIES } from "./content-registry";
import {
  deleteContentRow,
  listContentRows,
  upsertContentRow,
} from "./content-actions";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ContentCmsTable({ entityKey }: { entityKey: string }) {
  const config = CONTENT_ENTITIES[entityKey];
  const pathname = usePathname();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listContentRows(entityKey);
      setRows(data as Record<string, unknown>[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [entityKey, config]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setEditing(null);
  }, [pathname, entityKey]);

  if (!config) {
    return <p role="alert">Unknown content module.</p>;
  }

  async function save() {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      const payload = { ...editing };
      if (
        "slug" in payload &&
        !payload.slug &&
        typeof payload.name === "string"
      ) {
        payload.slug = slugify(payload.name);
      }
      if (
        "slug" in payload &&
        !payload.slug &&
        typeof payload.title === "string"
      ) {
        payload.slug = slugify(payload.title);
      }
      await upsertContentRow(entityKey, payload);
      setEditing(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string | number) {
    setLoading(true);
    setError(null);
    try {
      await deleteContentRow(entityKey, id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="pgs-admin__toolbar">
        <div>
          <h1 style={{ margin: 0 }}>{config.title}</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            Table CMS — create, edit, publish.
          </p>
        </div>
        <button
          type="button"
          className="pgs-admin__btn"
          onClick={() => setEditing({ ...(config.defaultValues ?? {}) })}
        >
          New
        </button>
      </div>

      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {loading ? <p style={{ color: "#6b6280" }}>Loading…</p> : null}

      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th key={c}>{c.replace(/_/g, " ")}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length + 1}>No rows yet.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  {config.columns.map((c) => (
                    <td key={c}>
                      {typeof row[c] === "boolean"
                        ? row[c]
                          ? "Yes"
                          : "No"
                        : String(row[c] ?? "")}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => setEditing(row)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => void remove(row.id as string | number)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div
          className="pgs-admin__drawer"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div className="pgs-admin__drawer-panel">
            <div className="pgs-admin__toolbar">
              <h2 style={{ margin: 0 }}>
                {editing.id ? "Edit" : "New"} — {config.title}
              </h2>
              <button
                type="button"
                className="pgs-admin__btn pgs-admin__btn--ghost"
                onClick={() => setEditing(null)}
              >
                Close
              </button>
            </div>
            <div className="pgs-admin__form">
              {config.fields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(editing[field.key])}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]: e.target.checked,
                        })
                      }
                    />
                  ) : field.type === "number" ? (
                    <input
                      type="number"
                      value={Number(editing[field.key] ?? 0)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]: Number(e.target.value),
                        })
                      }
                    />
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      value={String(editing[field.key] ?? "").slice(0, 10)}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                    />
                  ) : field.type === "datetime" ? (
                    <input
                      type="datetime-local"
                      value={String(editing[field.key] ?? "")
                        .replace("Z", "")
                        .slice(0, 16)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        })
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                    >
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                className="pgs-admin__btn"
                disabled={loading}
                onClick={() => void save()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
