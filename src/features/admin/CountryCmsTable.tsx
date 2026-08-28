"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  clearCountryDraft,
  listCountryRows,
  upsertCountryRow,
} from "./country-actions";
import { EventEditShell } from "./EventEditShell";
import { CountryEditForm } from "./CountryEditForm";
import { StandalonePreviewPane } from "./StandalonePreviewPane";
import { UnsavedChangesModal } from "./UnsavedChangesModal";
import {
  countryMockDraft,
  countryToDetail,
  sectionsForTab,
  topTabsForDraft,
  COUNTRY_EDIT_SECTIONS,
  type CountryDraft,
  type CountryTopTabId,
} from "./country-preview-map";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

function hydrateHeroFromContent(row: Record<string, unknown>) {
  const next = { ...row };
  const content = next.page_content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const hero = (content as { hero?: Record<string, string | null> }).hero;
    if (hero) {
      if (!next.hero_flag_url) next.hero_flag_url = hero.flagImage ?? "";
      if (!next.hero_desktop_url) next.hero_desktop_url = hero.desktopImage ?? "";
      if (!next.hero_mobile_url) next.hero_mobile_url = hero.mobileImage ?? "";
      if (!next.hero_flag_asset_id && hero.flagImageAssetId) {
        next.hero_flag_asset_id = hero.flagImageAssetId;
      }
      if (!next.hero_desktop_asset_id && hero.desktopImageAssetId) {
        next.hero_desktop_asset_id = hero.desktopImageAssetId;
      }
      if (!next.hero_mobile_asset_id && hero.mobileImageAssetId) {
        next.hero_mobile_asset_id = hero.mobileImageAssetId;
      }
    }
  }
  return next;
}

export function CountryCmsTable() {
  const pathname = usePathname();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<CountryDraft | null>(null);
  const [baseline, setBaseline] = useState<CountryDraft | null>(null);
  const [liveBaseline, setLiveBaseline] = useState<CountryDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState<CountryTopTabId>("page");
  const [activeSectionId, setActiveSectionId] = useState(
    COUNTRY_EDIT_SECTIONS[0].id,
  );
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const pastDraftsRef = useRef<CountryDraft[]>([]);
  const futureDraftsRef = useRef<CountryDraft[]>([]);
  const coalesceRef = useRef<{ at: number; key: string | null }>({
    at: 0,
    key: null,
  });
  const editingRef = useRef(editing);
  editingRef.current = editing;
  const baselineRef = useRef(baseline);
  baselineRef.current = baseline;

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
    () => sectionsForTab(activeTopTab),
    [activeTopTab],
  );

  const topTabs = useMemo(
    () => (editing ? topTabsForDraft(editing) : []),
    [editing],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCountryRows();
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
    const first = sectionsForTab(activeTopTab)[0];
    if (first) setActiveSectionId(first.id);
  }, [activeTopTab]);

  function clearDraftHistory() {
    pastDraftsRef.current = [];
    futureDraftsRef.current = [];
    coalesceRef.current = { at: 0, key: null };
  }

  async function openEdit(row: Record<string, unknown>) {
    const next = hydrateHeroFromContent({ ...row });
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

    editorDoc = hydrateHeroFromContent(editorDoc);

    clearDraftHistory();
    setLiveBaseline(
      liveSnapshot.published ? (cloneDraft(liveSnapshot) as CountryDraft) : null,
    );
    setEditing(editorDoc as CountryDraft);
    setBaseline(cloneDraft(editorDoc) as CountryDraft);
    setActiveTopTab("page");
    setActiveSectionId("hero");
    setPreviewVisible(true);
    setLeaveModalOpen(false);
  }

  function openNew() {
    clearDraftHistory();
    const mock = countryMockDraft();
    const maxOrder = rows.reduce(
      (max, row) => Math.max(max, Number(row.display_order ?? 0)),
      -1,
    );
    mock.display_order = maxOrder + 1;
    setLiveBaseline(null);
    setEditing(mock);
    setBaseline(cloneDraft(mock) as CountryDraft);
    setActiveTopTab("page");
    setActiveSectionId("hero");
    setPreviewVisible(true);
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
        await clearCountryDraft(Number(rowId));
        const restored = cloneDraft(live) as CountryDraft;
        setEditing(restored);
        setBaseline(cloneDraft(restored) as CountryDraft);
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
      setEditing(cloneDraft(baseline) as CountryDraft);
    } else {
      setEditing(null);
      setBaseline(null);
      setLiveBaseline(null);
    }
    setLeaveModalOpen(false);
  }

  function applyDraft(next: CountryDraft) {
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
        cloneDraft(current) as CountryDraft,
      ];
      futureDraftsRef.current = [];
      coalesceRef.current = { at: now, key: singleKey };
    } else {
      coalesceRef.current = { at: now, key: singleKey };
    }
    setEditing(next);
  }

  function payloadForSave(row: CountryDraft) {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      iso_code: row.iso_code,
      dial_code: row.dial_code,
      published: row.published,
      display_order: row.display_order,
      page_content: row.page_content,
      hero_flag_asset_id: row.hero_flag_asset_id,
      hero_desktop_asset_id: row.hero_desktop_asset_id,
      hero_mobile_asset_id: row.hero_mobile_asset_id,
      hero_flag_url: row.hero_flag_url,
      hero_desktop_url: row.hero_desktop_url,
      hero_mobile_url: row.hero_mobile_url,
    };
  }

  async function save(options?: { published?: boolean; stayOpen?: boolean }) {
    if (!editing) return;
    setLoading(true);
    setError(null);
    const stayOpen = Boolean(options?.stayOpen);
    const mode = options?.published === true ? "publish" : "draft";
    const nextEditing: CountryDraft = {
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
      if (!payload.slug && typeof payload.name === "string") {
        payload.slug = slugify(payload.name);
      }
      const result = await upsertCountryRow(payload, { mode });
      const saved = {
        ...nextEditing,
        published: result?.published ?? nextEditing.published,
      } as CountryDraft;
      if (result?.id != null) saved.id = result.id;
      if (result?.slug) saved.slug = result.slug;

      if (stayOpen) {
        clearDraftHistory();
        const normalized = cloneDraft(saved) as CountryDraft;
        setEditing(normalized);
        setBaseline(cloneDraft(normalized) as CountryDraft);
        if (mode === "publish") {
          setLiveBaseline(cloneDraft(normalized) as CountryDraft);
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
          <h1 style={{ margin: 0 }}>Countries</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            Edit country pages with live preview — one template for every country.
          </p>
        </div>
        <button
          type="button"
          className="pgs-admin__btn"
          onClick={() => openNew()}
          disabled={loading}
        >
          New country
        </button>
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
              <th>Published</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>No countries yet. Click New country to add one.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  <td>{String(row.name ?? "")}</td>
                  <td>{String(row.slug ?? "")}</td>
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
              title={String(editing.name ?? "Untitled country")}
              dirtyCount={unpublishedCount}
              previewVisible={previewVisible}
              onTogglePreview={() => setPreviewVisible((v) => !v)}
              onDiscard={() => void discardEdits()}
              onSaveDraft={() => void save({ published: false, stayOpen: true })}
              onPublish={() => void save({ published: true, stayOpen: true })}
              onOpenSite={
                editing.slug
                  ? () =>
                      window.open(`/countries/${editing.slug}`, "_blank")
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
                <CountryEditForm draft={editing} onChange={applyDraft} />
              }
              preview={
                <StandalonePreviewPane
                  kind="country"
                  detail={countryToDetail(editing)}
                  label="Country page"
                  publishMode={editing.published ? "publish" : "draft"}
                  onPublishModeChange={(mode) =>
                    applyDraft({
                      ...editing,
                      published: mode === "publish",
                    })
                  }
                  showDraftBanner={!editing.published}
                  activeTabId={activeTopTab}
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
