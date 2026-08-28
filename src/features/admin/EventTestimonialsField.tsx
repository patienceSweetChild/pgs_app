"use client";

import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";

export type TestimonialDraft = {
  name: string;
  quote: string;
  role: string;
  location: string;
  image_asset_id: string | null;
  /** Resolved public URL for live page preview */
  image_url: string;
};

export function emptyTestimonial(): TestimonialDraft {
  return {
    name: "",
    quote: "",
    role: "",
    location: "",
    image_asset_id: null,
    image_url: "/assets/img/photo-2.jpg",
  };
}

type Props = {
  value: TestimonialDraft[];
  onChange: (next: TestimonialDraft[]) => void;
};

export function EventTestimonialsField({ value, onChange }: Props) {
  const list = value.length > 0 ? value : [];

  function updateAt(index: number, patch: Partial<TestimonialDraft>) {
    const next = list.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange(next);
  }

  async function setImage(index: number, assetId: string | null) {
    if (!assetId) {
      updateAt(index, {
        image_asset_id: null,
        image_url: "/assets/img/photo-2.jpg",
      });
      return;
    }
    try {
      const preview = await getMediaAssetPreview(assetId);
      updateAt(index, {
        image_asset_id: assetId,
        image_url: preview?.publicUrl || "/assets/img/photo-2.jpg",
      });
    } catch {
      updateAt(index, {
        image_asset_id: assetId,
        image_url: "/assets/img/photo-2.jpg",
      });
    }
  }

  return (
    <div className="pgs-admin-facilitators">
      <div className="pgs-admin-facilitators__head">
        <strong>Testimonials</strong>
        <span>Shown on the session page carousel</span>
      </div>
      {list.length === 0 ? (
        <p className="pgs-admin-facilitators__empty">
          No testimonials yet. Add one to fill the quote section near the
          bottom of the session page.
        </p>
      ) : null}
      {list.map((row, index) => (
        <div key={`testimonial-${index}`} className="pgs-admin-facilitators__card">
          <div className="pgs-admin-facilitators__card-head">
            <span>Testimonial {index + 1}</span>
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
              placeholder="e.g. VILIVI P AYE"
            />
          </label>
          <label>
            Role
            <input
              value={row.role}
              onChange={(e) => updateAt(index, { role: e.target.value })}
              placeholder="e.g. #purplePremium student"
            />
          </label>
          <label>
            Location / tag
            <input
              value={row.location}
              onChange={(e) => updateAt(index, { location: e.target.value })}
              placeholder="e.g. #UK"
            />
          </label>
          <label>
            Quote
            <textarea
              rows={4}
              value={row.quote}
              onChange={(e) => updateAt(index, { quote: e.target.value })}
            />
          </label>
          <MediaAssetField
            label="Photo"
            value={row.image_asset_id}
            accept="image"
            folder="events/testimonials"
            onChange={(id) => void setImage(index, id)}
          />
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...list, emptyTestimonial()])}
      >
        + Add testimonial
      </button>
    </div>
  );
}
