"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ADVISORY_TEAM,
  ECOSYSTEM_LEFT,
  ECOSYSTEM_RIGHT,
  FAQ_ITEMS,
  FAQ_TABS,
  FOUNDER,
  NEWS_ITEMS,
  WHO_FOR,
  WHY_ACCEPTED,
} from "./content";

function WhyAccepted() {
  return (
    <section className="mobile-box-4">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h1 className="text-black fnt-family fw-500 fs-40 pt-0 text-center mobile-fs-24 mobile-lh-full">
            Why 98% of Our Students Get Accepted
          </h1>
          <div className="group-flex-items mt-5 d-flex wrap justify-content-space appear anime-child anime-complete">
            {WHY_ACCEPTED.map((item) => (
              <div className="w-211px column-flex" key={item.n}>
                <div className="d-flex align-items-start gap-3 mb-7">
                  <span className="icon-box">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/icon-traingal.png" alt="" />
                  </span>
                  <h4 className="text-black mb-0 fs-50 lh-50 fw-500">
                    {item.n}
                  </h4>
                </div>
                <h6 className="mb-0 fs-14 text-center lh-full">
                  {item.label.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < item.label.split("\n").length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoAndWhat() {
  return (
    <section className="about-mobile-who-is">
      <div className="container">
        <div className="row justify-content-start">
          <div className="w-15">
            <div className="d-flex align-items-baseline mt-30">
              <h5 className="text-black fnt-family fs-25 lh-25 text-nowrap mobile-fs-20 mobile-lh-full">
                in no <br /> particular
                <br /> order
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/top-arrow-2.png" width={75} alt="" />
            </div>
          </div>
          <div className="w-450px">
            <h3 className="fs-28 text-uppercase text-black fw-500 overflow-hidden text-blue mb-5 ml-78 bg-box-mobile-1">
              <span className="bg-light-green-200 p-1 fw-900 text-uppercase">
                {" "}
                Who is #PGS for?
              </span>
            </h3>
            {WHO_FOR.map((text) => (
              <div className="d-flex align-items-start gap-3 mb-3" key={text}>
                <span className="bg-green-1 border-color-1 border-radius-50px px-4 ht-24">
                  <i className="bi bi-check2 text-black fw-500 fs-20" />
                </span>
                <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                  {text}
                </h4>
              </div>
            ))}
          </div>
          <div className="w-344px">
            <h3 className="fs-28 text-uppercase text-black fw-500 overflow-hidden text-blue mb-5 ml-2 bg-box-mobile">
              <span className="bg-light-green-200 p-1 fw-900 text-uppercase border-gradient-purple-pink">
                What we do for you{" "}
              </span>
            </h3>
            <div className="d-flex align-items-start gap-3 mb-3">
              <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                Guidance and step-by-step planning for your medical path -{" "}
                <b>USMLE, AMC, or PLAB</b>
              </h4>
            </div>
            <div className="d-flex align-items-start gap-3 mb-3">
              <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                The right approach to applying to top-ranked universities starts
                with checking your profile{" "}
                <span className="italic-texts fw-700">
                  profile review is one of our key steps
                </span>
              </h4>
            </div>
            <div className="d-flex align-items-start gap-3 mb-3">
              <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                We make sure all forms are filled, deadlines met, and no
                last-minute mess-ups
              </h4>
            </div>
            <div className="d-flex align-items-start gap-3 mb-3">
              <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                <span className="italic-texts fw-700">
                  We&apos;ve partnered with universities for master&apos;s
                  programs too-
                </span>{" "}
                we filter them out for you
              </h4>
            </div>
            <div className="d-flex align-items-start gap-3 mb-3">
              <h4 className="bg-light-green-200 mb-0 fs-24 lh-full p-1 text-black fw-500 overflow-hidden text-blue">
                To get into top-ranked universities, secure a medical
                residency/training spot, or win a scholarship, you need to build
                your CV - we make that happen
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OnlineToggle() {
  const [online, setOnline] = useState(true);

  return (
    <section className="position-relative">
      <div className="container overlap-gap-section p-0 position-relative">
        <div className="row align-items-center justify-content-center justify-content-md-center">
          <div className="col-lg-7 m-auto">
            <div className="d-flex gap-3 align-items-start">
              <label className="toggle-switch big-toggle">
                <input
                  type="checkbox"
                  checked={online}
                  onChange={(e) => setOnline(e.target.checked)}
                  aria-label="Toggle online approach"
                />
                <span className="slider" />
              </label>
              <div className="w-70">
                {online ? (
                  <div>
                    <h1 className="text-black fs-76 lh-80 mb-0 mobile-fs-40">
                      <span className="fnt-family">
                        with #pgs you get <br />
                        Fully Online <br />
                        Approach -
                      </span>
                      <br />
                    </h1>
                    <h1 className="fw-200 fs-60 lh-full text-black mobile-fs-20 mobile-lh-25 mobile-w-80">
                      Supported by <br />
                      Information Centers & Offline Events*
                    </h1>
                    <p className="mb-0 fs-14 text-black lh-16">
                      *All our offline events and visits be pre-notified. Or
                      mentors will update you about them to you or if we are
                      coming to your university get updates from your HOD or
                      notice board, and also we&apos;re setting up info centers
                      for in-person support. That said, our mentors and team
                      stay accessible throughout your journey - that&apos;s
                      exactly why we&apos;re fully online first in today&apos;s
                      digital-first world.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-black fs-76 lh-80 mb-0 mobile-fs-40">
                      <span className="fnt-family">
                        WITHOUT #PGS — EVERYTHING TAKES MORE EFFORT -{" "}
                      </span>
                    </h1>
                    <h6 className="fw-200 fs-40 lh-full text-black mobile-fs-20 mobile-lh-25 mobile-w-80">
                      Deadlines aren&apos;t always obvious. Steps aren&apos;t
                      always structured. And decisions feel heavier than they
                      should.
                    </h6>
                    <p className="mb-0 fs-14 text-black lh-16">
                      Deadlines aren&apos;t always obvious. Steps aren&apos;t
                      always structured. And decisions feel heavier than they
                      should.
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

function FounderSection({
  founder,
}: {
  founder: {
    name: string;
    title: string;
    biography: string;
    image: string;
  } | null;
}) {
  const person = founder
    ? {
        name: founder.name,
        title: founder.title || FOUNDER.title,
        email: FOUNDER.email,
        image: founder.image || FOUNDER.image,
        bio: founder.biography
          ? founder.biography.split(/\n+/).filter(Boolean)
          : FOUNDER.bio,
      }
    : FOUNDER;

  return (
    <section className="pt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="d-flex gap-2 mobile-wrap mobile-justify-center">
              <div className="w-344px">
                <h4 className="fs-25 mobile-text-center mobile-mb-0">
                  Meet The{" "}
                  <span className="italic-texts text-black">Founder</span>
                </h4>
              </div>
              <div>
                <div className="founder-img-box border-radius-4px mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={person.image} alt={person.name} />
                </div>
                <h4 className="mb-0 text-black fs-40 mobile-pb-2">
                  {person.name}
                </h4>
                <h6 className="text-uppercase fs-15 text-black mb-4">
                  {person.title}
                </h6>
                <p className="text-black fs-14 lh-20 mb-0 fw-300">
                  Connect with me at:
                </p>
                <p className="text-black lh-20 mb-0 mobile-pb-4">
                  {person.email}
                </p>
              </div>
              <div className="founder-info w-40">
                {person.bio.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvisoryTeamSection({
  advisory,
}: {
  advisory?: { name: string; title: string; image: string }[];
}) {
  const team =
    advisory && advisory.length > 0
      ? advisory.map((m) => ({
          name: m.name,
          designation: m.title,
          image: m.image,
        }))
      : ADVISORY_TEAM;

  return (
    <section className="overflow-hidden bg-regal-blue position-relative border-radius-6px lg-border-radius-0px z-index-0">
      <div>
        <div className="row align-items-center mb-3 sm-mb-9 text-center text-lg-start justify-content-center">
          <div className="col-lg-5 md-mb-20px text-center">
            <h3 className="text-black fnt-family fs-38 mb-0">
              our advisory team
            </h3>
          </div>
        </div>
        <div className="row align-items-center mb-6">
          <div className="col-lg-9 m-auto">
            <div className="d-flex flex-wrap gap-4 justify-content-center purple-teams">
              {team.map((member, i) => (
                <div className="frame-purple" key={`${member.name}-${i}`}>
                  <div className="frame-purple-object-fit mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="text-white pt-5 pb-5 w-70 text-start m-auto w-204px">
                    <h5 className="fs-25 mb-2 fw-700">{member.name}</h5>
                    <p className="mb-0 lh-20 fs-14 text-uppercase fw-400">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <i className="bi bi-envelope text-white d-inline-block align-middle icon-extra-medium me-10px md-m-5px" />
              <div className="fs-18 text-white d-inline-block align-middle">
                Save your precious time and effort spent for finding a solution.{" "}
                <Link
                  href="/contact"
                  className="text-white text-decoration-line-bottom"
                >
                  Contact us now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  return (
    <section className="trust-box half-section overlap-height position-relative pt-15 mobile-partnar">
      <div className="container overlap-gap-section p-0">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px mobile-pb-0">
          <div className="mb-10px gap-5">
            <div className="text-center">
              <h5 className="text-black fw-700 fs-28 mobile-mb-0">
                #PGS in the news
              </h5>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 p-1 border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px">
          <div className="col-lg-9 m-auto d-flex gap-5 border-radius-10px overflow-hidden flex-wrap justify-content-center">
            {NEWS_ITEMS.map((item) => (
              <div className="box-light w-284px mobile-m-auto" key={item.logo}>
                <div className="header-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logo} alt="" />
                </div>
                <p className="w-100">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section className="container">
      <div className="row justify-content-center">
        <div className="col-lg-11">
          <div className="text-center">
            <h3 className="text-black fnt-family mb-1 fs-38">
              The #PGS Ecosystem
            </h3>
            <h3 className="fnt-family text_purple fs-38">
              10-Point Checklist of What You Actually get with us
            </h3>
          </div>
          <div className="d-flex gap-3 justify-content-space align-items-start mt-5 mobile-wrap">
            <div className="w-45">
              <ul className="p-0 m-0">
                {ECOSYSTEM_LEFT.map((item) => (
                  <li
                    className="d-flex align-items-start gap-2 mb-3"
                    key={item.title}
                  >
                    <i className="bi bi-check2-square fs-20 fw-500 text-green" />
                    <div className="text-black">
                      <h5 className="mb-0 fs-17 fw-500 lh-22">{item.title}</h5>
                      <p className="mb-0 fs-14 lh-20 mt-0 fw-300">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-45">
              <ul className="p-0 m-0">
                {ECOSYSTEM_RIGHT.map((item) => (
                  <li
                    className="d-flex align-items-start gap-2 mb-3"
                    key={item.title}
                  >
                    <i className="bi bi-check2-square fs-20 fw-500 text-green" />
                    <div className="text-black">
                      <h5 className="mb-0 fs-17 fw-500 lh-22">{item.title}</h5>
                      <p className="mb-0 fs-14 lh-20 mt-0 fw-300">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThingsYouShouldKnow({
  faqs,
}: {
  faqs?: { q: string; a: string }[];
}) {
  const [tab, setTab] = useState<(typeof FAQ_TABS)[number]["id"]>("tab_1");
  const [openQ, setOpenQ] = useState(0);
  const items = faqs && faqs.length > 0 ? faqs : [...FAQ_ITEMS];

  return (
    <section>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <h5 className="text-black fs-25 mb-1">Things you should know</h5>
            <div className="d-flex gap-5 mobile-wrap">
              <div className="w-25">
                <div className="group-of-button-div">
                  <ul className="portfolio-filter box-tabs-bottom m-0 p-0 nav nav-tabs">
                    {FAQ_TABS.map((t) => (
                      <li
                        className={`nav${tab === t.id ? " active" : ""}`}
                        key={t.id}
                      >
                        <a
                          href={`#${t.id}`}
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
                  <div className="grid-item tab_1 transition-inner-all w-100 text-red-active">
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
                                href={`#faq-${i}`}
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
                    {tab === "tab_2"
                      ? "Programme Learning Experience"
                      : "Refund Policy/Financials"}
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

export function AboutPage({
  founder = null,
  advisory,
  faqs,
}: {
  founder?: {
    name: string;
    title: string;
    biography: string;
    image: string;
  } | null;
  advisory?: { name: string; title: string; image: string }[];
  faqs?: { q: string; a: string }[];
} = {}) {
  return (
    <>
      <section className="pt-3 overlap-height position-relative minus-5 mobile-about-content mobile-section-step">
        <div className="overlap-gap-section position-relative overflow-hidden">
          <div className="row justify-content-center mobile-reverse">
            <div className="col-lg-6 position-relative">
              <div className="card-box-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/music.png" alt="" />
                <div className="pt-2 minus-7 mobile-mt-0">
                  <h4 className="fnt-family mb-0 fs-90 text-black fnt-family">
                    About
                  </h4>
                  <h4 className="mb-0 fs-90 text-black">
                    <span className="fnt-family">purpleguide.study</span>{" "}
                    <span className="fs-36 fw-500 mobile-fs-20">#PGS</span>
                  </h4>
                </div>
              </div>
              <div className="flot-arrow-box mobile-arrow-fix">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/arrow-down-1.png" alt="" />
                <span className="text-black fs-20 d-inline-block w-40 fw-500 lh-25 w-185px">
                  our quick way of referring to purpleguide.study.
                </span>
              </div>
              <p className="text-center fs-22 mt-1 mobile-posi-fix">
                Backed by experience. Trusted by students since 2006 (formerly
                CEG).
              </p>
            </div>
            <div className="col-lg-7">
              <div className="w-90 m-auto mt-5">
                <h3 className="text-black fs-24 lh-30 fw-400 mobile-fs-16 mobile-lh-18">
                  PurpleGuide.study was built to be your go-to admission
                  guidance hub. At our core, we&apos;re admission counselors,
                  but we go way beyond that{" "}
                  <b className="fw-600 text-uppercase">
                    we&apos;re the education portal you&apos;ve been waiting
                    for.
                  </b>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-very-light-green-1 border-green p-0 pt-2 pb-2">
        <div className="container">
          <div className="d-flex gap-4 align-items-center mobile-wrap-scrolling">
            <div className="d-flex w-20 align-items-center">
              <i className="text-green bi bi-dot fs-50 fw-800" />
              <h4 className="text-green mb-0 fs-20 lh-25">
                Live <br />
                Activity
              </h4>
            </div>
            {[1, 2, 3].map((i) => (
              <div className="text-green fw-300 lh-20" key={i}>
                <span>
                  {" "}
                  <i className="bi bi-check2-circle mr-1" />
                  <b>Priya M.</b>
                </span>
                <span className="fw-400 mobile-d-block">
                  Got accepted to Johns Hopkins #PGS | Batch 3, Class of 2025
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrapper-content">
        <WhyAccepted />
        <WhoAndWhat />

        <section className="position-relative">
          <div className="container p-0 position-relative">
            <div className="row align-items-center justify-content-md-center">
              <div className="w-900px">
                <div className="floting-text-heading">
                  <h4 className="mb-0 text-uppercase fw-500 text-black fs-40 lh-64">
                    USP
                  </h4>
                </div>
                <div className="card card-comment p-2 mobile-reverse">
                  <h5 className="px-0 lh-50">
                    <span className="fs-36 mobile-fs-20 mobile-lh-full">
                      Our unique dashboard and mentor approach allows you to
                      keep tabs on your entire journey. (Note: Some features
                      require #PurplePremium.)
                    </span>
                  </h5>
                  <span className="px-3 pt-1 d-block w-50 text-end">
                    <i className="bi bi-arrow-down-right bg-btn-arrow" />
                    <i className="bi bi-arrow-down-right bg-btn-arrow" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <OnlineToggle />

        <section className="position-relative">
          <div className="container overlap-gap-section p-0 position-relative">
            <div className="row align-items-center justify-content-center justify-content-md-center">
              <div className="col-lg-10 m-auto">
                <div className="d-flex gap-5 align-items-center justify-content-center mobile-gap-1">
                  <div className="bg-black p-05 w-40 black-shadow">
                    <div className="header-bg-black d-flex text-white justify-content-space pb-1 px-3 mobile-fs-10">
                      <span className="fs-13 mobile-fs-10">
                        <i className="bi bi-circle" />
                        <i className="bi bi-circle" />
                        <i className="bi bi-circle" />
                      </span>
                      <h5 className="mb-0 text-uppercase fs-20 mobile-fs-12">
                        note
                      </h5>
                      <span>
                        <i className="bi bi-file-earmark-pdf" />
                      </span>
                    </div>
                    <div className="bg-purple-100 d-flex justify-content-center align-items-center h-180px">
                      <h5 className="mb-0 fs-20 text-black">Since 2006</h5>
                    </div>
                  </div>
                  <div className="w-40 px-4 mobile-p-0">
                    <h5 className="mb-0 fs-25 lh-30 text-black mobile-fs-14 mobile-lh-18">
                      Let&apos;s talk about #PGS history - This is our story,
                      and it&apos;s exactly why we know how to get you where you
                      want to go.
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="position-relative pb-0 mobile-yello-heading-box">
          <div className="container overlap-gap-section p-0 position-relative">
            <div className="row align-items-center justify-content-center justify-content-md-center">
              <div className="col-lg-10 m-auto scale-down minus-5">
                <div className="flex-heading-floting text-black bg-gray p-2 w-90 m-auto mobile-bg-transparent mobiel-pb-4">
                  <h1 className="fs-38 fnt-family fw-500 mb-0 mobile-fs-24">
                    PurpleGuide.Study Evolution Timeline
                  </h1>
                  <p className="mb-1 fs-16 mobile-fs-14 mobile-lh-full">
                    Nearly Two Decades of Growth: From CEG to #PGS (2006–Present)
                  </p>
                </div>
                <div className="border-solid-gray border-radius-15px p-2 bg-white">
                  <ul className="m-0 p-0">
                    <li className="d-flex border-bottom pb-2 justify-content-space fs-16 text-black">
                      <span>Phase/Milestone</span>
                      <span>2006</span>
                      <span>2011</span>
                      <span>2017</span>
                      <span>2020</span>
                      <span>2024</span>
                      <button
                        type="button"
                        className="btn text-black border-radius-0px bg-purple-100 text-captilize"
                      >
                        Present
                      </button>
                    </li>
                    <li className="pt-1 pb-1 d-flex gap-5 border-bottom align-items-start">
                      <div className="w-15 lh-25">
                        <span className="text-gray mb-0 d-block lh-18 fs-14">
                          Phase 1
                        </span>
                        <span className="text-black lh-15 fs-14">
                          CEG (Chennai Edu Guidance)
                        </span>
                      </div>
                      <div className="text-black">
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Foundation + Start of Journey
                        </span>
                        <br />
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Establishing as freelancer for multiple top 10 private
                          UNIs based in Chennai
                        </span>
                      </div>
                    </li>
                    <li className="pt-1 pb-1 d-flex gap-5 border-bottom align-items-center">
                      <div className="w-25 lh-25">
                        <span className="text-gray mb-0 d-block lh-18 fs-14">
                          Phase 1
                        </span>
                        <span className="text-black lh-15 fs-14">
                          Domestic Expansion
                        </span>
                      </div>
                      <div className="text-black">
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Multi - City Counseling
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Partnerships
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Establishing Networks
                        </span>
                      </div>
                    </li>
                    <li className="pt-1 pb-1 d-flex gap-5 border-bottom align-items-center">
                      <div className="w-35 lh-25">
                        <span className="text-gray mb-0 d-block lh-18 fs-14">
                          Phase 3
                        </span>
                        <span className="text-black lh-15 fs-14">
                          Global reach
                        </span>
                      </div>
                      <div className="text-black">
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Visiting international universities and figuring out
                          their teaching methodologies
                        </span>
                        <br />
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          International Partnerships
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          UG
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Masters
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          <b>Ranked Uni</b>
                        </span>
                        <br />
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Medical Focus
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          <b>Post Graduation Medical Pathway</b>
                        </span>
                        <br />
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Study Abroad Focus
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Specialization
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          Research
                        </span>
                      </div>
                    </li>
                    <li className="pt-1 pb-1 d-flex gap-5 border-bottom align-items-center">
                      <div className="w-90 lh-25">
                        <span className="text-gray mb-0 d-block lh-18 fs-14">
                          Phase 4
                        </span>
                        <span className="text-black lh-15 fs-18 text-uppercase fw-600">
                          #PGS
                        </span>
                      </div>
                      <div className="text-black">
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          @purpleguide{" "}
                          <span className="italic-texts">IG</span>
                        </span>{" "}
                        <span className="bg-yellow py-1 px-2 fs-13 border-radius-10px">
                          more research & connections
                        </span>
                        <div className="bg-yellow py-1 px-2 fs-14 lh-20 border-radius-10px mb-1">
                          Worked with Universities and freelance clients in
                          EdTech, digging deep into student pain points. Guided
                          many students at once — and loved watching them reach
                          their dream institutes.
                        </div>
                        <div className="bg-yellow py-1 px-2 fs-14 lh-20 border-radius-10px">
                          <span className="fw-500">
                            We were helping students through our network even
                            before the portal existed.
                          </span>{" "}
                          #PGS Hub = smarter, organized approach to student
                          support with expert guidance & strategic connections.
                        </div>
                      </div>
                    </li>
                    <li className="pt-1 pb-1 d-flex gap-5 border-bottom align-items-center">
                      <div className="w-40 lh-25">
                        <span className="text-gray mb-0 d-block lh-18 fs-14">
                          Phase 5
                        </span>
                        <span className="text-black lh-15 fs-18">
                          <b>#PGS</b> aka <br /> <b>Purpleguide.study</b>
                        </span>
                        <br />
                        <span className="italic-texts fw-400 fs-15 text-black">
                          the education portal <br /> you&apos;ve been waiting
                          for
                        </span>
                      </div>
                      <div className="text-black w-50 position-relative">
                        <div className="bg-yellow py-1 px-2 fs-14 lh-20 border-radius-10px mb-1 pr-50 m-last w-70">
                          purpleguide.study - counseling + connections + student
                          insights + networking +mentor roadmap = your complete
                          admission journey partner.
                        </div>
                        <div className="bg-black text-white border-liner w-35 text-center m-last">
                          We are live for students
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="w-40 m-last mt-1 mobile-none">
                  <p className="text-black mb-0 fs-13 fw-500 lh-25">
                    #CEG was the freelance, backend and networking phase
                  </p>
                  <p className="text-black mb-0 fs-13 fw-500 lh-25">
                    #PGS is the organised journey phase for students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FounderSection founder={founder} />
        <AdvisoryTeamSection advisory={advisory} />
        <NewsSection />
        <EcosystemSection />

        <section className="half-section overlap-height position-relative overflow-hidden">
          <div className="container overlap-gap-section p-0">
            <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
              <div className="mb-10px gap-5">
                <div className="text-center mb-2">
                  <span className="small-caption" style={{ color: "#6A5ED9" }}>
                    Let&apos;s Go
                  </span>
                  <h5 className="w-100 text-black fs-40 mb-2 fw-700 m-auto">
                    Ready to get started?
                  </h5>
                  <p className="w-40 text-center m-auto">
                    Let&apos;s chart your study abroad path, together with{" "}
                    <b>Team #PGS.</b>
                  </p>
                  <Link
                    href="/login"
                    style={{
                      padding: "8px 30px",
                      backgroundColor: "#6A5ED9",
                    }}
                    className="mb-2 btn btn-small-large border-radius-10px text-white btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-15px"
                  >
                    <span>
                      <span
                        className="btn-double-text ls-minus-05px"
                        data-text="Start Your Journey"
                      >
                        Start Your Journey
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ThingsYouShouldKnow faqs={faqs} />
      </div>
    </>
  );
}
