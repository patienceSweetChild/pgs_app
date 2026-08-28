"use client";

import { AdminRichTextField } from "./AdminRichTextField";
import {
  AccreditationLogosField,
  parseAccreditationLogos,
  serializeAccreditationLogos,
  type AccreditationLogoDraft,
} from "./AccreditationLogosField";
import {
  CourseFactsField,
  parseCourseFactsDraft,
  serializeCourseFacts,
  type FactDraftItem,
} from "./CourseFactsField";
import {
  CourseFaqField,
  parseCourseFaqDraft,
  serializeCourseFaqItems,
  type CourseFaqDraftItem,
} from "./CourseFaqField";
import { EditableLabelField } from "./EditableLabelField";
import {
  EventTestimonialsField,
  type TestimonialDraft,
} from "./EventTestimonialsField";
import { LineItemsField } from "./LineItemsField";
import { BadgeChipStyleFields } from "./BadgeChipStyleFields";
import { DEFAULT_COURSE_BADGE_ICON } from "@/components/cards/badge-chip-style";
import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";
import { TagPickerField } from "./TagPickerField";
import {
  AdminDateTimeField,
  type DateTimeSaveState,
} from "./AdminDateTimeField";
import {
  DEFAULT_COURSE_SECTION_LABELS,
  type CoursePageLabels,
} from "@/features/programsfull/content";

export const COURSE_EDIT_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "schedule", label: "Schedule" },
  { id: "who", label: "Who’s it for" },
  { id: "topics", label: "Program topics" },
  { id: "description", label: "Description" },
  { id: "highlights", label: "Highlights" },
  { id: "benefits", label: "Benefits" },
  { id: "brochure", label: "Brochure" },
  { id: "awarding", label: "Awarding body" },
  { id: "apply", label: "How to apply" },
  { id: "certificate", label: "Certificate" },
  { id: "gallery", label: "Gallery" },
  { id: "fee", label: "Enrollment fee" },
  { id: "learners", label: "Learners" },
  { id: "faq", label: "FAQ" },
  { id: "meta", label: "Meta" },
] as const;

type Props = {
  draft: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  categoryOptions: { value: string; label: string }[];
  universityOptions: { value: string; label: string }[];
  dateSaveState?: {
    starts_on?: DateTimeSaveState;
    ends_on?: DateTimeSaveState;
  };
  onSectionRef?: (id: string, el: HTMLElement | null) => void;
};

type Clock = {
  hour12: number;
  minute: number;
  ampm: "AM" | "PM";
};

const DEFAULT_CLOCK: Clock = { hour12: 12, minute: 0, ampm: "AM" };

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatClock(c: Clock): string {
  return `${c.hour12}:${pad2(c.minute)} ${c.ampm}`;
}

function clockFromDate(d: Date): Clock {
  const hours24 = d.getHours();
  const ampm: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  let hour12 = hours24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute: d.getMinutes(), ampm };
}

function parseClockToken(token: string): Clock | null {
  const m = token
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?$/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = m[2] ? Number(m[2]) : 0;
  if (!Number.isFinite(hour) || hour < 0 || hour > 23 || minute > 59) {
    return null;
  }
  const meridiem = m[3]?.toLowerCase().replace(/\./g, "");
  let ampm: "AM" | "PM";
  if (meridiem?.startsWith("p")) {
    ampm = "PM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour -= 12;
  } else if (meridiem?.startsWith("a")) {
    ampm = "AM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
    ampm = "AM";
  } else if (hour === 12) {
    ampm = "PM";
  } else if (hour > 12) {
    hour -= 12;
    ampm = "PM";
  } else {
    ampm = "AM";
  }
  return { hour12: hour, minute, ampm };
}

/** Parse free-text session times like "12pm to 2 pm" or "9:00 AM". */
function parseSessionClocks(sessionTime: string): { start: Clock; end: Clock } {
  const raw = sessionTime.trim();
  if (!raw) return { start: DEFAULT_CLOCK, end: DEFAULT_CLOCK };
  const parts = raw.split(/\s*(?:to|–|-)\s*/i).filter(Boolean);
  const start = parseClockToken(parts[0] ?? "") ?? DEFAULT_CLOCK;
  const end =
    parts.length > 1
      ? (parseClockToken(parts[1] ?? "") ?? start)
      : start;
  return { start, end };
}

function toLocalIso(dateOnly: string, clock: Clock): string | null {
  if (!dateOnly) return null;
  const [y, m, day] = dateOnly.split("-").map(Number);
  if (!y || !m || !day) return null;
  let hours24 = clock.hour12 % 12;
  if (clock.ampm === "PM") hours24 += 12;
  const d = new Date(y, m - 1, day, hours24, clock.minute, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function localDateOnly(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function sessionTimeFromIsos(
  startIso: string | null,
  endIso: string | null,
): string {
  if (!startIso && !endIso) return "";
  const start = startIso ? clockFromDate(new Date(startIso)) : null;
  const end = endIso ? clockFromDate(new Date(endIso)) : null;
  if (start && end) {
    const a = formatClock(start);
    const b = formatClock(end);
    return a === b ? a : `${a} to ${b}`;
  }
  return formatClock((start ?? end)!);
}

function courseScheduleIsos(draft: Record<string, unknown>): {
  start: string | null;
  end: string | null;
} {
  const clocks = parseSessionClocks(str(draft, "session_time"));
  const startsOn = str(draft, "starts_on");
  const endsOn = str(draft, "ends_on");
  return {
    start: startsOn ? toLocalIso(startsOn, clocks.start) : null,
    end: endsOn ? toLocalIso(endsOn, clocks.end) : null,
  };
}

function str(draft: Record<string, unknown>, key: string): string {
  const v = draft[key];
  return v == null ? "" : String(v);
}

function asTestimonials(value: unknown): TestimonialDraft[] {
  return Array.isArray(value) ? (value as TestimonialDraft[]) : [];
}

function asLabels(value: unknown): CoursePageLabels {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as CoursePageLabels;
  }
  return {};
}

function asFaqs(draft: Record<string, unknown>): CourseFaqDraftItem[] {
  if (Array.isArray(draft.faq_draft)) {
    return draft.faq_draft as CourseFaqDraftItem[];
  }
  return parseCourseFaqDraft(str(draft, "faq_items"));
}

function asFacts(draft: Record<string, unknown>): FactDraftItem[] {
  if (Array.isArray(draft.facts_draft)) {
    return draft.facts_draft as FactDraftItem[];
  }
  return parseCourseFactsDraft(str(draft, "awarding_body_facts"));
}

function asAccreditationLogos(
  draft: Record<string, unknown>,
): AccreditationLogoDraft[] {
  if (Array.isArray(draft.accreditation_logos_draft)) {
    return draft.accreditation_logos_draft as AccreditationLogoDraft[];
  }
  return parseAccreditationLogos(str(draft, "accreditation_logos"));
}

function slugifyField(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CourseEditForm({
  draft,
  onChange,
  categoryOptions,
  universityOptions,
  dateSaveState,
  onSectionRef,
}: Props) {
  const labels = asLabels(draft.section_labels);
  const schedule = courseScheduleIsos(draft);

  function patch(partial: Record<string, unknown>) {
    onChange({ ...draft, ...partial });
  }

  function patchTitle(title: string) {
    const next: Record<string, unknown> = { title };
    if (draft.id == null) {
      const prevSlug = slugifyField(str(draft, "title"));
      const current = str(draft, "slug");
      if (!current || current === prevSlug) {
        next.slug = slugifyField(title);
      }
    }
    patch(next);
  }

  function patchScheduleStart(iso: string | null) {
    patch({
      starts_on: iso ? localDateOnly(iso) : null,
      session_time: sessionTimeFromIsos(iso, schedule.end),
    });
  }

  function patchScheduleEnd(iso: string | null) {
    patch({
      ends_on: iso ? localDateOnly(iso) : null,
      session_time: sessionTimeFromIsos(schedule.start, iso),
    });
  }

  function patchLabel(key: keyof CoursePageLabels, next: string) {
    patch({
      section_labels: {
        ...labels,
        [key]: next,
      },
    });
  }

  function bindSection(id: string) {
    return (el: HTMLElement | null) => onSectionRef?.(id, el);
  }

  async function setMediaUrl(
    assetKey: string,
    urlKey: string,
    assetId: string | null,
  ) {
    if (!assetId) {
      patch({ [assetKey]: null, [urlKey]: "" });
      return;
    }
    patch({ [assetKey]: assetId, [urlKey]: "" });
    try {
      const preview = await getMediaAssetPreview(assetId);
      patch({
        [assetKey]: assetId,
        [urlKey]: preview?.publicUrl || "",
      });
    } catch {
      /* keep asset id; preview URL can catch up later */
    }
  }

  function setFaqs(next: CourseFaqDraftItem[]) {
    patch({
      faq_draft: next,
      faq_items: serializeCourseFaqItems(next),
    });
  }

  return (
    <div className="pgs-event-cms__form-inner">
      <section
        id="hero"
        className="pgs-event-cms__section"
        ref={bindSection("hero")}
      >
        <h3 className="pgs-event-cms__section-title">Hero</h3>
        <label>
          Title
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "title")}
            onChange={(e) => patchTitle(e.target.value)}
          />
        </label>
        <AdminRichTextField
          label="Short description"
          value={str(draft, "short_description")}
          onChange={(next) => patch({ short_description: next })}
          rows={4}
        />
        <AdminRichTextField
          label="Headline"
          value={str(draft, "headline")}
          onChange={(next) => patch({ headline: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Hero note"
          value={str(draft, "hero_note")}
          onChange={(next) => patch({ hero_note: next })}
          rows={3}
        />
        <label>
          Program type
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "program_type")}
            onChange={(e) => patch({ program_type: e.target.value })}
          />
        </label>
        <label>
          Duration
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "duration")}
            onChange={(e) => patch({ duration: e.target.value })}
          />
        </label>
        <TagPickerField
          label="Mode"
          kind="mode"
          value={str(draft, "mode")}
          maxTags={1}
          hashPrefix
          onChange={(next) => patch({ mode: next })}
        />
        <TagPickerField
          label="Badge"
          kind="badge"
          value={str(draft, "badge")}
          maxTags={1}
          hashPrefix={false}
          onChange={(next) => patch({ badge: next })}
        />
        <BadgeChipStyleFields
          badgeLabel={str(draft, "badge")}
          badgeColor={
            draft.badge_color != null ? String(draft.badge_color) : null
          }
          badgeTextColor={
            draft.badge_text_color != null
              ? String(draft.badge_text_color)
              : null
          }
          badgeIconAssetId={
            draft.badge_icon_asset_id
              ? String(draft.badge_icon_asset_id)
              : null
          }
          badgeIconUrl={str(draft, "badge_icon_url")}
          defaultIconSrc={DEFAULT_COURSE_BADGE_ICON}
          onColorChange={(color) => patch({ badge_color: color })}
          onTextColorChange={(color) => patch({ badge_text_color: color })}
          onIconChange={(id) =>
            void setMediaUrl("badge_icon_asset_id", "badge_icon_url", id)
          }
        />
        <label>
          Location
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "location")}
            onChange={(e) => patch({ location: e.target.value })}
          />
        </label>
        <TagPickerField
          label="Tags"
          kind="tag"
          value={str(draft, "tags_text")}
          hashPrefix
          onChange={(next) => patch({ tags_text: next })}
        />
        <label>
          Booking URL
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "booking_url")}
            onChange={(e) => patch({ booking_url: e.target.value || null })}
          />
        </label>
        <MediaAssetField
          label="Hero image"
          value={draft.image_asset_id ? String(draft.image_asset_id) : null}
          accept="image"
          folder="courses"
          onChange={(id) => void setMediaUrl("image_asset_id", "image_url", id)}
        />
        <MediaAssetField
          label="Partner logo"
          value={
            draft.partner_logo_asset_id
              ? String(draft.partner_logo_asset_id)
              : null
          }
          accept="image"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl("partner_logo_asset_id", "partner_logo_url", id)
          }
        />
      </section>

      <section
        id="schedule"
        className="pgs-event-cms__section"
        ref={bindSection("schedule")}
      >
        <h3 className="pgs-event-cms__section-title">Schedule</h3>
        <AdminDateTimeField
          label="Starts at"
          value={schedule.start}
          saveState={dateSaveState?.starts_on}
          onChange={patchScheduleStart}
        />
        <AdminDateTimeField
          label="Ends at"
          value={schedule.end}
          saveState={dateSaveState?.ends_on}
          onChange={patchScheduleEnd}
        />
      </section>

      <section
        id="who"
        className="pgs-event-cms__section"
        ref={bindSection("who")}
      >
        <EditableLabelField
          value={labels.whoFor ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.whoFor}
          onChange={(next) => patchLabel("whoFor", next)}
        />
        <LineItemsField
          label="Who’s it for lines"
          itemLabel="Line"
          value={str(draft, "who_is_it_for")}
          onChange={(next) => patch({ who_is_it_for: next })}
          rich
          rows={3}
          emptyHint="Add each green line as its own box."
        />
      </section>

      <section
        id="topics"
        className="pgs-event-cms__section"
        ref={bindSection("topics")}
      >
        <EditableLabelField
          value={labels.programTopics ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.programTopics}
          onChange={(next) => patchLabel("programTopics", next)}
        />
        <LineItemsField
          label="Program topics"
          itemLabel="Topic"
          value={str(draft, "session_topics")}
          onChange={(next) => patch({ session_topics: next })}
          rich
          rows={3}
          emptyHint="Add each topic in its own box."
        />
      </section>

      <section
        id="description"
        className="pgs-event-cms__section"
        ref={bindSection("description")}
      >
        <EditableLabelField
          value={labels.programDescription ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.programDescription}
          onChange={(next) => patchLabel("programDescription", next)}
        />
        <AdminRichTextField
          label="Description"
          value={str(draft, "description")}
          onChange={(next) => patch({ description: next })}
          rows={8}
        />
      </section>

      <section
        id="highlights"
        className="pgs-event-cms__section"
        ref={bindSection("highlights")}
      >
        <EditableLabelField
          value={labels.highlights ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.highlights}
          onChange={(next) => patchLabel("highlights", next)}
        />
        <AdminRichTextField
          label="Highlight 1"
          value={str(draft, "highlight_1")}
          onChange={(next) => patch({ highlight_1: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Highlight 2"
          value={str(draft, "highlight_2")}
          onChange={(next) => patch({ highlight_2: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Highlight 3"
          value={str(draft, "highlight_3")}
          onChange={(next) => patch({ highlight_3: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Highlight 4"
          value={str(draft, "highlight_4")}
          onChange={(next) => patch({ highlight_4: next })}
          rows={3}
        />
      </section>

      <section
        id="benefits"
        className="pgs-event-cms__section"
        ref={bindSection("benefits")}
      >
        <EditableLabelField
          value={labels.benefitsAside ?? str(draft, "benefits_aside")}
          fallback={DEFAULT_COURSE_SECTION_LABELS.benefitsAside}
          onChange={(next) =>
            patch({
              section_labels: { ...labels, benefitsAside: next },
              benefits_aside: next,
            })
          }
        />
        <LineItemsField
          label="Benefits checklist"
          itemLabel="Benefit"
          value={str(draft, "benefits")}
          onChange={(next) => patch({ benefits: next })}
          rows={2}
          emptyHint="Add each benefit as its own box."
        />
      </section>

      <section
        id="brochure"
        className="pgs-event-cms__section"
        ref={bindSection("brochure")}
      >
        <EditableLabelField
          value={labels.brochureTitle ?? str(draft, "brochure_title")}
          fallback={DEFAULT_COURSE_SECTION_LABELS.brochureTitle}
          onChange={(next) =>
            patch({
              section_labels: { ...labels, brochureTitle: next },
              brochure_title: next,
            })
          }
        />
        <AdminRichTextField
          label="Brochure body"
          value={str(draft, "brochure_body")}
          onChange={(next) => patch({ brochure_body: next })}
          rows={3}
        />
        <label>
          Brochure badge
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "brochure_badge")}
            onChange={(e) => patch({ brochure_badge: e.target.value })}
          />
        </label>
        <MediaAssetField
          label="Brochure file"
          value={
            draft.brochure_asset_id ? String(draft.brochure_asset_id) : null
          }
          accept="document"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl("brochure_asset_id", "brochure_url", id)
          }
        />
      </section>

      <section
        id="awarding"
        className="pgs-event-cms__section"
        ref={bindSection("awarding")}
      >
        <EditableLabelField
          value={labels.awarding ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.awarding}
          onChange={(next) => patchLabel("awarding", next)}
        />
        <AdminRichTextField
          label="Intro"
          value={str(draft, "awarding_body_intro")}
          onChange={(next) => patch({ awarding_body_intro: next })}
          rows={4}
        />
        <CourseFactsField
          value={asFacts(draft)}
          onChange={(next) =>
            patch({
              facts_draft: next,
              awarding_body_facts: serializeCourseFacts(next),
            })
          }
        />
        <EditableLabelField
          value={labels.rankings ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.rankings}
          onChange={(next) => patchLabel("rankings", next)}
        />
        <AdminRichTextField
          label="Rankings & reputation"
          value={str(draft, "awarding_body_rankings")}
          onChange={(next) => patch({ awarding_body_rankings: next })}
          rows={5}
        />
        <EditableLabelField
          value={labels.accreditation ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.accreditation}
          onChange={(next) => patchLabel("accreditation", next)}
        />
        <AccreditationLogosField
          value={asAccreditationLogos(draft)}
          onChange={(next) =>
            patch({
              accreditation_logos_draft: next,
              accreditation_logos: serializeAccreditationLogos(next),
            })
          }
        />
        <MediaAssetField
          label="Awarding body image"
          value={
            draft.awarding_body_image_asset_id
              ? String(draft.awarding_body_image_asset_id)
              : null
          }
          accept="image"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl(
              "awarding_body_image_asset_id",
              "awarding_body_image_url",
              id,
            )
          }
        />
      </section>

      <section
        id="apply"
        className="pgs-event-cms__section"
        ref={bindSection("apply")}
      >
        <EditableLabelField
          value={labels.howToApply ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.howToApply}
          onChange={(next) => patchLabel("howToApply", next)}
        />
        <AdminRichTextField
          label="Intro"
          value={str(draft, "apply_intro")}
          onChange={(next) => patch({ apply_intro: next })}
          rows={4}
        />
        <EditableLabelField
          value={labels.eligibility ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.eligibility}
          onChange={(next) => patchLabel("eligibility", next)}
        />
        <LineItemsField
          label="Eligibility tags"
          itemLabel="Tag"
          value={str(draft, "eligibility")}
          onChange={(next) => patch({ eligibility: next })}
          multiline={false}
          emptyHint="Add each eligibility tag in its own box."
        />
      </section>

      <section
        id="certificate"
        className="pgs-event-cms__section"
        ref={bindSection("certificate")}
      >
        <h3 className="pgs-event-cms__section-title">Certificate</h3>
        <AdminRichTextField
          label="Certificate heading"
          value={str(draft, "certificate_heading")}
          onChange={(next) => patch({ certificate_heading: next })}
          rows={3}
        />
        <EditableLabelField
          value={labels.whyItMatters ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.whyItMatters}
          onChange={(next) => patchLabel("whyItMatters", next)}
        />
        <LineItemsField
          label="Why it matters"
          itemLabel="Point"
          value={str(draft, "certificate_why")}
          onChange={(next) => patch({ certificate_why: next })}
          rows={2}
          emptyHint="Add each checklist point in its own box."
        />
      </section>

      <section
        id="gallery"
        className="pgs-event-cms__section"
        ref={bindSection("gallery")}
      >
        <h3 className="pgs-event-cms__section-title">Gallery</h3>
        <label>
          Gallery title
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "gallery_title")}
            onChange={(e) => patch({ gallery_title: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Gallery blurb"
          value={str(draft, "gallery_blurb")}
          onChange={(next) => patch({ gallery_blurb: next })}
          rows={4}
        />
        <label>
          Gallery location
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "gallery_location")}
            onChange={(e) => patch({ gallery_location: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Gallery body"
          value={str(draft, "gallery_body")}
          onChange={(next) => patch({ gallery_body: next })}
          rows={5}
        />
        <MediaAssetField
          label="Gallery image 1"
          value={
            draft.gallery_image_1_asset_id
              ? String(draft.gallery_image_1_asset_id)
              : null
          }
          accept="image"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl(
              "gallery_image_1_asset_id",
              "gallery_image_1_url",
              id,
            )
          }
        />
        <MediaAssetField
          label="Gallery image 2"
          value={
            draft.gallery_image_2_asset_id
              ? String(draft.gallery_image_2_asset_id)
              : null
          }
          accept="image"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl(
              "gallery_image_2_asset_id",
              "gallery_image_2_url",
              id,
            )
          }
        />
        <MediaAssetField
          label="Gallery image 3"
          value={
            draft.gallery_image_3_asset_id
              ? String(draft.gallery_image_3_asset_id)
              : null
          }
          accept="image"
          folder="courses"
          onChange={(id) =>
            void setMediaUrl(
              "gallery_image_3_asset_id",
              "gallery_image_3_url",
              id,
            )
          }
        />
      </section>

      <section
        id="fee"
        className="pgs-event-cms__section"
        ref={bindSection("fee")}
      >
        <EditableLabelField
          value={labels.enrollmentFee ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.enrollmentFee}
          onChange={(next) => patchLabel("enrollmentFee", next)}
        />
        <label>
          Fee amount
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "fee_amount")}
            onChange={(e) => patch({ fee_amount: e.target.value })}
          />
        </label>
        <label>
          Fee subtitle
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "fee_subtitle")}
            onChange={(e) => patch({ fee_subtitle: e.target.value })}
          />
        </label>
        <label>
          Fee badge
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "fee_badge")}
            onChange={(e) => patch({ fee_badge: e.target.value })}
          />
        </label>
        <label>
          Fee note
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "fee_note")}
            onChange={(e) => patch({ fee_note: e.target.value })}
          />
        </label>
        <EditableLabelField
          value={labels.feeIncludes ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.feeIncludes}
          onChange={(next) => patchLabel("feeIncludes", next)}
        />
        <LineItemsField
          label="What’s included"
          itemLabel="Item"
          value={str(draft, "fee_includes")}
          onChange={(next) => patch({ fee_includes: next })}
          rows={2}
          emptyHint="Add each included item in its own box."
        />
        <label>
          Other expense label
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "other_expense_label")}
            onChange={(e) => patch({ other_expense_label: e.target.value })}
          />
        </label>
        <label>
          Other expense amount
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "other_expense_amount")}
            onChange={(e) => patch({ other_expense_amount: e.target.value })}
          />
        </label>
        <label>
          Payment methods
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "payment_methods")}
            onChange={(e) => patch({ payment_methods: e.target.value })}
          />
        </label>
      </section>

      <section
        id="learners"
        className="pgs-event-cms__section"
        ref={bindSection("learners")}
      >
        <EditableLabelField
          value={labels.learners ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.learners}
          onChange={(next) => patchLabel("learners", next)}
        />
        <AdminRichTextField
          label="Intro"
          value={str(draft, "learners_intro")}
          onChange={(next) => patch({ learners_intro: next })}
          rows={4}
        />
        <EventTestimonialsField
          value={asTestimonials(draft.testimonials)}
          onChange={(next) => patch({ testimonials: next })}
        />
      </section>

      <section
        id="faq"
        className="pgs-event-cms__section"
        ref={bindSection("faq")}
      >
        <EditableLabelField
          value={labels.faq ?? ""}
          fallback={DEFAULT_COURSE_SECTION_LABELS.faq}
          onChange={(next) => patchLabel("faq", next)}
        />
        <CourseFaqField value={asFaqs(draft)} onChange={setFaqs} />
      </section>

      <section
        id="meta"
        className="pgs-event-cms__section"
        ref={bindSection("meta")}
      >
        <h3 className="pgs-event-cms__section-title">Meta</h3>
        <label>
          Slug
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "slug")}
            onChange={(e) => patch({ slug: e.target.value })}
            placeholder="Auto-assigned; edit anytime"
          />
        </label>
        <label>
          Category
          <select
            value={
              draft.category_id == null || draft.category_id === ""
                ? ""
                : String(draft.category_id)
            }
            onChange={(e) =>
              patch({
                category_id: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">—</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          University
          <select
            value={
              draft.university_id == null || draft.university_id === ""
                ? ""
                : String(draft.university_id)
            }
            onChange={(e) =>
              patch({
                university_id: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">—</option>
            {universityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="pgs-event-cms__checkbox">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => patch({ featured: e.target.checked })}
          />
          Featured
        </label>
        <label>
          Display order
          <input
            type="number"
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={
              draft.display_order == null ? "" : String(draft.display_order)
            }
            onChange={(e) =>
              patch({
                display_order:
                  e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </label>
        <label>
          Lifecycle phase
          <select
            value={str(draft, "lifecycle_phase") || "live"}
            onChange={(e) => patch({ lifecycle_phase: e.target.value })}
          >
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="pgs-event-cms__checkbox">
          <input
            type="checkbox"
            checked={Boolean(draft.published)}
            onChange={(e) => patch({ published: e.target.checked })}
          />
          Published
        </label>
      </section>
    </div>
  );
}
