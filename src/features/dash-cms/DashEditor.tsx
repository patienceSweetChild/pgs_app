"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EventEditShell } from "@/features/admin/EventEditShell";
import { StandalonePreviewPane } from "@/features/admin/StandalonePreviewPane";
import { UnsavedChangesModal } from "@/features/admin/UnsavedChangesModal";
import type { StudentDashboardContent } from "@/features/dashboard/content";
import {
  discardDashboardDraft,
  saveDashboardDoc,
  type DashEditorPayload,
} from "./dash-actions";
import { DASH_EDIT_SECTIONS, DashEditForm } from "./DashEditForm";

function cloneContent(value: StudentDashboardContent): StudentDashboardContent {
  return JSON.parse(JSON.stringify(value)) as StudentDashboardContent;
}

function countDirty(
  current: StudentDashboardContent | null,
  baseline: StudentDashboardContent | null,
): number {
  if (!current || !baseline) return 0;
  const keys = new Set([
    ...Object.keys(current),
    ...Object.keys(baseline),
  ]) as Set<keyof StudentDashboardContent>;
  let n = 0;
  for (const key of keys) {
    if (JSON.stringify(current[key]) !== JSON.stringify(baseline[key])) n += 1;
  }
  return n;
}

function isEditableHotkeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

export function DashEditor({ initial }: { initial: DashEditorPayload }) {
  const router = useRouter();
  const [editing, setEditing] = useState(() => cloneContent(initial.content));
  const [baseline, setBaseline] = useState(() => cloneContent(initial.content));
  const [liveBaseline, setLiveBaseline] = useState<StudentDashboardContent | null>(
    initial.liveContent ? cloneContent(initial.liveContent) : null,
  );
  const [previewVisible, setPreviewVisible] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    DASH_EDIT_SECTIONS[0].id,
  );
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"draft" | "publish">("draft");

  const unpublishedCount = useMemo(
    () => countDirty(editing, liveBaseline ?? baseline),
    [editing, baseline, liveBaseline],
  );
  const unsavedCount = useMemo(
    () => countDirty(editing, baseline),
    [editing, baseline],
  );
  const isLive = Boolean(liveBaseline);
  const isDirty = unsavedCount > 0;

  const close = useCallback(() => {
    router.push("/dash");
  }, [router]);

  function requestClose() {
    if (isDirty) {
      setLeaveModalOpen(true);
      return;
    }
    close();
  }

  async function save(mode: "draft" | "publish"): Promise<boolean> {
    if (!initial.canManage) return false;
    setSaving(true);
    setError(null);
    try {
      const result = await saveDashboardDoc(initial.studentId, editing, mode);
      const next = cloneContent(editing);
      setBaseline(cloneContent(next));
      if (mode === "publish") {
        setLiveBaseline(cloneContent(next));
      } else if (!result.published) {
        setLiveBaseline(null);
      }
      setLeaveModalOpen(false);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function discard() {
    if (isLive) {
      setSaving(true);
      setError(null);
      try {
        await discardDashboardDraft(initial.studentId);
        const restored = cloneContent(liveBaseline ?? baseline);
        setEditing(restored);
        setBaseline(cloneContent(restored));
        setLeaveModalOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Discard failed");
      } finally {
        setSaving(false);
      }
      return;
    }
    setEditing(cloneContent(baseline));
    setLeaveModalOpen(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isEditableHotkeyTarget(e.target) && !e.ctrlKey && !e.metaKey) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        setPreviewVisible((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        void save("draft");
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        void save("publish");
      }
      if (e.key === "Escape") requestClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      {error ? (
        <p role="alert" className="pgs-dash-cms__error">
          {error}
        </p>
      ) : null}
      <EventEditShell
        title={initial.fullName}
        dirtyCount={unpublishedCount}
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((v) => !v)}
        onDiscard={() => void discard()}
        onSaveDraft={() => void save("draft")}
        onPublish={() => void save("publish")}
        onOpenSite={() =>
          window.open(`/dashboard?studentId=${initial.studentId}`, "_blank")
        }
        onClose={requestClose}
        saving={saving || !initial.canManage}
        publishMode={isLive ? "publish" : "draft"}
        isLive={isLive}
        sections={[...DASH_EDIT_SECTIONS]}
        activeSectionId={activeSectionId}
        onSectionClick={(id) => {
          setActiveSectionId(id);
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        form={
          <DashEditForm
            draft={editing}
            onChange={setEditing}
            catalogOptions={initial.catalogOptions}
          />
        }
        preview={
          <StandalonePreviewPane
            kind="dashboard"
            label="Student dashboard"
            detail={{
              content: editing,
              identity: initial.identity,
            }}
            publishMode={previewMode}
            onPublishModeChange={setPreviewMode}
            showDraftBanner={previewMode === "draft"}
          />
        }
      />
      <UnsavedChangesModal
        open={leaveModalOpen}
        onStay={() => setLeaveModalOpen(false)}
        onDiscard={() => void discard().then(() => close())}
        onSaveDraft={() =>
          void save("draft").then((ok) => {
            if (ok) close();
          })
        }
        onPublish={() =>
          void save("publish").then((ok) => {
            if (ok) close();
          })
        }
        saving={saving}
        isLive={isLive}
      />
    </>
  );
}
