"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import { UPCOMING_SESSIONS } from "@/features/purpleevents/content";
import {
  DEADLINE_LEFT,
  DEADLINE_RIGHT,
  FACT_SLIDES,
  FAQ_ITEMS,
  FAQ_TABS,
  KEY_DATE_GROUPS,
  LAST_UPDATED,
  STATS_BLOCKS,
} from "./content";

function DeadlineColumn({
  rows,
}: {
  rows: readonly { date: string; text: string }[];
}) {
  return (
    <div className="w-50 mobile-w-full">
      <h5 className="d-flex gap-5 text-white border-bottom py-3 mb-3 align-items-center">
        <div className="w-35">
          <h5 className="mb-0 fs-22 lh-28">Date</h5>
        </div>
        <div className="w-65">
          <h5 className="mb-0 fs-22 lh-28">What’s Happening</h5>
        </div>
      </h5>
      <ul className="text-white p-0 m-0 px-1 pt-0 m-auto">
        {rows.map((row, i) => (
          <li
            className={`d-flex gap-5 align-items-center ${
              i === rows.length - 1 ? "py-3" : "border-bottom py-3"
            }`}
            key={`${row.date}-${i}`}
          >
            <div className="w-35">
              <h5 className="mb-0 fs-19 lh-20 mobile-fs-14 mobile-lh-16">
                {row.date}
              </h5>
            </div>
            <div className="w-65">
              <h5 className="mb-0 fs-14 lh-20 fs-500">{row.text}</h5>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FactsCarousel({
  slides,
}: {
  slides?: readonly (readonly string[])[];
}) {
  const [index, setIndex] = useState(0);
  const source =
    slides && slides.length > 0
      ? slides
      : (FACT_SLIDES as unknown as string[][]);
  const facts = source[index] ?? source[0] ?? [];
  const len = Math.max(1, source.length);

  return (
    <section className="pt-3 pb-0">
      <style>{`
        .study-abroad-fact-content ul,
        .study-abroad-fact-content ol {
          display: block;
          list-style-position: outside;
          padding-left: 1.35rem;
          margin: 0 0 0.5rem 0;
        }
        .study-abroad-fact-content li {
          display: list-item;
          margin-bottom: 0.5rem;
          line-height: 1.45;
        }
      `}</style>
      <div className="container">
        <div className="row justify-content-center">
          <div className="w-80">
            <div className="d-flex gap-3 align-items-start">
              <div className="upcoming-swiper bottom-scrolling-swiper-section d-flex justify-content-center justify-content-xl-start flex-column gap-3">
                <button
                  type="button"
                  className="slider-one-slide-prev-3 text-dark-gray swiper-button-prev slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                  onClick={() => setIndex((i) => (i - 1 + len) % len)}
                  aria-label="Previous facts"
                >
                  <i className="fa-solid fa-arrow-left" />
                </button>
                <button
                  type="button"
                  className="slider-one-slide-next-3 text-dark-gray swiper-button-next slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                  onClick={() => setIndex((i) => (i + 1) % len)}
                  aria-label="Next facts"
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
              <div className="yellow-box-style-3 mb-90 w-100">
                <div className="header-yellow-box-style-3 d-flex align-items-center mb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/bell.gif"
                    className="w-10 mobile-w-30"
                    alt=""
                  />
                  <h2 className="fnt-family mb-0 fs-36 mobile-fs-24 mobile-lh-full mobile-font-normal mobile-w-50">
                    Study Abroad Facts You Probably Didn’t Know
                  </h2>
                </div>
                <div className="study-abroad-fact-content px-5 w-100 m-auto pt-0 fs-14 lh-20 fw-500">
                  <ol className="px-5 w-90 m-auto pt-0">
                    {facts.map((fact, i) => (
                      <li
                        className="w-100 fs-14 lh-20 fw-500 pb-2"
                        style={{
                          borderBottom: "1px solid gray",
                          padding: "7px 5px",
                          color: "black",
                        }}
                        key={`${index}-${i}`}
                      >
                        {fact}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqBlock({ faqs }: { faqs?: { q: string; a: string }[] }) {
  const [tab, setTab] = useState<(typeof FAQ_TABS)[number]["id"]>("tab_1");
  const [openQ, setOpenQ] = useState(0);
  const items = faqs && faqs.length > 0 ? faqs : [...FAQ_ITEMS];

  return (
    <section>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <h5 className="text-black fs-25 mb-4">Frequently Asked Questions</h5>
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
                          href={`#resources-${t.id}`}
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
                      {items.map((item, i) => {
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
                                href={`#resources-faq-${i}`}
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
                                  <p className="fw-400">{item.a}</p>
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

/**
 * Student Resources — from standalone-html/studentresources.html
 */
export function StudentResourcesPage({
  keyDateGroups,
  deadlineLeft,
  deadlineRight,
  statsBlocks,
  factSlides,
  faqs,
}: {
  keyDateGroups?: {
    month: string;
    items: {
      title: string;
      tags: string[];
      day: string;
      month: string;
      year: string;
      href: string;
    }[];
  }[];
  deadlineLeft?: readonly { date: string; text: string }[];
  deadlineRight?: readonly { date: string; text: string }[];
  statsBlocks?: readonly { title: string; rows: readonly string[] }[];
  factSlides?: readonly (readonly string[])[];
  faqs?: { q: string; a: string }[];
} = {}) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const dateGroups =
    keyDateGroups && keyDateGroups.length > 0
      ? keyDateGroups
      : KEY_DATE_GROUPS;
  const left =
    deadlineLeft && deadlineLeft.length > 0 ? deadlineLeft : DEADLINE_LEFT;
  const right =
    deadlineRight && deadlineRight.length > 0
      ? deadlineRight
      : DEADLINE_RIGHT;
  const stats =
    statsBlocks && statsBlocks.length > 0 ? statsBlocks : STATS_BLOCKS;

  function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMsg("Please enter a valid email.");
      return;
    }
    setMsg("You're subscribed. We'll keep you posted.");
    setEmail("");
  }

  return (
    <div className="wrapper-content">
      <section className="pt-0 overlap-height position-relative scale-down minus-5 mobile-section-step hero-student-resource mobile-pb-0">
        <div className="container overlap-gap-section p-0 pt-3">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h6 className="mb-3 text-black fs-24 mt-0 w-70 lh-35">
                Stay updated with the latest deadlines, exam dates, and <br />{" "}
                exclusive events organized by #PGS <b>#PGS</b>
              </h6>
              <div className="border-box-gradiant mb-10">
                <div className="card-box-img bg-gray ">
                  <div className="fit-object-cover-2 border-radius-10px">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/fit-student-hero-desk.png"
                      className="border-radius-10px"
                      alt=""
                    />
                  </div>
                  <div className="pt-3 d-flex justify-content-space align-items-start px-3">
                    <div>
                      <h4 className="fnt-family mb-1 mt-3 fs-96 text-black lh-80 fw-400">
                        Student Resources&nbsp;
                        <br />
                        &amp; Event
                        <span className="fnt-family fs-40">updates</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 studentResource">
        <div className="container-fluid overlap-gap-section px-5">
          <div className="row justify-content-center">
            <div className="col-lg-12 p-0">
              <div className="card-box-100 py-5 position-relative px-3">
                <div className="d-flex gap-3 mobile-wrap">
                  <div className="w-23 mobile-w-full">
                    <div className="text-center">
                      <h5 className="mb-0 fs-16 text-black">{LAST_UPDATED}</h5>
                      <h3 className="p-1 fnt-family bg-white text-black d-inline-block fs-38">
                        Upcoming Key Dates
                      </h3>
                    </div>
                  </div>
                  {dateGroups.map((group) => (
                    <div className="w-30 mobile-w-full" key={group.month}>
                      <div className="d-flex gap-3 align-items-start">
                        <h4 className="mb-0 fnt-family text-black top-0 text-nowrap fs-38">
                          {group.month}
                        </h4>
                        <div className="w-100">
                          {group.items.map((item) => (
                            <div
                              className="d-flex gap-2 mb-4"
                              key={`${group.month}-${item.title}`}
                            >
                              <div className="border-gray px-2 py-2 border-radius-15px w-270px">
                                <h5 className="bg-yellow text-black p-2 text-uppercase fs-22 mb-0 lh-30 d-inline">
                                  {item.title}
                                </h5>
                                <div className="sop-tags">
                                  {item.tags.map((tag) => (
                                    <span className="sop-tag" key={tag}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="w-25">
                                <h4 className="mb-0 fnt-family text-black fs-25 lh-25">
                                  {item.day} <br /> {item.month} <br />{" "}
                                  {item.year}
                                </h4>
                                <a
                                  href={item.href}
                                  className="bg-yellow p-5 text-underline text-black fs-16"
                                  target={
                                    item.href.startsWith("http")
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    item.href.startsWith("http")
                                      ? "noreferrer"
                                      : undefined
                                  }
                                >
                                  link
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-3">
        <div className="container-fluid overlap-gap-section px-5">
          <div className="row justify-content-center">
            <div className="col-lg-12 p-0">
              <div className="bg-red border-radius-20px p-4 pb-5">
                <div className="text-start w-20 text-white m-auto mb-5 mobile-w-50 mobile-mb-0">
                  <p className="mb-0 fs-22">urgent</p>
                  <h1 className="mb-0 fs-36">Deadlines &amp; Updates</h1>
                </div>
                <div className="d-flex gap-4 align-items-start mobile-wrap">
                  <DeadlineColumn rows={left} />
                  <DeadlineColumn rows={right} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FactsCarousel slides={factSlides} />

      <section className="pt-3 mobile-event-program">
        <div className="container px-5">
          <div className="row mt-3 justify-content-start fix-box-design">
            <div className="col-lg-12">
              <h5 className="mb-0 fs-36 text-black fnt-family mobile-fs-24 mobile-lh-full mobile-w-42 mobile-auto mobile-pb-4">
                #Purple Events &amp; Other Programs
              </h5>
            </div>
            {UPCOMING_SESSIONS.slice(0, 6).map((session) => (
              <div
                className="col-lg-4 col-sm-12 mt-1 col-md-4 position-relative mobile-w-50"
                key={`res-${session.id}`}
              >
                <div className="sop-card-unique left-13 border-none border-radius-20px">
                  <div className="sop-top-label h-30px">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/red-hours.gif" alt="" />
                    Filling Fast
                  </div>
                  <div className="sop-start-free bg-purple-set fs-9">
                    {session.mode ?? "#inCampus"}
                  </div>
                  <div className="sop-image-wrapper-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.image}
                      alt={session.title}
                      className="big_img"
                    />
                    <div className="sop-heart-icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/share.png" width={20} alt="" />
                    </div>
                    <div className="event-author-info">
                      <h5 className="fs-16 text-black mb-0">
                        {session.author ?? "Upcoming"}
                      </h5>
                      <p className="fs-12 mb-0 lh-15">Upcoming session</p>
                    </div>
                  </div>
                  <div className="sop-content card-box-date">
                    <div className="date-box bg-transparent">
                      <div>
                        <div className="box-date-info bg-black">
                          <span className="date text_purple">
                            {session.start.day}
                          </span>
                          <span className="month">{session.start.month}</span>
                        </div>
                        <p className="fs-12 fw-600 mb-0 text-black text-center">
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
                        <p className="fs-12 fw-600 mb-0 text-black text-center">
                          {session.end.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="content-wrap mt-4 p-3 pt-0">
                    <div>
                      <h1 className="mb-0 border-black fnt-family px-2 py-2 text-black fs-40 border-radius-4px bg-white d-inline-block">
                        {session.title}
                      </h1>
                    </div>
                    {session.tags ? (
                      <div className="sop-tags px-2 py-2">
                        {session.tags.map((tag) => (
                          <span className="sop-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="content-p">
                      <p className="fs-12 fw-400 mb-0 text-black text-start lh-18">
                        {session.blurb ?? session.whoFor ?? ""}
                      </p>
                    </div>
                    <div className="d-flex justify-content-space">
                      <Link
                        href={`/purpleevents/session/${session.id}`}
                        className="sop-learn-btn bg-blue-500 mt-4 fs-12 text-decoration-none text-black d-inline-flex align-items-center justify-content-center"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-3">
        <div className="container">
          <div className="row mt-3 justify-content-center">
            <div className="col-lg-11">
              <div className="bg-gray-100 border-radius-15px p-3 pt-5">
                <div className="d-flex gap-2 align-items-start w-70 m-auto mobile-wrap mobile-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/ball.png"
                    width={84}
                    height={84}
                    alt=""
                  />
                  <div className="text-black pt-1 w-100">
                    <h1 className="mb-0 fnt-family fs-36">
                      Never Miss an Important Deadline
                    </h1>
                    <h6 className="fs-16 lh-20 mb-0 mt-1 fw-500">
                      Subscribe to our deadline alerts and event notifications.
                      <br />
                      Get personalized reminders delivered straight to your
                      inbox.
                    </h6>
                    <form
                      className="group-inpur-border mt-3"
                      onSubmit={onSubscribe}
                    >
                      <input
                        type="email"
                        className="ht-55px border-liner placeholder-text bg-transparent px-2 py-1 fs-30 text-black text-center"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="btn border-liner bg-white w-100 px-2 py-2 fs-20 text-black text-captilize mt-3 ht-55px"
                      >
                        Subscribe{" "}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/right-arrow-button.png"
                          style={{ width: 35 }}
                          alt=""
                        />
                      </button>
                      {msg ? (
                        <p className="fnt-family-1 mb-0 text-center mt-4 fs-12 lh-20">
                          {msg}
                        </p>
                      ) : null}
                      <p className="fnt-family-1 mb-0 text-center mt-2 fs-12 lh-20">
                        Your info stays private. We only use it to reach out,
                        never share it.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-5 position-relative">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <Link
                href="/purplepremiumhome"
                className="card-box-img position-relative p-0 border-radius-10px bg-transparent d-block text-decoration-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/premium-3.png"
                  className="border-radius-10px aspact-rastion-2"
                  alt="Step into purplepremium"
                />
                <div className="position-static-img d-flex">
                  <div className="play-circular-button">
                    <i className="bi bi-play-circle fs-75 text-white" />
                  </div>
                  <h4
                    className="fnt-family fs-75 text-white pb-1 mobile-flot-heading lh-65"
                    style={{ lineHeight: "66px" }}
                  >
                    Step into <br /> #purplepremium
                  </h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <h1 className="text-black fnt-family fs-75">
                <span className="bg-light-green-200 d-block px-2 pt-1 mobile-fs-24 mobile-lh-full mobile-p-2">
                  PGS data and stats
                </span>
              </h1>
              <div className="flex-wrap d-flex gap-4 justify-content-space mobile-wrap">
                {stats.map((block) => (
                  <div
                    className="mb-1 w-45 mobile-w-90 mobile-auto mobile-pb-10"
                    key={block.title}
                  >
                    <h6 className="text-black fnt-family mb-1 fs-38 mobile-fs-20 mobile-lh-full mobile-pb-2">
                      {block.title}
                    </h6>
                    <table className="table-custom-border">
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row}>
                            <td>
                              <span className="icon-box">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="/assets/img/icon-traingal.png"
                                  alt=""
                                />
                              </span>
                            </td>
                            <td>{row}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqBlock faqs={faqs} />
      <PgsPicksSection />
    </div>
  );
}
