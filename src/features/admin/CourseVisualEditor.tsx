"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { HeartToggle } from "@/components/cards/HeartToggle";
import { PillTags } from "@/components/cards/PillTags";
import "@/components/cards/cards.css";
import "@/features/purpleevents/purple-events.css";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadMediaAsset } from "@/lib/supabase/storage";
import { AdminRichTextField } from "./AdminRichTextField";
import {
  badgeChipStyle,
  DEFAULT_EVENT_BADGE_ICON,
} from "@/components/cards/badge-chip-style";
import {
  getMediaAssetPreview,
  registerCmsMediaAsset,
} from "./media-actions";
import {
  COURSE_VISUAL_KEYS,
  COURSE_VISUAL_LABELS,
  courseToFeedChip,
  courseToInternshipCard,
  courseToProgramCompact,
  courseToProgramFull,
  courseToPromoCard,
  courseToSessionDetail,
  courseToUpcomingSession,
  isCourseCardSurfaceEnabled,
  parseCourseCardSurfaces,
  toggleCourseCardSurface,
  type CourseDraft,
  type CourseVisualKey,
} from "./course-preview-map";

type Props = {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
};

function str(draft: CourseDraft, key: string): string {
  const v = draft[key];
  return v == null ? "" : String(v);
}

function patchDraft(
  draft: CourseDraft,
  onChange: (next: CourseDraft) => void,
  partial: Record<string, unknown>,
) {
  onChange({ ...draft, ...partial });
}

/**
 * Canva-style text: double-click to edit in place (contentEditable).
 */
function CanvaText({
  value,
  onCommit,
  className,
  as: Tag = "span",
  multiline = false,
  placeholder = "",
}: {
  value: string;
  onCommit: (next: string) => void;
  className?: string;
  as?: ElementType;
  multiline?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const display = value.trim() ? value : placeholder;

  useEffect(() => {
    if (!ref.current || editing) return;
    ref.current.textContent = display || "\u00A0";
  }, [display, editing]);

  function startEdit(e: ReactMouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  }

  useEffect(() => {
    if (!editing) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editing]);

  function finish(commit: boolean) {
    const el = ref.current;
    if (!el) {
      setEditing(false);
      return;
    }
    if (commit) {
      const next = (el.innerText || "").replace(/\u00A0/g, " ").trimEnd();
      // Only collapse untouched placeholder → empty when the stored value was empty.
      const cleaned =
        !value.trim() && next.trim() === placeholder.trim() ? "" : next;
      if (cleaned !== value) onCommit(cleaned);
    } else {
      el.textContent = display || "\u00A0";
    }
    setEditing(false);
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      finish(false);
      return;
    }
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      finish(true);
    }
  }

  return (
    <Tag
      ref={ref}
      className={`pgs-admin-visual__canva-text${editing ? " is-editing" : ""}${
        className ? ` ${className}` : ""
      }${!value.trim() && !editing ? " is-placeholder" : ""}`}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={editing}
      title={editing ? undefined : "Double-click to edit"}
      onMouseDown={(e: ReactMouseEvent) => {
        if (e.detail >= 2) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onDoubleClick={startEdit}
      onBlur={() => {
        if (editing) finish(true);
      }}
      onKeyDown={onKeyDown}
      onClick={(e: ReactMouseEvent) => e.stopPropagation()}
    />
  );
}

/** Double-click card image to upload a new photo. */
function CanvaImage({
  src,
  alt = "",
  className,
  draft,
  onChange,
}: {
  src: string;
  alt?: string;
  className?: string;
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded = await uploadMediaAsset(supabase, file, "courses", {
        imagesOnly: true,
      });
      const registered = await registerCmsMediaAsset({
        path: uploaded.path,
        mimeType: file.type,
        byteSize: file.size,
        altText: "Course card image",
      });
      const preview = await getMediaAssetPreview(registered.id);
      patchDraft(draft, onChange, {
        image_asset_id: registered.id,
        image_url: preview?.publicUrl || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <button
      type="button"
      className={`pgs-admin-visual__canva-image${busy ? " is-busy" : ""}${
        className ? ` ${className}` : ""
      }`}
      title="Double-click to upload image"
      onMouseDown={(e) => {
        if (e.detail >= 2) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.click();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} draggable={false} />
      <span className="pgs-admin-visual__canva-image-hint">
        {busy ? "Uploading…" : "Double-click to change image"}
      </span>
      {error ? (
        <span className="pgs-admin-visual__canva-image-error">{error}</span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        hidden
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </button>
  );
}

function EditableProgramCard({
  draft,
  onChange,
  compact,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
  compact?: boolean;
}) {
  const data = compact
    ? courseToProgramCompact(draft)
    : courseToProgramFull(draft);
  const badgeIcon = data.badgeIcon ?? "/assets/img/purpleboard/fire.gif";
  const promoSubtitle =
    str(draft, "card_promo_subtitle").trim() ||
    data.promo?.subtitle ||
    "Check\nWith US";
  const [promoLine1, ...promoRest] = promoSubtitle.split("\n");
  const promoSubLine1 = promoLine1 || "Check";
  const promoSubLine2 = promoRest.join("\n") || "With US";

  return (
    <div className="pgs-cards pgs-admin-visual__canva-card">
      <article className={`cardbox${compact ? " cardbox--compact" : ""}`}>
        <div className="cardbox-left">
          <CanvaImage
            className="pgs-board-campus"
            src={data.image}
            draft={draft}
            onChange={onChange}
          />
          <div
            className="cardbox-tag"
            style={badgeChipStyle(data.badgeColor, data.badgeTextColor)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={badgeIcon} alt="" />
            <CanvaText
              value={str(draft, "badge")}
              onCommit={(v) => patchDraft(draft, onChange, { badge: v })}
              placeholder="Badge"
            />
          </div>
          {data.logo ? (
            <div className="cardbox-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.logo} alt="" />
            </div>
          ) : null}
        </div>

        <div className="cardbox-middle">
          <CanvaText
            as="h3"
            value={str(draft, "title")}
            onCommit={(v) => patchDraft(draft, onChange, { title: v })}
            placeholder="Course title"
          />
          {!compact ? (
            <div className="cardbox-highlight">
              <span className="cardbox-highlight-label">About:</span>
              <br />
              <CanvaText
                as="span"
                className="cardbox-highlight-value"
                value={str(draft, "short_description")}
                onCommit={(v) =>
                  patchDraft(draft, onChange, { short_description: v })
                }
                multiline
                placeholder="Summary for cards"
              />
            </div>
          ) : null}
          <div className="cardbox-detail-stack">
            <div className="cardbox-detail-label">Location</div>
            <CanvaText
              as="div"
              className="cardbox-detail-value"
              value={str(draft, "location")}
              onCommit={(v) => patchDraft(draft, onChange, { location: v })}
              placeholder="Location"
            />
          </div>
          {compact ? (
            <div className="cardbox-detail-stack">
              <div className="cardbox-detail-label">Duration</div>
              <CanvaText
                as="div"
                className="cardbox-detail-value"
                value={str(draft, "duration")}
                onCommit={(v) => patchDraft(draft, onChange, { duration: v })}
                placeholder="Duration"
              />
            </div>
          ) : (
            <div className="cardbox-detail-stack">
              <div className="cardbox-detail-label">Mode</div>
              <CanvaText
                as="div"
                className="cardbox-detail-value"
                value={str(draft, "mode")}
                onCommit={(v) => patchDraft(draft, onChange, { mode: v })}
                placeholder="Mode"
              />
            </div>
          )}
          <PillTags tags={data.tags} />
        </div>

        <div className="cardbox-right">
          {!compact ? (
            <>
              <div className="pgs-dates-rail">
                <CanvaText
                  as="span"
                  value={
                    str(draft, "card_dates_rail").trim() ||
                    data.datesRail ||
                    "Dates You Should Be Aware off."
                  }
                  onCommit={(v) =>
                    patchDraft(draft, onChange, { card_dates_rail: v })
                  }
                  placeholder="Dates You Should Be Aware off."
                />
              </div>
              <HeartToggle initialSaved={data.saved} />
              <div className="pgs-board-deadline">
                <div className="pgs-deadline">
                  <CanvaText
                    as="p"
                    className="pgs-deadline-caption pgs-deadline-caption--stacked"
                    value={
                      str(draft, "card_promo_title").trim() ||
                      data.promo?.title ||
                      "Dates\nExtended"
                    }
                    onCommit={(v) =>
                      patchDraft(draft, onChange, { card_promo_title: v })
                    }
                    multiline
                    placeholder={"Dates\nExtended"}
                  />
                  <div className="pgs-deadline-strip pgs-deadline-strip--text">
                    <CanvaText
                      as="span"
                      className="pgs-deadline-num"
                      value={promoSubLine1}
                      onCommit={(v) =>
                        patchDraft(draft, onChange, {
                          card_promo_subtitle: `${v}\n${promoSubLine2}`,
                        })
                      }
                      placeholder="Check"
                    />
                    <CanvaText
                      as="span"
                      className="pgs-deadline-unit"
                      value={promoSubLine2}
                      onCommit={(v) =>
                        patchDraft(draft, onChange, {
                          card_promo_subtitle: `${promoSubLine1}\n${v}`,
                        })
                      }
                      placeholder="With US"
                    />
                  </div>
                </div>
                <CanvaText
                  as="p"
                  className="pgs-deadline-date mb-0"
                  value={
                    str(draft, "card_promo_date").trim() ||
                    data.promo?.date ||
                    ""
                  }
                  onCommit={(v) =>
                    patchDraft(draft, onChange, { card_promo_date: v })
                  }
                  placeholder="Date"
                />
              </div>
            </>
          ) : (
            <HeartToggle initialSaved={data.saved} />
          )}
          <div
            className={`pgs-board-qr-col${compact ? " pgs-board-qr-col--compact" : ""}`}
          >
            <CanvaText
              as="span"
              className="cardbox-learn-btn pgs-admin-visual__canva-cta"
              value={
                str(draft, "card_cta_label").trim() ||
                data.ctaLabel ||
                "Learn More"
              }
              onCommit={(v) =>
                patchDraft(draft, onChange, { card_cta_label: v })
              }
              placeholder="Learn More"
            />
          </div>
        </div>
      </article>
    </div>
  );
}

function EditablePromoCard({
  draft,
  onChange,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const data = courseToPromoCard(draft);
  return (
    <div className="pgs-cards pgs-promo-card pgs-admin-visual__canva-card">
      <div className="sop-card-unique">
        <div className="sop-image-wrapper">
          <CanvaImage src={data.image} draft={draft} onChange={onChange} />
          <div
            className="sop-top-label"
            style={badgeChipStyle(data.seatBadgeColor, data.seatBadgeTextColor)}
          >
            {data.seatBadgeIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.seatBadgeIcon} alt="" />
            ) : null}
            <CanvaText
              value={str(draft, "badge")}
              onCommit={(v) => patchDraft(draft, onChange, { badge: v })}
              placeholder="Seat badge"
            />
          </div>
          <div className="sop-start-free">
            <CanvaText
              value={str(draft, "mode")}
              onCommit={(v) => patchDraft(draft, onChange, { mode: v })}
              placeholder="Start Free"
            />
          </div>
          <div className="sop-heart-icon pgs-promo-heart">
            <HeartToggle
              initialSaved={data.saved}
              className="pgs-promo-heart-btn"
            />
          </div>
        </div>
        <div className="sop-content">
          <CanvaText
            as="div"
            className="sop-title"
            value={str(draft, "title")}
            onCommit={(v) => patchDraft(draft, onChange, { title: v })}
            placeholder="Title"
          />
          <CanvaText
            as="div"
            className="sop-subtext"
            value={str(draft, "short_description")}
            onCommit={(v) =>
              patchDraft(draft, onChange, { short_description: v })
            }
            multiline
            placeholder="Card description"
          />
          <PillTags
            tags={data.tags}
            className="sop-tags"
            tagClassName="sop-tag"
          />
          <div className="d-flex justify-content-space align-items-center gap-2">
            <span className="sop-learn-btn d-inline-flex align-items-center justify-content-center">
              Learn More
            </span>
            {data.closesOn ? (
              <div className="sop-close-date">{data.closesOn}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableInternshipCard({
  draft,
  onChange,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const data = courseToInternshipCard(draft);
  return (
    <div className="pgs-cards pgs-internship-card pgs-admin-visual__canva-card">
      <div className="county-box-short">
        <div className="img-box-fit position-relative">
          <CanvaImage src={data.image} draft={draft} onChange={onChange} />
          <div className="tag-flot-usa">
            <CanvaText
              value={str(draft, "badge")}
              onCommit={(v) => patchDraft(draft, onChange, { badge: v })}
              placeholder="Badge"
            />
          </div>
        </div>
        <div className="mobile-pb-23 pgs-internship-body">
          <CanvaText
            as="div"
            className="fs-17 fw-600 mb-1 text-black"
            value={str(draft, "title")}
            onCommit={(v) => patchDraft(draft, onChange, { title: v })}
            placeholder="Title"
          />
          <CanvaText
            as="div"
            className="fs-14 lh-full mb-2 text-black"
            value={str(draft, "short_description")}
            onCommit={(v) =>
              patchDraft(draft, onChange, { short_description: v })
            }
            multiline
            placeholder="Description"
          />
          <PillTags
            tags={data.tags}
            className="pgs-internship-tags mb-2"
            tagClassName="pgs-internship-tag"
          />
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <i
                className="bi bi-check-circle-fill"
                style={{ fontSize: 22, color: "forestgreen" }}
                aria-hidden
              />
              <CanvaText
                as="h5"
                className="fnt-family fs-18 mb-0 text-success text-uppercase"
                value={str(draft, "mode")}
                onCommit={(v) => patchDraft(draft, onChange, { mode: v })}
                placeholder="COURSE"
              />
            </div>
            <HeartToggle
              initialSaved={data.saved ?? true}
              className="pgs-internship-heart"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedChipPreview({
  draft,
  onChange,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const ev = courseToFeedChip(draft);
  return (
    <div className="grid-box-style-2 pgs-admin-visual__feed-chips pgs-admin-visual__canva-card">
      <div className="card-box-1">
        <div className="d-flex gap-2 flex-wrap">
          <CanvaText
            as="h5"
            value={str(draft, "title")}
            onCommit={(v) => patchDraft(draft, onChange, { title: v })}
            placeholder="Title"
          />
          <h5>{ev.date}</h5>
          <h5>{ev.time}</h5>
        </div>
        <CanvaText
          as="div"
          className="mb-0 fs-11 lh-full text-black fw-400 lh-new-100 mt-3"
          value={str(draft, "short_description")}
          onCommit={(v) =>
            patchDraft(draft, onChange, { short_description: v })
          }
          multiline
          placeholder="Blurb"
        />
        <p className="mb-0 fs-11 lh-full text-black fw-400 lh-full mt-3">
          <b>Mode:&nbsp;</b>
          <CanvaText
            value={str(draft, "mode")}
            onCommit={(v) => patchDraft(draft, onChange, { mode: v })}
            placeholder="Online"
          />
        </p>
      </div>
    </div>
  );
}

function SessionCardPreview({
  draft,
  onChange,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const session = courseToUpcomingSession(draft);
  return (
    <article className="pgs-session-card pgs-admin-visual__canva-card">
      <span className="pgs-session-card__dot" aria-hidden />
      <div className="pgs-session-card__inner">
        <div className="pgs-session-card__title">
          <CanvaText
            as="h5"
            value={str(draft, "title")}
            onCommit={(v) => patchDraft(draft, onChange, { title: v })}
            placeholder="Title"
          />
        </div>
        <div className="pgs-session-card__dates">
          <div className="pgs-session-card__date-col">
            <div className="pgs-session-card__date-box">
              <span className="pgs-session-card__day">{session.start.day}</span>
              <span className="pgs-session-card__month">
                {session.start.month}
              </span>
            </div>
            <p className="pgs-session-card__time">{session.start.time}</p>
          </div>
          <div className="pgs-session-card__date-col">
            <div className="pgs-session-card__date-box">
              <span className="pgs-session-card__day">{session.end.day}</span>
              <span className="pgs-session-card__month">
                {session.end.month}
              </span>
            </div>
            <p className="pgs-session-card__time">{session.end.time}</p>
          </div>
        </div>
        <div className="pgs-session-card__body">
          <div>
            <h5>Who&apos;s It For?</h5>
            <CanvaText
              as="div"
              value={str(draft, "who_is_it_for")}
              onCommit={(v) =>
                patchDraft(draft, onChange, { who_is_it_for: v })
              }
              multiline
              placeholder="Who’s it for"
            />
          </div>
          <div className="pgs-session-card__topics">
            <h5>Topics Covered</h5>
            <CanvaText
              as="div"
              value={str(draft, "session_topics")}
              onCommit={(v) =>
                patchDraft(draft, onChange, { session_topics: v })
              }
              multiline
              placeholder="Topics (one per line)"
            />
          </div>
          <span className="pgs-session-card__cta">Learn More</span>
        </div>
      </div>
      <div className="pgs-session-card__media">
        <CanvaImage src={session.image} draft={draft} onChange={onChange} />
      </div>
    </article>
  );
}

function EventsHeroPreview({
  draft,
  onChange,
}: {
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  const session = courseToSessionDetail(draft);
  return (
    <div className="pgs-admin-visual__hero sop-card-unique left-13 full-box-content border-none d-flex align-items-start gap-3 pgs-admin-visual__canva-card">
      <div className="w-30" style={{ minWidth: 140, maxWidth: 180 }}>
        <div
          className="sop-top-label h-30px w-130px fs-14 label-flot-update pgs-enroll-badge"
          style={badgeChipStyle(session.badgeColor, session.badgeTextColor)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={session.badgeIcon || DEFAULT_EVENT_BADGE_ICON}
            className="pgs-enroll-badge__icon"
            alt=""
          />
          &nbsp;
          <CanvaText
            value={str(draft, "badge")}
            onCommit={(v) => patchDraft(draft, onChange, { badge: v })}
            placeholder="Enroll Now"
          />
        </div>
        <div className="sop-image-wrapper-1 w-100">
          <CanvaImage
            className="big_img"
            src={session.image}
            draft={draft}
            onChange={onChange}
          />
          <div className="sop-heart-icon bg-purple text-white px-1 fs-22 border-radius-6px">
            <CanvaText
              value={str(draft, "mode")}
              onCommit={(v) => patchDraft(draft, onChange, { mode: v })}
              placeholder="#Online"
            />
          </div>
        </div>
      </div>
      <div
        className="content-wrap flex-1 p-1 pt-0"
        style={{ flex: 1, minWidth: 0 }}
      >
        <CanvaText
          as="h1"
          className="mb-0 border-black fnt-family px-2 py-2 text-black fs-50 border-radius-4px bg-white"
          value={str(draft, "title")}
          onCommit={(v) => patchDraft(draft, onChange, { title: v })}
          placeholder="Title"
        />
        <div className="mt-2 mb-2">
          <span className="fs-14">Host : </span>
          <CanvaText
            className="text-dark-gray fs-14"
            value={str(draft, "location")}
            onCommit={(v) => patchDraft(draft, onChange, { location: v })}
            placeholder="Location"
          />
        </div>
        <div className="d-flex gap-3 mt-2 flex-wrap">
          <div className="date-box bg-transparent d-flex gap-2">
            <div className="box-date-info bg-black">
              <span className="date text_purple">{session.start.day}</span>
              <span className="month">{session.start.month}</span>
            </div>
            <div className="box-date-info bg-black">
              <span className="date text_purple">{session.end.day}</span>
              <span className="month">{session.end.month}</span>
            </div>
          </div>
          <div className="content-p" style={{ maxWidth: 280 }}>
            <CanvaText
              as="div"
              className="mb-2 text-black fs-25 fw-500 lh-30"
              value={str(draft, "headline")}
              onCommit={(v) => patchDraft(draft, onChange, { headline: v })}
              multiline
              placeholder="Headline"
            />
            <CanvaText
              as="div"
              className="mb-0 text-black fs-12 lh-12"
              value={str(draft, "description")}
              onCommit={(v) =>
                patchDraft(draft, onChange, { description: v })
              }
              multiline
              placeholder="Description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualPanel({
  visualKey,
  draft,
  onChange,
}: {
  visualKey: CourseVisualKey;
  draft: CourseDraft;
  onChange: (next: CourseDraft) => void;
}) {
  switch (visualKey) {
    case "saved_program_full":
      return (
        <div className="pgs-admin-visual__card-wrap">
          <EditableProgramCard draft={draft} onChange={onChange} />
        </div>
      );
    case "saved_promo":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--third">
          <EditablePromoCard draft={draft} onChange={onChange} />
        </div>
      );
    case "saved_internship":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--half">
          <EditableInternshipCard draft={draft} onChange={onChange} />
        </div>
      );
    case "saved_program_compact":
      return (
        <div className="pgs-admin-visual__card-wrap">
          <EditableProgramCard draft={draft} onChange={onChange} compact />
        </div>
      );
    case "add_to_calendar":
      return <FeedChipPreview draft={draft} onChange={onChange} />;
    case "events_hero":
      return <EventsHeroPreview draft={draft} onChange={onChange} />;
    case "events_upcoming_card":
      return (
        <div className="pgs-purple-events">
          <SessionCardPreview draft={draft} onChange={onChange} />
        </div>
      );
    case "purpleboard":
      return (
        <div className="pgs-admin-visual__card-wrap">
          <EditableProgramCard draft={draft} onChange={onChange} />
        </div>
      );
    case "cvready_featured":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--half">
          <EditableInternshipCard draft={draft} onChange={onChange} />
        </div>
      );
    case "cvready_programs":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--third">
          <EditablePromoCard draft={draft} onChange={onChange} />
        </div>
      );
    default:
      return null;
  }
}

/** Card surfaces with Canva-style double-click text editing on the card. */
export function CourseVisualEditor({ draft, onChange }: Props) {
  const [activeVisual, setActiveVisual] = useState<CourseVisualKey | "all">(
    () => {
      const enabled = parseCourseCardSurfaces(draft);
      return enabled[0] ?? "purpleboard";
    },
  );
  const selected = useMemo(() => parseCourseCardSurfaces(draft), [draft]);

  const visibleKeys = useMemo(
    () =>
      activeVisual === "all" ? [...COURSE_VISUAL_KEYS] : [activeVisual],
    [activeVisual],
  );

  return (
    <div className="pgs-admin-visual">
      <p className="pgs-admin-visual__hint">
        Double-click text to edit in place. Double-click a photo to upload a new
        card image. Changes save with Draft / Publish in the top bar.
      </p>

      <div className="pgs-admin-visual__summary">
        <AdminRichTextField
          label="Summary (cards / listings only)"
          value={
            draft.short_description == null
              ? ""
              : String(draft.short_description)
          }
          onChange={(next) =>
            onChange({ ...draft, short_description: next })
          }
          rows={4}
        />
        <label>
          Location (cards)
          <input
            className="pgs-admin-control"
            style={{ padding: "12px 16px" }}
            value={draft.location == null ? "" : String(draft.location)}
            onChange={(e) => onChange({ ...draft, location: e.target.value })}
          />
        </label>
      </div>

      <div className="pgs-admin-visual__select">
        <div className="pgs-admin-visual__select-head">
          <strong>Cards for this course</strong>
          <span>
            {selected.length} of {COURSE_VISUAL_KEYS.length} selected
          </span>
        </div>
        <div className="pgs-admin-visual__select-grid">
          {COURSE_VISUAL_KEYS.map((key) => {
            const on = isCourseCardSurfaceEnabled(draft, key);
            return (
              <label
                key={key}
                className={`pgs-admin-visual__chip-toggle${on ? " is-on" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) =>
                    onChange(
                      toggleCourseCardSurface(draft, key, e.target.checked),
                    )
                  }
                />
                <span className="pgs-admin-visual__chip-toggle-text">
                  {COURSE_VISUAL_LABELS[key]}
                </span>
              </label>
            );
          })}
        </div>
        <div className="pgs-admin-visual__select-actions">
          <button
            type="button"
            className="pgs-admin__btn pgs-admin__btn--ghost"
            onClick={() =>
              onChange({ ...draft, card_surfaces: [...COURSE_VISUAL_KEYS] })
            }
          >
            Select all
          </button>
          <button
            type="button"
            className="pgs-admin__btn pgs-admin__btn--ghost"
            onClick={() => onChange({ ...draft, card_surfaces: [] })}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="pgs-admin__tabs pgs-admin-visual__tabs">
        <button
          type="button"
          className={activeVisual === "all" ? "is-active" : undefined}
          onClick={() => setActiveVisual("all")}
        >
          All cards
        </button>
        {COURSE_VISUAL_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={activeVisual === key ? "is-active" : undefined}
            onClick={() => setActiveVisual(key)}
          >
            {COURSE_VISUAL_LABELS[key].includes("—")
              ? COURSE_VISUAL_LABELS[key].split("—")[0].trim()
              : COURSE_VISUAL_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="pgs-admin-visual__canvas pgs-purple-events">
        {visibleKeys.map((key) => {
          const enabled = isCourseCardSurfaceEnabled(draft, key);
          return (
            <section
              key={key}
              className={`pgs-admin-visual__panel${enabled ? "" : " is-off"}`}
            >
              <header className="pgs-admin-visual__panel-head">
                <label className="pgs-admin-visual__panel-check">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      onChange(
                        toggleCourseCardSurface(draft, key, e.target.checked),
                      )
                    }
                  />
                  <span>{COURSE_VISUAL_LABELS[key]}</span>
                </label>
                {!enabled ? (
                  <span className="pgs-admin-visual__off-badge">Not used</span>
                ) : (
                  <span className="pgs-admin-visual__canva-hint">
                    Double-click text
                  </span>
                )}
              </header>
              <div className="pgs-admin-visual__panel-body">
                {enabled ? (
                  <VisualPanel
                    visualKey={key}
                    draft={draft}
                    onChange={onChange}
                  />
                ) : (
                  <p className="pgs-admin-visual__off-copy mb-0">
                    Enable this surface above to edit its card preview.
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
