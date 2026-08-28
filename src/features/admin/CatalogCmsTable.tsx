"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  clearCatalogDraft,
  listCatalogCategoryOptions,
  listCatalogRows,
  listCatalogUniversityOptions,
  listCourseTestimonials,
  listEventFacilitators,
  listEventTestimonials,
  setCatalogPhase,
  suggestCatalogSlug,
  upsertCatalogRow,
  type CatalogEntity,
  type LifecyclePhase,
} from "./catalog-actions";
import { EventVisualEditor } from "./EventVisualEditor";
import { CourseVisualEditor } from "./CourseVisualEditor";
import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";
import { StandalonePreviewPane } from "./StandalonePreviewPane";
import { TagsField } from "./TagsField";
import { EventEditShell } from "./EventEditShell";
import {
  EventEditForm,
  EVENT_EDIT_SECTIONS,
} from "./EventEditForm";
import {
  CourseEditForm,
  COURSE_EDIT_SECTIONS,
} from "./CourseEditForm";
import { UnsavedChangesModal } from "./UnsavedChangesModal";
import type { DateTimeSaveState } from "./AdminDateTimeField";
import {
  EVENT_VISUAL_KEYS,
  eventMockDraft,
  eventToSessionDetail,
} from "./event-preview-map";
import {
  COURSE_VISUAL_KEYS,
  courseMockDraft,
  courseToDetail,
} from "./course-preview-map";

const CMS_EXTRA_KEYS: Record<"events" | "courses", readonly string[]> = {
  events: [
    "section_labels",
    "benefits",
    "benefits_aside",
    "card_dates_rail",
    "card_promo_title",
    "card_promo_subtitle",
    "card_promo_date",
    "card_cta_label",
  ],
  courses: [
    "section_labels",
    "benefits_aside",
    "brochure_title",
    "brochure_body",
    "brochure_badge",
    "gallery_image_1_asset_id",
    "gallery_image_2_asset_id",
    "gallery_image_3_asset_id",
    "accreditation_logos",
    "card_dates_rail",
    "card_promo_title",
    "card_promo_subtitle",
    "card_promo_date",
    "card_cta_label",
  ],
};

type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "checkbox"
    | "select"
    | "number"
    | "date"
    | "datetime"
    | "media"
    | "tags";
  options?: { value: string; label: string }[];
  /** Empty string is sent as null (nullable DB columns). */
  nullable?: boolean;
  mediaAccept?: "image" | "document";
  /** Textarea accepts raw HTML (WordPress-style values). */
  html?: boolean;
};

const PHASE_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
  { value: "archived", label: "Archived" },
];

const FIELDS: Record<CatalogEntity, Field[]> = {
  courses: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    {
      key: "short_description",
      label: "Short description (hero intro)",
      type: "textarea",
      html: true,
    },
    {
      key: "headline",
      label: "Headline (beside dates)",
      type: "textarea",
      html: true,
    },
    {
      key: "hero_note",
      label: "Hero note (under headline)",
      type: "textarea",
    },
    {
      key: "description",
      label: "Program Description",
      type: "textarea",
      html: true,
    },
    { key: "category_id", label: "Category", type: "select", nullable: true },
    {
      key: "university_id",
      label: "University",
      type: "select",
      nullable: true,
    },
    { key: "program_type", label: "Type (e.g. Certificate)" },
    { key: "duration", label: "Duration" },
    { key: "mode", label: "Mode (e.g. #inCampus)" },
    { key: "badge", label: "Badge (e.g. Filling Fast)" },
    { key: "location", label: "Location" },
    { key: "session_time", label: "Session time (under dates)" },
    {
      key: "tags_text",
      label: "Tags",
      type: "tags",
    },
    { key: "starts_on", label: "Starts on", type: "date", nullable: true },
    { key: "ends_on", label: "Ends on", type: "date", nullable: true },
    { key: "booking_url", label: "Booking URL", nullable: true },
    {
      key: "who_is_it_for",
      label: "Who’s It For?",
      type: "textarea",
      html: true,
    },
    {
      key: "session_topics",
      label: "Program Topics",
      type: "textarea",
      html: true,
    },
    { key: "highlight_1", label: "Highlight 1", type: "textarea" },
    { key: "highlight_2", label: "Highlight 2", type: "textarea" },
    { key: "highlight_3", label: "Highlight 3", type: "textarea" },
    { key: "highlight_4", label: "Highlight 4", type: "textarea" },
    {
      key: "benefits",
      label: "Benefits checklist (one per line)",
      type: "textarea",
    },
    {
      key: "awarding_body_intro",
      label: "Awarding body intro",
      type: "textarea",
    },
    {
      key: "awarding_body_facts",
      label: "Awarding body facts (Title||Body per line)",
      type: "textarea",
    },
    {
      key: "awarding_body_rankings",
      label: "Rankings & reputation",
      type: "textarea",
    },
    {
      key: "apply_intro",
      label: "How to apply intro",
      type: "textarea",
    },
    {
      key: "eligibility",
      label: "Eligibility tags (one per line)",
      type: "textarea",
    },
    {
      key: "certificate_heading",
      label: "Certificate heading",
      type: "textarea",
    },
    {
      key: "certificate_why",
      label: "Certificate why it matters (one per line)",
      type: "textarea",
    },
    { key: "gallery_title", label: "Gallery title" },
    {
      key: "gallery_blurb",
      label: "Gallery blurb",
      type: "textarea",
    },
    { key: "gallery_location", label: "Gallery location" },
    {
      key: "gallery_body",
      label: "Gallery body",
      type: "textarea",
    },
    { key: "fee_amount", label: "Enrollment fee amount" },
    { key: "fee_subtitle", label: "Fee subtitle" },
    { key: "fee_badge", label: "Fee badge" },
    { key: "fee_note", label: "Fee note (e.g. Early Bird)" },
    {
      key: "fee_includes",
      label: "Fee includes (one per line)",
      type: "textarea",
    },
    { key: "other_expense_label", label: "Other expense label" },
    { key: "other_expense_amount", label: "Other expense amount" },
    {
      key: "payment_methods",
      label: "Payment methods",
      type: "textarea",
    },
    {
      key: "learners_intro",
      label: "Learners intro",
      type: "textarea",
    },
    {
      key: "faq_items",
      label: "FAQ items (tab||Question||Answer per line)",
      type: "textarea",
      html: false,
    },
    { key: "benefits_aside", label: "Benefits aside", type: "textarea" },
    { key: "brochure_title", label: "Brochure title" },
    { key: "brochure_body", label: "Brochure body", type: "textarea" },
    { key: "brochure_badge", label: "Brochure badge" },
    {
      key: "gallery_image_1_asset_id",
      label: "Gallery image 1",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "gallery_image_2_asset_id",
      label: "Gallery image 2",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "gallery_image_3_asset_id",
      label: "Gallery image 3",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "accreditation_logos",
      label: "Accreditation logos (one URL per line)",
      type: "textarea",
    },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Hero image",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "partner_logo_asset_id",
      label: "Partner logo",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "awarding_body_image_asset_id",
      label: "Awarding body image",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "brochure_asset_id",
      label: "Brochure",
      type: "media",
      mediaAccept: "document",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
  events: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    {
      key: "summary",
      label: "Summary (cards / listings — Visual templates tab)",
      type: "textarea",
      html: true,
    },
    {
      key: "description",
      label: "Description (hero body)",
      type: "textarea",
      html: true,
    },
    { key: "category_id", label: "Category", type: "select", nullable: true },
    { key: "host", label: "Host" },
    { key: "top_label", label: "Top label (hero subtitle)" },
    { key: "badge", label: "Enroll badge (hero chip)" },
    {
      key: "tags_text",
      label: "Tags",
      type: "tags",
    },
    { key: "location", label: "Location (cards)" },
    { key: "location_note", label: "Note" },
    { key: "roadmap_title", label: "Note adjacent title", type: "textarea" },
    { key: "roadmap_body", label: "Note adjacent body", type: "textarea" },
    { key: "roadmap_footer", label: "Note footer", type: "textarea" },
    {
      key: "show_upcoming_sessions",
      label: "Show Upcoming Sessions on session page",
      type: "checkbox",
    },
    { key: "mode", label: "Mode" },
    { key: "starts_at", label: "Starts at", type: "datetime", nullable: true },
    { key: "ends_at", label: "Ends at", type: "datetime", nullable: true },
    { key: "booking_url", label: "Booking URL", nullable: true },
    {
      key: "who_is_it_for",
      label: "Who’s It For?",
      type: "textarea",
      html: true,
    },
    {
      key: "session_topics",
      label: "Session Topics",
      type: "textarea",
      html: true,
    },
    {
      key: "what_we_cover",
      label: "What We’ll Cover in This Session",
      type: "textarea",
      html: true,
    },
    {
      key: "benefits_aside",
      label: "Session perks — green box (one line per row)",
      type: "textarea",
      html: true,
    },
    {
      key: "benefits",
      label: "Session perks checklist (one per line)",
      type: "textarea",
    },
    { key: "poster_title", label: "Poster / share title", type: "textarea" },
    { key: "poster_body", label: "Poster / share body", type: "textarea" },
    { key: "poster_invite_title", label: "Poster invite title" },
    {
      key: "poster_invite_body",
      label: "Poster invite body",
      type: "textarea",
    },
    { key: "poster_live", label: "Poster live line" },
    { key: "poster_topics", label: "Poster topics", type: "textarea" },
    {
      key: "poster_qr_asset_id",
      label: "Poster QR",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "poster_bg_asset_id",
      label: "Poster background",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    { key: "highlight_heading", label: "Highlights heading" },
    { key: "highlight_title", label: "Highlights title", type: "textarea" },
    { key: "highlight_location", label: "Highlights location" },
    { key: "highlight_body", label: "Highlights body", type: "textarea" },
    {
      key: "highlight_image_1_asset_id",
      label: "Highlight image 1",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "highlight_image_2_asset_id",
      label: "Highlight image 2",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "highlight_image_3_asset_id",
      label: "Highlight image 3",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    { key: "cta_eyebrow", label: "CTA eyebrow" },
    { key: "cta_title", label: "CTA title" },
    { key: "cta_body", label: "CTA body", type: "textarea" },
    { key: "cta_button_label", label: "CTA button label" },
    { key: "cta_button_href", label: "CTA button URL" },
    {
      key: "faq_items",
      label: "FAQ (Question||Answer per line)",
      type: "textarea",
    },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Hero image",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
  programs: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "short_description", label: "Short description", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "university_id",
      label: "University",
      type: "select",
      nullable: true,
    },
    { key: "top_label", label: "Top label" },
    { key: "badge_text", label: "Badge" },
    { key: "close_date_text", label: "Close date text" },
    { key: "learn_more_url", label: "Learn more URL", nullable: true },
    { key: "who_is_it_for", label: "Who is it for", type: "textarea" },
    { key: "session_topics", label: "Session topics", type: "textarea" },
    { key: "highlight_1", label: "Highlight 1" },
    { key: "highlight_2", label: "Highlight 2" },
    { key: "highlight_3", label: "Highlight 3" },
    { key: "highlight_4", label: "Highlight 4" },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    {
      key: "image_asset_id",
      label: "Image",
      type: "media",
      mediaAccept: "image",
      nullable: true,
    },
    {
      key: "brochure_asset_id",
      label: "Brochure",
      type: "media",
      mediaAccept: "document",
      nullable: true,
    },
    { key: "published", label: "Published", type: "checkbox" },
    {
      key: "lifecycle_phase",
      label: "Phase",
      type: "select",
      options: PHASE_OPTIONS,
    },
  ],
};

const PHASES: Array<LifecyclePhase | "all"> = [
  "all",
  "live",
  "ended",
  "archived",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function countDirtyKeys(
  current: Record<string, unknown> | null,
  baseline: Record<string, unknown> | null,
): number {
  if (!current || !baseline) return 0;
  const keys = new Set([
    ...Object.keys(current),
    ...Object.keys(baseline),
  ]);
  let n = 0;
  for (const key of keys) {
    if (JSON.stringify(current[key]) !== JSON.stringify(baseline[key])) {
      n += 1;
    }
  }
  return n;
}

function cloneDraft(row: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(row)) as Record<string, unknown>;
}

const DRAFT_HISTORY_CAP = 50;
const DRAFT_COALESCE_MS = 400;

function changedTopLevelKeys(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const key of keys) {
    if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
      changed.push(key);
    }
  }
  return changed;
}

function isEditableHotkeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

export function CatalogCmsTable({
  entity,
  title,
}: {
  entity: CatalogEntity;
  title: string;
}) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<LifecyclePhase | "all">("live");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [baseline, setBaseline] = useState<Record<string, unknown> | null>(
    null,
  );
  /** Last published live snapshot (events/courses). Null when never live. */
  const [liveBaseline, setLiveBaseline] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [universityOptions, setUniversityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  /** Events / courses: form vs visual template previews. */
  const [editorMode, setEditorMode] = useState<"form" | "visual">("form");
  const [visualEditorMounted, setVisualEditorMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    EVENT_EDIT_SECTIONS[0].id,
  );
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [dateSaveState, setDateSaveState] = useState<{
    starts_at?: DateTimeSaveState;
    ends_at?: DateTimeSaveState;
    starts_on?: DateTimeSaveState;
    ends_on?: DateTimeSaveState;
  }>({});

  const pastDraftsRef = useRef<Record<string, unknown>[]>([]);
  const futureDraftsRef = useRef<Record<string, unknown>[]>([]);
  const coalesceRef = useRef<{ at: number; key: string | null }>({
    at: 0,
    key: null,
  });
  const editingRef = useRef(editing);
  editingRef.current = editing;
  const baselineRef = useRef(baseline);
  baselineRef.current = baseline;
  const hotkeyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});

  const unsavedCount = useMemo(
    () =>
      entity === "events" || entity === "courses"
        ? countDirtyKeys(editing, baseline)
        : 0,
    [entity, editing, baseline],
  );
  /** Changes not yet pushed to the public live row (vs last publish). */
  const unpublishedCount = useMemo(() => {
    if (entity !== "events" && entity !== "courses") return 0;
    if (liveBaseline) return countDirtyKeys(editing, liveBaseline);
    return countDirtyKeys(editing, baseline);
  }, [entity, editing, baseline, liveBaseline]);
  const isDirty = unsavedCount > 0;
  const isLivePublished = Boolean(
    liveBaseline?.published || editing?.published,
  );
  const fields = useMemo(() => {
    return FIELDS[entity].map((field) => {
      if (field.key === "category_id") {
        return {
          ...field,
          options: [
            { value: "", label: "— None —" },
            ...categoryOptions,
          ],
        };
      }
      if (field.key === "university_id") {
        return {
          ...field,
          options: [
            { value: "", label: "— None —" },
            ...universityOptions,
          ],
        };
      }
      return field;
    });
  }, [entity, categoryOptions, universityOptions]);

  const reload = useCallback(
    async (nextPhase: LifecyclePhase | "all" = phase) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listCatalogRows(entity, nextPhase);
        setRows(data as Record<string, unknown>[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [entity, phase],
  );

  useEffect(() => {
    void reload(phase);
  }, [reload, phase]);

  useEffect(() => {
    if (editorMode === "visual") {
      setVisualEditorMounted(true);
    }
  }, [editorMode]);

  useEffect(() => {
    setEditing(null);
    setBaseline(null);
    setLiveBaseline(null);
    pastDraftsRef.current = [];
    futureDraftsRef.current = [];
    coalesceRef.current = { at: 0, key: null };
    setEditorMode("form");
    setVisualEditorMounted(false);
    setCategoryOptions([]);
    setUniversityOptions([]);
    if (entity !== "programs") {
      void listCatalogCategoryOptions(entity)
        .then(setCategoryOptions)
        .catch(() => setCategoryOptions([]));
    }
    if (entity === "courses" || entity === "programs") {
      void listCatalogUniversityOptions()
        .then(setUniversityOptions)
        .catch(() => setUniversityOptions([]));
    }
  }, [pathname, entity]);

  useEffect(() => {
    if (
      !editing ||
      (entity !== "events" && entity !== "courses") ||
      !isDirty
    )
      return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing, entity, isDirty]);

  const isCmsEditorOpen =
    editing !== null && (entity === "events" || entity === "courses");

  useEffect(() => {
    if (!isCmsEditorOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      hotkeyHandlerRef.current(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCmsEditorOpen]);

  const columns = useMemo(
    () => ["title", "slug", "published", "lifecycle_phase", "updated_at"],
    [],
  );

  function clearDraftHistory() {
    pastDraftsRef.current = [];
    futureDraftsRef.current = [];
    coalesceRef.current = { at: 0, key: null };
  }

  function beginEditing(row: Record<string, unknown>, mode: "form" | "visual") {
    clearDraftHistory();
    setEditing(row);
    setBaseline(cloneDraft(row));
    setLiveBaseline(null);
    setEditorMode(mode);
    setVisualEditorMounted(mode === "visual");
    setPreviewVisible(true);
    setActiveSectionId(
      entity === "courses"
        ? COURSE_EDIT_SECTIONS[0].id
        : EVENT_EDIT_SECTIONS[0].id,
    );
    setLeaveModalOpen(false);
    setDateSaveState({});
  }

  function openNew() {
    if (entity === "events") {
      const draft = eventMockDraft();
      const tempSlug = `${slugify(String(draft.title ?? "event"))}-${Date.now().toString(36)}`;
      draft.slug = tempSlug;
      beginEditing(draft, "form");
      void suggestCatalogSlug("events", String(draft.title ?? "event"))
        .then((slug) => {
          if (!editingRef.current || editingRef.current.id != null) return;
          setEditing((prev) => (prev ? { ...prev, slug } : prev));
          setBaseline((prev) => (prev ? { ...prev, slug } : prev));
        })
        .catch(() => {});
      return;
    }
    if (entity === "courses") {
      const draft = courseMockDraft();
      const tempSlug = `${slugify(String(draft.title ?? "course"))}-${Date.now().toString(36)}`;
      draft.slug = tempSlug;
      beginEditing(draft, "form");
      void suggestCatalogSlug("courses", String(draft.title ?? "course"))
        .then((slug) => {
          if (!editingRef.current || editingRef.current.id != null) return;
          setEditing((prev) => (prev ? { ...prev, slug } : prev));
          setBaseline((prev) => (prev ? { ...prev, slug } : prev));
        })
        .catch(() => {});
      return;
    }
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        defaults[field.key] = false;
      } else if (field.key === "lifecycle_phase") {
        defaults[field.key] = "live";
      } else if (field.type === "number") {
        defaults[field.key] = field.nullable ? "" : 0;
      } else if (field.key === "category_id") {
        defaults[field.key] = "";
      } else if (field.key === "university_id") {
        defaults[field.key] = "";
      } else {
        defaults[field.key] = "";
      }
    }
    setEditing(defaults);
    setBaseline(null);
    setLiveBaseline(null);
  }

  function payloadForEntity(row: Record<string, unknown>) {
    const payload: Record<string, unknown> = {};
    if (row.id != null) payload.id = row.id;
    for (const field of fields) {
      if (!(field.key in row)) continue;
      let value = row[field.key];
      if (field.key === "category_id" || field.key === "university_id") {
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          value === 0 ||
          value === "0"
        ) {
          value = null;
        } else {
          value = Number(value);
        }
      } else if (field.type === "number") {
        if (value === "" || value === null || value === undefined) {
          value = field.nullable ? null : 0;
        } else {
          value = Number(value);
        }
      } else if (
        field.nullable &&
        (value === "" || value === undefined)
      ) {
        value = null;
      }
      payload[field.key] = value;
    }
    if (entity === "events") {
      payload.card_surfaces = Array.isArray(row.card_surfaces)
        ? row.card_surfaces
        : [...EVENT_VISUAL_KEYS];
      payload.facilitators = Array.isArray(row.facilitators)
        ? row.facilitators
        : [];
      payload.testimonials = Array.isArray(row.testimonials)
        ? row.testimonials
        : [];
    }
    if (entity === "courses") {
      payload.card_surfaces = Array.isArray(row.card_surfaces)
        ? row.card_surfaces
        : [...COURSE_VISUAL_KEYS];
      payload.testimonials = Array.isArray(row.testimonials)
        ? row.testimonials
        : [];
    }
    if (entity === "events" || entity === "courses") {
      for (const key of CMS_EXTRA_KEYS[entity]) {
        if (key in row) payload[key] = row[key];
      }
    }
    return payload;
  }

  async function openEdit(row: Record<string, unknown>) {
    const next: Record<string, unknown> = {
      ...row,
      facilitators: [],
      testimonials: [],
    };
    if (
      (entity === "events" || entity === "courses") &&
      !Array.isArray(next.card_surfaces)
    ) {
      next.card_surfaces =
        entity === "events"
          ? [...EVENT_VISUAL_KEYS]
          : [...COURSE_VISUAL_KEYS];
    }
    if (entity === "events" && row.id != null) {
      if (next.show_upcoming_sessions == null) {
        next.show_upcoming_sessions = true;
      }
      try {
        next.facilitators = await listEventFacilitators(Number(row.id));
      } catch {
        next.facilitators = [];
      }
      try {
        next.testimonials = await listEventTestimonials(Number(row.id));
      } catch {
        next.testimonials = [];
      }
      const assetId = next.image_asset_id ? String(next.image_asset_id) : "";
      if (assetId && !next.image_url) {
        try {
          const preview = await getMediaAssetPreview(assetId);
          next.image_url = preview?.publicUrl || "";
        } catch {
          next.image_url = "";
        }
      }
      const mediaPairs: Array<[string, string]> = [
        ["badge_icon_asset_id", "badge_icon_url"],
        ["poster_qr_asset_id", "poster_qr_url"],
        ["poster_bg_asset_id", "poster_bg_url"],
        ["highlight_image_1_asset_id", "highlight_image_1_url"],
        ["highlight_image_2_asset_id", "highlight_image_2_url"],
        ["highlight_image_3_asset_id", "highlight_image_3_url"],
      ];
      for (const [assetKey, urlKey] of mediaPairs) {
        const id = next[assetKey] ? String(next[assetKey]) : "";
        if (id && !next[urlKey]) {
          try {
            const preview = await getMediaAssetPreview(id);
            next[urlKey] = preview?.publicUrl || "";
          } catch {
            next[urlKey] = "";
          }
        }
      }
      if (next.section_labels == null || typeof next.section_labels !== "object") {
        next.section_labels = {};
      }
    }
    if (entity === "courses" && row.id != null) {
      try {
        next.testimonials = await listCourseTestimonials(Number(row.id));
      } catch {
        next.testimonials = [];
      }
      const courseMedia: Array<[string, string]> = [
        ["image_asset_id", "image_url"],
        ["badge_icon_asset_id", "badge_icon_url"],
        ["partner_logo_asset_id", "partner_logo_url"],
        ["brochure_asset_id", "brochure_url"],
        ["awarding_body_image_asset_id", "awarding_body_image_url"],
        ["gallery_image_1_asset_id", "gallery_image_1_url"],
        ["gallery_image_2_asset_id", "gallery_image_2_url"],
        ["gallery_image_3_asset_id", "gallery_image_3_url"],
      ];
      for (const [assetKey, urlKey] of courseMedia) {
        const id = next[assetKey] ? String(next[assetKey]) : "";
        if (id && !next[urlKey]) {
          try {
            const preview = await getMediaAssetPreview(id);
            next[urlKey] = preview?.publicUrl || "";
          } catch {
            next[urlKey] = "";
          }
        }
      }
      if (next.section_labels == null || typeof next.section_labels !== "object") {
        next.section_labels = {};
      }
    }
    const storedDraft = next.cms_draft;
    delete next.cms_draft;

    const liveSnapshot = cloneDraft(next);
    let editorDoc = liveSnapshot;
    if (
      storedDraft &&
      typeof storedDraft === "object" &&
      !Array.isArray(storedDraft)
    ) {
      const draft = storedDraft as Record<string, unknown>;
      editorDoc = {
        ...liveSnapshot,
        ...draft,
        id: liveSnapshot.id,
        published: Boolean(liveSnapshot.published),
      };
      delete editorDoc.cms_draft;
    }

    if (entity === "events") {
      clearDraftHistory();
      setLiveBaseline(
        liveSnapshot.published ? cloneDraft(liveSnapshot) : null,
      );
      setEditing(editorDoc);
      setBaseline(cloneDraft(editorDoc));
      setEditorMode("form");
      setPreviewVisible(true);
      setActiveSectionId(EVENT_EDIT_SECTIONS[0].id);
      setLeaveModalOpen(false);
      setDateSaveState({});
    } else if (entity === "courses") {
      clearDraftHistory();
      setLiveBaseline(
        liveSnapshot.published ? cloneDraft(liveSnapshot) : null,
      );
      setEditing(editorDoc);
      setBaseline(cloneDraft(editorDoc));
      setEditorMode("form");
      setPreviewVisible(true);
      setActiveSectionId(COURSE_EDIT_SECTIONS[0].id);
      setLeaveModalOpen(false);
      setDateSaveState({});
    } else {
      setEditing(next);
    }
  }

  function requestCloseEditor() {
    if ((entity === "events" || entity === "courses") && isDirty) {
      setLeaveModalOpen(true);
      return;
    }
    clearDraftHistory();
    setEditing(null);
    setBaseline(null);
    setLiveBaseline(null);
    setLeaveModalOpen(false);
    setVisualEditorMounted(false);
    setEditorMode("form");
  }

  async function discardEdits() {
    clearDraftHistory();
    const live = liveBaseline;
    const rowId = editing?.id ?? live?.id;
    if (
      (entity === "events" || entity === "courses") &&
      live &&
      rowId != null &&
      Boolean(live.published)
    ) {
      setLoading(true);
      setError(null);
      try {
        await clearCatalogDraft(entity, Number(rowId));
        const restored = cloneDraft(live);
        setEditing(restored);
        setBaseline(cloneDraft(restored));
        setDateSaveState({});
        await reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Discard failed");
      } finally {
        setLoading(false);
      }
      setLeaveModalOpen(false);
      return;
    }
    if (baseline) {
      setEditing(cloneDraft(baseline));
      setDateSaveState({});
    } else {
      setEditing(null);
      setBaseline(null);
      setLiveBaseline(null);
    }
    setLeaveModalOpen(false);
  }

  function applyDraft(next: Record<string, unknown>) {
    const current = editingRef.current;
    if (!current) {
      setEditing(next);
      return;
    }
    const changed = changedTopLevelKeys(current, next);
    if (changed.length === 0) {
      setEditing(next);
      return;
    }

    const now = Date.now();
    const singleKey = changed.length === 1 ? changed[0] : null;
    const coalesce = coalesceRef.current;
    const shouldCoalesce =
      singleKey != null &&
      coalesce.key === singleKey &&
      now - coalesce.at < DRAFT_COALESCE_MS;

    if (!shouldCoalesce) {
      pastDraftsRef.current = [
        ...pastDraftsRef.current.slice(-(DRAFT_HISTORY_CAP - 1)),
        cloneDraft(current),
      ];
      futureDraftsRef.current = [];
      coalesceRef.current = { at: now, key: singleKey };
    } else {
      coalesceRef.current = { at: now, key: singleKey };
    }

    setEditing(next);
    if (entity === "events" || entity === "courses") {
      setDateSaveState(
        scheduleSaveStateFor(next, baselineRef.current, false),
      );
    }
  }

  function undoDraft() {
    const current = editingRef.current;
    if (!current || pastDraftsRef.current.length === 0) return;
    const previous = pastDraftsRef.current[pastDraftsRef.current.length - 1];
    pastDraftsRef.current = pastDraftsRef.current.slice(0, -1);
    futureDraftsRef.current = [
      ...futureDraftsRef.current,
      cloneDraft(current),
    ];
    coalesceRef.current = { at: 0, key: null };
    setEditing(cloneDraft(previous));
    if (entity === "events" || entity === "courses") {
      setDateSaveState(
        scheduleSaveStateFor(previous, baselineRef.current, false),
      );
    }
  }

  function redoDraft() {
    const current = editingRef.current;
    if (!current || futureDraftsRef.current.length === 0) return;
    const next = futureDraftsRef.current[futureDraftsRef.current.length - 1];
    futureDraftsRef.current = futureDraftsRef.current.slice(0, -1);
    pastDraftsRef.current = [
      ...pastDraftsRef.current.slice(-(DRAFT_HISTORY_CAP - 1)),
      cloneDraft(current),
    ];
    coalesceRef.current = { at: 0, key: null };
    setEditing(cloneDraft(next));
    if (entity === "events" || entity === "courses") {
      setDateSaveState(
        scheduleSaveStateFor(next, baselineRef.current, false),
      );
    }
  }

  function dateStateFor(
    key: "starts_at" | "ends_at" | "starts_on" | "ends_on",
    next: Record<string, unknown>,
    prevBaseline: Record<string, unknown> | null,
    saving: boolean,
  ): DateTimeSaveState {
    if (saving) return "saving";
    const cur = JSON.stringify(next[key] ?? null);
    const base = JSON.stringify(prevBaseline?.[key] ?? null);
    if (cur !== base) return "dirty";
    return "idle";
  }

  function scheduleSaveStateFor(
    next: Record<string, unknown>,
    prevBaseline: Record<string, unknown> | null,
    saving: boolean,
  ) {
    if (entity === "courses") {
      const startDirty =
        dateStateFor("starts_on", next, prevBaseline, false) === "dirty" ||
        JSON.stringify(next.session_time ?? null) !==
          JSON.stringify(prevBaseline?.session_time ?? null);
      const endDirty =
        dateStateFor("ends_on", next, prevBaseline, false) === "dirty" ||
        JSON.stringify(next.session_time ?? null) !==
          JSON.stringify(prevBaseline?.session_time ?? null);
      return {
        starts_on: saving
          ? ("saving" as const)
          : startDirty
            ? ("dirty" as const)
            : ("idle" as const),
        ends_on: saving
          ? ("saving" as const)
          : endDirty
            ? ("dirty" as const)
            : ("idle" as const),
      };
    }
    return {
      starts_at: dateStateFor("starts_at", next, prevBaseline, saving),
      ends_at: dateStateFor("ends_at", next, prevBaseline, saving),
    };
  }

  async function save(options?: {
    published?: boolean;
    stayOpen?: boolean;
  }) {
    if (!editing) return;
    setLoading(true);
    setError(null);
    const stayOpen = Boolean(options?.stayOpen);
    const mode = options?.published === true ? "publish" : "draft";
    const nextEditing =
      mode === "publish"
        ? { ...editing, published: true }
        : {
            ...editing,
            // Keep live items live when saving a WIP draft
            published:
              isLivePublished || Boolean(editing.published)
                ? true
                : false,
          };

    if (entity === "events" || entity === "courses") {
      setDateSaveState(scheduleSaveStateFor(nextEditing, baseline, true));
    }

    try {
      const payload = payloadForEntity(nextEditing);
      if (!payload.slug && typeof payload.title === "string") {
        payload.slug = slugify(payload.title);
      }
      payload.published = nextEditing.published;
      const result = await upsertCatalogRow(entity, payload, { mode });
      const saved: Record<string, unknown> = {
        ...nextEditing,
        published: result?.published ?? nextEditing.published,
      };
      if (result?.id != null) saved.id = result.id;
      if (result?.slug) {
        saved.slug = result.slug;
      } else if (payload.slug) {
        saved.slug = payload.slug;
      } else if (typeof payload.title === "string") {
        saved.slug = slugify(payload.title);
      }
      delete saved.cms_draft;

      if (stayOpen && (entity === "events" || entity === "courses")) {
        clearDraftHistory();
        const normalized = cloneDraft(saved);
        setEditing(normalized);
        setBaseline(cloneDraft(normalized));
        if (mode === "publish") {
          setLiveBaseline(cloneDraft(normalized));
        } else if (!result?.published) {
          setLiveBaseline(null);
        }
        if (entity === "courses") {
          setDateSaveState({ starts_on: "saved", ends_on: "saved" });
          window.setTimeout(() => {
            setDateSaveState((prev) => ({
              starts_on: prev.starts_on === "saved" ? "idle" : prev.starts_on,
              ends_on: prev.ends_on === "saved" ? "idle" : prev.ends_on,
            }));
          }, 1600);
        } else {
          setDateSaveState({ starts_at: "saved", ends_at: "saved" });
          window.setTimeout(() => {
            setDateSaveState((prev) => ({
              starts_at: prev.starts_at === "saved" ? "idle" : prev.starts_at,
              ends_at: prev.ends_at === "saved" ? "idle" : prev.ends_at,
            }));
          }, 1600);
        }
        await reload();
      } else {
        clearDraftHistory();
        setEditing(null);
        setBaseline(null);
        setLiveBaseline(null);
        await reload();
      }
      setLeaveModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      if (entity === "events") {
        setDateSaveState({
          starts_at: "error",
          ends_at: "error",
        });
      } else if (entity === "courses") {
        setDateSaveState({
          starts_on: "error",
          ends_on: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function archiveRow(id: number) {
    setLoading(true);
    setError(null);
    try {
      await setCatalogPhase(entity, id, "archived");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed");
    } finally {
      setLoading(false);
    }
  }

  hotkeyHandlerRef.current = (e: KeyboardEvent) => {
    const mod = e.ctrlKey || e.metaKey;
    const inField = isEditableHotkeyTarget(e.target);
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (e.key === "Escape" && !mod && !e.altKey) {
      if (leaveModalOpen) {
        e.preventDefault();
        setLeaveModalOpen(false);
        return;
      }
      if (inField) return;
      e.preventDefault();
      requestCloseEditor();
      return;
    }

    if (!mod) return;

    const allowInField =
      (key === "s" && !e.altKey) ||
      (key === "z" && !e.altKey) ||
      (key === "y" && !e.shiftKey && !e.altKey);

    if (inField && !allowInField) return;

    if (key === "s" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (loading) return;
      if (leaveModalOpen) {
        void save({ published: false, stayOpen: false });
      } else {
        void save({ published: false, stayOpen: true });
      }
      return;
    }
    if (key === "s" && e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (loading) return;
      if (leaveModalOpen) {
        void save({ published: true, stayOpen: false });
      } else {
        void save({ published: true, stayOpen: true });
      }
      return;
    }
    if (key === "z" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      undoDraft();
      return;
    }
    if ((key === "z" && e.shiftKey && !e.altKey) || (key === "y" && !e.shiftKey && !e.altKey)) {
      e.preventDefault();
      redoDraft();
      return;
    }
    if (e.key === "Backspace" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (!loading && (isDirty || unpublishedCount > 0)) void discardEdits();
      return;
    }
    if (e.key === "\\" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (editorMode === "form") setPreviewVisible((v) => !v);
      return;
    }
    if (e.key === "1" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      setEditorMode("form");
      return;
    }
    if (e.key === "2" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      setEditorMode("visual");
    }
  };

  return (
    <div>
      <div className="pgs-admin__toolbar">
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p style={{ margin: "0.25rem 0 0", color: "#6b6280" }}>
            {entity === "events"
              ? "Edit Events Page or Visual templates — one record updates all card layouts."
              : entity === "courses"
                ? "Edit Courses Page or Visual templates — one record updates all card layouts."
                : "Collection table — filter by phase, edit in drawer."}
          </p>
        </div>
        <button type="button" className="pgs-admin__btn" onClick={openNew}>
          New {entity.slice(0, -1)}
        </button>
      </div>

      <div className="pgs-admin__tabs" style={{ marginBottom: "0.85rem" }}>
        {PHASES.map((p) => (
          <button
            key={p}
            type="button"
            className={phase === p ? "is-active" : undefined}
            onClick={() => setPhase(p)}
          >
            {p === "all" ? "All" : p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {loading ? <p style={{ color: "#6b6280" }}>Loading…</p> : null}

      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c.replace(/_/g, " ")}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>No rows in this phase.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row.id)}>
                  {columns.map((c) => (
                    <td key={c}>
                      {c === "lifecycle_phase" ? (
                        <span
                          className={`pgs-admin__badge pgs-admin__badge--${String(row[c])}`}
                        >
                          {String(row[c])}
                        </span>
                      ) : c === "published" ? (
                        row[c] ? "Yes" : "No"
                      ) : (
                        String(row[c] ?? "")
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => void openEdit(row)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={() => void archiveRow(Number(row.id))}
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div
          className="pgs-admin__drawer"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) requestCloseEditor();
          }}
        >
          <div
            className={`pgs-admin__drawer-panel${
              entity === "events" || entity === "courses"
                ? " pgs-admin__drawer-panel--preview-form"
                : ""
            }`}
          >
            {entity === "events" || entity === "courses" ? (
              <>
                <EventEditShell
                  title={String(
                    editing.title ??
                      (entity === "courses"
                        ? "Untitled course"
                        : "Untitled event"),
                  )}
                  dirtyCount={unpublishedCount}
                  previewVisible={previewVisible && editorMode === "form"}
                  onTogglePreview={() => setPreviewVisible((v) => !v)}
                  onDiscard={() => void discardEdits()}
                  onSaveDraft={() =>
                    void save({ published: false, stayOpen: true })
                  }
                  onPublish={() =>
                    void save({ published: true, stayOpen: true })
                  }
                  onOpenSite={
                    editing.id
                      ? () =>
                          window.open(
                            entity === "courses"
                              ? `/programsfull/program/${editing.id}`
                              : `/purpleevents/session/${editing.id}`,
                            "_blank",
                          )
                      : undefined
                  }
                  onClose={requestCloseEditor}
                  saving={loading}
                  publishMode={isLivePublished ? "publish" : "draft"}
                  isLive={isLivePublished}
                  sections={
                    editorMode === "form"
                      ? [
                          ...(entity === "courses"
                            ? COURSE_EDIT_SECTIONS
                            : EVENT_EDIT_SECTIONS),
                        ]
                      : []
                  }
                  activeSectionId={activeSectionId}
                  onSectionClick={(id) => {
                    setActiveSectionId(id);
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  editorModeTabs={
                    <div className="pgs-admin__tabs" role="tablist">
                      <button
                        type="button"
                        className={
                          editorMode === "form" ? "is-active" : undefined
                        }
                        onClick={() => setEditorMode("form")}
                        title="Form editor (Ctrl+1)"
                      >
                        {entity === "courses"
                          ? "Edit Courses Page"
                          : "Edit Events Page"}
                      </button>
                      <button
                        type="button"
                        className={
                          editorMode === "visual" ? "is-active" : undefined
                        }
                        onClick={() => setEditorMode("visual")}
                        title="Visual templates (Ctrl+2)"
                      >
                        Visual templates
                      </button>
                    </div>
                  }
                  form={
                    <>
                      <div
                        className={
                          editorMode === "form"
                            ? undefined
                            : "pgs-admin__editor-pane--hidden"
                        }
                        aria-hidden={editorMode !== "form"}
                      >
                        {entity === "courses" ? (
                          <CourseEditForm
                            draft={editing}
                            onChange={applyDraft}
                            categoryOptions={[
                              { value: "", label: "— None —" },
                              ...categoryOptions,
                            ]}
                            universityOptions={[
                              { value: "", label: "— None —" },
                              ...universityOptions,
                            ]}
                            dateSaveState={dateSaveState}
                          />
                        ) : (
                          <EventEditForm
                            draft={editing}
                            onChange={applyDraft}
                            categoryOptions={[
                              { value: "", label: "— None —" },
                              ...categoryOptions,
                            ]}
                            dateSaveState={dateSaveState}
                          />
                        )}
                      </div>
                      {visualEditorMounted ? (
                        <div
                          className={
                            editorMode === "visual"
                              ? undefined
                              : "pgs-admin__editor-pane--hidden"
                          }
                          aria-hidden={editorMode !== "visual"}
                        >
                          {entity === "courses" ? (
                            <CourseVisualEditor
                              draft={editing}
                              onChange={applyDraft}
                            />
                          ) : (
                            <EventVisualEditor
                              draft={editing}
                              onChange={applyDraft}
                            />
                          )}
                        </div>
                      ) : null}
                    </>
                  }
                  preview={
                    editorMode === "form" ? (
                      entity === "courses" ? (
                        <StandalonePreviewPane
                          kind="course"
                          label="Live preview"
                          publishMode={
                            editing.published ? "publish" : "draft"
                          }
                          onPublishModeChange={(mode) =>
                            applyDraft({
                              ...editing,
                              published: mode === "publish",
                            })
                          }
                          detail={courseToDetail(editing)}
                          showDraftBanner={!editing.published}
                        />
                      ) : (
                        <StandalonePreviewPane
                          kind="event"
                          label="Live preview"
                          publishMode={
                            editing.published ? "publish" : "draft"
                          }
                          onPublishModeChange={(mode) =>
                            applyDraft({
                              ...editing,
                              published: mode === "publish",
                            })
                          }
                          detail={eventToSessionDetail(editing)}
                          showDraftBanner={!editing.published}
                        />
                      )
                    ) : null
                  }
                />
                <UnsavedChangesModal
                  open={leaveModalOpen}
                  saving={loading}
                  isLive={isLivePublished}
                  onStay={() => setLeaveModalOpen(false)}
                  onDiscard={() => {
                    clearDraftHistory();
                    setEditing(null);
                    setBaseline(null);
                    setLiveBaseline(null);
                    setLeaveModalOpen(false);
                  }}
                  onSaveDraft={() =>
                    void save({ published: false, stayOpen: false })
                  }
                  onPublish={() =>
                    void save({ published: true, stayOpen: false })
                  }
                />
              </>
            ) : (
              <>
                <div className="pgs-admin__toolbar">
                  <h2 style={{ margin: 0 }}>
                    {editing.id ? "Edit" : "New"} {entity.slice(0, -1)}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={requestCloseEditor}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="pgs-admin__form">
                  {fields.map((field) =>
                    field.type === "media" ? (
                      <MediaAssetField
                        key={field.key}
                        label={field.label}
                        value={
                          editing[field.key]
                            ? String(editing[field.key])
                            : null
                        }
                        accept={field.mediaAccept ?? "image"}
                        folder={entity}
                        onChange={(id) =>
                          setEditing({ ...editing, [field.key]: id })
                        }
                      />
                    ) : field.type === "tags" ? (
                      <TagsField
                        key={field.key}
                        label={field.label}
                        value={String(editing[field.key] ?? "")}
                        onChange={(next) =>
                          setEditing({ ...editing, [field.key]: next })
                        }
                      />
                    ) : (
                      <label key={field.key}>
                        {field.label}
                        {field.html ? (
                          <span className="pgs-admin__field-hint">
                            HTML allowed
                          </span>
                        ) : null}
                        {field.type === "textarea" ? (
                          <textarea
                            rows={field.html ? 6 : 4}
                            className={
                              field.html
                                ? "pgs-admin__textarea--html"
                                : undefined
                            }
                            placeholder={
                              field.html
                                ? "Plain text or HTML, e.g. <p><strong>…</strong></p>"
                                : undefined
                            }
                            value={String(editing[field.key] ?? "")}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]: e.target.value,
                              })
                            }
                          />
                        ) : field.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={Boolean(editing[field.key])}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]: e.target.checked,
                              })
                            }
                          />
                        ) : field.type === "number" ? (
                          <input
                            type="number"
                            value={
                              editing[field.key] === null ||
                              editing[field.key] === undefined
                                ? ""
                                : String(editing[field.key])
                            }
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]:
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                              })
                            }
                          />
                        ) : field.type === "date" ? (
                          <input
                            type="date"
                            value={
                              editing[field.key]
                                ? String(editing[field.key]).slice(0, 10)
                                : ""
                            }
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]: e.target.value || null,
                              })
                            }
                          />
                        ) : field.type === "datetime" ? (
                          <input
                            type="datetime-local"
                            value={
                              editing[field.key]
                                ? String(editing[field.key])
                                    .replace("Z", "")
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]: e.target.value
                                  ? new Date(e.target.value).toISOString()
                                  : null,
                              })
                            }
                          />
                        ) : field.type === "select" ? (
                          <select
                            value={
                              field.key === "category_id" ||
                              field.key === "university_id"
                                ? editing[field.key] == null ||
                                  editing[field.key] === ""
                                  ? ""
                                  : String(editing[field.key])
                                : String(editing[field.key] ?? "live")
                            }
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]:
                                  (field.key === "category_id" ||
                                    field.key === "university_id") &&
                                  e.target.value === ""
                                    ? null
                                    : field.key === "category_id" ||
                                        field.key === "university_id"
                                      ? Number(e.target.value)
                                      : e.target.value,
                              })
                            }
                          >
                            {field.options?.map((o) => (
                              <option key={o.value || "none"} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            value={String(editing[field.key] ?? "")}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                [field.key]: e.target.value,
                              })
                            }
                          />
                        )}
                      </label>
                    ),
                  )}
                  <div className="pgs-admin__form-actions">
                    <button
                      type="button"
                      className="pgs-admin__btn"
                      onClick={() => void save()}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="pgs-admin__btn pgs-admin__btn--ghost"
                      onClick={requestCloseEditor}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
