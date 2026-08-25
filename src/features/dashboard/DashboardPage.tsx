"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BumpPremiumModal,
  UNLOCK_BUMP_CONFIG,
} from "@/components/BumpPremiumModal";
import { SoftLock } from "@/components/SoftLock";
import { DEFAULT_AVATAR, useExperience } from "@/lib/auth/experience";
import {
  DOC_TRACKER,
  FINALIZED_UNIS,
  FUTURE_TASKS,
  GUEST_PROFILE,
  ONBOARDING_CHECKS,
  SHORTLIST,
  TOP_PICKS,
  UPCOMING_EVENTS,
  WORKING_ON,
  type FeedUpcomingEvent,
} from "./content";
import { CommentsSection } from "./CommentsSection";
import "./dashboard.css";

const CHIP_LIMIT = 3;

function fallbackFeedEvents(): FeedUpcomingEvent[] {
  return UPCOMING_EVENTS.map((ev, i) => ({
    id: `static-${i}`,
    title: "title" in ev ? ev.title : `${ev.titleLines[0]} ${ev.titleLines[1]}`,
    date: ev.date,
    time: ev.time,
    blurb: ev.blurb,
    mode: ev.mode,
    startsAt: null,
  }));
}

function FeedMonthCalendar({ events }: { events: FeedUpcomingEvent[] }) {
  const dated = useMemo(
    () =>
      events
        .map((e) => (e.startsAt ? new Date(e.startsAt) : null))
        .filter((d): d is Date => d != null && !Number.isNaN(d.getTime())),
    [events],
  );

  const initial = dated[0] ?? new Date();
  const [cursor, setCursor] = useState(
    () => new Date(initial.getFullYear(), initial.getMonth(), 1),
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor
    .toLocaleString("en-US", { month: "long" })
    .toUpperCase();

  // Monday-first: Mon=0 … Sun=6
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const eventDaySet = useMemo(() => {
    const set = new Set<number>();
    for (const d of dated) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        set.add(d.getDate());
      }
    }
    return set;
  }, [dated, year, month]);

  type Cell = { day: number; inMonth: boolean; hasEvent: boolean };
  const cells: Cell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrev - i,
      inMonth: false,
      hasEvent: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      inMonth: true,
      hasEvent: eventDaySet.has(d),
    });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, inMonth: false, hasEvent: false });
  }

  function shiftMonth(delta: number) {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  return (
    <div
      className="pgs-feed-calendar"
      aria-label={`Calendar for ${monthName} ${year}`}
    >
      <div className="pgs-feed-calendar__switcher">
        <button
          type="button"
          className="pgs-feed-calendar__nav pgs-feed-calendar__nav--prev"
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          ‹
        </button>
        <div className="pgs-feed-calendar__pills">
          <span className="pgs-feed-calendar__pill">{monthName}</span>
          <span className="pgs-feed-calendar__pill">{year}</span>
        </div>
        <button
          type="button"
          className="pgs-feed-calendar__nav pgs-feed-calendar__nav--next"
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
        >
          ›
        </button>
      </div>

      <div className="pgs-feed-calendar__dow">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="pgs-feed-calendar__grid">
        {cells.map((cell, i) => (
          <span
            key={`day-${i}`}
            className={[
              "pgs-feed-calendar__day",
              !cell.inMonth ? "is-outside" : "",
              cell.hasEvent ? "is-event" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {cell.day}
            {cell.hasEvent ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="pgs-feed-calendar__badge"
                src="/assets/img/avatar.png"
                alt=""
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function TopPickItem({
  pick,
}: {
  pick: (typeof TOP_PICKS)[number];
}) {
  return (
    <div className="todo-list">
      <div className="content-todo">
        <h5 className="mb-0"> {pick.title}</h5>
        <span className="todo-tag">{pick.tag}</span>
        <span className="todo-tag-hightlist">
          <span className={`${pick.dot} dot-tag`} />
          {pick.highlight}
        </span>
      </div>
      <div className="img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pick.image} alt="" />
      </div>
    </div>
  );
}

/**
 * Feed / dashboard (Figma #userdashboard):
 * - Home `/` keeps signed-in & premium marketing tops
 * - This page is the actual feed dashboard
 * - anonymous: empty profile + soft-locks, unlock → login
 * - authenticated_standard: profile + soft-locks, unlock → premium modal
 * - authenticated_premium: profile + #PURPLEPREMIUM badge, unlocked
 */
export function DashboardPage({
  upcomingEvents,
}: {
  upcomingEvents?: FeedUpcomingEvent[];
} = {}) {
  const { isLoggedIn, isPremium, fullName, avatarUrl, email, pgsCode } =
    useExperience();
  const router = useRouter();
  const [unlockOpen, setUnlockOpen] = useState(false);

  const feedEvents =
    upcomingEvents && upcomingEvents.length > 0
      ? upcomingEvents
      : fallbackFeedEvents();
  const chipEvents = feedEvents.slice(0, CHIP_LIMIT);
  const moreCount = Math.max(0, feedEvents.length - CHIP_LIMIT);

  const locked = !isPremium;
  const displayName = isLoggedIn
    ? fullName?.trim() || "Student"
    : GUEST_PROFILE.name;
  const displayHandle = isLoggedIn
    ? email
      ? `@${email.split("@")[0]}`
      : ""
    : GUEST_PROFILE.handle;
  const displayId = isLoggedIn ? pgsCode || "" : "";
  const displayAvatar = isLoggedIn
    ? avatarUrl || DEFAULT_AVATAR
    : GUEST_PROFILE.avatar;
  const pathway = GUEST_PROFILE.pathway;
  const premiumLabel = GUEST_PROFILE.premiumLabel;

  function openUnlock() {
    if (!isLoggedIn) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    setUnlockOpen(true);
  }

  const unlockBadge = (
    <h4 className="mb-0" style={{ cursor: "pointer" }}>
      {isLoggedIn ? (
        <button
          type="button"
          className="text-black text-decoration-none bg-transparent border-0 text-start p-0"
          onClick={openUnlock}
        >
          Yet to <br /> Unlock Full <br /> Access
        </button>
      ) : (
        <Link
          href="/login?redirect=/dashboard"
          className="text-black text-decoration-none"
        >
          Yet to <br /> Unlock Full <br /> Access
        </Link>
      )}
    </h4>
  );

  return (
    <div className="wrapper-content">
      <section className="pt-0 mobile-student-cart about-section half-section overlap-height position-relative pgs-dashboard-feed pgs-identity-card">
        <div className="pgs-dashboard-feed-inner">
        <div className="w-729px p-0">
          <div className="card-box-avatar">
            {isLoggedIn ? (
              <div className="avatar-info position-relative">
                <div className="avatar-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayAvatar}
                    alt=""
                    className="border-radius-6px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="avatar_name">
                    <h5 className="mb-3">{displayName}</h5>
                    {displayHandle ? <span>{displayHandle}</span> : null}
                    {displayId ? <span>id: {displayId}</span> : null}
                  </div>
                </div>
                <div className="title-info">
                  <h5 className="mb-0">{premiumLabel}</h5>
                  <h6 className="mb-0">{pathway}</h6>
                </div>
              </div>
            ) : (
              <div className="avatar-info position-relative" aria-hidden />
            )}
            <div
              className={`avatar-heading-right-box${
                isPremium ? "" : " justify-content-start"
              }`}
              style={isPremium ? undefined : { paddingLeft: 10 }}
            >
              {isPremium ? (
                <h4 className="mb-0">#PURPLEPREMIUM</h4>
              ) : (
                unlockBadge
              )}
            </div>
          </div>
        </div>

        <div className="container overlap-gap-section p-0">
          <div className="row align-items-start mt-4">
            <div className="w-616px">
              <div className="group-todo-list new-mobile-todo-list desktop-none">
                <div className="top-todo-list toggle-todo">
                  <div className="d-flex justify-content-space">
                    <h4 className="mb-0 fs-20 text-black mt-0 mobile-fs-12">
                      Top picks &nbsp;&nbsp;&gt;
                    </h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/filter-icon.png" alt="" />
                  </div>
                </div>
                <div className="body-of-todo">
                  {TOP_PICKS.map((pick, i) => (
                    <TopPickItem key={`m-${i}`} pick={pick} />
                  ))}
                </div>
              </div>

              <div className="card-overview">
                <h5 className="text-black text-center fs-17 lh-22 fw-600 mb-3 text-uppercase">
                  Your Quick Dashboard overview
                </h5>
              </div>
              <div className="d-flex gap-3 justify-content-space mobile-wrap-2-template position-relative">
                {locked ? (
                  <SoftLock className="lock-box" onUnlock={openUnlock} />
                ) : null}
                <div className="card-fill-box">
                  Uni <br /> Applied
                  <div className="d-flex justify-content-space">
                    <span>|</span>
                    <span>02</span>
                  </div>
                </div>
                <div className="card-fill-box">
                  Offers <br />
                  Received
                  <div className="d-flex justify-content-space">
                    <span>|</span>
                    <span>02</span>
                  </div>
                </div>
                <div className="card-fill-box">
                  Tuition Receipt <br />
                  Uploaded
                  <div className="d-flex justify-content-space">
                    <span>|</span>
                    <label className="toggle-switch">
                      <input type="checkbox" checked readOnly disabled />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
                <div className="card-fill-box">
                  Visa <br />
                  Applied
                  <div className="d-flex justify-content-space">
                    <span>|</span>
                    <label className="toggle-switch">
                      <input type="checkbox" checked readOnly disabled />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3 align-items-start mobile-notes-div">
                <div className="notes-box w-50 d-flex flex-grid pt-3 pb-3 justify-content-center flex-direction-column">
                  <h5 className="mb-2 text-black fs-17 lh-22 fw-600 mobile-fs-14">
                    Notes
                  </h5>
                  <p className="mb-0 text-black fs-14 lh-19 mobile-fs-14">
                    This is the phase where we check your documents, get your
                    applications ready, and start planning your university
                    journey. Got questions or need feedback? Reach out to your
                    counselor anytime—and make sure to join any upcoming
                    sessions we invite you to.
                  </p>
                </div>
                <div className="w-50 position-relative">
                  <div className="mobile-width-set">
                    <div>
                      <h5 className="mb-0 bg-bluey fs-19 lh-19 fw-500 mobile-fs-14">
                        MBA Aspirant @class of 2025
                      </h5>
                    </div>
                    <div className="lh-full">
                      <h6 className="mb-0 bg-dark-pink fs-12 lh-12 ">Gender</h6>
                    </div>
                    <div className="lh-full">
                      <h6 className="mb-0 bg-bluey fs-12 lh-12">Male</h6>
                    </div>
                    <div className="d-flex lh-full align-items-center">
                      <div className="bg-light-yellow-2 w-12-ht-19">
                        <i className="bi bi-ui-radios-grid" />
                      </div>
                      <div className="bg-light-yellow w-12-ht-19">
                        <i className="bi bi-geo-alt-fill" />
                      </div>
                      <h5 className="bg-dark-pink fs-12 lh-12 mb-0">
                        White Town, Pondicherry
                      </h5>
                    </div>
                    <div className="d-flex ht-custom25">
                      <div className="light-gray-bg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/US.png" alt="" />
                      </div>
                      <div className="bg-bluey lh-12">USA</div>
                      <div className="light-gray-bg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/US.png" alt="" />
                      </div>
                      <div className="bg-bluey px-2 lh-12">UK</div>
                    </div>
                  </div>
                  <div>
                    <div className="post-arrow">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/top-down-arrow.png" alt="" />
                      <p className="mb-0 post-arrow-text">
                        <span>See what&apos;s done,</span>
                        <span>what&apos;s in progress,</span>
                        <span>and what&apos;s coming next.</span>
                      </p>
                    </div>
                    <Link
                      href="/feed_track_progress"
                      className="btn-progress mobile-top-space text-white text-center"
                    >
                      Track Your Progress
                    </Link>
                    <Link
                      href="/purpleboard"
                      className="btn-progress text-white text-center"
                    >
                      #purpleBoard
                    </Link>
                    <div className="post-arrow-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/left-right.png" alt="" />
                      <p className="mb-0 post-arrow-text">
                        <span>Get the latest on scholarships,</span>
                        <span>newly opened courses, and</span>
                        <span>important updates, all in one</span>
                        <span>place.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-303px p-0">
              <div className="group-todo-list mobile-none">
                <div className="top-todo-list">
                  <div className="d-flex justify-content-space">
                    <h4 className="mb-0 fs-20 text-black lh-20 mt-2">
                      Top picks &nbsp;&nbsp;&gt;
                    </h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/filter-icon.png" alt="" />
                  </div>
                  <hr />
                  {TOP_PICKS.map((pick, i) => (
                    <TopPickItem key={`d-${i}`} pick={pick} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </section>

      <div className="w-841px m-auto">
        {locked ? (
          <section className="dashboard-lock-action">
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/lock-border.png"
                    className="w-60"
                    style={{ marginBottom: -20 }}
                    alt=""
                  />
                  <h4 className="text-red text-uppercase fnt-family fs-75 mb-0">
                    no
                  </h4>
                  <p className="fs-19 lh-20 text-black fnt-family mobile-fs-24 mobile-lh-full mobile-w-60">
                    Don’t get stuck figuring it all out!Get the full dashboard
                    access, mentor support,{" "}
                    <span className="bg-yellow mobile-bg-white">
                      and admissions help
                    </span>
                  </p>
                </div>
                <div className="col-lg-8">
                  <div className="d-flex align-items-start gap-3 mobile-wrap">
                    <div className="w-50 mobile-w-full position-relative">
                      <div className="flot-lock-yes">
                        <h4 className="text-green text-uppercase fnt-family fs-75 mb-0 text-end mobile-none">
                          Yes
                        </h4>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/lock-arrow-down.png"
                          className="m-last d-block mt-1-img mobile-none"
                          alt=""
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/lock-2.png"
                          className="m-last d-block mobile-m-start"
                          alt=""
                        />
                      </div>
                      <div className="desktop-none d-flex gap-2 mobile-pt-4">
                        <h4 className="text-green text-uppercase fnt-family fs-75 mb-0 text-end ">
                          Yes
                        </h4>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/lock-arrow-down-2.png"
                          className="m-last d-block mobile-m-start"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="w-50 mobile-w-full mobile-pt-0">
                      <p className="fs-34 lh-full text-black fnt-family mobile-fs-24 mobile-w-70">
                        Unlock the full dashboard experience{" "}
                        <span className="bg-yellow">with #PurplePremium</span>{" "}
                        we accept only a{" "}
                        <span className="bg-yellow">
                          limited number of seats each month
                        </span>
                        , connect with our Help Hub to get in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="content-report">
          <div>
            <div className="text-center">
              <h2 className="mb-1 fnt-family text-black fs-38 mobile-fs-24">
                Where You Stand
              </h2>
              <p className="mb-3 w-60 fs-16 lh-19 m-auto text-black mobile-fs-14 text-start">
                This is the heart of your study path. This centralized study
                dashboard helps you track onboarding, monitor progress, see key
                milestones, and identify next steps. Designed to keep you on
                track.
              </p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-11 m-auto p-0">
                <div
                  className="card-box-border pb-10 position-relative"
                  style={{ zIndex: locked ? -1 : undefined }}
                >
                  {locked ? (
                    <SoftLock className="lock-box-2" onUnlock={openUnlock} />
                  ) : null}
                  <div className="d-flex gap-4 w-100 justify-content-center mobile-wrap-box-style-4">
                    <div className="w-100px d-flex align-items-center m-auto">
                      <div>
                        <h5 className="fnt-family text-back fs-60 text-black mb-0">
                          14%
                        </h5>
                        <h6 className="mb-0 text-black fs-16 lh-19">
                          through your <br />
                          onboarding <br />
                          journey
                        </h6>
                      </div>
                    </div>
                    <div className="w-40">
                      <div className="checkbox-card">
                        <h5 className="mb-5">Onboarding Checklist </h5>
                        {ONBOARDING_CHECKS.map((item) => (
                          <div
                            className="d-flex align-items-center gap-4 mb-4"
                            key={item.label}
                          >
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                readOnly
                                disabled
                              />
                              <span className="slider" />
                            </label>
                            <span className="w-80 text-start">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-40">
                      <div className="checkbox-card" style={{ height: "60%" }}>
                        <h5 className="mb-5">June feedback session </h5>
                        <div className="d-flex align-items-center gap-4 mb-4">
                          <label className="toggle-switch">
                            <input type="checkbox" readOnly disabled />
                            <span className="slider" />
                          </label>
                          <span className="w-80 text-start">
                            One-on-One Session Booked
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-4 w-100 justify-content-start mt-3 mobile-wrap-box-style-4">
                    <div
                      className="w-100px d-flex align-items-center"
                      style={{ marginLeft: 9, marginRight: -5 }}
                    >
                      <h5 className="fnt-family text-back fs-40 text-black mb-0">
                        Prep Status
                      </h5>
                    </div>
                    <div className="w-264px">
                      <div className="checkbox-card">
                        <h5 className="mb-5">Documents Tracker</h5>
                        {DOC_TRACKER.map((row) => (
                          <div
                            className="d-flex align-items-center gap-2 mb-2"
                            key={row.label}
                          >
                            <h1
                              className={`mb-0 text-black fs-36 fw-500 w-20 lh-40${
                                row.danger ? " text-red" : ""
                              }`}
                            >
                              {row.count}
                            </h1>
                            <span className="w-80 text-start">{row.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-264px">
                      <div
                        className="checkbox-card pbs-100"
                        style={{ height: "90%" }}
                      >
                        <h5 className="mb-5">Uni Shortlist</h5>
                        {SHORTLIST.map((row) => (
                          <div
                            className="d-flex align-items-center gap-2 mb-2"
                            key={row.label}
                          >
                            <h1 className="mb-0 fs-30 fw-500 w-20 text-black">
                              {row.count}
                            </h1>
                            <span className="w-80 text-start">{row.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 p-0 position-relative z-index-2">
                <div
                  className="bg-black d-flex border-radius-20px p-2 custom-mobile-margin"
                  style={{ marginTop: -7 }}
                >
                  <div className="w-25 d-flex align-items-center justify-content-center">
                    <div>
                      <h5 className="fnt-family text-back fs-60 text-white mb-0">
                        06
                      </h5>
                      <h5 className="fnt-family text-back fs-28 lh-24 text-white mb-0 fw-400">
                        Finalized
                        <br /> Uni List
                      </h5>
                    </div>
                  </div>
                  <div className="w-80">
                    <div className="d-flex gap-3 flex-wrap position-relative">
                      {locked ? (
                        <SoftLock className="lock-box" onUnlock={openUnlock} />
                      ) : null}
                      {FINALIZED_UNIS.map((uni, i) => (
                        <div
                          className="card-with-image w-30"
                          key={`${uni.name}-${i}`}
                        >
                          <div className="header-caption">
                            <i className="bi bi-plus-circle-fill" /> {uni.name}
                          </div>
                          <div className="form-image-box position-relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={uni.image} alt="" />
                            <div className="caption--absoulte">{uni.tag}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-11 m-auto p-0">
                <div className="card-box-border pb-5 pt-5 px-5 mobile-flex-boxes">
                  <div className="w-70 position-relative">
                    {locked ? (
                      <SoftLock className="lock-box-3" onUnlock={openUnlock} />
                    ) : null}
                    <div className="d-flex align-items-center mb-4 gap-4">
                      <div className="w-35">
                        <h1 className="mb-0 fnt-family text-black fs-38 lh-32 fw-400 mobile-fs-24 mobile-lh-full">
                          You are <br />
                          Currently <br />
                          Working On
                        </h1>
                      </div>
                      <div className="w-70">
                        <div className="card-white-box-border">
                          {WORKING_ON.map((item, i) => (
                            <div className="list-type" key={`w-${i}`}>
                              {item.badge ? <span>{item.badge}</span> : null}
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <div className="w-35">
                        <h1 className="mb-0 fnt-family text-black fs-38 lh-32 fw-400 mobile-fs-24 mobile-lh-full">
                          Future task{" "}
                          <span style={{ color: "rgba(10, 191, 140, 1)" }}>
                            preview
                          </span>
                        </h1>
                      </div>
                      <div className="w-70">
                        <div className="card-white-box-border">
                          {FUTURE_TASKS.map((item, i) => (
                            <div className="list-type" key={`f-${i}`}>
                              {item.badge ? <span>{item.badge}</span> : null}
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CommentsSection />

        <section className="content-report pt-10">
          <div>
            <div className="text-center">
              <h2 className="mb-4 fnt-family text-black fs-38 heading-up-event mobile-fs-24 mobile-pb-4">
                Upcoming Events
              </h2>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-11 d-flex gap-3 mobile-grid-calendar">
                <div className="w-50">
                  <FeedMonthCalendar events={feedEvents} />
                </div>
                <div className="w-50">
                  <div className="grid-box-style-2">
                    {chipEvents.map((ev) => (
                      <div className="card-box-1" key={ev.id}>
                        <div className="d-flex">
                          <h5>{ev.title}</h5>
                          <h5>{ev.date}</h5>
                          <h5>{ev.time}</h5>
                        </div>
                        {ev.blurb ? (
                          <p className="mb-0 fs-11 lh-full text-black fw-400 lh-new-100 mt-3">
                            {ev.blurb}
                          </p>
                        ) : null}
                        <p className="mb-0 fs-11 lh-full text-black fw-400 lh-full mt-3">
                          <b>Mode:&nbsp;</b>
                          {ev.mode}
                        </p>
                      </div>
                    ))}
                    {moreCount > 0 ? (
                      <div className="card-box-1 border-none d-flex align-items-center justify-content-start">
                        <div className="d-flex align-items-center">
                          <h2 className="text-black mb-0 fw-600 d-flex align-items-center gap-2">
                            <span className="fnt-family fs-38 fw-400">
                              +{moreCount}{" "}
                            </span>
                            <span className="fs-17 lh-22">more</span>
                          </h2>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BumpPremiumModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        config={UNLOCK_BUMP_CONFIG}
      />
    </div>
  );
}
