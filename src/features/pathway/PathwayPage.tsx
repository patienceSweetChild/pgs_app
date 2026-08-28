"use client";

import { useState } from "react";
import Link from "next/link";
import { HighlightsSection } from "@/components/HighlightsSection";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import {
  type MedicalPathwayPageContent,
} from "./page-content";
import "./pathway.css";

function ProgressStat({
  value,
  label,
  dash,
}: {
  value: string;
  label: string;
  dash: string;
}) {
  return (
    <div className="d-flex gap-3 align-items-start">
      <div>
        <h3 className="fs-500 mb-0 lh-28 text-green fw-500 fs-22">{value}</h3>
        <p className="text-white mb-0 fs-14">{label}</p>
      </div>
      <div className="progress-circle">
        <svg width="60" height="60">
          <circle className="progress-bg" cx="30" cy="30" r="20" />
          <circle
            className="progress-bar"
            cx="30"
            cy="30"
            r="20"
            strokeDasharray={dash}
            strokeDashoffset="100"
          />
        </svg>
        <div className="progress-text" />
      </div>
    </div>
  );
}

function FaqBlock({ items }: { items: MedicalPathwayPageContent["faq"] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq_section">
      <div className="w-899px m-auto overlap-gap-section p-0">
        <div className="bg-very-light-green xl-p-4 md-p-50px sm-p-30px mobile-p-0">
          <h2 className="fac-title">FAQ’s</h2>
          <div className="accordion accordion-style-02">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  className={`accordion-item${isOpen ? " active-accordion" : ""}`}
                  key={`${item.q}-${i}`}
                >
                  <div className="accordion-header border-color-extra-medium-gray">
                    <a
                      href={`#pathway-faq-${i}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(isOpen ? -1 : i);
                      }}
                    >
                      <div className="accordion-title mb-0 position-relative text-black mobile-lh-20">
                        <i
                          className={`feather ${
                            isOpen ? "icon-feather-minus" : "icon-feather-plus"
                          }`}
                        />
                        <span className="fw-600 fs-17 lh-22 ls-minus-05px">
                          {item.q}
                        </span>
                      </div>
                    </a>
                  </div>
                  {isOpen ? (
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
      </div>
    </section>
  );
}

/** Shared medical pathway page — from purpleusme / purpleamc / purpleplab HTML. */
export function PathwayPage({ content }: { content: MedicalPathwayPageContent }) {
  const { intro, track, pathway: path, dashboard, offer, meet, contact } = content;
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseDone, setExpenseDone] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseEmail, setExpenseEmail] = useState("");
  const [expensePhone, setExpensePhone] = useState("");

  return (
    <>
    <div className="wrapper-content">
      <section className="pt-0 about-section half-section overlap-height position-relative minus-5 mobile-board-2">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="w-75 m-auto text-center">
                <h1 className="text-black fw-500 fs-36 pt-0 mb-1 lh-40">
                  {intro.heroTitle}
                </h1>
                <p className="mb-0 lh-20 fs-16">
                  {intro.heroSubtitle}
                </p>
                <h6 className="mb-0 text-black fs-16 mt-0">
                  {intro.heroBadgeLine}
                </h6>
                <button
                  type="button"
                  className="btn btn-purple mt-1 bg-black-btn fs-11 mb-0"
                >
                  {intro.heroCtaLabel}
                </button>
                <p className="mb-0 fs-12 lh-15 mt-1">
                  {intro.heroCtaSubtext}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 overlap-height position-relative mobile-section-step">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="w-877px">
              <div className="card-box-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={intro.stepIntoImage} alt="" />
                <div className="minus-5">
                  <h4 className="fnt-family mb-0 fs-95 text-black">
                    Step into
                  </h4>
                  <h4 className="mb-0 fs-95 text-black d-flex gap-3 align-items-end lh-80">
                    <span className="fnt-family">#purplepremium </span>
                    <span className="fs-28 lh-35 mb-1 fw-500">
                      {intro.stepIntoBadgeLine.split("\n").map((line, i) => (
                        <span key={`${line}-${i}`}>
                          {line}
                          {i < intro.stepIntoBadgeLine.split("\n").length - 1 ? (
                            <br />
                          ) : null}
                        </span>
                      ))}
                    </span>
                  </h4>
                </div>
              </div>
              <p className="text-center fs-22 mobile-pt-2">
                {intro.stepIntoTrustLine}
              </p>
            </div>
            <div className="col-lg-9 mt-8 mobile-w-80 mobile-auto">
              <h3 className="text-black fnt-family w-80 mb-1 m-auto d-flex justify-content-center fs-38 lh-32 text-center mobile-fs-24 mobile-lh-full mobile-pt-5">
                {intro.whyBuiltTitle}
              </h3>
              <div className="w-555px m-auto">
                <h5 className="text-black fs-17 mt-2 fw-600 mb-1">
                  {intro.whyBuiltSubtitle}
                </h5>
                <ul className="p-0">
                  {intro.whyBuiltBullets.map((text) => (
                    <li
                      className="mb-2 text-black fs-14 d-flex gap-2 align-items-start lh-full"
                      key={text.slice(0, 40)}
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-3 half-section overlap-height position-relative">
        <div className="w-899px overlap-gap-section p-0 m-auto">
          <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px mobile-pb-0 mobile-mb-2">
            <div className="mb-10px">
              <div className="text-center mobile-w-90 mobile-auto">
                <h6 className="mb-1 text-black fs-20 lh-22 fw-600">
                  {intro.purpleMapHeadline}
                </h6>
                <p className="mb-0 text-black fs-14 lh-full">
                  {intro.purpleMapSubhead}
                </p>
              </div>
            </div>
          </div>
          <div className="row align-items-center justify-content-md-start mt-3 mobile-new-bg-path">
            <div className="col-lg-5 col-md-5 position-relative md-mb-50px sm-mb-40px">
              <figure className="position-relative text-center mb-8 fix-object-cover-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={intro.purpleMapImage}
                  alt=""
                  className="border-radius-6px"
                />
              </figure>
            </div>
            <div className="col-lg-7 col-md-7 position-relative md-mb-50px sm-mb-40px mobile-w-85 mobile-mb-0">
              <div className="d-flex align-items-center gap-1 mt-2">
                <div className="bg-path">
                  <br />
                  <i className="bi bi-arrow-right-short fs-40" />
                </div>
                <h5 className="mb-0 fs-25 lh-30 text-black bg-light-blue-1 border-radius-8px p-1 p-05 fw-400 mobile-fs-14 mobile-lh-16 mobile-p-3">
                  {intro.purpleMapCrossLink}
                </h5>
              </div>
              <div className="d-flex w-60 gap-3 align-items-start mt-4 m-auto mb-10 mobile-mb-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/dots-top-arrow.png"
                  className="pb-10"
                  alt=""
                />
                <h6 className="text-black fs-17 lh-22 fw-600 mb-0 pt-15 mobile-fs-14 mobile-lh-16">
                  {intro.purpleMapPathTitle.split("\n").map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {line}
                      {i < intro.purpleMapPathTitle.split("\n").length - 1 ? (
                        <br />
                      ) : null}
                    </span>
                  ))}
                </h6>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="d-flex gap-5 mobile-wrap">
                <div className="w-50 mobile-w-65 mobile-auto">
                  <h5 className="mb-3 fs-20 text-black fw-500 lh-22">
                    {intro.cvTitle}
                  </h5>
                  <p className="text-black fs-14 lh-full mb-8">
                    {intro.cvBody}
                  </p>
                  <h5 className="mb-0 fs-17 text-black fw-600 lh-20">
                    {intro.cvRecruiterTitle}
                  </h5>
                  <p className="text-black fs-12 fw-500 mobile-fs-14">
                    {intro.cvRecruiterSubtext}
                  </p>
                  <div className="d-flex gap-3 ml-7">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/filter-line.png" alt="" />
                    <ul className="mb-0 p-0 mobile-checklist-medical">
                      <li className="fs-14 lh-14 mb-1 fw-300 mb-5">
                        {intro.cvIntroLine}
                      </li>
                      {intro.cvChecklist.map(({ dot, text }) => (
                        <li
                          className="text-black fw-400 fs-12 d-flex gap-2 align-items-start"
                          key={text}
                        >
                          <span className={`dots-box-grid ${dot}`} />
                          {text}&nbsp;
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-256px">
                  <div className="card-box-study px-2">
                    <h6 className="mb-0 fs-50 text-black fw-600">
                      {intro.cvCardTitle}
                    </h6>
                    <p
                      className="text-black fs-25 fw-300 mt-10 w-70 mobile-fs-20"
                      style={{
                        fontFamily: "'Roboto Mono'",
                        backgroundImage: "url('/assets/img/bg-liner.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "bottom",
                      }}
                    >
                      {intro.cvCardUnplanned}
                    </p>
                    <p
                      className="text-black fs-20 fw-300 mt-10 mobile-fs-16"
                      style={{ fontFamily: "'Roboto Mono'" }}
                    >
                      {intro.cvCardResearched}
                    </p>
                    <div
                      className="frame-set-content"
                      style={{
                        backgroundImage: "url('/assets/img/frame-set.png')",
                      }}
                    >
                      <h5 className="fw-500">{intro.cvCardFooter}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <br />

      <section className="left-4 top-50s pt-5 pb-5 mobile-pb-40 pgs-track1-section">
        <div className="container">
          <div className="row">
            <div className="w-900px m-auto position-relative purple-section ">
              <div className="purple-gray-box ht-786px mobile-new-usme">
                <h1 className="fnt-family text-green fs-38 d-flex align-items-center gap-2 mobile-fs-30">
                  #purplePremium{" "}
                  <span className="text-red fs-19 mobile-fs-20">
                    {track.sectionLabel}
                  </span>
                </h1>
                <div className="text-center w-75 m-auto mt-6 text-black mobile-w-90 mobile-pb-10">
                  <h3 className="fnt-family mb-2 fs-38 mobile-d-flex gap-3 mobile-justify-center">
                    <span className="mobile-fs-20">{track.trackLabel}</span>
                    {track.trackTitle}
                  </h3>
                  <h6 className="fs-17 fw-400 lh-22 text-black mobile-fs-14 mobile-lh-full">
                    {track.trackIntro}
                  </h6>
                  <p className="text-black fs-17 lh-22 mb-1 text-start mobile-fs-14 mobile-lh-full">
                    {track.trackBody}
                  </p>
                </div>
                <div className="d-flex align-items-start gap-3 mt-2 position-relative justify-content-center mobile-respo-box-1 mobile-respo-box-3">
                  <div className="w-20 mobile-w-50">
                    <div className="card-box-border h-300px">
                      <div className="icon-box-position">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/list-check.png" alt="" />
                      </div>
                      <div className="bg-light-box mt-10">
                        <h6>Smart shortlisting</h6>
                        <h6>+</h6>
                        <h6>Profile deep-dive</h6>
                      </div>
                    </div>
                  </div>
                  <div className="w-230px mobile-w-50 mobile-pt-4">
                    <div className="card-box-border d-flex gap-3 justify-content-start">
                      <div className="icon-box-position w-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/user-edit.png"
                          width={40}
                          style={{ height: 26, width: 125 }}
                          alt=""
                        />
                      </div>
                      <div className="bg-light-box">
                        <h6>
                          Observation or rotation training that aligns with the
                          medical system you’re aiming for
                        </h6>
                      </div>
                    </div>
                    <div className="card-box-border mt-4">
                      <div className="icon-box-position w-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/heart.gif"
                          width={80}
                          className="mb-0"
                          style={{ width: 50 }}
                          alt=""
                        />
                      </div>
                      <br />
                      <div className="text-black fs-15 w-60 mt-10 m-last ">
                        <h6 className="text-black fs-16 lh-22 mb-3 mobile-fs-12 mobile-lh-full">
                          And a timeline that doesn’t burn you out or waste
                          years
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="w-25 mobile-w-50 mobile-none">
                    <div className="card-box-border">
                      <div className="icon-box-position w-50">
                        <div className="icon-box-position">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/topy.png" alt="" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/stemp.png" alt="" />
                        </div>
                      </div>
                      <div className="bg-light-box">
                        <h6>
                          Observation or rotation training that aligns with the
                          medical system you’re aiming for
                        </h6>
                      </div>
                      <span className="fw-500 fs-30 m-auto text-center d-block text-black">
                        +
                      </span>
                      <div className="bg-light-box">
                        <h6>
                          Pathway-relevant certificate <br />
                          courses
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pgs-track1-bottom mobile-mt-10">
                  <div className="pgs-track1-copy">
                    <div className="pgs-track1-card-wrap">
                      <div className="pgs-badge fnt-family fw-500">#PGS</div>
                      <div
                        className="bg-pgs-content px-4 py-4 border-radius-10px"
                        style={{
                          backgroundImage: "url('/assets/img/Subtract.png')",
                        }}
                      >
                        <h5 className="text-black fs-17 lh-22 fw-600 mobile-fs-14 mobile-lh-full">
                          {track.bottomHeadline}
                        </h5>
                        <p className="mb-0 text-dark-gray lh-19 fs-14 mobile-fs-12 mobile-lh-full">
                          {track.bottomBody}
                        </p>
                      </div>
                    </div>
                  </div>
                  <figure className="pgs-track1-portrait">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.portraitImage} alt="" />
                  </figure>
                </div>
              </div>
              <div className="pgs-track1-quote d-flex gap-2">
                <span className="fnt-family fs-40 text-black">“</span>
                <p className="mb-0 fs-14 lh-full text-black mobile-fs-14">
                  {track.testimonialQuote}
                  <span className="fnt-family fs-40 text-black d-block m-last text-end">
                    ”
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8 pgs-pathway-path-section">
        <div className="container">
          <div className="w-990px m-auto">
            <div className="text-center">
              <h3 className="text-black mb-1 fnt-family mb-0 fs-38 mobile-fs-24 mobile-lh-full">
                {path.pathParen}
              </h3>
              <p className="text-black fs-16 lh-19 mobile-fs-14">
                {path.pathIntro}
              </p>
            </div>
            <div className="bg-black what-is-purple-relative border-radius-10px pt-5 purple-mobile-box-1">
              <div className="w-100">
                <h5 className="text_purple fs-30 text-end mobile-fs-24 mobile-text-start">
                  #purplePremium
                </h5>
              </div>
              <div className="d-flex gap-4 w-95 m-auto mobile-wrap">
                <div className="w-50">
                  <div className="text-indennt-30">
                    <h4 className="text-yellow fnt-family fs-39 lh-22 fw-400 mb-0 mobile-lh-full">
                      get to know
                    </h4>
                    <h4 className="text-yellow fnt-family fs-100 fw-400 lh-100">
                      {path.getToKnowTitle}
                    </h4>
                  </div>
                  <h4 className="mb-0 text-white fs-19 fw-600 text-indennt-30 mobile-fs-14 mobile-lh-full">
                    {path.gatewayTitle}
                  </h4>
                  <p className="text-white lh-19 fw-300 fs-14 px-5 mobile-fs-14 mobile-lh-full mobile-p-0">
                    {path.gatewayBody}
                  </p>
                  <div className="mt-4 w-100 m-auto mb-3 mobile-none">
                    <div className="d-flex gap-2 align-items-center mobile-wrap">
                      {path.steps.map((step) => (
                        <div className="w-145px" key={step.title}>
                          <button
                            type="button"
                            className="btn bg-yellow border-radius-10px px-4 w-100 fnt-family py-1 lh-20 fs-20 mb-4"
                          >
                            {step.title}
                          </button>
                          <h6 className="text-yellow fs-12 lh-full mobile-fs-12 mobile-mb-0">
                            {step.detail.split("\n").map((line) => (
                              <span key={line}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </h6>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-50">
                  <div className="mobile-none">
                    <h5 className="text-green mb-0 fs-17 lh-22 fw-600">
                      {path.performanceLabel}
                    </h5>
                    <p className="text-white fs-14 fw-400 lh-14 mb-0">
                      {path.performanceNote}
                    </p>
                  </div>
                  <div className="d-flex gap-3 mt-3 mobile-none">
                    {path.stats.map((s) => (
                      <ProgressStat key={s.label} {...s} />
                    ))}
                  </div>
                  <h5 className="box-border-mark lh-16">
                    {path.timelineNote}
                  </h5>
                  <h5 className="text-yellow fs-13 lh-15 mb-1 mobile-pt-2">
                    {path.residencyTitle}
                  </h5>
                  <p className="text-white lh-16 mobile-fs-14 mobile-lh-full">
                    {path.residencyBody}
                  </p>
                  <h5 className="text-yellow fs-14 lh-16 fw-600 w-80 pt-2 mb-0">
                    {path.matchSystemNote}
                  </h5>
                </div>
              </div>

              <div className="col-lg-12 m-auto">
                <div className="gray-bg-overlaping">
                  <div className="ml-0 d-flex align-items-end text-black gap-2 justify-content-end minus-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/intro.png"
                      alt="intro"
                      className="small-mobile-img"
                    />
                  </div>
                  <h1 className="fnt-family text-black fs-50 pt-1 text-center mb-2 lh-48 mobile-fs-32 mobile-lh-full mobile-text-start">
                    {path.whatYouGetTitle}
                  </h1>
                  <div className="d-flex purple-gray-box-1 gap-3 justify-content-center mt-5 mobile-wrap">
                    <div className="w-50">
                      <div className="mb-3 text-black">
                        <div className="w-263px m-last">
                          <h6 className="fs-17 fw-600 mb-0">
                            {path.networkHeadline}
                          </h6>
                          <p className="mb-0 fs-14 lh-20">
                            {path.networkBody}
                          </p>
                        </div>
                      </div>
                      <div className="card-box-border w-452px">
                        <div>
                          <h5 className="text-black fw-500 mobile-fs-20">
                            {path.formsTitle}
                          </h5>
                          <ul className="points w-65 m-last pb-4 mobile-w-80">
                            {path.forms.map((item) => (
                              <li
                                className="text-black fs-16 lh-20 mb-1"
                                key={item}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="card-box-border mt-3 w-90 m-last mobile-w-95">
                        <div>
                          <h5 className="text-black fw-500 mb-2 fs-32 mobile-fs-20 mobile-lh-full">
                            {path.prepGroupTitle}
                          </h5>
                          <p className="text-black fs-16 lh-20 mb-1 pb-5 mobile-fs-14">
                            {path.prepGroupBody}
                          </p>
                        </div>
                      </div>
                      <div className="light-purple-bg py-3 px-5 border-radius-10px mt-3 pb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/speach.png" alt="" />
                        <h5 className="fs-17 lh-22 text-black mb-0 text-center mobile-fs-14 mobile-lh-full">
                          {path.conferenceNote}
                        </h5>
                      </div>
                    </div>
                    <div className="w-50">
                      <div className="card-box-border">
                        <div>
                          <h5 className="text-black fw-500 mobile-fs-20 mobile-lh-full">
                            {path.checklistTitle}
                          </h5>
                          <ul className="w-100 m-last">
                            {path.checklist.map((item) => (
                              <li
                                className="text-black fs-18 lh-25 mb-2 d-flex gap-2 align-items-start mobile-fs-14 mobile-lh-full"
                                key={item}
                              >
                                <span className="green-box-dot" />
                                <div className="mobile-w-90">{item}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="card-box-border w-65 mt-3 mobile-w-95s">
                        <div className="mb-5 icon-box-position d-flex align-items-center gap-2 justify-content-start">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/desk-user.png"
                            className="mb-0"
                            alt=""
                          />
                          <span className="fs-20 mobile-fs-16 mobile-lh-full">
                            Book feedback sessions
                          </span>
                        </div>
                        <div className="calendar-box-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/bookcalendar.png" alt="" />
                        </div>
                      </div>
                      <div className="mt-8">
                        <h4 className="mb-1 fs-17 fw-600 text-black lh-15 mobile-fs-14">
                          {path.rotationsTitle}
                          <span className="d-block fs-12 fw-400 text-start mt-2 mobile-fs-14">
                            {path.rotationsSubtext}
                          </span>
                        </h4>
                        <h4 className="mb-0 fs-17 mb-2 lh-20 fw-600 text-black mobile-fs-14">
                          {path.visaHelpTitle}
                        </h4>
                        <h4 className="mb-0 fs-17 fw-600 lh-20 text-black mobile-fs-14">
                          {path.cvHelpTitle}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 mb-3">
                    <a
                      href="#offer_script"
                      className="btn btn-green-btn m-auto mobile-fs-14 mobile-lh-full"
                    >
                      {path.ctaLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section half-section overlap-height position-relative overflow-hidden pt-13">
        <div className="overlap-gap-section p-0 w-863px m-auto">
          <div className="row align-items-center justify-content-md-center m-0">
            <div className="col-lg-12 col-md-12 m-0">
              <div className="card card-comment">
                <h5>
                  <span className="fnt-50">“</span>
                  <span>
                    {content.counselorQuote}
                    <span className="fnt-50 dot-flot-1">”</span>
                  </span>
                </h5>
                <div className="tag-comment lt-1">
                  <div className="tag-border">{content.counselorTag}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

      <HighlightsSection />

      <div className="wrapper-content">
      <section className="position-relative pb-100 mobile-aboutus">
        <div className="w-903px p-0 m-auto pb-100">
          <div className="row align-items-center justify-content-center d-flex gap-5">
            <div className="position-relative bg-gray w-504px bg-very-light-green xl-p-4 md-p-50px sm-p-30px border-radius-10px px-5">
              <div className="mb-10px">
                <div className="mt-10 mobile-px-4">
                  <h2 className="mb-1 text-uppercase fnt-bab text-black fs-38 mobile-br-none mobile-fs-20 mobile-lh-20 mobile-w-60">
                    {content.documentationTitle.split("\n").map((line, i) => (
                      <span key={`${line}-${i}`}>
                        {line}
                        {i < content.documentationTitle.split("\n").length - 1 ? (
                          <br />
                        ) : null}
                      </span>
                    ))}
                  </h2>
                  <button
                    type="button"
                    style={{ padding: "8px 30px" }}
                    className="mb-2 mobile-px-3 btn btn-small-large border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
                    onClick={() => {
                      setExpenseDone(false);
                      setExpenseOpen(true);
                    }}
                  >
                    <span>
                      <span
                        className="btn-double-text ls-minus-05px fs-15"
                        data-text={content.documentationCta}
                      >
                        {content.documentationCta}
                      </span>
                    </span>
                  </button>
                  <p className="text-black mt-3 mb-3">
                    {content.documentationInboxNote}
                  </p>
                  <p className="text-black fs-16 lh-19 mt-6 mb-30 mobile-fs-14 mobile-pb-30">
                    {content.documentationBody}
                  </p>
                </div>
                <figure className="about-floting-img m-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.documentationImage}
                    alt=""
                    className="border-radius-6px"
                  />
                </figure>
              </div>
            </div>
            <div className="w-336px">
              <figure className="request-img-box text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.documentationSideImage}
                  alt=""
                  className="border-radius-6px"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-11 m-auto mobile-p-0">
              <h3 className="text-black fnt-family w-60 fs-38 lh-full text-center m-auto mobile-fs-24 mobile-w-full">
                {dashboard.title}
              </h3>
              <div className="box-img-grid-gorup grid-block-size mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dashboard.image}
                  className="border-radius-10px"
                  alt=""
                />
              </div>
              <div className="line-active" />
              <div className="group-flex-items mt-4 d-flex wrap justify-content-space mobile-scrolling-nowrap">
                {dashboard.features.map((title) => (
                  <div className="w-20" key={title}>
                    <div className="d-flex align-items-start gap-3 mb-5 w-202px">
                      <span className="icon-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/icon-traingal.png" alt="" />
                      </span>
                      <h4 className="text-black mb-0 fs-19 lh-25 w-80 mobile-fs-19 mobile-lh-25">
                        {title.split("\n").map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="pt-10 js-purplepremium-offer-section"
        id="offer_script"
      >
        <div className="w-899px m-auto">
          <div className="row justify-content-center mobile-row-0">
            <div className="mobile-p-0">
              <div className="box-gray-2 border-radius-10px">
                <div className="w-90 m-auto">
                  <div className="w-95 card-box-border bg-white border-black pt-4 m-auto mobile-bg-white">
                    <h1 className="fnt-family text-black w-75 fs-50 lh-45 mb-0 mobile-fs-24 mobile-lh-full mobile-pb-4">
                      {offer.headline}
                    </h1>
                    <p className="text-black fs-12 lh-18 w-75 mb-0 pb-4 mobile-lh-full mobile-fs-14">
                      {offer.subtext}
                    </p>
                  </div>
                  <div className="w-100 card-box-border bg-black border-liner custom-padding-100 m-auto minus-5 border-radius-0px mobile-bg-black">
                    <h6 className="fs-16 fw-500 text-white d-flex gap-2 align-items-center mobile-wrap mobile-d-block mobile-mb-0">
                      <span className="mobile-d-block mobile-pb-5 mobile-text-center mobile-fs-13">
                        Get Started at discounted price
                      </span>
                      <span className="mobile-flot-price">
                        <span
                          className="bg-yellow text-black px-2 py-1 border-radius-6px"
                          style={{ height: 25, lineHeight: "17px" }}
                        >
                          {offer.discountLabel}
                        </span>{" "}
                        <del className="fw-300 fs-25 mobile-fs-16">
                          {offer.wasPrice}
                        </del>
                      </span>
                    </h6>
                    <h2 className="mb-4 text-white fw-800 fs-50 lh-30 mobile-text-center">
                      {offer.price}
                    </h2>
                    <Link
                      className="btn btn-purple2 text-black fw-500 w-230px mt-2 fs-19"
                      href="/purplepremiumhome"
                    >
                      {offer.enrollLabel}
                    </Link>
                  </div>
                  <h1 className="mb-0 fs-28 mt-4 fnt-family text-black mobile-fs-24">
                    {offer.includedTitle}
                  </h1>
                  <p className="fw-400 fs-12 lh-16 text-black mobile-fs-14 mobile-lh-full">
                    {offer.includedIntro}
                  </p>
                  <ul className="check-list">
                    {offer.included.map((item) => (
                      <li key={item}>
                        <i className="bi bi-check-circle-fill" />
                        <div>{item}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="group-of-box-bottom d-flex gap-2 align-items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/high-fiy.png" alt="" />
                <h5 className="fw-400 text-black fs-12 lh-full mb-0">
                  {offer.footerNote}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-899px m-auto">
          <div className="row justify-content-center">
            <div className="col-lg-6 mobile-w-90 mobile-auto">
              <div className="mobile-d-flex mobile-align-center mobile-pb-5">
                <h3 className="text-black fnt-family fs-38 mb-1 mobile-fs-24 mobile-w-60">
                  {meet.title}
                </h3>
                <p className="text-green fs-17 fw-500 mobile-fs-14 mobile-lh-full mobile-w-50 mobile-mb-0">
                  {meet.subtext}
                </p>
              </div>
              <ul className="p-0 m-0">
                {meet.bullets.map((line) => (
                  <li
                    className="d-flex gap-2 align-items-center mb-4"
                    key={line}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/yellow-check.png"
                      className="mobile-w-25px"
                      alt=""
                    />
                    <h6 className="fs-16 text-black mb-0 fw-500 lh-20 mobile-fs-14">
                      {line}
                    </h6>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-5">
              <div className="bg-black p-4 pt-4 pb-4 border-radius-10px text-white text-center">
                <h5 className="mb-0 fs-25 lh-25 pt-3 mobile-fs-20">
                  {meet.cardTitle}
                </h5>
                <h4 className="mb-0 fs-32 mobile-pb-2">
                  <b>{meet.cardSubtitle}</b>
                </h4>
                <p className="mb-3 fs-12 fw-300">
                  {meet.cardBody}
                </p>
                <button
                  type="button"
                  className="btn btn-purple2 fs-19 fw-700"
                  style={{ width: 230 }}
                >
                  {meet.ctaLabel}
                </button>
                <div className="fix-object-img-w-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/meet-laptop.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqBlock items={content.faq} />

      <section className="pt-0 mobile-pgs-info">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 m-auto">
              <div className="d-flex align-items-center justify-content-center m-d-flex">
                <div className="w-20 new-black-m">
                  <h5 className="mb-0 bg-black text_purple_bg">#PGS</h5>
                  <p className="text-black fs-15 mb-0">#StudentSupportHub</p>
                </div>
                <div className="w-40">
                  <h6 className="mb-2 text-black d-flex gap-2 fs-20 fw-500">
                    <span className="w-20 ml-3 px-1 bg-yellow fs-18 d-inline-block">
                      Call Us{" "}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/phone.png" width={20} alt="" />
                    {contact.phone}
                  </h6>
                  <h6 className="mb-2 text-black d-flex gap-2 fs-20 fw-500">
                    <span className="w-20 ml-3 px-1 bg-yellow fs-18 d-inline-block">
                      Email Us
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/phone.png" width={20} alt="" />
                    {contact.email}
                  </h6>
                </div>
                <div className="w-15">
                  <p className="text-black font-style-italic fs-15 lh-20">
                    {contact.blurb}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PgsPicksSection />
      </div>

      {expenseOpen ? (
        <div
          className="mobile-applicant pgs-modal premium-modal-overlay modal-pgsamc"
          style={{ display: "flex" }}
        >
          <div className="premium-modal-container purple-modal d-flex">
            <div className="panel-left">
              <button
                className="close-btn desktop-none"
                type="button"
                aria-label="Close"
                onClick={() => setExpenseOpen(false)}
              >
                ✕
              </button>
              <div className="brand-row">
                <div className="brand-title">#PGS</div>
                <div className="heart-badge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/heart.gif" alt="" />
                </div>
              </div>
              <div className="sub-label fnt-family">
                medical pathway finance
              </div>
              <p className="tagline lh-18ppx">
                Prepping your medical journey? Figure out your expenses
              </p>
              <div className="boost-wrap">
                <div className="mobile-none" style={{ margin: "0 0 0 auto" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/arrow-modal.png"
                    style={{ width: 95, marginLeft: -10 }}
                    alt=""
                  />
                  <span className="w-full d-block fs-16 text-white lh-18">
                    get the <br />
                    boost <br /> your <br /> deserves
                  </span>
                </div>
                <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/bump.png" alt="" />
                </div>
                <div className="desktop-none">
                  <p className="mb-0 fs-14 lh-20 fw-400 text-white">
                    get the boost your <br /> PREP deserves
                  </p>
                </div>
              </div>
            </div>
            <div className="panel-right">
              <button
                className="close-btn mobile-none"
                type="button"
                aria-label="Close"
                onClick={() => setExpenseOpen(false)}
              >
                ✕
              </button>
              {expenseDone ? (
                <div className="success-msg" style={{ display: "block" }}>
                  <div className="checkmark">🎉</div>
                  <h3>You&apos;re all set!</h3>
                  <p>
                    Your personalised checklist is on its way.
                    <br />
                    Check your inbox soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!expenseName.trim() || !expenseEmail.includes("@"))
                      return;
                    setExpenseDone(true);
                  }}
                >
                  <div className="field-group">
                    <div className="field">
                      <input
                        type="text"
                        placeholder="Enter Name *"
                        autoComplete="name"
                        required
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        type="email"
                        placeholder="Email *"
                        autoComplete="email"
                        required
                        value={expenseEmail}
                        onChange={(e) => setExpenseEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        type="tel"
                        placeholder="Phone (Whatsapp number preffered)"
                        autoComplete="tel"
                        value={expensePhone}
                        onChange={(e) => setExpensePhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <br />
                  <div>
                    <p className="section-label mb-2">
                      What describes you best?
                    </p>
                    <div className="d-flex gap-3">
                      <select className="modal-btn-pgs" defaultValue="1">
                        <option value="1">1st year Prep?</option>
                        <option value="2">1st year Prep? - 1</option>
                      </select>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/arrow-btn.png"
                        style={{ width: 26, height: 26 }}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="cta-row mt-5">
                    <button className="cta-btn" type="submit">
                      GET MY EXPENSE CHECKLIST
                      <span className="arrow">←</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
