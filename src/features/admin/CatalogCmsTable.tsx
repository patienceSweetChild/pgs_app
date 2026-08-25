"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  listCatalogCategoryOptions,
  listCatalogRows,
  setCatalogPhase,
  upsertCatalogRow,
  type CatalogEntity,
  type LifecyclePhase,
} from "./catalog-actions";
import { EventVisualEditor } from "./EventVisualEditor";
import { EVENT_VISUAL_KEYS } from "./event-preview-map";

type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "checkbox"
    | "select"
    | "number"
    | "date"
    | "datetime";
  options?: { value: string; label: string }[];
  /** Empty string is sent as null (nullable DB columns). */
  nullable?: boolean;
};

const PHASE_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
  { value: "archived", label: "Archived" },
];

const FIELDS: Record<CatalogEntity, Field[]> = {
  courses: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "short_description", label: "Short description", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category_id", label: "Category", type: "select", nullable: true },
    { key: "duration", label: "Duration" },
    { key: "mode", label: "Mode" },
    { key: "starts_on", label: "Starts on", type: "date", nullable: true },
    { key: "ends_on", label: "Ends on", type: "date", nullable: true },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Image asset ID",
      nullable: true,
    },
    {
      key: "brochure_asset_id",
      label: "Brochure asset ID",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
  events: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "category_id", label: "Category", type: "select", nullable: true },
    { key: "host", label: "Host" },
    { key: "top_label", label: "Top label" },
    { key: "badge", label: "Badge" },
    { key: "location_note", label: "Location note" },
    { key: "mode", label: "Mode" },
    { key: "starts_at", label: "Starts at", type: "datetime", nullable: true },
    { key: "ends_at", label: "Ends at", type: "datetime", nullable: true },
    { key: "booking_url", label: "Booking URL", nullable: true },
    { key: "who_is_it_for", label: "Who is it for", type: "textarea" },
    { key: "session_topics", label: "Session topics", type: "textarea" },
    { key: "what_we_cover", label: "What we cover", type: "textarea" },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Image asset ID",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
  programs: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "short_description", label: "Short description", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "top_label", label: "Top label" },
    { key: "badge_text", label: "Badge" },
    { key: "close_date_text", label: "Close date text" },
    { key: "learn_more_url", label: "Learn more URL", nullable: true },
    { key: "who_is_it_for", label: "Who is it for", type: "textarea" },
    { key: "session_topics", label: "Session topics", type: "textarea" },
    { key: "highlight_1", label: "Highlight 1" },
    { key: "highlight_2", label: "Highlight 2" },
    { key: "highlight_3", label: "Highlight 3" },
    { key: "highlight_4", label: "Highlight 4" },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Image asset ID",
      nullable: true,
    },
    {
      key: "brochure_asset_id",
      label: "Brochure asset ID",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
};

const PHASES: Array<LifecyclePhase | "all"> = [
  "all",
  "live",
  "ended",
  "archived",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CatalogCmsTable({
  entity,
  title,
}: {
  entity: CatalogEntity;
  title: string;
}) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<LifecyclePhase | "all">("live");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  /** Events only: ACF form vs visual template previews. */
  const [editorMode, setEditorMode] = useState<"form" | "visual">(
    entity === "events" ? "visual" : "form",
  );
  const [visualFocusField, setVisualFocusField] = useState<string | null>(
    "title",
  );
  const fields = useMemo(() => {
    return FIELDS[entity].map((field) => {
      if (field.key !== "category_id") return field;
      return {
        ...field,
        options: [
          { value: "", label: "— None —" },
          ...categoryOptions,
        ],
      };
    });
  }, [entity, categoryOptions]);

  const reload = useCallback(
    async (nextPhase: LifecyclePhase | "all" = phase) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listCatalogRows(entity, nextPhase);
        setRows(data as Record<string, unknown>[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [entity, phase],
  );

  useEffect(() => {
    void reload(phase);
  }, [reload, phase]);

  useEffect(() => {
    setEditing(null);
    setEditorMode(entity === "events" ? "visual" : "form");
    setVisualFocusField("title");
    setCategoryOptions([]);
    if (entity === "programs") return;
    void listCatalogCategoryOptions(entity)
      .then(setCategoryOptions)
      .catch(() => setCategoryOptions([]));
  }, [pathname, entity]);

  const columns = useMemo(
    () => ["title", "slug", "published", "lifecycle_phase", "updated_at"],
    [],
  );

  function openNew() {
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        defaults[field.key] = false;
      } else if (field.key === "lifecycle_phase") {
        defaults[field.key] = "live";
      } else if (field.type === "number") {
        defaults[field.key] = field.nullable ? "" : 0;
      } else if (field.key === "category_id") {
        defaults[field.key] = "";
      } else {
        defaults[field.key] = "";
      }
    }
    if (entity === "events") {
      defaults.card_surfaces = [...EVENT_VISUAL_KEYS];
    }
    setEditing(defaults);
    if (entity === "events") setEditorMode("visual");
  }

  function payloadForEntity(row: Record<string, unknown>) {
    const payload: Record<string, unknown> = {};
    if (row.id != null) payload.id = row.id;
    for (const field of fields) {
      if (!(field.key in row)) continue;
      let value = row[field.key];
      if (field.key === "category_id") {
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          value === 0 ||
          value === "0"
        ) {
          value = null;
        } else {
          value = Number(value);
        }
      } else if (field.type === "number") {
        if (value === "" || value === null || value === undefined) {
          value = field.nullable ? null : 0;
        } else {
          value = Number(value);
        }
      } else if (
        field.nullable &&
        (value === "" || value === undefined)
      ) {
        value = null;
      }
      payload[field.key] = value;
    }
    if (entity === "events") {
      payload.card_surfaces = Array.isArray(row.card_surfaces)
        ? row.card_surfaces
        : [...EVENT_VISUAL_KEYS];
    }
    return payload;
  }

  async function save() {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      const payload = payloadForEntity(editing);
      if (!payload.slug && typeof payload.title === "string") {
        payload.slug = slugify(payload.title);
      }
      await upsertCatalogRow(entity, payload);
      setEditing(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function archiveRow(id: number) {
    setLoading(true);
    setError(null);
    try {
      await setCatalogPhase(entity, id, "archived");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="pgs-admin__toolbar">
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            {entity === "events"
              ? "Edit as Form (ACF) or Visual templates — one record updates all 7 layouts."
              : "Collection table — filter by phase, edit in drawer."}
          </p>
        </div>
        <button type="button" className="pgs-admin__btn" onClick={openNew}>
          New {entity.slice(0, -1)}
        </button>
      </div>

      <div className="pgs-admin__tabs" style={{ marginBottom: "0.85rem" }}>
        {PHASES.map((p) => (
          <button
            key={p}
            type="button"
            className={phase === p ? "is-active" : undefined}
            onClick={() => setPhase(p)}
          >
            {p === "all" ? "All" : p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
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
              {columns.map((c) => (
                <th key={c}>{c.replace(/_/g, " ")}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>No rows in this phase.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  {columns.map((c) => (
                    <td key={c}>
                      {c === "lifecycle_phase" ? (
                        <span
                          className={`pgs-admin__badge pgs-admin__badge--${String(row[c])}`}
                        >
                          {String(row[c])}
                        </span>
                      ) : c === "published" ? (
                        row[c] ? "Yes" : "No"
                      ) : (
                        String(row[c] ?? "")
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => {
                        const next = { ...row };
                        if (entity === "events" && !Array.isArray(next.card_surfaces)) {
                          next.card_surfaces = [...EVENT_VISUAL_KEYS];
                        }
                        setEditing(next);
                        if (entity === "events") setEditorMode("visual");
                      }}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => void archiveRow(Number(row.id))}
                    >
                      Archive
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
          <div
            className={`pgs-admin__drawer-panel${
              entity === "events" && editorMode === "visual"
                ? " pgs-admin__drawer-panel--wide"
                : entity === "events"
                  ? " pgs-admin__drawer-panel--md"
                  : ""
            }`}
          >
            <div className="pgs-admin__toolbar">
              <h2 style={{ margin: 0 }}>
                {editing.id ? "Edit" : "New"} {entity.slice(0, -1)}
              </h2>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {entity === "events" ? (
                  <div className="pgs-admin__tabs" role="tablist">
                    <button
                      type="button"
                      className={editorMode === "form" ? "is-active" : undefined}
                      onClick={() => setEditorMode("form")}
                    >
                      Form (ACF)
                    </button>
                    <button
                      type="button"
                      className={
                        editorMode === "visual" ? "is-active" : undefined
                      }
                      onClick={() => setEditorMode("visual")}
                    >
                      Visual templates
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="pgs-admin__btn pgs-admin__btn--ghost"
                  onClick={() => setEditing(null)}
                >
                  Close
                </button>
              </div>
            </div>

            {entity === "events" && editorMode === "visual" ? (
              <>
                <EventVisualEditor
                  draft={editing}
                  onChange={setEditing}
                  focusField={visualFocusField}
                  onFocusField={(key) => {
                    setVisualFocusField(key);
                    requestAnimationFrame(() => {
                      document
                        .getElementById(`visual-field-${key}`)
                        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                      const el = document.querySelector(
                        `#visual-field-${key} input, #visual-field-${key} textarea`,
                      ) as HTMLInputElement | HTMLTextAreaElement | null;
                      el?.focus();
                    });
                  }}
                />
                <div style={{ marginTop: "1rem" }}>
                  <button
                    type="button"
                    className="pgs-admin__btn"
                    onClick={() => void save()}
                    disabled={loading}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <div className="pgs-admin__form">
                {fields.map((field) => (
                  <label key={field.key}>
                    {field.label}
                    {field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={String(editing[field.key] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.key]: e.target.value,
                          })
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
                                ? ""
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
                          field.key === "category_id"
                            ? editing[field.key] == null ||
                              editing[field.key] === ""
                              ? ""
                              : String(editing[field.key])
                            : String(editing[field.key] ?? "live")
                        }
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.key]:
                              field.key === "category_id" &&
                              e.target.value === ""
                                ? null
                                : field.key === "category_id"
                                  ? Number(e.target.value)
                                  : e.target.value,
                          })
                        }
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
                            [field.key]: e.target.value,
                          })
                        }
                      />
                    )}
                  </label>
                ))}
                <button
                  type="button"
                  className="pgs-admin__btn"
                  onClick={() => void save()}
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
