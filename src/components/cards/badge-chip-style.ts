/** Defaults and helpers for CMS badge / enroll chips. */

export const DEFAULT_BADGE_COLOR = "#000000";
export const DEFAULT_BADGE_TEXT_COLOR = "#ffffff";
export const DEFAULT_COURSE_BADGE_ICON = "/assets/img/purpleboard/fire.gif";
export const DEFAULT_EVENT_BADGE_ICON = "/assets/img/red-hours.gif";

/** Relative luminance → readable text on a solid chip background. */
export function autoContrastTextColor(bg: string | null | undefined): string {
  const hex = normalizeHex(bg);
  if (!hex) return DEFAULT_BADGE_TEXT_COLOR;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

/** @deprecated Use autoContrastTextColor */
export const badgeTextColor = autoContrastTextColor;

export function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[1];
    const g = raw[2];
    const b = raw[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export function badgeChipStyle(
  bgColor: string | null | undefined,
  textColor?: string | null | undefined,
): { backgroundColor?: string; color?: string } {
  const bg = normalizeHex(bgColor);
  const text = normalizeHex(textColor);
  if (!bg && !text) return {};
  const style: { backgroundColor?: string; color?: string } = {};
  if (bg) style.backgroundColor = bg;
  if (text) style.color = text;
  else if (bg) style.color = autoContrastTextColor(bg);
  return style;
}
