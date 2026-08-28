"use client";

import { useEffect, useRef, useState } from "react";
import { CmsHtml, looksLikeHtml } from "@/components/CmsHtml";
import {
  badgeChipStyle,
  DEFAULT_COURSE_BADGE_ICON,
} from "@/components/cards/badge-chip-style";
import type { CourseDetail, CourseFaqItem } from "./content";
import {
  COURSE_PAGE_MOCK,
  DEFAULT_COURSE_SECTION_LABELS,
  emptyCourseDetail,
} from "./content";
import "./programsfull.css";

type Props = {
  courseId?: string;
  detail?: CourseDetail | null;
};

function pageLabel(
  detail: CourseDetail,
  key: keyof typeof DEFAULT_COURSE_SECTION_LABELS,
): string {
  const from = detail.labels?.[key];
  const v = typeof from === "string" ? from.trim() : "";
  return v || DEFAULT_COURSE_SECTION_LABELS[key];
}

/** Render CMS label text that may contain intentional newlines. */
function LabelWithBreaks({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((line, i) => (
        <span key={`lbl-${i}`}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

function DateCard({ day, month }: { day: string; month: string }) {
  const parts = month.trim().split(/\s+/).filter(Boolean);
  let mo = "";
  let yr = "";
  if (parts.length >= 2) {
    mo = parts[0];
    yr = parts[1];
  } else if (parts.length === 1) {
    const m = parts[0].match(/^([A-Za-z]+)\s*(\d{2})$/);
    if (m) {
      mo = m[1];
      yr = m[2];
    } else {
      mo = parts[0];
    }
  }
  // Date cards are sized for 3-letter months (Sep, not Sept).
  mo = mo.slice(0, 3);
  return (
    <div className="pgs-programsfull__date-card">
      <span className="pgs-programsfull__date-day">{day}</span>
      <span className="pgs-programsfull__date-month">
        <span className="mo">{mo}</span>
        <span className="yr">{yr}</span>
      </span>
    </div>
  );
}

function GreenLines({ lines, fallback }: { lines: string[]; fallback: string }) {
  const list = lines.filter(Boolean);
  if (list.length === 1 && looksLikeHtml(list[0])) {
    return (
      <div className="pgs-programsfull__green-block">
        <CmsHtml as="div" html={list[0]} />
      </div>
    );
  }
  if (list.length === 0) {
    return (
      <div className="pgs-programsfull__green-block">
        <CmsHtml as="div" html={fallback} />
      </div>
    );
  }
  return (
    <>
      {list.map((line, i) => (
        <div className="pgs-programsfull__green-block" key={`line-${i}`}>
          {line}
        </div>
      ))}
    </>
  );
}

function GalleryTrack({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length < 2) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const card = el.querySelector<HTMLElement>(
        ".pgs-programsfull__gallery-card",
      );
      if (!card) return;
      const gap = 20.8;
      const step = card.offsetWidth + gap;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      const next = el.scrollLeft + step;
      if (next >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3200);

    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div
      ref={trackRef}
      className="pgs-programsfull__gallery-track"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {images.map((src, i) => (
        <div className="pgs-programsfull__gallery-card" key={`g-${i}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
}

function FaqSection({
  tabs,
  items,
  title,
}: {
  tabs: CourseDetail["faqTabs"];
  items: CourseFaqItem[];
  title: string;
}) {
  const [tab, setTab] = useState(tabs[0]?.id ?? "tab_1");
  const [openQ, setOpenQ] = useState(0);
  const filtered = items.filter((i) => (i.tab || "tab_1") === tab);

  return (
    <section className="pgs-programsfull__faq pt-5 pb-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <h5 className="text-black fs-25 mb-4">{title}</h5>
            <div className="pgs-programsfull__faq-layout">
              <div className="pgs-programsfull__faq-tabs">
                <ul className="portfolio-filter box-tabs-bottom m-0 p-0 nav nav-tabs">
                  {tabs.map((t) => (
                    <li
                      className={`nav${tab === t.id ? " active" : ""}`}
                      key={t.id}
                    >
                      <a
                        href={`#course-${t.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setTab(t.id);
                          setOpenQ(0);
                        }}
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pgs-programsfull__faq-panel">
                <div className="accordion accordion-style-02">
                  {filtered.map((item, i) => {
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
                            href={`#course-faq-${i}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenQ(open ? -1 : i);
                            }}
                          >
                            <div
                              className={`accordion-title mb-0 position-relative${
                                open ? " text-danger" : " text-black"
                              }`}
                            >
                              <i
                                className={`feather ${
                                  open
                                    ? "icon-feather-minus"
                                    : "icon-feather-plus"
                                }`}
                              />
                              <span className="fw-600 fs-20 ls-minus-05px">
                                {i + 1}. {item.q}
                              </span>
                            </div>
                          </a>
                        </div>
                        {open ? (
                          <div className="accordion-collapse collapse show">
                            <div className="accordion-body last-paragraph-no-margin border-color-light-medium-gray">
                              <p className="fw-400 text-black">{item.a}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CourseDetailBody({ detail }: { detail: CourseDetail }) {
  const tags =
    detail.tags?.length > 0
      ? detail.tags
      : [detail.mode ? `#${detail.mode.replace(/^#/, "")}` : "#Course"].filter(
          Boolean,
        );
  const highlights = (detail.highlights ?? []).filter(Boolean);
  const topics = (detail.sessionTopics ?? []).filter(Boolean);
  const whoLines = (detail.whoForLines ?? []).filter(Boolean);
  const benefits = (detail.benefits ?? []).filter(Boolean);
  const sessionTime =
    detail.sessionTime || detail.start?.time || detail.end?.time || "";
  const bookHref = detail.bookingUrl || "#";
  const feeIncludes = (detail.feeIncludes ?? []).filter(Boolean);
  const mid = Math.ceil(feeIncludes.length / 2);
  const feeLeft = feeIncludes.slice(0, mid);
  const feeRight = feeIncludes.slice(mid);
  const facts = detail.awardingBodyFacts ?? [];
  const accreditationLogos = detail.accreditationLogos ?? [];
  const eligibility = detail.eligibility ?? [];
  const certificateWhy = detail.certificateWhy ?? [];
  const galleryImages = detail.galleryImages ?? [];
  const testimonials = detail.testimonials ?? [];
  const faqTabs = detail.faqTabs ?? [];
  const faqItems = detail.faqItems ?? [];

  return (
    <>
      <section className="position-relative pt-2 purple-event-hero program-full-hero">
        <div className="container">
          <div className="pgs-programsfull__hero">
            <div className="pgs-programsfull__hero-meta">
              <div className="pgs-programsfull__partner-logo">
                <span className="pgs-programsfull__corner" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detail.partnerLogo} alt="" />
              </div>
              <div>
                <div className="pgs-programsfull__meta-item">
                  <span className="pgs-programsfull__meta-label">Type</span>
                  <span className="pgs-programsfull__meta-value">
                    {detail.programType || "Certificate"}
                  </span>
                </div>
                <div className="pgs-programsfull__meta-item">
                  <span className="pgs-programsfull__meta-label">Duration</span>
                  <span className="pgs-programsfull__meta-value">
                    {detail.duration || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pgs-programsfull__hero-media">
              {detail.badge ? (
                <div
                  className="pgs-programsfull__filling"
                  style={badgeChipStyle(detail.badgeColor, detail.badgeTextColor)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={detail.badgeIcon || DEFAULT_COURSE_BADGE_ICON}
                    alt=""
                  />
                  {detail.badge}
                </div>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={detail.image} alt="" />
            </div>

            <div className="pgs-programsfull__hero-body">
              <div className="pgs-programsfull__hero-top">
                {detail.mode ? (
                  <span className="pgs-programsfull__mode">{detail.mode}</span>
                ) : null}
                <span className="pgs-programsfull__share" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/share.png" alt="" />
                </span>
              </div>

              <div className="pgs-programsfull__title-box">
                <span className="pgs-programsfull__corner" aria-hidden />
                <h1>{detail.title}</h1>
              </div>

              {detail.shortDescription ? (
                <CmsHtml
                  as="div"
                  className="pgs-programsfull__intro"
                  html={detail.shortDescription}
                />
              ) : null}

              <div className="pgs-programsfull__dates-row">
                <div className="pgs-programsfull__dates">
                  <div className="pgs-programsfull__date-cards">
                    <DateCard
                      day={detail.start?.day ?? "--"}
                      month={detail.start?.month ?? ""}
                    />
                    <DateCard
                      day={detail.end?.day ?? "--"}
                      month={detail.end?.month ?? ""}
                    />
                  </div>
                  {sessionTime ? (
                    <div className="pgs-programsfull__date-times">
                      <span>{sessionTime}</span>
                      <span>{sessionTime}</span>
                    </div>
                  ) : null}
                </div>
                <div className="pgs-programsfull__headline-col">
                  <CmsHtml
                    as="div"
                    className="pgs-programsfull__headline"
                    html={detail.headline || " "}
                  />
                  {detail.heroNote ? (
                    <CmsHtml
                      as="div"
                      className="pgs-programsfull__hero-note"
                      html={detail.heroNote}
                    />
                  ) : null}
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="pgs-programsfull__tags">
                  {tags.map((tag) => (
                    <span className="pgs-programsfull__tag" key={tag}>
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              ) : null}

              {detail.bookingUrl ? (
                <a
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pgs-programsfull__book"
                >
                  Book Your Seat
                </a>
              ) : (
                <span className="pgs-programsfull__book">Book Your Seat</span>
              )}

              {detail.location ? (
                <p className="pgs-programsfull__location">
                  📍{detail.location}
                </p>
              ) : null}
            </div>
          </div>

          <div className="pgs-programsfull__split">
            <div className="pgs-programsfull__split-col">
              <h3 className="pgs-programsfull__green-title">
                {pageLabel(detail, "whoFor")}
              </h3>
              <GreenLines
                lines={whoLines}
                fallback={
                  detail.whoFor ||
                  "Students and professionals building practical, career-ready skills."
                }
              />
            </div>
            <div className="pgs-programsfull__split-col">
              <h3 className="pgs-programsfull__green-title">
                {pageLabel(detail, "programTopics")}
              </h3>
              <GreenLines
                lines={topics}
                fallback="Key topics covered in this program."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-1">
        <div className="container">
          <div className="pgs-programsfull__desc">
            <div className="pgs-programsfull__desc-inner">
              <div className="pgs-programsfull__desc-label">
                <span className="pgs-programsfull__desc-icon" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/programsfull/desc-icon-glyph.svg"
                    alt=""
                  />
                </span>
                <h4>
                  <LabelWithBreaks
                    text={pageLabel(detail, "programDescription")}
                  />
                </h4>
              </div>
              <CmsHtml
                as="div"
                className="pgs-programsfull__desc-body"
                html={
                  detail.description ||
                  detail.shortDescription ||
                  "Program information is published from the PurpleGuide catalog."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {highlights.length > 0 ? (
        <section className="mobile-box-4 mobile-box-style-2 mobile-pt-2">
          <div className="container">
            <div className="pgs-programsfull__highlights-wrap">
              <h2>{pageLabel(detail, "highlights")}</h2>
              <div className="pgs-programsfull__highlights">
                {highlights.map((item, i) => (
                  <div
                    className="pgs-programsfull__highlight"
                    key={`hl-${i}`}
                  >
                    <div className="pgs-programsfull__highlight-num">
                      <span className="pgs-programsfull__highlight-icon" aria-hidden>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/programsfull/highlight-icon-glyph.svg"
                          alt=""
                        />
                      </span>
                      <h4>{String(i + 1).padStart(2, "0")}</h4>
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {benefits.length > 0 ? (
        <section className="pt-4">
          <div className="container">
            <div className="pgs-programsfull__benefits">
              <div className="pgs-programsfull__split-col">
                <div className="pgs-programsfull__green-block">
                  <LabelWithBreaks
                    text={
                      detail.benefitsAside || pageLabel(detail, "benefitsAside")
                    }
                  />
                </div>
              </div>
              <ul className="pgs-programsfull__benefits-list">
                {benefits.map((item, i) => (
                  <li key={`benefit-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/flat-color-icons_ok.png" alt="" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="pt-2">
        <div className="container">
          <div className="pgs-programsfull__brochure">
            <div>
              <h3>
                {detail.brochureTitle || pageLabel(detail, "brochureTitle")}
              </h3>
              <p>
                {detail.brochureBody || pageLabel(detail, "brochureBody")}
              </p>
              {detail.brochureUrl ? (
                <a
                  href={detail.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pgs-programsfull__brochure-btn"
                >
                  Download Here
                </a>
              ) : (
                <span className="pgs-programsfull__brochure-btn">
                  Download Here
                </span>
              )}
            </div>
            <div className="pgs-programsfull__brochure-badge" aria-hidden>
              <span className="pgs-programsfull__brochure-badge-icon">文A</span>
              <span>{detail.brochureBadge || "Duolingo enthusiast"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Awarding body — Figma / OG overlapping layout */}
      <section className="pgs-programsfull__awarding pt-5 pb-5">
        <div className="container">
          <div className="pgs-programsfull__awarding-inner">
            <div className="pgs-programsfull__awarding-head">
              <h2 className="pgs-programsfull__awarding-title">
                {pageLabel(detail, "awarding")}
              </h2>
              <CmsHtml
                as="p"
                className="pgs-programsfull__awarding-intro"
                html={detail.awardingBodyIntro}
              />
            </div>

            <div className="pgs-programsfull__awarding-stage">
              <div className="pgs-programsfull__awarding-left">
                <div className="pgs-programsfull__awarding-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.partnerLogo} alt="" />
                </div>
                {facts.map((fact, i) => (
                  <div
                    key={`fact-${i}`}
                    className="pgs-programsfull__awarding-fact"
                  >
                    <h4>{fact.title}</h4>
                    {fact.body ? <p>{fact.body}</p> : null}
                  </div>
                ))}
              </div>

              <div className="pgs-programsfull__awarding-right">
                <div className="pgs-programsfull__awarding-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.awardingBodyImage} alt="" />
                </div>

                <div className="pgs-programsfull__awarding-below">
                  <div className="pgs-programsfull__rankings">
                    <h4>{pageLabel(detail, "rankings")}</h4>
                    <CmsHtml
                      as="div"
                      className="pgs-programsfull__rankings-body"
                      html={detail.awardingBodyRankings}
                    />
                  </div>
                  <div className="pgs-programsfull__accreditation">
                    <h4>
                      <LabelWithBreaks
                        text={pageLabel(detail, "accreditation")}
                      />
                    </h4>
                    <div className="pgs-programsfull__accreditation-logos">
                      {accreditationLogos.map((src, i) => (
                        <div
                          className="pgs-programsfull__accreditation-logo"
                          key={`acc-${i}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to apply — OG program-detail layout */}
      <section className="pgs-programsfull__apply pt-5">
        <div className="container">
          <div className="pgs-programsfull__apply-inner">
            <h4 className="pgs-programsfull__apply-title">
              {pageLabel(detail, "howToApply")}
            </h4>
            <CmsHtml
              as="p"
              className="pgs-programsfull__apply-intro"
              html={detail.applyIntro}
            />
            <h4 className="pgs-programsfull__eligibility-label">
              {pageLabel(detail, "eligibility")}
            </h4>
            <div className="pgs-programsfull__eligibility">
              {eligibility.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="pgs-programsfull__apply-options">
              <div className="pgs-programsfull__option-row">
                <div className="pgs-programsfull__option-num">
                  Option
                  <span>1</span>
                </div>
                <div className="pgs-programsfull__option-step">
                  <h5>Submit Application</h5>
                  <p>
                    Fill the form in the course intro button or{" "}
                    <a href={bookHref}>apply here</a>
                  </p>
                </div>
                <span className="pgs-programsfull__option-arrow" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/arrow-left-2.png" alt="" width={30} />
                </span>
                <div className="pgs-programsfull__option-step">
                  <h5>Follow up</h5>
                  <p>Get on a call with our counselor &amp; clear doubts.</p>
                </div>
                <span className="pgs-programsfull__option-arrow" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/arrow-left-2.png" alt="" width={30} />
                </span>
                <div className="pgs-programsfull__option-step">
                  <h5>Get Payment Link</h5>
                  <p>Complete the payment, and get the welcome email</p>
                </div>
              </div>

              <div className="pgs-programsfull__option-row pgs-programsfull__option-row--simple">
                <div className="pgs-programsfull__option-num">
                  Option
                  <span>2</span>
                </div>
                <div className="pgs-programsfull__option-step pgs-programsfull__option-step--wide">
                  <h5>Pay via the enroll button</h5>
                  <p>
                    Skip the wait — pay directly in the Program Fee section{" "}
                    <a href="#enrollment-fee">below</a> to enroll and get your
                    welcome email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate — Figma Frame 1000006723 */}
      <section className="pgs-programsfull__cert pt-5">
        <div className="container">
          <div className="pgs-programsfull__cert-box">
            <div className="pgs-programsfull__cert-copy">
              <h2 className="pgs-programsfull__cert-heading">
                {detail.certificateHeading}
              </h2>
              <h3 className="pgs-programsfull__cert-why">
                {pageLabel(detail, "whyItMatters")}
              </h3>
              <ul className="pgs-programsfull__check-list">
                {certificateWhy.map((item, i) => (
                  <li key={`why-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/programsfull/check-ok.svg"
                      alt=""
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pgs-programsfull__cert-mock">
              <div className="pgs-programsfull__cert-mock-head">Certificate</div>
              <div className="pgs-programsfull__cert-mock-body">
                <h4 className="pgs-programsfull__cert-program">Program Title</h4>
                <div className="pgs-programsfull__cert-row">
                  <div className="pgs-programsfull__cert-field">
                    <span className="pgs-programsfull__cert-label">Name</span>
                    <div className="pgs-programsfull__cert-input">Your Name</div>
                  </div>
                  <div className="pgs-programsfull__cert-field">
                    <span className="pgs-programsfull__cert-label">Date</span>
                    <div className="pgs-programsfull__cert-input">
                      Date Of Program
                    </div>
                  </div>
                </div>
                <div className="pgs-programsfull__cert-field pgs-programsfull__cert-field--wide">
                  <span className="pgs-programsfull__cert-label">
                    Awarding Body
                  </span>
                  <div className="pgs-programsfull__cert-input">
                    {"/* Awarding Body Name */"}
                  </div>
                </div>
                <div className="pgs-programsfull__cert-footer" aria-hidden />
                <div className="pgs-programsfull__cert-seal-wrap" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/gold-sticker.png"
                    alt=""
                    className="pgs-programsfull__cert-seal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #higlights — Figma Frame 427319613 */}
      <section className="pgs-programsfull__gallery pt-5">
        <div className="pgs-programsfull__gallery-bleed">
          <div className="pgs-programsfull__gallery-layout">
            <div className="pgs-programsfull__gallery-copy">
              <h3 className="pgs-programsfull__gallery-title">
                {detail.galleryTitle}
              </h3>
              <p className="pgs-programsfull__gallery-blurb">
                {detail.galleryBlurb}
              </p>
              <p className="pgs-programsfull__gallery-loc">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/programsfull/pin.svg" alt="" />
                {detail.galleryLocation}
              </p>
              <p className="pgs-programsfull__gallery-body">
                {detail.galleryBody}
              </p>
            </div>
            <GalleryTrack images={galleryImages} />
          </div>
        </div>
      </section>

      {/* Enrollment fee */}
      <section className="pgs-programsfull__fee pt-5" id="enrollment-fee">
        <div className="container">
          <div className="pgs-programsfull__fee-card">
            <div className="pgs-programsfull__fee-head">
              <h1 className="fnt-family text-black fs-48 mb-0">
                {pageLabel(detail, "enrollmentFee")}
              </h1>
              <p className="text-black fs-24 lh-32 mb-0">{detail.feeSubtitle}</p>
            </div>
            <div className="pgs-programsfull__fee-price">
              <div>
                <h2 className="mb-2 text-white fs-40 fw-800">
                  {detail.feeAmount}
                </h2>
                {detail.bookingUrl ? (
                  <a
                    href={detail.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-purple2 text-black fw-500 fs-19"
                  >
                    Enroll Now
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-purple2 text-black fw-500 fs-19"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
              <div>
                {detail.feeBadge ? (
                  <h5 className="pgs-programsfull__fee-badge">
                    {detail.feeBadge}
                  </h5>
                ) : null}
                {detail.feeNote ? (
                  <h6 className="fs-16 lh-25 text-white mb-0">
                    {detail.feeNote}
                  </h6>
                ) : null}
              </div>
            </div>
            <h3 className="mb-2 fs-28 mt-3 fnt-family text-black px-3">
              course breakdowns:
            </h3>
            <div className="pgs-programsfull__fee-breakdown">
              <ul className="pgs-programsfull__check-list">
                {feeLeft.map((item, i) => (
                  <li key={`fl-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/flat-color-icons_ok.png" alt="" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <ul className="pgs-programsfull__check-list">
                  {feeRight.map((item, i) => (
                    <li key={`fr-${i}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/flat-color-icons_ok.png" alt="" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pgs-programsfull__fee-extras">
                  {detail.otherExpenseAmount ? (
                    <div className="pgs-programsfull__fee-extra">
                      <h4>Other expenses (optional)</h4>
                      <div className="pgs-programsfull__fee-extra-box">
                        <span>{detail.otherExpenseLabel}</span>
                        <div className="pgs-programsfull__fee-extra-price">
                          <strong>{detail.otherExpenseAmount}</strong>
                          <em>*approx</em>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {detail.paymentMethods ? (
                    <div className="pgs-programsfull__fee-extra">
                      <h4>Payment Methods</h4>
                      <div className="pgs-programsfull__fee-extra-box">
                        <span>{detail.paymentMethods}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learner testimonials */}
      <section className="pgs-programsfull__learners pt-5">
        <div className="container">
          <div className="text-center">
            <h4 className="pgs-programsfull__learners-title text-black fs-25 fw-500 mb-1">
              {pageLabel(detail, "learners")}
            </h4>
            <CmsHtml
              as="p"
              className="text-center text-black w-60 m-auto fs-16 lh-22"
              html={detail.learnersIntro}
            />
          </div>
          <div className="pgs-programsfull__learners-grid mt-4">
            {testimonials.map((t, i) => (
              <article className="pgs-programsfull__learner-card" key={`t-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} />
                <div className="pgs-programsfull__learner-body">
                  <span className="pgs-programsfull__quote-mark" aria-hidden>
                    ”
                  </span>
                  <p>{t.quote}</p>
                  <div>
                    <h6>{t.name}</h6>
                    <p>
                      {t.role}
                      {t.location ? ` · ${t.location}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        tabs={faqTabs}
        items={faqItems}
        title={pageLabel(detail, "faq")}
      />

      <section className="pt-2 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <a
                href="/purpleboard"
                className="sop-learn-btn bg-blue-500 fw-600 text-black border-radius-4px py-2 px-4 text-decoration-none d-inline-block"
              >
                ← Back to Purple Board
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Standalone course detail — Figma # programs full / OG program-detail */
export function CourseDetailPage({ courseId, detail: detailProp }: Props) {
  const detail =
    detailProp ??
    (courseId ? emptyCourseDetail(courseId) : COURSE_PAGE_MOCK);

  return (
    <div className="wrapper-content pgs-programsfull">
      <CourseDetailBody detail={detail} />
    </div>
  );
}
