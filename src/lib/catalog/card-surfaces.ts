/** Shared card surface keys for courses and events (admin + public). */

export const LEGACY_VISUAL_KEYS = [
  "saved_program_full",
  "saved_promo",
  "saved_internship",
  "saved_program_compact",
  "add_to_calendar",
  "events_hero",
  "events_upcoming_card",
] as const;

export type LegacyVisualKey = (typeof LEGACY_VISUAL_KEYS)[number];

export const PAGE_SURFACE_KEYS = [
  "purpleboard",
  "cvready_featured",
  "cvready_programs",
] as const;

export type PageSurfaceKey = (typeof PAGE_SURFACE_KEYS)[number];

export const SAVED_SURFACE_KEYS = [
  "saved_program_full",
  "saved_promo",
  "saved_internship",
  "saved_program_compact",
] as const;

export type SavedSurfaceKey = (typeof SAVED_SURFACE_KEYS)[number];

export const COURSE_VISUAL_KEYS = [
  ...LEGACY_VISUAL_KEYS,
  ...PAGE_SURFACE_KEYS,
] as const;

export type CourseVisualKey = (typeof COURSE_VISUAL_KEYS)[number];

export const EVENT_VISUAL_KEYS = [...COURSE_VISUAL_KEYS] as const;

export type EventVisualKey = (typeof EVENT_VISUAL_KEYS)[number];

export const COURSE_VISUAL_LABELS: Record<CourseVisualKey, string> = {
  saved_program_full: "Saved list — program (full)",
  saved_promo: "Saved list — promo card",
  saved_internship: "Saved list — internship card",
  saved_program_compact: "Saved list — program (compact)",
  add_to_calendar: "add to calendar",
  events_hero: "Events page — top / featured",
  events_upcoming_card: "Events page — upcoming session card",
  purpleboard: "Purple Board — program card",
  cvready_featured: "CV Ready — #purpleSelected featured",
  cvready_programs: "CV Ready — Discover programs grid",
};

export const EVENT_VISUAL_LABELS: Record<EventVisualKey, string> = {
  ...COURSE_VISUAL_LABELS,
};

const VISUAL_KEY_SET = new Set<string>(COURSE_VISUAL_KEYS);

const LEGACY_SURFACE_MAP: Record<string, CourseVisualKey> = {
  purpleboard: "purpleboard",
  purpleboard_closed: "events_upcoming_card",
  featured_pick: "add_to_calendar",
  feed_chip: "add_to_calendar",
};

export type CardSurfacesRow = { card_surfaces?: unknown };

/** Missing/null → legacy keys only (page keys require explicit opt-in). Empty → none. */
export function parseCardSurfaces(row: CardSurfacesRow): CourseVisualKey[] {
  const raw = row.card_surfaces;
  if (raw == null) return [...LEGACY_VISUAL_KEYS];
  if (!Array.isArray(raw)) return [...LEGACY_VISUAL_KEYS];
  if (raw.length === 0) return [];
  const seen = new Set<CourseVisualKey>();
  const keys: CourseVisualKey[] = [];
  for (const item of raw) {
    const mapped = LEGACY_SURFACE_MAP[String(item)] ?? String(item);
    if (!VISUAL_KEY_SET.has(mapped)) continue;
    const key = mapped as CourseVisualKey;
    if (seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  return keys;
}

export function isCardSurfaceEnabled(
  row: CardSurfacesRow,
  key: CourseVisualKey,
): boolean {
  return parseCardSurfaces(row).includes(key);
}

export function toggleCardSurface<T extends CardSurfacesRow>(
  row: T,
  key: CourseVisualKey,
  enabled: boolean,
): T {
  const current = new Set(parseCardSurfaces(row));
  if (enabled) current.add(key);
  else current.delete(key);
  const next = COURSE_VISUAL_KEYS.filter((k) => current.has(k));
  return { ...row, card_surfaces: next };
}

const PAGE_SURFACE_SET = new Set<string>(PAGE_SURFACE_KEYS);

export function matchesCardSurface(
  row: CardSurfacesRow,
  key: CourseVisualKey | PageSurfaceKey,
): boolean {
  const enabled = parseCardSurfaces(row);
  if (enabled.includes(key)) return true;
  // Public listing pages share opt-in: enabling any page surface shows the card
  // on purpleboard and CV Ready (each page still uses its own card layout).
  if (PAGE_SURFACE_SET.has(key)) {
    return PAGE_SURFACE_KEYS.some((surface) => enabled.includes(surface));
  }
  return false;
}

/** First enabled saved-list surface for rendering on /saved. */
export function firstSavedSurface(
  row: CardSurfacesRow,
): SavedSurfaceKey | null {
  const enabled = parseCardSurfaces(row);
  for (const key of SAVED_SURFACE_KEYS) {
    if (enabled.includes(key)) return key;
  }
  return null;
}

export function saveItemKey(
  entityType: "course" | "event",
  entityId: string | number,
): string {
  return `${entityType}:${entityId}`;
}

export function parseSaveItemKey(key: string): {
  entityType: "course" | "event";
  entityId: string;
} | null {
  const match = /^(\w+):(.+)$/.exec(key);
  if (!match) return null;
  const entityType = match[1];
  if (entityType !== "course" && entityType !== "event") return null;
  return { entityType, entityId: match[2] };
}
