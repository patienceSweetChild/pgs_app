"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  clearPathwayDraft,
  listPathwayRows,
  upsertPathwayRow,
} from "./pathway-actions";
import { EventEditShell } from "./EventEditShell";
import { PathwayEditForm } from "./PathwayEditForm";
import { StandalonePreviewPane } from "./StandalonePreviewPane";
import { UnsavedChangesModal } from "./UnsavedChangesModal";
import {
  pathwayToDetail,
  previewKindForDraft,
  sectionsForTemplate,
  topTabsForTemplate,
  getTemplateFromDraft,
  type PathwayDraft,
  type PathwayTopTabId,
} from "./pathway-preview-map";

function cloneDraft(row: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(row)) as Record<string, unknown>;
}

function countDirtyKeys(
  current: Record<string, unknown> | null,
  baseline: Record<string, unknown> | null,
): number {
  if (!current || !baseline) return 0;
  const keys = new Set([...Object.keys(current), ...Object.keys(baseline)]);
  let n = 0;
  for (const key of keys) {
    if (JSON.stringify(current[key]) !== JSON.stringify(baseline[key])) {
      n += 1;
    }
  }
  return n;
}

const DRAFT_HISTORY_CAP = 50;
const DRAFT_COALESCE_MS = 400;

function changedTopLevelKeys(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const key of keys) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
      changed.push(key);
    }
  }
  return changed;
}

function isEditableHotkeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

export function PathwayCmsTable() {
  const pathname = usePathname();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<PathwayDraft | null>(null);
  const [baseline, setBaseline] = useState<PathwayDraft | null>(null);
  const [liveBaseline, setLiveBaseline] = useState<PathwayDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState<PathwayTopTabId>("intro");
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const pastDraftsRef = useRef<PathwayDraft[]>([]);
  const futureDraftsRef = useRef<PathwayDraft[]>([]);
  const coalesceRef = useRef<{ at: number; key: string | null }>({
    at: 0,
    key: null,
  });
  const editingRef = useRef(editing);
  editingRef.current = editing;

  const template = editing ? getTemplateFromDraft(editing) : "medical";

  const unsavedCount = useMemo(
    () => countDirtyKeys(editing, baseline),
    [editing, baseline],
  );
  const unpublishedCount = useMemo(() => {
    if (liveBaseline) return countDirtyKeys(editing, liveBaseline);
    return countDirtyKeys(editing, baseline);
  }, [editing, baseline, liveBaseline]);
  const isDirty = unsavedCount > 0;
  const isLivePublished = Boolean(liveBaseline?.published || editing?.published);

  const railSections = useMemo(
    () => sectionsForTemplate(template, activeTopTab),
    [template, activeTopTab],
  );

  const topTabs = useMemo(() => topTabsForTemplate(template), [template]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPathwayRows();
      setRows(data as Record<string, unknown>[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setEditing(null);
    setBaseline(null);
    setLiveBaseline(null);
    pastDraftsRef.current = [];
    futureDraftsRef.current = [];
  }, [pathname]);

  useEffect(() => {
    const first = sectionsForTemplate(template, activeTopTab)[0];
    if (first) setActiveSectionId(first.id);
  }, [activeTopTab, template]);

  function clearDraftHistory() {
    pastDraftsRef.current = [];
    futureDraftsRef.current = [];
    coalesceRef.current = { at: 0, key: null };
  }

  async function openEdit(row: Record<string, unknown>) {
    const next = { ...row };
    const storedDraft = next.cms_draft;
    delete next.cms_draft;

    const liveSnapshot = cloneDraft(next);
    let editorDoc = liveSnapshot;
    if (
      storedDraft &&
      typeof storedDraft === "object" &&
      !Array.isArray(storedDraft)
    ) {
      editorDoc = {
        ...liveSnapshot,
        ...(storedDraft as Record<string, unknown>),
        id: liveSnapshot.id,
        published: Boolean(liveSnapshot.published),
      };
    }

    clearDraftHistory();
    setLiveBaseline(
      liveSnapshot.published ? (cloneDraft(liveSnapshot) as PathwayDraft) : null,
    );
    setEditing(editorDoc as PathwayDraft);
    setBaseline(cloneDraft(editorDoc) as PathwayDraft);
    setActiveTopTab("intro");
    setActiveSectionId("hero");
    setPreviewVisible(true);
    setLeaveModalOpen(false);
  }

  function requestCloseEditor() {
    if (isDirty) {
      setLeaveModalOpen(true);
      return;
    }
    clearDraftHistory();
    setEditing(null);
    setBaseline(null);
    setLiveBaseline(null);
    setLeaveModalOpen(false);
  }

  async function discardEdits() {
    clearDraftHistory();
    const live = liveBaseline;
    const rowId = editing?.id ?? live?.id;
    if (live && rowId != null && Boolean(live.published)) {
      setLoading(true);
      setError(null);
      try {
        await clearPathwayDraft(Number(rowId));
        const restored = cloneDraft(live) as PathwayDraft;
        setEditing(restored);
        setBaseline(cloneDraft(restored) as PathwayDraft);
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Discard failed");
      } finally {
        setLoading(false);
      }
      setLeaveModalOpen(false);
      return;
    }
    if (baseline) {
      setEditing(cloneDraft(baseline) as PathwayDraft);
    } else {
      setEditing(null);
      setBaseline(null);
      setLiveBaseline(null);
    }
    setLeaveModalOpen(false);
  }

  function applyDraft(next: PathwayDraft) {
    const current = editingRef.current;
    if (!current) {
      setEditing(next);
      return;
    }
    const changed = changedTopLevelKeys(current, next);
    if (changed.length === 0) {
      setEditing(next);
      return;
    }
    const now = Date.now();
    const singleKey = changed.length === 1 ? changed[0] : null;
    const coalesce = coalesceRef.current;
    const shouldCoalesce =
      singleKey != null &&
      coalesce.key === singleKey &&
      now - coalesce.at < DRAFT_COALESCE_MS;

    if (!shouldCoalesce) {
      pastDraftsRef.current = [
        ...pastDraftsRef.current.slice(-(DRAFT_HISTORY_CAP - 1)),
        cloneDraft(current) as PathwayDraft,
      ];
      futureDraftsRef.current = [];
      coalesceRef.current = { at: now, key: singleKey };
    } else {
      coalesceRef.current = { at: now, key: singleKey };
    }
    setEditing(next);
  }

  function payloadForSave(row: PathwayDraft) {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      template: row.template,
      published: row.published,
      display_order: row.display_order,
      page_content: row.page_content,
    };
  }

  async function save(options?: { published?: boolean; stayOpen?: boolean }) {
    if (!editing) return;
    setLoading(true);
    setError(null);
    const stayOpen = Boolean(options?.stayOpen);
    const mode = options?.published === true ? "publish" : "draft";
    const nextEditing: PathwayDraft = {
      ...editing,
      published:
        mode === "publish"
          ? true
          : isLivePublished || Boolean(editing.published)
            ? true
            : false,
    };

    try {
      const payload = payloadForSave(nextEditing);
      const result = await upsertPathwayRow(payload, { mode });
      const saved = {
        ...nextEditing,
        published: result?.published ?? nextEditing.published,
      } as PathwayDraft;
      if (result?.id != null) saved.id = result.id;
      if (result?.slug) saved.slug = result.slug;

      if (stayOpen) {
        clearDraftHistory();
        const normalized = cloneDraft(saved) as PathwayDraft;
        setEditing(normalized);
        setBaseline(cloneDraft(normalized) as PathwayDraft);
        if (mode === "publish") {
          setLiveBaseline(cloneDraft(normalized) as PathwayDraft);
        } else if (!result?.published) {
          setLiveBaseline(null);
        }
        await reload();
      } else {
        clearDraftHistory();
        setEditing(null);
        setBaseline(null);
        setLiveBaseline(null);
        await reload();
      }
      setLeaveModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!editing) return;
      if (isEditableHotkeyTarget(e.target) && !e.ctrlKey && !e.metaKey) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        setPreviewVisible((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        void save({ published: false, stayOpen: true });
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
        e.preventDefault();
        void save({ published: true, stayOpen: true });
      }
      if (e.key === "Escape") {
        requestCloseEditor();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div>
      <div className="pgs-admin__toolbar">
        <div>
          <h1 style={{ margin: 0 }}>Pathways</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            Edit PurplePremium pathway pages with live preview — medical and
            non-medical templates.
          </p>
        </div>
      </div>

      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {loading && !editing ? (
        <p style={{ color: "#6b6280" }}>Loading…</p>
      ) : null}

      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Template</th>
              <th>Published</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>No pathways yet.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  <td>{String(row.name ?? "")}</td>
                  <td>{String(row.slug ?? "")}</td>
                  <td>{String(row.template ?? "")}</td>
                  <td>{row.published ? "Yes" : "No"}</td>
                  <td>{String(row.display_order ?? 0)}</td>
                  <td>
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => void openEdit(row)}
                    >
                      Edit
                    </button>
                    {row.hasDraft ? (
                      <span className="pgs-admin__badge"> Draft</span>
                    ) : null}
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
            if (e.target === e.currentTarget) requestCloseEditor();
          }}
        >
          <div className="pgs-admin__drawer-panel pgs-admin__drawer-panel--preview-form">
            <EventEditShell
              title={String(editing.name ?? "Untitled pathway")}
              dirtyCount={unpublishedCount}
              previewVisible={previewVisible}
              onTogglePreview={() => setPreviewVisible((v) => !v)}
              onDiscard={() => void discardEdits()}
              onSaveDraft={() => void save({ published: false, stayOpen: true })}
              onPublish={() => void save({ published: true, stayOpen: true })}
              onOpenSite={
                editing.slug
                  ? () =>
                      window.open(`/pathways/${editing.slug}`, "_blank")
                  : undefined
              }
              onClose={requestCloseEditor}
              saving={loading}
              publishMode={isLivePublished ? "publish" : "draft"}
              isLive={isLivePublished}
              sections={railSections}
              activeSectionId={activeSectionId}
              onSectionClick={(id) => {
                setActiveSectionId(id);
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              editorModeTabs={
                <div className="pgs-admin__tabs" role="tablist">
                  {topTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      className={
                        activeTopTab === tab.id ? "is-active" : undefined
                      }
                      onClick={() => setActiveTopTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              }
              form={
                <PathwayEditForm draft={editing} onChange={applyDraft} />
              }
              preview={
                <StandalonePreviewPane
                  kind={previewKindForDraft(editing)}
                  detail={pathwayToDetail(editing)}
                  label="Pathway page"
                  publishMode={editing.published ? "publish" : "draft"}
                  onPublishModeChange={(mode) =>
                    applyDraft({
                      ...editing,
                      published: mode === "publish",
                    })
                  }
                  showDraftBanner={!editing.published}
                />
              }
            />
          </div>
        </div>
      ) : null}

      <UnsavedChangesModal
        open={leaveModalOpen}
        onStay={() => setLeaveModalOpen(false)}
        onDiscard={() => void discardEdits()}
        onSaveDraft={() => void save({ published: false, stayOpen: true })}
        onPublish={() => void save({ published: true, stayOpen: true })}
        saving={loading}
        isLive={isLivePublished}
      />
    </div>
  );
}
