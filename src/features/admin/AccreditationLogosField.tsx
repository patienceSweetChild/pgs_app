"use client";

import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";

export type AccreditationLogoDraft = {
  assetId: string | null;
  url: string;
};

type Props = {
  value: AccreditationLogoDraft[];
  onChange: (next: AccreditationLogoDraft[]) => void;
};

export function parseAccreditationLogos(raw: string): AccreditationLogoDraft[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ assetId: null, url }));
}

export function serializeAccreditationLogos(
  items: AccreditationLogoDraft[],
): string {
  return items
    .map((item) => item.url.trim())
    .filter(Boolean)
    .join("\n");
}

export function AccreditationLogosField({ value, onChange }: Props) {
  const items =
    value.length > 0 ? value : [{ assetId: null as string | null, url: "" }];

  function patchAt(index: number, partial: Partial<AccreditationLogoDraft>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  async function setLogo(index: number, assetId: string | null) {
    if (!assetId) {
      patchAt(index, { assetId: null, url: "" });
      return;
    }
    try {
      const preview = await getMediaAssetPreview(assetId);
      patchAt(index, {
        assetId,
        url: preview?.publicUrl || "",
      });
    } catch {
      patchAt(index, { assetId, url: "" });
    }
  }

  function addItem() {
    onChange([
      ...items.filter((item) => item.url.trim() || item.assetId),
      { assetId: null, url: "" },
    ]);
  }

  function removeAt(index: number) {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length ? next : []);
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Accreditation logos</strong>
        <span>
          {items.filter((item) => item.url.trim() || item.assetId).length}{" "}
          logos
        </span>
      </div>
      {items.every((item) => !item.url.trim() && !item.assetId) ? (
        <p className="pgs-admin-line-items__empty">
          No logos yet. Upload an image for each accreditation mark.
        </p>
      ) : null}
      {items.map((item, i) => (
        <div key={`logo-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Logo {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => removeAt(i)}
            >
              Remove
            </button>
          </div>
          {item.url && !item.assetId ? (
            <div className="pgs-admin-accreditation__preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" />
              <span className="pgs-admin-accreditation__hint">
                Existing image — upload a new file to replace it.
              </span>
            </div>
          ) : null}
          <MediaAssetField
            label={`Accreditation logo ${i + 1}`}
            value={item.assetId}
            accept="image"
            folder="courses/accreditation"
            onChange={(id) => void setLogo(i, id)}
          />
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={addItem}
      >
        + Add logo
      </button>
    </div>
  );
}
