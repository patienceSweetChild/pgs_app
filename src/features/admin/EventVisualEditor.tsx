"use client";

import { useMemo, useState } from "react";
import { InternshipCard } from "@/components/cards/InternshipCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { PromoCard } from "@/components/cards/PromoCard";
import "@/components/cards/cards.css";
import "@/features/purpleevents/purple-events.css";
import {
  EVENT_VISUAL_KEYS,
  EVENT_VISUAL_LABELS,
  eventToFeedChip,
  eventToInternshipCard,
  eventToProgramCompact,
  eventToProgramFull,
  eventToPromoCard,
  eventToSessionDetail,
  eventToUpcomingSession,
  isCardSurfaceEnabled,
  parseCardSurfaces,
  toggleCardSurface,
  type EventDraft,
  type EventVisualKey,
} from "./event-preview-map";

type Props = {
  draft: EventDraft;
  onChange: (next: EventDraft) => void;
  focusField?: string | null;
  onFocusField?: (key: string) => void;
};

/** Shared fields editable from visual mode (ACF-style, drives all 7 layouts). */
const VISUAL_FIELDS: { key: string; label: string; type?: "text" | "textarea" | "datetime" }[] = [
  { key: "title", label: "Title" },
  { key: "summary", label: "Summary", type: "textarea" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "host", label: "Host" },
  { key: "top_label", label: "Top label" },
  { key: "badge", label: "Badge" },
  { key: "mode", label: "Mode" },
  { key: "location_note", label: "Location note" },
  { key: "starts_at", label: "Starts at", type: "datetime" },
  { key: "ends_at", label: "Ends at", type: "datetime" },
  { key: "who_is_it_for", label: "Who is it for", type: "textarea" },
  { key: "session_topics", label: "Session topics", type: "textarea" },
  { key: "what_we_cover", label: "What we cover", type: "textarea" },
];

function setField(draft: EventDraft, key: string, value: unknown): EventDraft {
  return { ...draft, [key]: value };
}

function Hotspot({
  fieldKey,
  active,
  onFocus,
  children,
}: {
  fieldKey: string;
  active: boolean;
  onFocus: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`pgs-admin-visual__hotspot${active ? " is-active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus(fieldKey);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFocus(fieldKey);
        }
      }}
      title={`Edit “${fieldKey}”`}
    >
      {children}
    </div>
  );
}

function FeedChipPreview({
  draft,
  focusField,
  onFocusField,
}: {
  draft: EventDraft;
  focusField: string | null;
  onFocusField: (key: string) => void;
}) {
  const ev = eventToFeedChip(draft);
  return (
    <div className="card-box-1 pgs-admin-visual__chip">
      <div className="d-flex">
        <Hotspot fieldKey="title" active={focusField === "title"} onFocus={onFocusField}>
          <h5>{ev.title}</h5>
        </Hotspot>
        <Hotspot fieldKey="starts_at" active={focusField === "starts_at"} onFocus={onFocusField}>
          <h5>{ev.date}</h5>
        </Hotspot>
        <Hotspot fieldKey="starts_at" active={focusField === "starts_at"} onFocus={onFocusField}>
          <h5>{ev.time}</h5>
        </Hotspot>
      </div>
      {ev.blurb ? (
        <Hotspot fieldKey="summary" active={focusField === "summary"} onFocus={onFocusField}>
          <p className="mb-0 fs-11 lh-full text-black fw-400 lh-new-100 mt-3">
            {ev.blurb}
          </p>
        </Hotspot>
      ) : null}
      <Hotspot fieldKey="mode" active={focusField === "mode"} onFocus={onFocusField}>
        <p className="mb-0 fs-11 lh-full text-black fw-400 lh-full mt-3">
          <b>Mode:&nbsp;</b>
          {ev.mode}
        </p>
      </Hotspot>
    </div>
  );
}

function SessionCardPreview({
  draft,
  focusField,
  onFocusField,
}: {
  draft: EventDraft;
  focusField: string | null;
  onFocusField: (key: string) => void;
}) {
  const session = eventToUpcomingSession(draft);
  return (
    <article className="pgs-session-card">
      <span className="pgs-session-card__dot" aria-hidden />
      <div className="pgs-session-card__inner">
        <div className="pgs-session-card__title">
          <Hotspot fieldKey="title" active={focusField === "title"} onFocus={onFocusField}>
            <h5>{session.title}</h5>
          </Hotspot>
        </div>
        <div className="pgs-session-card__dates">
          <div className="pgs-session-card__date-col">
            <Hotspot fieldKey="starts_at" active={focusField === "starts_at"} onFocus={onFocusField}>
              <div className="pgs-session-card__date-box">
                <span className="pgs-session-card__day">{session.start.day}</span>
                <span className="pgs-session-card__month">{session.start.month}</span>
              </div>
              <p className="pgs-session-card__time">{session.start.time}</p>
            </Hotspot>
          </div>
          <div className="pgs-session-card__date-col">
            <Hotspot fieldKey="ends_at" active={focusField === "ends_at"} onFocus={onFocusField}>
              <div className="pgs-session-card__date-box">
                <span className="pgs-session-card__day">{session.end.day}</span>
                <span className="pgs-session-card__month">{session.end.month}</span>
              </div>
              <p className="pgs-session-card__time">{session.end.time}</p>
            </Hotspot>
          </div>
        </div>
        <div className="pgs-session-card__body">
          {session.whoFor ? (
            <div>
              <h5>Who&apos;s It For?</h5>
              <Hotspot
                fieldKey="who_is_it_for"
                active={focusField === "who_is_it_for"}
                onFocus={onFocusField}
              >
                <p>{session.whoFor}</p>
              </Hotspot>
            </div>
          ) : null}
          {session.topics && session.topics.length > 0 ? (
            <div className="pgs-session-card__topics">
              <h5>Topics Covered</h5>
              <Hotspot
                fieldKey="session_topics"
                active={focusField === "session_topics"}
                onFocus={onFocusField}
              >
                {session.topics.map((t, i) => (
                  <h6 key={`topic-${i}`}>{t}</h6>
                ))}
              </Hotspot>
            </div>
          ) : null}
          <span className="pgs-session-card__cta">Learn More</span>
        </div>
      </div>
      <div className="pgs-session-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.image} alt="" />
      </div>
    </article>
  );
}

function EventsHeroPreview({
  draft,
  focusField,
  onFocusField,
}: {
  draft: EventDraft;
  focusField: string | null;
  onFocusField: (key: string) => void;
}) {
  const session = eventToSessionDetail(draft);
  return (
    <div className="pgs-admin-visual__hero sop-card-unique left-13 full-box-content border-none d-flex align-items-start gap-3">
      <div className="w-30" style={{ minWidth: 140, maxWidth: 180 }}>
        <Hotspot fieldKey="badge" active={focusField === "badge"} onFocus={onFocusField}>
          <div className="sop-top-label h-30px w-130px fs-14 label-flot-update">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/red-hours.gif" className="w-15 ml-2" alt="" />
            &nbsp;{session.enrollLabel ?? "Enroll Now"}
          </div>
        </Hotspot>
        <div className="sop-image-wrapper-1 w-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={session.image} alt="" className="big_img" />
          {session.mode ? (
            <Hotspot fieldKey="mode" active={focusField === "mode"} onFocus={onFocusField}>
              <div className="sop-heart-icon bg-purple text-white px-1 fs-22 border-radius-6px">
                {session.mode}
              </div>
            </Hotspot>
          ) : null}
        </div>
      </div>
      <div className="content-wrap flex-1 p-1 pt-0" style={{ flex: 1, minWidth: 0 }}>
        <Hotspot fieldKey="title" active={focusField === "title"} onFocus={onFocusField}>
          <h1 className="mb-0 border-black fnt-family px-2 py-2 text-black fs-50 border-radius-4px bg-white">
            {session.title}
          </h1>
        </Hotspot>
        <div className="mt-2 mb-2">
          <span className="fs-14">Host : </span>
          <Hotspot fieldKey="host" active={focusField === "host"} onFocus={onFocusField}>
            <span className="text-dark-gray fs-14">{session.host || "—"}</span>
          </Hotspot>
        </div>
        <div className="d-flex gap-3 mt-2 flex-wrap">
          <Hotspot fieldKey="starts_at" active={focusField === "starts_at"} onFocus={onFocusField}>
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
          </Hotspot>
          <div className="content-p" style={{ maxWidth: 280 }}>
            <Hotspot
              fieldKey="top_label"
              active={focusField === "top_label" || focusField === "summary"}
              onFocus={onFocusField}
            >
              <h5 className="mb-2 text-black fs-25 fw-500 lh-30">
                {session.subtitle || "Add subtitle / top label"}
              </h5>
            </Hotspot>
            <Hotspot
              fieldKey="description"
              active={focusField === "description" || focusField === "summary"}
              onFocus={onFocusField}
            >
              <p className="mb-0 text-black fs-12 lh-12">
                {session.description || "Add description"}
              </p>
            </Hotspot>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualPanel({
  visualKey,
  draft,
  focusField,
  onFocusField,
}: {
  visualKey: EventVisualKey;
  draft: EventDraft;
  focusField: string | null;
  onFocusField: (key: string) => void;
}) {
  switch (visualKey) {
    case "saved_program_full":
      return (
        <div
          className="pgs-admin-visual__card-wrap"
          onClick={() => onFocusField("title")}
          onKeyDown={() => undefined}
          role="presentation"
        >
          <ProgramCard data={eventToProgramFull(draft)} />
        </div>
      );
    case "saved_promo":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--third">
          <PromoCard data={eventToPromoCard(draft)} />
        </div>
      );
    case "saved_internship":
      return (
        <div className="pgs-admin-visual__card-wrap pgs-admin-visual__card-wrap--half">
          <InternshipCard data={eventToInternshipCard(draft)} />
        </div>
      );
    case "saved_program_compact":
      return (
        <div className="pgs-admin-visual__card-wrap">
          <ProgramCard data={eventToProgramCompact(draft)} />
        </div>
      );
    case "add_to_calendar":
      return (
        <FeedChipPreview
          draft={draft}
          focusField={focusField}
          onFocusField={onFocusField}
        />
      );
    case "events_hero":
      return (
        <EventsHeroPreview
          draft={draft}
          focusField={focusField}
          onFocusField={onFocusField}
        />
      );
    case "events_upcoming_card":
      return (
        <div className="pgs-purple-events">
          <SessionCardPreview
            draft={draft}
            focusField={focusField}
            onFocusField={onFocusField}
          />
        </div>
      );
    default:
      return null;
  }
}

export function EventVisualEditor({
  draft,
  onChange,
  focusField: focusFieldProp,
  onFocusField,
}: Props) {
  const [localFocus, setLocalFocus] = useState<string | null>("title");
  const [activeVisual, setActiveVisual] = useState<EventVisualKey | "all">("all");
  const focusField = focusFieldProp ?? localFocus;
  const selected = useMemo(() => parseCardSurfaces(draft), [draft]);

  function focus(key: string) {
    setLocalFocus(key);
    onFocusField?.(key);
  }

  const visibleKeys = useMemo(
    () =>
      activeVisual === "all"
        ? [...EVENT_VISUAL_KEYS]
        : [activeVisual],
    [activeVisual],
  );

  return (
    <div className="pgs-admin-visual">
      <p className="pgs-admin-visual__hint">
        Select which cards this event uses. Edit fields below — selected
        templates update together. Click a region to jump to that field.
      </p>

      <div className="pgs-admin-visual__select">
        <div className="pgs-admin-visual__select-head">
          <strong>Cards for this event</strong>
          <span>
            {selected.length} of {EVENT_VISUAL_KEYS.length} selected
          </span>
        </div>
        <div className="pgs-admin-visual__select-grid">
          {EVENT_VISUAL_KEYS.map((key) => {
            const on = isCardSurfaceEnabled(draft, key);
            return (
              <label key={key} className={`pgs-admin-visual__chip-toggle${on ? " is-on" : ""}`}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) =>
                    onChange(toggleCardSurface(draft, key, e.target.checked))
                  }
                />
                <span className="pgs-admin-visual__chip-toggle-text">
                  {EVENT_VISUAL_LABELS[key]}
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
              onChange({ ...draft, card_surfaces: [...EVENT_VISUAL_KEYS] })
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

      <div className="pgs-admin-visual__fields">
        {VISUAL_FIELDS.map((field) => {
          const active = focusField === field.key;
          return (
            <label
              key={field.key}
              className={active ? "is-focused" : undefined}
              id={`visual-field-${field.key}`}
            >
              {field.label}
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={String(draft[field.key] ?? "")}
                  onFocus={() => focus(field.key)}
                  onChange={(e) =>
                    onChange(setField(draft, field.key, e.target.value))
                  }
                />
              ) : field.type === "datetime" ? (
                <input
                  type="datetime-local"
                  value={
                    draft[field.key]
                      ? String(draft[field.key]).replace("Z", "").slice(0, 16)
                      : ""
                  }
                  onFocus={() => focus(field.key)}
                  onChange={(e) =>
                    onChange(
                      setField(
                        draft,
                        field.key,
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      ),
                    )
                  }
                />
              ) : (
                <input
                  value={String(draft[field.key] ?? "")}
                  onFocus={() => focus(field.key)}
                  onChange={(e) =>
                    onChange(setField(draft, field.key, e.target.value))
                  }
                />
              )}
            </label>
          );
        })}
      </div>

      <div className="pgs-admin__tabs pgs-admin-visual__tabs">
        <button
          type="button"
          className={activeVisual === "all" ? "is-active" : undefined}
          onClick={() => setActiveVisual("all")}
        >
          All cards
        </button>
        {EVENT_VISUAL_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={activeVisual === key ? "is-active" : undefined}
            onClick={() => setActiveVisual(key)}
          >
            {EVENT_VISUAL_LABELS[key].includes("—")
              ? EVENT_VISUAL_LABELS[key].split("—")[0].trim()
              : EVENT_VISUAL_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="pgs-admin-visual__canvas pgs-purple-events">
        {visibleKeys.map((key) => {
          const enabled = isCardSurfaceEnabled(draft, key);
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
                        toggleCardSurface(draft, key, e.target.checked),
                      )
                    }
                  />
                  <span>{EVENT_VISUAL_LABELS[key]}</span>
                </label>
                {!enabled ? (
                  <span className="pgs-admin-visual__off-badge">Not used</span>
                ) : null}
              </header>
              <div className="pgs-admin-visual__panel-body">
                <VisualPanel
                  visualKey={key}
                  draft={draft}
                  focusField={focusField}
                  onFocusField={focus}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
