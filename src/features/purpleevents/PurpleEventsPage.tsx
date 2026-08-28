"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BumpPremiumModal } from "@/components/BumpPremiumModal";
import { CmsHtml, looksLikeHtml } from "@/components/CmsHtml";
import { HighlightsSection } from "@/components/HighlightsSection";
import { useCmsShell } from "@/components/layout/cms-shell";
import {
  DEFAULT_SECTION_LABELS,
  DOWNLOAD_COPY,
  EVENT_TESTIMONIALS,
  FAQ_ITEMS,
  FAQ_TABS,
  FEATURED_SESSION,
  getSessionById,
  ROADMAP,
  SESSION_PERKS,
  SOCIAL_SHARE,
  UPCOMING_SESSIONS,
  type SessionDetail,
  type SessionPageLabels,
  type UpcomingSession,
} from "./content";
import {
  badgeChipStyle,
  DEFAULT_EVENT_BADGE_ICON,
} from "@/components/cards/badge-chip-style";
import "./purple-events.css";

function pageLabel(
  session: SessionDetail | undefined,
  key: keyof SessionPageLabels,
): string {
  const fromSession = session?.labels?.[key];
  if (typeof fromSession === "string" && fromSession.trim()) {
    return fromSession.trim();
  }
  return DEFAULT_SECTION_LABELS[key];
}

function SessionCard({ session }: { session: UpcomingSession }) {
  return (
    <article className="pgs-session-card">
      <span className="pgs-session-card__dot" aria-hidden />
      <div className="pgs-session-card__inner">
        <div className="pgs-session-card__title">
          <h5>{session.title}</h5>
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
          {session.whoFor ? (
            <div>
              <h5>Who&apos;s It For?</h5>
              <CmsHtml as="div" html={session.whoFor} />
            </div>
          ) : null}
          {session.topics && session.topics.length > 0 ? (
            <div className="pgs-session-card__topics">
              <h5>Topics Covered</h5>
              {session.topics.length === 1 && looksLikeHtml(session.topics[0]) ? (
                <CmsHtml as="div" html={session.topics[0]} />
              ) : (
                session.topics.map((t, i) => (
                  <h6 key={`topic-${session.id}-${i}`}>{t}</h6>
                ))
              )}
            </div>
          ) : null}
          <Link
            href={`/purpleevents/session/${session.id}`}
            className="pgs-session-card__cta"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className="pgs-session-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={session.image} alt="" />
      </div>
    </article>
  );
}

function UpcomingSessions({
  sessions = UPCOMING_SESSIONS,
  title,
}: {
  sessions?: UpcomingSession[];
  title?: string;
}) {
  const list = sessions.length > 0 ? sessions : UPCOMING_SESSIONS;
  const [index, setIndex] = useState(0);
  const visible = 3;
  const len = Math.max(list.length, 1);

  useEffect(() => {
    if (list.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [list.length]);

  function prev() {
    setIndex((i) => (i - 1 + len) % len);
  }
  function next() {
    setIndex((i) => (i + 1) % len);
  }

  const slides = Array.from({ length: Math.min(visible, list.length || 1) }, (_, offset) => {
    return list[(index + offset) % len];
  }).filter(Boolean);

  return (
    <section className="pgs-upcoming">
      <h1 className="pgs-upcoming__title">
        {title || DEFAULT_SECTION_LABELS.upcoming}
      </h1>
      <div className="pgs-upcoming__row">
        <div className="pgs-upcoming__nav">
          <button type="button" onClick={prev} aria-label="Previous slide">
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button type="button" onClick={next} aria-label="Next slide">
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
        <div className="pgs-upcoming__track">
          {slides.map((session, i) => (
            <SessionCard key={`d-${session.id}-${i}`} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqBlock({
  items,
  title,
}: {
  items?: { q: string; a: string }[];
  title?: string;
}) {
  const faqItems =
    items && items.length > 0
      ? items
      : FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a }));
  const [tab, setTab] = useState<(typeof FAQ_TABS)[number]["id"]>("tab_1");
  const [openQ, setOpenQ] = useState(0);

  return (
    <section>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <h5 className="text-black fs-25 mb-4">
              {title || DEFAULT_SECTION_LABELS.faq}
            </h5>
            <div className="d-flex gap-5">
              <div className="w-25">
                <div className="group-of-button-div">
                  <ul className="portfolio-filter box-tabs-bottom m-0 p-0 nav nav-tabs">
                    {FAQ_TABS.map((t) => (
                      <li
                        className={`nav${tab === t.id ? " active" : ""}`}
                        key={t.id}
                      >
                        <a
                          href={`#events-${t.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setTab(t.id);
                          }}
                        >
                          {t.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-70 portfolio-wrapper">
                {tab === "tab_1" ? (
                  <div className="grid-item tab_1 transition-inner-all w-100">
                    <div className="accordion accordion-style-02">
                      {faqItems.map((item, i) => {
                        const open = openQ === i;
                        return (
                          <div
                            className={`accordion-item border-bottom${
                              open ? " active-accordion" : ""
                            }${i === 0 ? " pt-0" : ""}`}
                            key={`${item.q}-${i}`}
                          >
                            <div
                              className={`accordion-header border-color-extra-medium-gray${
                                i === 0 ? " pt-0" : ""
                              }`}
                            >
                              <a
                                href={`#events-faq-${i}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenQ(open ? -1 : i);
                                }}
                              >
                                <div className="accordion-title mb-0 position-relative text-black">
                                  <i
                                    className={`feather ${
                                      open
                                        ? "icon-feather-minus"
                                        : "icon-feather-plus"
                                    }`}
                                  />
                                  <span className="fw-600 fs-20 ls-minus-05px">
                                    {item.q}
                                  </span>
                                </div>
                              </a>
                            </div>
                            {open ? (
                              <div className="accordion-collapse collapse show">
                                <div className="accordion-body last-paragraph-no-margin border-color-light-medium-gray">
                                  <CmsHtml
                                    as="div"
                                    className="fw-400"
                                    html={item.a}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid-item transition-inner-all w-100">
                    <p className="text-black mb-0">
                      {FAQ_TABS.find((t) => t.id === tab)?.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({
  items,
}: {
  items?: SessionDetail["testimonials"];
}) {
  const { testimonials } = useCmsShell();
  const [index, setIndex] = useState(0);
  const resolved =
    items && items.length > 0
      ? items
      : testimonials.length > 0
        ? testimonials.map((t) => ({
            quote: t.quote,
            name: t.name,
            role: t.role,
            location: "",
            image: "/assets/img/selfe.jpg",
          }))
        : [...EVENT_TESTIMONIALS];
  const len = Math.max(1, resolved.length);
  const item = resolved[index % len];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 3000);
    return () => window.clearInterval(id);
  }, [len]);

  return (
    <section className="position-relative pt-5 mobile-pb-25">
      <div className="container overlap-gap-section p-0 position-relative">
        <div className="row align-items-center justify-content-center justify-content-md-center">
          <div className="col-lg-9 m-last">
            <div className="sm-outside-box-right-0 d-flex align-items-center gap-4 upcoming-swiper mobile-wrap pgs-testimonial-row">
              <div className="pgs-testimonial-nav" aria-label="Testimonial navigation">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i - 1 + len) % len)}
                    aria-label="Previous testimonial"
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i + 1) % len)}
                    aria-label="Next testimonial"
                  >
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
              </div>
              <div className="m-auto d-flex align-items-center gap-4 mobile-wrap w-100">
                <div className="w-50 mobile-w-full mobile-pt-0">
                  <div className="d-flex align-items-end">
                    <h5 className="fs-14 lh-full text-black d-flex gap-2 mobile-fs-14 mobile-lh-full mobile-mb-0 mobile-pb-4 mobile-w-80 mobile-auto">
                      <span className="fnt-family fs-50">&quot;</span>
                      {item.quote}
                    </h5>
                    <span className="fnt-family fs-50 text-black">&quot;</span>
                  </div>
                </div>
                <div className="w-50 mobile-w-full mobile-pt-0">
                  <div className="caption-img-box-new">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} />
                    <div
                      className="d-flex position-absolute-css z-100 justify-content-space px-4"
                      style={{ bottom: 15 }}
                    >
                      <div>
                        <h5 className="fs-40 lh-30 fnt-family text-white mb-0 mobile-fs-24">
                          {item.name}
                        </h5>
                        <p className="mb-0 fs-15 text-white mb-0">{item.role}</p>
                      </div>
                      <div>
                        <h5 className="fs-40 lh-30 fnt-family text-white mb-0 mobile-fs-24 mobile-nowrap">
                          {item.location}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookSeatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BumpPremiumModal
      open={open}
      onClose={onClose}
      config={{
        subLabel: "#purpleevents",
        tagline: "Book your seat for this session — we’ll confirm shortly.",
        cta: "Book Your Seat",
        selects: [
          {
            label: "What describes you best?",
            options: [
              { value: "1", label: "Medical aspirant" },
              { value: "2", label: "STEM / Non-medical" },
              { value: "3", label: "Exploring options" },
            ],
          },
        ],
        successTitle: "You're on the list",
        successBody: "We'll confirm your seat shortly.",
      }}
    />
  );
}

function SessionHero({
  session,
  mode,
  onBook,
}: {
  session: SessionDetail;
  mode: "listing" | "detail";
  onBook?: () => void;
}) {
  return (
    <section className="position-relative pt-4 purple-event-hero">
      <div className="container p-0">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-sm-12 mt-1 col-md-5 position-relative">
            <div className="sop-card-unique left-13 full-box-content full-box-content-height border-none d-flex align-items-start justify-content-end gap-3 mobile-wrap">
              <div className="w-30 mobile-w-full">
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
                  &nbsp;{session.enrollLabel ?? "Enroll Now"}
                </div>
                <div className="sop-image-wrapper-1 w-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.image}
                    alt={session.title}
                    className="big_img"
                  />
                  <div className="sop-heart-icon">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/share.png" alt="Share" />
                  </div>
                  {session.mode ? (
                    <div className="sop-heart-icon bg-purple text-white px-1 fs-22 border-radius-6px">
                      {session.mode}
                    </div>
                  ) : null}
                  {session.author ? (
                    <div className="event-author-info">
                      <h5 className="fs-12 text-black mb-0 lh-20">
                        {session.author}
                      </h5>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="content-wrap w-50 p-1 pt-0 mobile-w-full">
                <div className="w-70">
                  <h1 className="mb-0 border-black fnt-family px-2 py-2 text-black fs-50 border-radius-4px bg-white">
                    {session.title}
                  </h1>
                </div>
                <div className="mt-2 mb-4">
                  <span className="fs-14">{pageLabel(session, "hostPrefix")}</span>
                  <span className="text-dark-gray fs-14">{session.host}</span>
                </div>
                <div className="d-flex gap-3 mt-2">
                  <div className="sop-content card-box-date">
                    <div className="date-box bg-transparent">
                      <div>
                        <div className="box-date-info bg-black">
                          <span className="date text_purple">
                            {session.start.day}
                          </span>
                          <span className="month">{session.start.month}</span>
                        </div>
                        <p className="mb-0 text-black fw-600 fs-12 text-center">
                          {session.start.time}
                        </p>
                      </div>
                      <div>
                        <div className="box-date-info bg-black">
                          <span className="date text_purple">
                            {session.end.day}
                          </span>
                          <span className="month">{session.end.month}</span>
                        </div>
                        <p className="mb-0 text-black fw-600 fs-12 text-center">
                          {session.end.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="content-p mobile-w-50">
                    <CmsHtml
                      as="div"
                      className="mb-2 text-black fs-25 fw-500 w-300px lh-30 mobile-w-full"
                      html={session.subtitle}
                    />
                    <CmsHtml
                      as="div"
                      className="mb-0 text-black fs-12 lh-12"
                      html={session.description}
                    />
                  </div>
                </div>
                {session.tags && session.tags.length > 0 ? (
                  <div className="sop-tags px-2 py-2 mb-0 mt-3">
                    {session.tags.map((tag) => (
                      <span className="sop-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="d-flex justify-content-space mt-0 flex-wrap gap-2">
                  {mode === "listing" ? (
                    <button
                      type="button"
                      className="sop-learn-btn bg-blue-500 mt-2 fs-17 w-100 fw-600 text-black border-radius-4px py-2 ht-48"
                      onClick={onBook}
                    >
                      Book Your Seat
                    </button>
                  ) : (
                    <Link
                      href="/purpleevents"
                      className="sop-learn-btn bg-blue-500 mt-2 fs-17 fw-600 text-black border-radius-4px py-2 ht-48 px-4 text-center text-decoration-none"
                      style={{ lineHeight: "normal" }}
                    >
                      ← Back to Events
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12" />
          <div className="d-flex gap-5 w-60 align-items-start mt-8 mobile-wrap">
            <div className="mobile-w-full">
              <h3 className="fs-28 text-black text-uppercase fw-900 overflow-hidden text-blue mb-4 gr-mobile-1">
                <span
                  className="bg-light-green-200 p-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {pageLabel(session, "whoFor")}
                </span>
              </h3>
              {mode === "listing" ? (
                <>
                  <div className="d-flex align-items-start gap-1 mb-3">
                    {session.whoForLines.length === 1 &&
                    looksLikeHtml(session.whoForLines[0]) ? (
                      <div className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black w-344px fw-500 overflow-hidden text-blue mobile-fs-14">
                        <CmsHtml as="div" html={session.whoForLines[0]} />
                      </div>
                    ) : (
                      <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black w-344px fw-500 overflow-hidden text-blue mobile-fs-14">
                        {session.whoForLines.slice(0, 3).map((line, i) => (
                          <span key={`who-${i}`}>
                            {line}
                            {i < 2 ? <br /> : null}
                          </span>
                        ))}
                      </h4>
                    )}
                  </div>
                  <div className="mb-3">
                    <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black w-344px fw-500 overflow-hidden text-blue mobile-fs-14">
                      This session’s made for you.
                    </h4>
                  </div>
                </>
              ) : (
                <div className="bg-light-green-200 p-1">
                  {session.whoForLines.length === 1 &&
                  looksLikeHtml(session.whoForLines[0]) ? (
                    <CmsHtml
                      as="div"
                      className="mb-0 fs-24 lh-full text-black w-344px fw-500 mobile-fs-14"
                      html={session.whoForLines[0]}
                    />
                  ) : (
                    <p className="mb-0 fs-24 lh-full text-black w-344px fw-500 mobile-fs-14">
                      {session.whoForLines.join(" ")}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="mobile-w-full">
              <h3 className="fs-28 text-black text-uppercase fw-900 overflow-hidden text-blue mb-4 gr-mobile-1">
                <span
                  className="bg-light-green-200 p-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {pageLabel(session, "sessionTopics")}
                </span>
              </h3>
              <div className="mb-3">
                {session.sessionTopics.length === 1 &&
                looksLikeHtml(session.sessionTopics[0]) ? (
                  <div className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black w-344px fw-500 overflow-hidden text-blue mobile-fs-14">
                    <CmsHtml as="div" html={session.sessionTopics[0]} />
                  </div>
                ) : (
                  session.sessionTopics.map((topic, i) => (
                    <h4
                      className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black w-344px fw-500 overflow-hidden text-blue mobile-fs-14"
                      key={`st-${i}`}
                    >
                      {topic}
                    </h4>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SessionBody({
  session,
}: {
  session: SessionDetail;
}) {
  const roadmap = session.roadmap ?? ROADMAP;
  const footer = roadmap.footer || ROADMAP.footer;
  const footerParts = footer.split(/get started\./i);
  const footerLead = footerParts[0] ?? "";
  const footerBold =
    footerParts.length > 1
      ? `get started.${footerParts.slice(1).join("get started.")}`
      : "";

  return (
    <>
      <section className="pt-5">
        <div className="">
          <div className="row justify-content-center">
            <div className="col-lg-12 mobile-box-4 mobile-box-style-2">
              <h1 className="text-black fnt-family fw-500 fs-40 pt-0 text-center mobile-fs-24">
                {pageLabel(session, "whatWeCover")}
              </h1>
              <div className="group-flex-items mt-5 d-flex wrap justify-content-center">
                {session.coverItems.length === 1 &&
                looksLikeHtml(session.coverItems[0]) ? (
                  <CmsHtml
                    as="div"
                    className="text-black fs-16 lh-24 w-80"
                    html={session.coverItems[0]}
                  />
                ) : (
                  session.coverItems.map((item, i) => (
                    <div className="w-211px column-flex" key={`cover-${i}`}>
                      <div className="d-flex align-items-start gap-3 mb-5">
                        <span className="icon-box">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/icon-traingal.png" alt="" />
                        </span>
                        <h4 className="text-black mb-0 fs-50 lh-50 fw-500">
                          {String(i + 1).padStart(2, "0")}
                        </h4>
                      </div>
                      <h6 className="mb-0 fs-14 text-center lh-20 text-black">
                        {item}
                      </h6>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-5">
        <div className="">
          <div className="d-flex justify-content-center align-items-center gap-5 mobile-wrap">
            <div className="d-flex align-items-start gap-1 mb-3 w-344px mobile-w-70 mobile-auto mobile-pb-4">
              {(() => {
                const asideLines =
                  session.benefitsAsideLines &&
                  session.benefitsAsideLines.length > 0
                    ? session.benefitsAsideLines
                    : session.whoForLines;
                if (
                  asideLines.length === 1 &&
                  looksLikeHtml(asideLines[0])
                ) {
                  return (
                    <div className="bg-light-green-200 mb-0 fs-24 mobile-fs-22 lh-28 w-344px p-1 text-black fw-500 overflow-hidden text-blue m-border-1">
                      <CmsHtml as="div" html={asideLines[0]} />
                    </div>
                  );
                }
                return (
                  <h4 className="bg-light-green-200 mb-0 fs-24 mobile-fs-22 lh-28 w-344px p-1 text-black fw-500 overflow-hidden text-blue m-border-1">
                    {asideLines.slice(0, 3).map((line, i) => (
                      <span key={`perk-who-${i}`}>
                        {line}
                        {i < Math.min(asideLines.length, 3) - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h4>
                );
              })()}
            </div>
            <div className="w-25 mobile-w-50">
              <ul className="todo-update-list p-0">
                {(session.benefits && session.benefits.length > 0
                  ? session.benefits
                  : [...SESSION_PERKS]
                ).map((perk) => (
                  <li
                    className="fs-16 text-black mb-2 fw-600 d-flex gap-2 align-items-start mobile-lh-full mobile-fs-15 mobile-pb-4"
                    key={perk}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/flat-color-icons_ok.png" alt="" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-5">
        <div className="container">
          <div className="row justify-content-center align-items-center gap-5">
            <div className="w-650px p-0 mobile-w-full">
              <h4 className="text-black fs-40 text-center lh-50 mobile-fs-22 mobile-br-none mobile-lg-full mobile-mb-0">
                {(() => {
                  const label = pageLabel(session, "facilitators");
                  const parts = label.split(/\s+/);
                  if (parts.length >= 3 && /^meet$/i.test(parts[0])) {
                    return (
                      <>
                        <span className="fs-32"> {parts.slice(0, -1).join(" ")}</span>{" "}
                        <br />{" "}
                        <span className="italic-texts fw-800">
                          {parts[parts.length - 1]}
                        </span>
                      </>
                    );
                  }
                  return <span className="italic-texts fw-800">{label}</span>;
                })()}
              </h4>
              <div className="d-flex gap-3 justify-content-center flex-wrap pgs-facilitators-row">
                {session.facilitators.map((f) => (
                  <div
                    className="pgs-facilitator-cell mobile-w-50 mobile-mt-0 mobile-pt-0"
                    key={f.name}
                  >
                    <div className="founder-img-box border-radius-4px mb-2 w-full border-radius-20px">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.image} alt={f.name} />
                    </div>
                    <h4 className="mb-0 text-black fs-40 mobile-fs-25">
                      {f.name}
                    </h4>
                    <h6 className="text-uppercase fs-16 text-black mb-2 mt-2">
                      {f.role}
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="position-relative pt-8">
        <div className="container overlap-gap-section p-0 position-relative">
          <div className="row align-items-center justify-content-center justify-content-md-center">
            <div className="col-lg-10 m-auto mobile-w-90">
              <div className="d-flex gap-5 align-items-center justify-content-center mobile-wrap">
                <div className="w-40">
                  <div className="bg-black p-05 black-shadow mb-5">
                    <div className="header-bg-black d-flex text-white justify-content-space pb-1 px-3">
                      <span className="fs-13 mobile-fs-10">
                        <i className="bi bi-circle" />
                        <i className="bi bi-circle" />
                        <i className="bi bi-circle" />
                      </span>
                      <h5 className="mb-0 text-uppercase fs-20 mobile-fs-12">
                        {pageLabel(session, "note")}
                      </h5>
                      <span>
                        <i className="bi bi-file-earmark-pdf" />
                      </span>
                    </div>
                    <div className="bg-purple-100 d-flex justify-content-center align-items-center h-180px">
                      <h5 className="mb-0 fs-25 text-black text-center w-328px mobile-fs-16 mobile-lh-full">
                        {session.note}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="w-40 px-4 mb-4 mobile-d-flex mobile-gap-2">
                  <h5 className="mb-2 fs-22 fw-700 lh-30 text-black mobile-font-400 mobile-w-50 mobile-lh-16">
                    {roadmap.title}
                  </h5>
                  <p className="mb-0 fs-22 fw-400 lh-30 text-black mobile-w-50 mobile-lh-16">
                    {roadmap.body}
                  </p>
                </div>
              </div>
              <div className="w-60 m-auto mt-4 mobile-last-auto mobile-w-48 mobile-auto-last">
                <p className="mb-0 text-black fs-20 lh-full w-80 m-auto mt-3 lt-0.2 mobile-p-0 mobile-w-full mobile-fs-14 mobile-lh-16">
                  {footerLead}
                  {footerBold ? (
                    <>
                      <br />
                      <b>{footerBold}</b>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SharedTail({
  session,
}: {
  session?: SessionDetail;
} = {}) {
  const poster = session?.poster ?? {
    title: DOWNLOAD_COPY.title,
    body: DOWNLOAD_COPY.body,
    inviteTitle: DOWNLOAD_COPY.inviteTitle,
    inviteBody: DOWNLOAD_COPY.inviteBody,
    live: DOWNLOAD_COPY.live,
    topics: [...DOWNLOAD_COPY.topics],
    qrUrl: "/assets/img/qr-2.png",
    bgUrl: "/assets/img/green-1.png",
  };
  const cta = session?.cta ?? {
    eyebrow: "Let's Go",
    title: pageLabel(session, "cta"),
    body: "Let’s chart your study abroad path, together with Team #PGS.",
    buttonLabel: "Start Your Journey",
    buttonHref: "/contact",
  };
  const highlightCopy =
    session?.highlights &&
    (session.highlights.title.trim() || session.highlights.body.trim())
      ? {
          heading:
            session.highlights.heading || pageLabel(session, "highlights"),
          title: session.highlights.title,
          location: session.highlights.location,
          body: session.highlights.body,
        }
      : undefined;
  const highlightImages =
    session?.highlights?.images && session.highlights.images.length > 0
      ? session.highlights.images
      : undefined;

  return (
    <>
      <section className="pgs-download">
        <div className="pgs-download__row">
          <div className="pgs-download__copy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/top-to-right.png"
              className="pgs-download__arrow mobile-none"
              alt=""
            />
            <h4>{poster.title || pageLabel(session, "download")}</h4>
            <CmsHtml as="div" html={poster.body || DOWNLOAD_COPY.body} />
            <div className="pgs-download__socials">
              {SOCIAL_SHARE.map((s) => (
                <a href={s.href} key={s.alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} />
                </a>
              ))}
            </div>
          </div>

          <div className="pgs-download__poster-wrap">
            <div
              className="pgs-download__poster"
              style={{
                backgroundImage: `url(${poster.bgUrl || "/assets/img/green-1.png"})`,
              }}
            >
              <div className="pgs-poster-block position-relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/logo-transparent.png"
                  width={180}
                  alt="#purpleGuide"
                />
                <br />
                <h5 className="pgs-poster-label">invitation for</h5>
                <h5 className="pgs-poster-aspirants">{poster.inviteTitle}</h5>
                <button type="button" className="pgs-download__dl" aria-label="Download poster">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/download.png" alt="" />
                </button>
              </div>

              <div className="pgs-poster-block pgs-poster-block--wide">
                <h5 className="pgs-poster-body">{poster.inviteBody}</h5>
              </div>
              <div className="pgs-poster-block pgs-poster-block--pill">
                <h5 className="pgs-poster-live">{poster.live}</h5>
              </div>

              <div className="pgs-poster-footer">
                <div className="pgs-poster-dates">
                  {[0, 1].map((i) => (
                    <div className="pgs-poster-date-col" key={`poster-date-${i}`}>
                      <div className="pgs-poster-date-box">
                        <span className="day">
                          {session?.start.day || "31"}
                        </span>
                        <span className="month">
                          {session?.start.month || "Dec 25"}
                        </span>
                      </div>
                      <p>
                        {session?.start.time && session?.end.time
                          ? `${session.start.time} to ${session.end.time}`
                          : "12pm to 2 pm"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pgs-poster-join">
                  <div className="pgs-poster-join__top">
                    <button type="button" aria-label="Join here">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/join-btn.png" alt="JOIN HERE" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={poster.qrUrl || "/assets/img/qr-2.png"}
                      alt="QR code"
                    />
                  </div>
                  <div className="pgs-poster-join__topics">
                    <h5>Topics Covered</h5>
                    {poster.topics.map((t) => (
                      <h6 key={t}>{t}</h6>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HighlightsSection copy={highlightCopy} images={highlightImages} />
      <Testimonials items={session?.testimonials} />

      <section className="half-section overlap-height position-relative overflow-hidden">
        <div className="container overlap-gap-section p-0">
          <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
            <div className="mb-10px gap-5">
              <div className="text-center mb-2">
                <span className="small-caption" style={{ color: "#6A5ED9" }}>
                  {cta.eyebrow}
                </span>
                <h5 className="w-100 text-black fs-40 mb-2 fw-700 m-auto">
                  {cta.title}
                </h5>
                <CmsHtml
                  as="p"
                  className="w-40 text-center m-auto"
                  html={cta.body}
                />
                <Link
                  href={cta.buttonHref || "/contact"}
                  style={{ padding: "8px 30px", backgroundColor: "#6A5ED9" }}
                  className="mb-2 btn btn-small-large border-radius-10px text-white btn-rounded btn-switch-text d-inline-flex me-20px sm-me-10px align-middle left-icon mt-15px"
                >
                  <span>
                    <span
                      className="btn-double-text ls-minus-05px"
                      data-text={cta.buttonLabel}
                    >
                      {cta.buttonLabel}
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqBlock
        items={session?.faqItems}
        title={pageLabel(session, "faq")}
      />
    </>
  );
}

/** #purpleevents listing — from standalone-html/purpleevents.html */
export function PurpleEventsPage({
  sessions,
}: {
  sessions?: UpcomingSession[];
} = {}) {
  const [bookOpen, setBookOpen] = useState(false);
  const list = sessions && sessions.length > 0 ? sessions : UPCOMING_SESSIONS;
  const featured = list[0]
    ? ({
        ...FEATURED_SESSION,
        ...list[0],
        host: list[0].author || FEATURED_SESSION.host,
        subtitle: list[0].blurb || FEATURED_SESSION.subtitle,
        description: list[0].blurb || FEATURED_SESSION.description,
        whoForLines: list[0].whoFor
          ? [list[0].whoFor]
          : FEATURED_SESSION.whoForLines,
        sessionTopics: list[0].topics || FEATURED_SESSION.sessionTopics,
      } as SessionDetail)
    : FEATURED_SESSION;

  return (
    <div className="wrapper-content pgs-purple-events">
      <SessionHero
        session={featured}
        mode="listing"
        onBook={() => setBookOpen(true)}
      />
      <SessionBody session={featured} />
      <UpcomingSessions
        sessions={list}
        title={pageLabel(featured, "upcoming")}
      />
      <SharedTail session={featured} />
      <BookSeatModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}

/** Session detail — from standalone-html/event-session.html */
export function EventSessionPage({
  sessionId,
  detail: detailProp,
  sessions,
}: {
  sessionId: string;
  detail?: SessionDetail | null;
  sessions?: UpcomingSession[];
}) {
  const detail = detailProp ?? getSessionById(sessionId);
  const showUpcoming = detail.showUpcomingSessions !== false;
  const list =
    sessions && sessions.length > 0
      ? sessions
      : showUpcoming
        ? UPCOMING_SESSIONS
        : [];

  return (
    <div className="wrapper-content pgs-purple-events">
      <SessionHero session={detail} mode="detail" />
      <SessionBody session={detail} />
      {showUpcoming ? (
        <UpcomingSessions
          sessions={list}
          title={pageLabel(detail, "upcoming")}
        />
      ) : null}
      <SharedTail session={detail} />
    </div>
  );
}
