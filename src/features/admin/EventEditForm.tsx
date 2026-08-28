"use client";

import {
  AdminDateTimeField,
  type DateTimeSaveState,
} from "./AdminDateTimeField";
import { AdminRichTextField } from "./AdminRichTextField";
import { LineItemsField } from "./LineItemsField";
import { EditableLabelField } from "./EditableLabelField";
import {
  EventFacilitatorsField,
  type FacilitatorDraft,
} from "./EventFacilitatorsField";
import {
  EventFaqField,
  parseFaqDraft,
  serializeFaqItems,
  type FaqDraftItem,
} from "./EventFaqField";
import {
  EventTestimonialsField,
  type TestimonialDraft,
} from "./EventTestimonialsField";
import { BadgeChipStyleFields } from "./BadgeChipStyleFields";
import { DEFAULT_EVENT_BADGE_ICON } from "@/components/cards/badge-chip-style";
import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";
import { TagPickerField } from "./TagPickerField";
import {
  DEFAULT_SECTION_LABELS,
  type SessionPageLabels,
} from "@/features/purpleevents/content";

export const EVENT_EDIT_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "schedule", label: "Schedule" },
  { id: "who", label: "Who’s it for" },
  { id: "topics", label: "Topics" },
  { id: "cover", label: "What we cover" },
  { id: "perks", label: "Session perks" },
  { id: "facilitators", label: "Facilitators" },
  { id: "note", label: "Note" },
  { id: "upcoming", label: "Upcoming" },
  { id: "poster", label: "Poster / share" },
  { id: "highlights", label: "Highlights" },
  { id: "testimonials", label: "Testimonials" },
  { id: "cta", label: "CTA" },
  { id: "faq", label: "FAQ" },
  { id: "meta", label: "Meta" },
] as const;

type Props = {
  draft: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  categoryOptions: { value: string; label: string }[];
  dateSaveState?: {
    starts_at?: DateTimeSaveState;
    ends_at?: DateTimeSaveState;
  };
  /** Optional ref callback when a section mounts / unmounts. */
  onSectionRef?: (id: string, el: HTMLElement | null) => void;
};

function str(draft: Record<string, unknown>, key: string): string {
  const v = draft[key];
  return v == null ? "" : String(v);
}

function asFacilitators(value: unknown): FacilitatorDraft[] {
  return Array.isArray(value) ? (value as FacilitatorDraft[]) : [];
}

function asTestimonials(value: unknown): TestimonialDraft[] {
  return Array.isArray(value) ? (value as TestimonialDraft[]) : [];
}

function asLabels(value: unknown): SessionPageLabels {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as SessionPageLabels;
  }
  return {};
}

function asFaqs(draft: Record<string, unknown>): FaqDraftItem[] {
  if (Array.isArray(draft.faq_draft)) {
    return draft.faq_draft as FaqDraftItem[];
  }
  return parseFaqDraft(str(draft, "faq_items"));
}

function slugifyField(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function EventEditForm({
  draft,
  onChange,
  categoryOptions,
  dateSaveState,
  onSectionRef,
}: Props) {
  const labels = asLabels(draft.section_labels);

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

  function patchLabel(key: keyof SessionPageLabels, next: string) {
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

  async function setHeroImage(assetId: string | null) {
    await setMediaUrl("image_asset_id", "image_url", assetId);
  }

  function setFaqs(next: FaqDraftItem[]) {
    patch({
      faq_draft: next,
      faq_items: serializeFaqItems(next),
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
        <label>
          Host
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "host")}
            onChange={(e) => patch({ host: e.target.value })}
          />
        </label>
        <EditableLabelField
          as="label"
          value={labels.hostPrefix ?? ""}
          fallback={DEFAULT_SECTION_LABELS.hostPrefix}
          onChange={(next) => patchLabel("hostPrefix", next)}
        />
        <label>
          Top label
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "top_label")}
            onChange={(e) => patch({ top_label: e.target.value })}
          />
        </label>
        <TagPickerField
          label="Enroll badge"
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
          defaultIconSrc={DEFAULT_EVENT_BADGE_ICON}
          onColorChange={(color) => patch({ badge_color: color })}
          onTextColorChange={(color) => patch({ badge_text_color: color })}
          onIconChange={(id) =>
            void setMediaUrl("badge_icon_asset_id", "badge_icon_url", id)
          }
        />
        <TagPickerField
          label="Mode"
          kind="mode"
          value={str(draft, "mode")}
          maxTags={1}
          hashPrefix
          onChange={(next) => patch({ mode: next })}
        />
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
          folder="events"
          onChange={(id) => void setHeroImage(id)}
        />
        <AdminRichTextField
          label="Description"
          value={str(draft, "description")}
          onChange={(next) => patch({ description: next })}
          rows={8}
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
          value={draft.starts_at ? String(draft.starts_at) : null}
          saveState={dateSaveState?.starts_at}
          onChange={(iso) => patch({ starts_at: iso })}
        />
        <AdminDateTimeField
          label="Ends at"
          value={draft.ends_at ? String(draft.ends_at) : null}
          saveState={dateSaveState?.ends_at}
          onChange={(iso) => patch({ ends_at: iso })}
        />
      </section>

      <section
        id="who"
        className="pgs-event-cms__section"
        ref={bindSection("who")}
      >
        <EditableLabelField
          value={labels.whoFor ?? ""}
          fallback={DEFAULT_SECTION_LABELS.whoFor}
          onChange={(next) => patchLabel("whoFor", next)}
        />
        <LineItemsField
          label="Who’s it for lines"
          itemLabel="Line"
          value={str(draft, "who_is_it_for")}
          onChange={(next) => patch({ who_is_it_for: next })}
          rich
          rows={3}
          emptyHint="Add each line as its own box."
        />
      </section>

      <section
        id="topics"
        className="pgs-event-cms__section"
        ref={bindSection("topics")}
      >
        <EditableLabelField
          value={labels.sessionTopics ?? ""}
          fallback={DEFAULT_SECTION_LABELS.sessionTopics}
          onChange={(next) => patchLabel("sessionTopics", next)}
        />
        <LineItemsField
          label="Session topics"
          itemLabel="Topic"
          value={str(draft, "session_topics")}
          onChange={(next) => patch({ session_topics: next })}
          rich
          rows={3}
          emptyHint="Add each topic in its own box."
        />
      </section>

      <section
        id="cover"
        className="pgs-event-cms__section"
        ref={bindSection("cover")}
      >
        <EditableLabelField
          value={labels.whatWeCover ?? ""}
          fallback={DEFAULT_SECTION_LABELS.whatWeCover}
          onChange={(next) => patchLabel("whatWeCover", next)}
        />
        <LineItemsField
          label="What we cover"
          itemLabel="Item"
          value={str(draft, "what_we_cover")}
          onChange={(next) => patch({ what_we_cover: next })}
          rich
          rows={3}
          emptyHint="Add each numbered cover item in its own box."
        />
      </section>

      <section
        id="perks"
        className="pgs-event-cms__section"
        ref={bindSection("perks")}
      >
        <h3 className="pgs-event-cms__section-title">Session perks</h3>
        <p className="pgs-event-cms__hint">
          Green box on the left and checklist on the right, between What we
          cover and Facilitators.
        </p>
        <LineItemsField
          label="Green box lines"
          itemLabel="Line"
          value={str(draft, "benefits_aside")}
          onChange={(next) => patch({ benefits_aside: next })}
          rich
          rows={2}
          emptyHint="Add each line shown in the green box."
        />
        <LineItemsField
          label="Checklist items"
          itemLabel="Perk"
          value={str(draft, "benefits")}
          onChange={(next) => patch({ benefits: next })}
          rows={2}
          emptyHint="Add each checklist perk in its own box."
        />
      </section>

      <section
        id="facilitators"
        className="pgs-event-cms__section"
        ref={bindSection("facilitators")}
      >
        <EditableLabelField
          value={labels.facilitators ?? ""}
          fallback={DEFAULT_SECTION_LABELS.facilitators}
          onChange={(next) => patchLabel("facilitators", next)}
        />
        <EventFacilitatorsField
          value={asFacilitators(draft.facilitators)}
          onChange={(next) => patch({ facilitators: next })}
        />
      </section>

      <section
        id="note"
        className="pgs-event-cms__section"
        ref={bindSection("note")}
      >
        <EditableLabelField
          value={labels.note ?? ""}
          fallback={DEFAULT_SECTION_LABELS.note}
          onChange={(next) => patchLabel("note", next)}
        />
        <AdminRichTextField
          label="Note body"
          value={str(draft, "location_note")}
          onChange={(next) => patch({ location_note: next })}
          rows={4}
        />
        <AdminRichTextField
          label="Text beside note — title"
          value={str(draft, "roadmap_title")}
          onChange={(next) => patch({ roadmap_title: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Text beside note — body"
          value={str(draft, "roadmap_body")}
          onChange={(next) => patch({ roadmap_body: next })}
          rows={5}
        />
        <AdminRichTextField
          label="Footer under note"
          value={str(draft, "roadmap_footer")}
          onChange={(next) => patch({ roadmap_footer: next })}
          rows={4}
        />
      </section>

      <section
        id="upcoming"
        className="pgs-event-cms__section"
        ref={bindSection("upcoming")}
      >
        <EditableLabelField
          value={labels.upcoming ?? ""}
          fallback={DEFAULT_SECTION_LABELS.upcoming}
          onChange={(next) => patchLabel("upcoming", next)}
        />
        <label className="pgs-event-cms__checkbox">
          <input
            type="checkbox"
            checked={Boolean(draft.show_upcoming_sessions)}
            onChange={(e) =>
              patch({ show_upcoming_sessions: e.target.checked })
            }
          />
          Show Upcoming Sessions on session page
        </label>
      </section>

      <section
        id="poster"
        className="pgs-event-cms__section"
        ref={bindSection("poster")}
      >
        <EditableLabelField
          value={labels.download ?? ""}
          fallback={DEFAULT_SECTION_LABELS.download}
          onChange={(next) => patchLabel("download", next)}
        />
        <AdminRichTextField
          label="Share section title"
          value={str(draft, "poster_title")}
          onChange={(next) => patch({ poster_title: next })}
          rows={3}
        />
        <AdminRichTextField
          label="Share section body"
          value={str(draft, "poster_body")}
          onChange={(next) => patch({ poster_body: next })}
          rows={5}
        />
        <label>
          Poster invite title
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "poster_invite_title")}
            onChange={(e) => patch({ poster_invite_title: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Poster invite body"
          value={str(draft, "poster_invite_body")}
          onChange={(next) => patch({ poster_invite_body: next })}
          rows={4}
        />
        <label>
          Live / mode line
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "poster_live")}
            onChange={(e) => patch({ poster_live: e.target.value })}
          />
        </label>
        <LineItemsField
          label="Poster topics"
          itemLabel="Topic"
          value={str(draft, "poster_topics")}
          onChange={(next) => patch({ poster_topics: next })}
          rows={2}
          emptyHint="Add each poster topic in its own box."
        />
        <MediaAssetField
          label="QR code image"
          value={
            draft.poster_qr_asset_id ? String(draft.poster_qr_asset_id) : null
          }
          accept="image"
          folder="events"
          onChange={(id) =>
            void setMediaUrl("poster_qr_asset_id", "poster_qr_url", id)
          }
        />
        <MediaAssetField
          label="Poster background image"
          value={
            draft.poster_bg_asset_id ? String(draft.poster_bg_asset_id) : null
          }
          accept="image"
          folder="events"
          onChange={(id) =>
            void setMediaUrl("poster_bg_asset_id", "poster_bg_url", id)
          }
        />
      </section>

      <section
        id="highlights"
        className="pgs-event-cms__section"
        ref={bindSection("highlights")}
      >
        <EditableLabelField
          value={labels.highlights ?? ""}
          fallback={DEFAULT_SECTION_LABELS.highlights}
          onChange={(next) => patchLabel("highlights", next)}
        />
        <label>
          Heading override (optional)
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "highlight_heading")}
            onChange={(e) => patch({ highlight_heading: e.target.value })}
            placeholder={DEFAULT_SECTION_LABELS.highlights}
          />
        </label>
        <AdminRichTextField
          label="Highlight title"
          value={str(draft, "highlight_title")}
          onChange={(next) => patch({ highlight_title: next })}
          rows={3}
        />
        <label>
          Location
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "highlight_location")}
            onChange={(e) => patch({ highlight_location: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Highlight body"
          value={str(draft, "highlight_body")}
          onChange={(next) => patch({ highlight_body: next })}
          rows={6}
        />
        <MediaAssetField
          label="Highlight image 1"
          value={
            draft.highlight_image_1_asset_id
              ? String(draft.highlight_image_1_asset_id)
              : null
          }
          accept="image"
          folder="events"
          onChange={(id) =>
            void setMediaUrl(
              "highlight_image_1_asset_id",
              "highlight_image_1_url",
              id,
            )
          }
        />
        <MediaAssetField
          label="Highlight image 2"
          value={
            draft.highlight_image_2_asset_id
              ? String(draft.highlight_image_2_asset_id)
              : null
          }
          accept="image"
          folder="events"
          onChange={(id) =>
            void setMediaUrl(
              "highlight_image_2_asset_id",
              "highlight_image_2_url",
              id,
            )
          }
        />
        <MediaAssetField
          label="Highlight image 3"
          value={
            draft.highlight_image_3_asset_id
              ? String(draft.highlight_image_3_asset_id)
              : null
          }
          accept="image"
          folder="events"
          onChange={(id) =>
            void setMediaUrl(
              "highlight_image_3_asset_id",
              "highlight_image_3_url",
              id,
            )
          }
        />
      </section>

      <section
        id="testimonials"
        className="pgs-event-cms__section"
        ref={bindSection("testimonials")}
      >
        <h3 className="pgs-event-cms__section-title">Testimonials</h3>
        <EventTestimonialsField
          value={asTestimonials(draft.testimonials)}
          onChange={(next) => patch({ testimonials: next })}
        />
      </section>

      <section
        id="cta"
        className="pgs-event-cms__section"
        ref={bindSection("cta")}
      >
        <EditableLabelField
          value={labels.cta ?? ""}
          fallback={DEFAULT_SECTION_LABELS.cta}
          onChange={(next) => patchLabel("cta", next)}
        />
        <label>
          Eyebrow
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "cta_eyebrow")}
            onChange={(e) => patch({ cta_eyebrow: e.target.value })}
          />
        </label>
        <label>
          Title
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "cta_title")}
            onChange={(e) => patch({ cta_title: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={str(draft, "cta_body")}
          onChange={(next) => patch({ cta_body: next })}
          rows={4}
        />
        <label>
          Button label
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "cta_button_label")}
            onChange={(e) => patch({ cta_button_label: e.target.value })}
          />
        </label>
        <label>
          Button URL
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={str(draft, "cta_button_href")}
            onChange={(e) => patch({ cta_button_href: e.target.value })}
          />
        </label>
      </section>

      <section
        id="faq"
        className="pgs-event-cms__section"
        ref={bindSection("faq")}
      >
        <EditableLabelField
          value={labels.faq ?? ""}
          fallback={DEFAULT_SECTION_LABELS.faq}
          onChange={(next) => patchLabel("faq", next)}
        />
        <EventFaqField value={asFaqs(draft)} onChange={setFaqs} />
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
          Display order
          <input
            type="number"
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
      </section>
    </div>
  );
}
