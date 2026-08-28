"use client";

import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";

export type FacilitatorDraft = {
  name: string;
  role: string;
  biography: string;
  image_asset_id: string | null;
  /** Resolved public URL for live page preview */
  image_url: string;
};

export function emptyFacilitator(): FacilitatorDraft {
  return {
    name: "",
    role: "",
    biography: "",
    image_asset_id: null,
    image_url: "/assets/img/founder.png",
  };
}

type Props = {
  value: FacilitatorDraft[];
  onChange: (next: FacilitatorDraft[]) => void;
};

export function EventFacilitatorsField({ value, onChange }: Props) {
  const list = value.length > 0 ? value : [];

  function updateAt(index: number, patch: Partial<FacilitatorDraft>) {
    const next = list.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange(next);
  }

  async function setImage(index: number, assetId: string | null) {
    if (!assetId) {
      updateAt(index, {
        image_asset_id: null,
        image_url: "/assets/img/founder.png",
      });
      return;
    }
    try {
      const preview = await getMediaAssetPreview(assetId);
      updateAt(index, {
        image_asset_id: assetId,
        image_url: preview?.publicUrl || "/assets/img/founder.png",
      });
    } catch {
      updateAt(index, {
        image_asset_id: assetId,
        image_url: "/assets/img/founder.png",
      });
    }
  }

  return (
    <div className="pgs-admin-facilitators">
      <div className="pgs-admin-facilitators__head">
        <strong>Meet Your Facilitators</strong>
        <span>Shown on the session page</span>
      </div>
      {list.length === 0 ? (
        <p className="pgs-admin-facilitators__empty">
          No facilitators yet. Add one to fill the “Meet Your Facilitators”
          section.
        </p>
      ) : null}
      {list.map((row, index) => (
        <div key={`fac-${index}`} className="pgs-admin-facilitators__card">
          <div className="pgs-admin-facilitators__card-head">
            <span>Facilitator {index + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(list.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
          <label>
            Name
            <input
              value={row.name}
              onChange={(e) => updateAt(index, { name: e.target.value })}
              placeholder="e.g. Vidhi"
            />
          </label>
          <label>
            Role
            <input
              value={row.role}
              onChange={(e) => updateAt(index, { role: e.target.value })}
              placeholder="e.g. Counsellor"
            />
          </label>
          <label>
            Biography
            <textarea
              rows={3}
              value={row.biography}
              onChange={(e) => updateAt(index, { biography: e.target.value })}
            />
          </label>
          <MediaAssetField
            label="Photo"
            value={row.image_asset_id}
            accept="image"
            folder="events/facilitators"
            onChange={(id) => void setImage(index, id)}
          />
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...list, emptyFacilitator()])}
      >
        + Add facilitator
      </button>
    </div>
  );
}
