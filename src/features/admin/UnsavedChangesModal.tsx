"use client";

type Props = {
  open: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving?: boolean;
  /** True when a live version is already on the public site. */
  isLive?: boolean;
};

export function UnsavedChangesModal({
  open,
  onStay,
  onDiscard,
  onSaveDraft,
  onPublish,
  saving = false,
  isLive = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="pgs-admin-unsaved-modal" role="presentation">
      <div
        className="pgs-admin-unsaved-modal__backdrop"
        onClick={saving ? undefined : onStay}
        aria-hidden
      />
      <div
        className="pgs-admin-unsaved-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pgs-unsaved-title"
      >
        <h2 id="pgs-unsaved-title" className="pgs-admin-unsaved-modal__title">
          You have unsaved changes
        </h2>
        <p className="pgs-admin-unsaved-modal__body">
          {isLive
            ? "Save as draft keeps the live page as-is. Publish Live updates the public page. Discard closes without saving these edits."
            : "Save as draft or publish live before leaving, or discard your edits."}
        </p>
        <div className="pgs-admin-unsaved-modal__actions">
          <button
            type="button"
            className="pgs-admin-unsaved-modal__btn pgs-admin-unsaved-modal__btn--stay"
            onClick={onStay}
            disabled={saving}
          >
            Stay
          </button>
          <button
            type="button"
            className="pgs-admin-unsaved-modal__btn pgs-admin-unsaved-modal__btn--discard"
            onClick={onDiscard}
            disabled={saving}
          >
            Discard
          </button>
          <button
            type="button"
            className="pgs-admin-unsaved-modal__btn pgs-admin-unsaved-modal__btn--save"
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
            className="pgs-admin-unsaved-modal__btn pgs-admin-unsaved-modal__btn--publish"
            onClick={onPublish}
            disabled={saving}
            title="Publish Live (Ctrl+Shift+S)"
          >
            Publish Live
          </button>
        </div>
      </div>
    </div>
  );
}
