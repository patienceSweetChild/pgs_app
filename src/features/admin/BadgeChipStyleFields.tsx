"use client";

import { MediaAssetField } from "./MediaAssetField";
import {
  DEFAULT_BADGE_COLOR,
  DEFAULT_BADGE_TEXT_COLOR,
  DEFAULT_COURSE_BADGE_ICON,
  badgeChipStyle,
  normalizeHex,
} from "@/components/cards/badge-chip-style";

type Props = {
  badgeLabel: string;
  badgeColor: string | null | undefined;
  badgeTextColor: string | null | undefined;
  badgeIconAssetId: string | null | undefined;
  badgeIconUrl?: string | null | undefined;
  defaultIconSrc?: string;
  onColorChange: (color: string | null) => void;
  onTextColorChange: (color: string | null) => void;
  onIconChange: (assetId: string | null) => void;
};

export function BadgeChipStyleFields({
  badgeLabel,
  badgeColor,
  badgeTextColor,
  badgeIconAssetId,
  badgeIconUrl,
  defaultIconSrc = DEFAULT_COURSE_BADGE_ICON,
  onColorChange,
  onTextColorChange,
  onIconChange,
}: Props) {
  const bgHex = normalizeHex(badgeColor) ?? DEFAULT_BADGE_COLOR;
  const textHex = normalizeHex(badgeTextColor) ?? DEFAULT_BADGE_TEXT_COLOR;
  const hasCustomBg = Boolean(normalizeHex(badgeColor));
  const hasCustomText = Boolean(normalizeHex(badgeTextColor));
  const iconSrc = (badgeIconUrl && String(badgeIconUrl).trim()) || defaultIconSrc;
  const chipStyle = badgeChipStyle(
    hasCustomBg ? bgHex : null,
    hasCustomText ? textHex : null,
  );
  const previewLabel = badgeLabel.trim() || "Badge preview";

  return (
    <div className="pgs-admin-badge-style">
      <div className="pgs-admin-badge-style__row">
        <label className="pgs-admin-badge-style__color">
          Chip color
          <span className="pgs-admin-badge-style__color-controls">
            <input
              type="color"
              value={bgHex}
              aria-label="Badge chip color"
              onChange={(e) => onColorChange(e.target.value)}
            />
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              disabled={!hasCustomBg}
              onClick={() => onColorChange(null)}
            >
              Reset
            </button>
          </span>
        </label>
        <label className="pgs-admin-badge-style__color">
          Text color
          <span className="pgs-admin-badge-style__color-controls">
            <input
              type="color"
              value={textHex}
              aria-label="Badge text color"
              onChange={(e) => onTextColorChange(e.target.value)}
            />
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              disabled={!hasCustomText}
              onClick={() => onTextColorChange(null)}
            >
              Reset
            </button>
          </span>
        </label>
        <div
          className="pgs-admin-badge-style__preview"
          style={chipStyle}
          title="Chip preview"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt="" />
          <span>{previewLabel}</span>
        </div>
      </div>
      <MediaAssetField
        label="Badge GIF / icon"
        value={badgeIconAssetId}
        folder="cms/badges"
        accept="image"
        onChange={onIconChange}
      />
    </div>
  );
}
