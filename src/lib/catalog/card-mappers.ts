/**
 * Maps courses/events catalog rows → public card shapes.
 * Used by public catalog queries and re-exported from admin preview maps.
 */

import type {
  InternshipCardData,
  ProgramCardData,
  PromoCardData,
  SavedCardData,
} from "@/components/cards/types";
import { splitCmsLines } from "@/components/CmsHtml";
import {
  DEFAULT_COURSE_BADGE_ICON,
  DEFAULT_EVENT_BADGE_ICON,
  normalizeHex,
} from "@/components/cards/badge-chip-style";
import type { SavedSurfaceKey } from "@/lib/catalog/card-surfaces";
import { firstSavedSurface } from "@/lib/catalog/card-surfaces";

export type CatalogRow = Record<string, unknown>;

const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const PROMO_IMG = "/assets/img/saved_1.jpg";
const INTERNSHIP_IMG = "/assets/img/saved_3.jpg";
const SAVED_IMG = "/assets/img/saved_4.jpg";
const BOARD_CAMPUS = "/assets/img/purpleboard/campus.jpg";

function str(row: CatalogRow, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function badgeColor(row: CatalogRow): string | undefined {
  return normalizeHex(str(row, "badge_color")) ?? undefined;
}

function badgeTextColor(row: CatalogRow): string | undefined {
  return normalizeHex(str(row, "badge_text_color")) ?? undefined;
}

function badgeIcon(row: CatalogRow, fallback = DEFAULT_COURSE_BADGE_ICON): string {
  return str(row, "badge_icon_url").trim() || fallback;
}

function cardImage(row: CatalogRow, fallback: string): string {
  return str(row, "image_url").trim() || fallback;
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    if (seen.has(tag)) return false;
    seen.add(tag);
    return true;
  });
}

function parseTagsText(
  value: string | null | undefined,
  fallback: string[] = [],
): string[] {
  const fromText = dedupeTags(
    splitCmsLines(value ?? "")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`)),
  );
  return fromText.length > 0 ? fromText : dedupeTags(fallback);
}

function courseTags(row: CatalogRow): string[] {
  const fromText = parseTagsText(str(row, "tags_text"));
  if (fromText.length) return fromText;
  const mode = str(row, "mode");
  const tags = [mode ? (mode.startsWith("#") ? mode : `#${mode}`) : ""].filter(
    Boolean,
  );
  if (row.featured) tags.push("#Featured");
  return tags.length ? dedupeTags(tags) : ["#Course"];
}

function eventTags(row: CatalogRow): string[] {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  const fallback = [mode, badge]
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
  return parseTagsText(str(row, "tags_text"), fallback);
}

function courseBadge(row: CatalogRow): string {
  return str(row, "badge") || (row.featured ? "Featured" : "Open");
}

function closesLabel(iso: string | null | undefined): string {
  if (!iso) return "Closes On\nTBA";
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "Closes On\nTBA";
  return `Closes On\n${d.toLocaleString("en-US", { month: "long", day: "numeric" })}`;
}

function promoDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`;
}

function withEntityMeta<T extends SavedCardData>(
  card: T,
  entityType: "course" | "event",
  entityId: string | number,
): T {
  return {
    ...card,
    id: saveCardId(entityType, entityId),
    entityType,
    entityId: String(entityId),
  };
}

export function saveCardId(
  entityType: "course" | "event",
  entityId: string | number,
): string {
  return `${entityType}:${entityId}`;
}

export function courseHref(row: CatalogRow): string {
  const id = row.id;
  if (id == null || id === "" || id === "draft") return "#";
  return `/programsfull/program/${id}`;
}

export function eventHref(row: CatalogRow): string {
  const id = row.id;
  if (id == null || id === "" || id === "draft") return "#";
  return `/purpleevents/session/${id}`;
}

export function courseToProgramFull(
  row: CatalogRow,
  options?: { saved?: boolean },
): ProgramCardData {
  const summary = str(row, "short_description") || str(row, "description");
  const mode = str(row, "mode");
  const endsOn = str(row, "ends_on") || str(row, "starts_on") || null;
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: courseHref(row),
    image: cardImage(row, BOARD_CAMPUS),
    title: str(row, "title", "Untitled course"),
    tags: courseTags(row),
    saved: options?.saved,
    badge: courseBadge(row),
    badgeIcon: badgeIcon(row),
    badgeColor: badgeColor(row),
    badgeTextColor: badgeTextColor(row),
    logo: LOGO,
    logoAlt: "Course",
    details: [
      { label: "About", value: summary || "—" },
      { label: "Location", value: str(row, "location") || mode || "—" },
      { label: "Mode", value: mode || "—" },
    ],
    variant: "full",
    datesRail:
      str(row, "card_dates_rail").trim() ||
      "Dates You Should Be Aware off.",
    promo: {
      title: str(row, "card_promo_title").trim() || "Dates\nExtended",
      subtitle: str(row, "card_promo_subtitle").trim() || "Check\nWith US",
      date:
        str(row, "card_promo_date").trim() ||
        promoDate(endsOn) ||
        closesLabel(endsOn).replace("Closes On\n", ""),
    },
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

export function courseToPromoCard(
  row: CatalogRow,
  options?: { saved?: boolean },
): PromoCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "promo",
    col: "third",
    href: courseHref(row),
    image: cardImage(row, PROMO_IMG),
    title: str(row, "title", "Untitled course"),
    description: str(row, "short_description") || str(row, "description"),
    tags: courseTags(row),
    saved: options?.saved,
    seatBadge: courseBadge(row),
    seatBadgeIcon: badgeIcon(row),
    seatBadgeColor: badgeColor(row),
    seatBadgeTextColor: badgeTextColor(row),
    overlayBadge: str(row, "mode") || "Start Free",
    closesOn: closesLabel(str(row, "ends_on") || str(row, "starts_on") || null),
  };
}

export function courseToInternshipCard(
  row: CatalogRow,
  options?: { saved?: boolean },
): InternshipCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "internship",
    col: "half",
    href: courseHref(row),
    image: cardImage(row, INTERNSHIP_IMG),
    title: str(row, "title", "Untitled course"),
    description: str(row, "short_description") || str(row, "description"),
    tags: courseTags(row),
    saved: options?.saved,
    overlayBadge: courseBadge(row),
    batchLabel: (str(row, "mode") || "COURSE").toUpperCase(),
  };
}

export function courseToProgramCompact(
  row: CatalogRow,
  options?: { saved?: boolean },
): ProgramCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: courseHref(row),
    image: cardImage(row, SAVED_IMG),
    title: str(row, "title", "Untitled course"),
    tags: courseTags(row),
    saved: options?.saved,
    badge: courseBadge(row),
    badgeIcon: badgeIcon(row),
    badgeColor: badgeColor(row),
    badgeTextColor: badgeTextColor(row),
    logo: LOGO,
    logoAlt: "Course",
    details: [
      { label: "Location", value: str(row, "location") || "—" },
      { label: "Duration", value: str(row, "duration") || "—" },
    ],
    variant: "compact",
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

export function eventToProgramFull(
  row: CatalogRow,
  options?: { saved?: boolean },
): ProgramCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  const summary = str(row, "summary");
  const endsAt = str(row, "ends_at") || str(row, "starts_at") || null;
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: eventHref(row),
    image: cardImage(row, BOARD_CAMPUS),
    title: str(row, "title", "Untitled event"),
    tags: eventTags(row),
    saved: options?.saved,
    badge: badge || undefined,
    badgeIcon: badge ? badgeIcon(row, DEFAULT_EVENT_BADGE_ICON) : undefined,
    badgeColor: badge ? badgeColor(row) : undefined,
    badgeTextColor: badge ? badgeTextColor(row) : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event host",
    details: [
      {
        label: "About",
        value: summary || str(row, "description") || "—",
      },
      {
        label: "Location",
        value: str(row, "location") || mode || "—",
      },
      {
        label: "Mode",
        value: mode || "—",
      },
    ],
    variant: "full",
    datesRail:
      str(row, "card_dates_rail").trim() ||
      "Dates You Should Be Aware off.",
    promo: {
      title: str(row, "card_promo_title").trim() || "Dates\nExtended",
      subtitle: str(row, "card_promo_subtitle").trim() || "Check\nWith US",
      date:
        str(row, "card_promo_date").trim() ||
        promoDate(endsAt),
    },
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

export function eventToPromoCard(
  row: CatalogRow,
  options?: { saved?: boolean },
): PromoCardData {
  const badge = str(row, "badge");
  return {
    id: String(row.id ?? "draft"),
    type: "promo",
    col: "third",
    href: eventHref(row),
    image: cardImage(row, PROMO_IMG),
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: eventTags(row),
    saved: options?.saved,
    seatBadge: badge || undefined,
    seatBadgeIcon: badge ? badgeIcon(row, DEFAULT_EVENT_BADGE_ICON) : undefined,
    seatBadgeColor: badge ? badgeColor(row) : undefined,
    seatBadgeTextColor: badge ? badgeTextColor(row) : undefined,
    overlayBadge: str(row, "top_label") || "Start Free",
    closesOn: closesLabel(str(row, "ends_at") || str(row, "starts_at") || null),
  };
}

export function eventToInternshipCard(
  row: CatalogRow,
  options?: { saved?: boolean },
): InternshipCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  return {
    id: String(row.id ?? "draft"),
    type: "internship",
    col: "half",
    href: eventHref(row),
    image: cardImage(row, INTERNSHIP_IMG),
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: eventTags(row),
    saved: options?.saved,
    overlayBadge: badge || undefined,
    batchLabel:
      str(row, "top_label") || (mode ? mode.toUpperCase() : "LIVE EVENT"),
  };
}

export function eventToProgramCompact(
  row: CatalogRow,
  options?: { saved?: boolean },
): ProgramCardData {
  const badge = str(row, "badge");
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: eventHref(row),
    image: cardImage(row, SAVED_IMG),
    title: str(row, "title", "Untitled event"),
    tags: eventTags(row),
    saved: options?.saved,
    badge: badge || undefined,
    badgeIcon: badge ? badgeIcon(row, DEFAULT_EVENT_BADGE_ICON) : undefined,
    badgeColor: badge ? badgeColor(row) : undefined,
    badgeTextColor: badge ? badgeTextColor(row) : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event",
    details: [
      { label: "Location", value: str(row, "location") || "Online" },
      { label: "Host", value: str(row, "host") || "—" },
    ],
    variant: "compact",
  };
}

export function mapCourseToSavedCard(
  row: CatalogRow,
  surface: SavedSurfaceKey,
  saved = true,
): SavedCardData {
  switch (surface) {
    case "saved_program_full":
      return withEntityMeta(courseToProgramFull(row, { saved }), "course", row.id as string | number);
    case "saved_promo":
      return withEntityMeta(courseToPromoCard(row, { saved }), "course", row.id as string | number);
    case "saved_internship":
      return withEntityMeta(courseToInternshipCard(row, { saved }), "course", row.id as string | number);
    case "saved_program_compact":
      return withEntityMeta(courseToProgramCompact(row, { saved }), "course", row.id as string | number);
    default:
      return withEntityMeta(courseToProgramFull(row, { saved }), "course", row.id as string | number);
  }
}

export function mapEventToSavedCard(
  row: CatalogRow,
  surface: SavedSurfaceKey,
  saved = true,
): SavedCardData {
  switch (surface) {
    case "saved_program_full":
      return withEntityMeta(eventToProgramFull(row, { saved }), "event", row.id as string | number);
    case "saved_promo":
      return withEntityMeta(eventToPromoCard(row, { saved }), "event", row.id as string | number);
    case "saved_internship":
      return withEntityMeta(eventToInternshipCard(row, { saved }), "event", row.id as string | number);
    case "saved_program_compact":
      return withEntityMeta(eventToProgramCompact(row, { saved }), "event", row.id as string | number);
    default:
      return withEntityMeta(eventToProgramFull(row, { saved }), "event", row.id as string | number);
  }
}

export function mapRowToSavedCard(
  entityType: "course" | "event",
  row: CatalogRow,
  saved = true,
): SavedCardData | null {
  const surface = firstSavedSurface(row);
  if (!surface) return null;
  return entityType === "course"
    ? mapCourseToSavedCard(row, surface, saved)
    : mapEventToSavedCard(row, surface, saved);
}

export function mapPurpleboardCourse(
  row: CatalogRow,
  saved?: boolean,
): ProgramCardData {
  return withEntityMeta(courseToProgramFull(row, { saved }), "course", row.id as string | number);
}

export function mapPurpleboardEvent(
  row: CatalogRow,
  saved?: boolean,
): ProgramCardData {
  return withEntityMeta(eventToProgramFull(row, { saved }), "event", row.id as string | number);
}

export function mapCvReadyFeaturedCourse(
  row: CatalogRow,
  saved?: boolean,
): InternshipCardData {
  return withEntityMeta(courseToInternshipCard(row, { saved }), "course", row.id as string | number);
}

export function mapCvReadyFeaturedEvent(
  row: CatalogRow,
  saved?: boolean,
): InternshipCardData {
  return withEntityMeta(eventToInternshipCard(row, { saved }), "event", row.id as string | number);
}

export function mapCvReadyProgramCourse(
  row: CatalogRow,
  saved?: boolean,
): PromoCardData {
  return withEntityMeta(courseToPromoCard(row, { saved }), "course", row.id as string | number);
}

export function mapCvReadyProgramEvent(
  row: CatalogRow,
  saved?: boolean,
): PromoCardData {
  return withEntityMeta(eventToPromoCard(row, { saved }), "event", row.id as string | number);
}
