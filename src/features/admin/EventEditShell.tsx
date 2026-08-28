"use client";

import type { ReactNode } from "react";

type Section = { id: string; label: string };

type Props = {
  title: string;
  dirtyCount: number;
  previewVisible: boolean;
  onTogglePreview: () => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenSite?: () => void;
  onClose: () => void;
  saving?: boolean;
  publishMode: "draft" | "publish";
  /** True when a live version is on the public site. */
  isLive?: boolean;
  sections: Section[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
  form: ReactNode;
  preview: ReactNode;
  editorModeTabs?: ReactNode;
};

export function EventEditShell({
  title,
  dirtyCount,
  previewVisible,
  onTogglePreview,
  onDiscard,
  onSaveDraft,
  onPublish,
  onOpenSite,
  onClose,
  saving = false,
  publishMode,
  isLive = false,
  sections,
  activeSectionId,
  onSectionClick,
  form,
  preview,
  editorModeTabs,
}: Props) {
  return (
    <div
      className={
        previewVisible
          ? "pgs-event-cms"
          : "pgs-event-cms pgs-event-cms--preview-hidden"
      }
    >
      <header className="pgs-event-cms__top">
        <div className="pgs-event-cms__top-left">
          <h1 className="pgs-event-cms__title">{title || "Untitled event"}</h1>
          {dirtyCount > 0 ? (
            <span className="pgs-event-cms__dirty">
              ● {dirtyCount} unpublished change{dirtyCount === 1 ? "" : "s"}
            </span>
          ) : null}
          {publishMode === "draft" ? (
            <span className="pgs-event-cms__phase">Draft</span>
          ) : (
            <span className="pgs-event-cms__phase pgs-event-cms__phase--live">
              Live
            </span>
          )}
        </div>
        <div className="pgs-event-cms__top-actions">
          {sections.length > 0 ? (
            <button
              type="button"
              className="pgs-event-cms__btn pgs-event-cms__btn--ghost"
              onClick={onTogglePreview}
              title="Toggle preview (Ctrl+\)"
            >
              {previewVisible ? "Hide Preview" : "Show Preview"}
            </button>
          ) : null}
          <button
            type="button"
            className="pgs-event-cms__btn pgs-event-cms__btn--ghost"
            onClick={onDiscard}
            disabled={saving || dirtyCount === 0}
            title={
              isLive
                ? "Discard draft edits and restore the live published version (Ctrl+Backspace)"
                : "Discard all changes (Ctrl+Backspace)"
            }
          >
            Discard
          </button>
          <button
            type="button"
            className="pgs-event-cms__btn pgs-event-cms__btn--draft"
            onClick={onSaveDraft}
            disabled={saving}
            title={
              isLive
                ? "Save draft without changing the live page (Ctrl+S)"
                : "Save as Draft (Ctrl+S)"
            }
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="pgs-event-cms__btn pgs-event-cms__btn--publish"
            onClick={onPublish}
            disabled={saving}
            title="Publish Live (Ctrl+Shift+S)"
          >
            Publish Live
          </button>
          {onOpenSite ? (
            <button
              type="button"
              className="pgs-event-cms__btn pgs-event-cms__btn--ghost"
              onClick={onOpenSite}
            >
              Open site
            </button>
          ) : null}
          <button
            type="button"
            className="pgs-event-cms__btn pgs-event-cms__btn--close"
            onClick={onClose}
            aria-label="Close"
            title="Close (Esc)"
          >
            Close
          </button>
        </div>
      </header>

      {editorModeTabs ? (
        <div className="pgs-event-cms__tabs">{editorModeTabs}</div>
      ) : null}

      <div
        className={
          sections.length > 0
            ? "pgs-event-cms__body"
            : "pgs-event-cms__body pgs-event-cms__body--visual"
        }
      >
        {sections.length > 0 ? (
          <nav className="pgs-event-cms__rail" aria-label="Sections">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  section.id === activeSectionId
                    ? "pgs-event-cms__rail-item is-active"
                    : "pgs-event-cms__rail-item"
                }
                onClick={() => onSectionClick(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        ) : null}
        <div className="pgs-event-cms__form">{form}</div>
        {previewVisible && preview ? (
          <aside className="pgs-event-cms__preview">{preview}</aside>
        ) : null}
      </div>
    </div>
  );
}
