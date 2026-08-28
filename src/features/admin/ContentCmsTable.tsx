"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { CONTENT_ENTITIES, type ContentField } from "./content-registry";
import {
  deleteContentRow,
  listContentFkOptions,
  listContentRows,
  upsertContentRow,
} from "./content-actions";
import { MediaAssetField } from "./MediaAssetField";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FK_KEYS = new Set(["country_id", "course_id", "university_id", "category_id"]);

export function ContentCmsTable({ entityKey }: { entityKey: string }) {
  const config = CONTENT_ENTITIES[entityKey];
  const pathname = usePathname();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fkOptions, setFkOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

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

  useEffect(() => {
    if (!config) return;
    const sources = Array.from(
      new Set(
        config.fields
          .map((f) => f.optionsSource)
          .filter(Boolean) as Array<"countries" | "universities" | "courses">,
      ),
    );
    if (sources.length === 0) {
      setFkOptions({});
      return;
    }
    void Promise.all(
      sources.map(async (source) => {
        try {
          const opts = await listContentFkOptions(source);
          return [source, opts] as const;
        } catch {
          return [source, []] as const;
        }
      }),
    ).then((entries) => {
      setFkOptions(Object.fromEntries(entries));
    });
  }, [config, entityKey]);

  const fields = useMemo(() => {
    if (!config) return [] as ContentField[];
    return config.fields.map((field) => {
      if (!field.optionsSource) return field;
      return {
        ...field,
        options: [
          { value: "", label: "— None —" },
          ...(fkOptions[field.optionsSource] ?? []),
        ],
      };
    });
  }, [config, fkOptions]);

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
            Table CMS — create, edit, publish. Fields match Supabase columns.
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
              {fields.map((field) =>
                field.type === "media" ? (
                  <MediaAssetField
                    key={field.key}
                    label={field.label}
                    value={
                      editing[field.key] ? String(editing[field.key]) : null
                    }
                    accept={field.mediaAccept ?? "image"}
                    folder={entityKey}
                    onChange={(id) =>
                      setEditing({ ...editing, [field.key]: id })
                    }
                  />
                ) : (
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
                      value={
                        editing[field.key] === null ||
                        editing[field.key] === undefined
                          ? ""
                          : String(editing[field.key])
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]:
                            e.target.value === ""
                              ? field.nullable
                                ? null
                                : ""
                              : Number(e.target.value),
                        })
                      }
                    />
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      value={
                        editing[field.key]
                          ? String(editing[field.key]).slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]: e.target.value || null,
                        })
                      }
                    />
                  ) : field.type === "datetime" ? (
                    <input
                      type="datetime-local"
                      value={
                        editing[field.key]
                          ? String(editing[field.key])
                              .replace("Z", "")
                              .slice(0, 16)
                          : ""
                      }
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
                      value={
                        editing[field.key] == null || editing[field.key] === ""
                          ? ""
                          : String(editing[field.key])
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        let next: unknown = raw;
                        if (FK_KEYS.has(field.key)) {
                          next =
                            raw === ""
                              ? null
                              : Number(raw);
                        }
                        setEditing({ ...editing, [field.key]: next });
                      }}
                    >
                      {field.options?.map((o) => (
                        <option key={o.value || "none"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]:
                            field.nullable && e.target.value === ""
                              ? null
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </label>
                ),
              )}
              <div className="pgs-admin__form-actions">
                <button
                  type="button"
                  className="pgs-admin__btn"
                  disabled={loading}
                  onClick={() => void save()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="pgs-admin__btn pgs-admin__btn--ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
