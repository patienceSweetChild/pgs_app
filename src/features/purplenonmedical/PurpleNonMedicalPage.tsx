"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { HighlightsSection } from "@/components/HighlightsSection";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import {
  CV_CHECKLIST,
  DASHBOARD_FEATURES,
  FAQ_ITEMS,
  MEET_BULLETS,
  OFFER_INCLUDED,
  STUDENT_CAPTION,
  TESTIMONIAL_QUOTE,
  WHY_BUILT_BULLETS,
} from "./content";

function FaqBlock() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq_section">
      <div className="w-899px m-auto overlap-gap-section p-0">
        <div className="bg-very-light-green xl-p-4 md-p-50px sm-p-30px mobile-p-0">
          <h2 className="fac-title">FAQ’s</h2>
          <div className="accordion accordion-style-02">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  className={`accordion-item${isOpen ? " active-accordion" : ""}`}
                  key={`${item.q}-${i}`}
                >
                  <div className="accordion-header border-color-extra-medium-gray">
                    <a
                      href={`#purplenonmedical-faq-${i}`}
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

/**
 * Non-medical #purplePremium page — from standalone-html/purplenonmedical.html
 */
export function PurpleNonMedicalPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDone, setModalDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function openModal() {
    setModalDone(false);
    setModalOpen(true);
  }

  function onModalSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setModalDone(true);
  }

  return (
    <>
      <div className="wrapper-content">
        <section className="pt-0 about-section half-section overlap-height position-relative minus-5 mobile-board-2">
          <div className="container overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="w-75 m-auto text-center">
                  <h1 className="text-black fw-500 fs-36 pt-0 mb-1 lh-40">
                    Get Into Your Dream University Abroad with a Structured
                    Workflow
                  </h1>
                  <p className="mb-0 lh-20 fs-16">
                    Boost Your Chances of Selection 3X with Smart, Informed
                    University Picks
                  </p>
                  <h6 className="mb-0 text-black fs-16 mt-0">
                    For Medical, STEM, and More—We’ve Got You Covered
                  </h6>
                  <button
                    type="button"
                    className="btn btn-purple mt-1 bg-black-btn fs-11 mb-0"
                    onClick={openModal}
                  >
                    Set Up a Quick Call
                  </button>
                  <p className="mb-0 fs-12 lh-15 mt-1">
                    Clear All Your Doubts in 30 Minutes, Figure out your
                    scholarship path.
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
                  <img src="/assets/img/music.png" alt="" />
                  <div className="minus-5">
                    <h4 className="fnt-family mb-0 fs-95 text-black">
                      Step into
                    </h4>
                    <h4 className="mb-0 fs-95 text-black d-flex gap-3 align-items-end lh-80">
                      <span className="fnt-family">#purplepremium </span>
                      <span className="fs-28 lh-35 mb-1 fw-500">
                        Masters, STEM
                        <br />
                        UG, MBA & Others
                      </span>
                    </h4>
                  </div>
                </div>
                <p className="text-center fs-22 mobile-pt-2">
                  Backed by experience. Trusted by students since 2006 (formerly
                  CEG).
                </p>
              </div>
              <div className="col-lg-9 mt-8 mobile-w-80 mobile-auto">
                <h3 className="text-black fnt-family w-80 mb-1 m-auto d-flex justify-content-center fs-38 lh-32 text-center mobile-fs-24 mobile-lh-full mobile-pt-5">
                  Why We Built #PurplePremium <br />
                  (And Why It Matters)
                </h3>
                <div className="w-555px m-auto">
                  <h5 className="text-black fs-17 mt-2 fw-600 mb-1">
                    The high-stakes medical pathways:
                  </h5>
                  <ul className="p-0">
                    {WHY_BUILT_BULLETS.map((text) => (
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
                    This is where #purplePremium comes in.
                  </h6>
                  <p className="mb-0 text-black fs-14 lh-full">
                    Because not every journey needs the same map. Explore them
                    below.
                  </p>
                </div>
              </div>
            </div>
            <div className="row align-items-center justify-content-md-start mt-3 mobile-new-bg-path">
              <div className="col-lg-5 col-md-5 position-relative md-mb-50px sm-mb-40px">
                <figure className="position-relative text-center mb-8 fix-object-cover-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/play-book-read.png"
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
                    For all from — STEM, Management, Design & More.
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
                    Your path.
                    <br />
                    Let’s get started.
                  </h6>
                </div>
                <br />
                <br />
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-11">
                <div className="d-flex gap-5 mobile-wrap">
                  <div className="w-50 mobile-w-65 mobile-auto">
                    <h5 className="mb-3 fs-20 text-black fw-500 lh-22">
                      Getting into a medical pathway that’s well-researched
                      matters, a lot.
                    </h5>
                    <p className="text-black fs-14 lh-full mb-8">
                      Let’s be real—studying abroad isn’t just “another phase.”
                      And it’s not just about taking classes. You’re chasing
                      that high-paying job, aiming to build a global network,
                      and picking up real skills that actually make you stand
                      out.
                    </p>
                    <h5 className="mb-0 fs-17 text-black fw-600 lh-20">
                      You need to start thinking like a recruiter.
                    </h5>
                    <p className="text-black fs-12 fw-500 mobile-fs-14">
                      What are they going to see when they open your CV
                      post-graduation?
                    </p>
                    <div className="d-flex gap-3 ml-7">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/filter-line.png" alt="" />
                      <ul className="mb-0 p-0 mobile-checklist-medical">
                        <li className="fs-14 lh-14 mb-1 fw-300 mb-5">
                          You guessed it, it’s not just about the degree,{" "}
                          <br />
                          —it all stacks up.&nbsp;
                        </li>
                        {CV_CHECKLIST.map(({ dot, text }) => (
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
                        Study Abroad Pathway
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
                        un-planned
                      </p>
                      <p
                        className="text-black fs-20 fw-300 mt-10 mobile-fs-16"
                        style={{ fontFamily: "'Roboto Mono'" }}
                      >
                        well-researched 🙌
                      </p>
                      <div
                        className="frame-set-content"
                        style={{
                          backgroundImage: "url('/assets/img/frame-set.png')",
                        }}
                      >
                        <h5 className="fw-500">
                          It’s about launching your future. You owe it to
                          yourself to do it right. And we’re here to make sure
                          you do. <b>#pgs</b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="left-4 top-50s pb-200 mobile-pb-100">
          <div className="container">
            <div className="row">
              <div className="w-900px m-auto position-relative purple-section ">
                <div className="purple-gray-box ht-786px">
                  <h1 className="fnt-family text-green fs-38 d-flex align-items-center gap-2 mobile-fs-30 mobile-lh-full mobile-mb-0 mobile-justify-center mobile-w-full">
                    #purplePremium{" "}
                    <span className="text-red fs-19">MEDICAL PATHWAY</span>
                  </h1>
                  <div className="text-center mobile-text-start w-75 m-auto mt-6 mobile-w-80 mobile-mt-0">
                    <h3 className="fnt-family mb-1 fs-38 text-black mobile-fs-20 mobile-text-center">
                      Study Abroad Deadlines Sneak Up Fast
                    </h3>
                    <h6 className="fs-17 lh-22 fw-400 text-black mb-3 mobile-fs-14 mobile-text-center">
                      Fall 2025 Is Already Ticking
                    </h6>
                    <h6 className="fs-14 lh-19 fw-400 lh-22 text-black mb-1 mobile-fs-14">
                      If you haven’t sorted your profile, picked your countries
                      and unis, <br /> or planned your SOP yet… hey, no
                      stress—but it’s definitely time to move!
                    </h6>
                    <p className="fs-17 lh-22 mb-1 text-center mobile-text-start pb-2 mobile-fs-14 mobile-lh-full">
                      Good News: #purplePremium Will Guide You the Rest of the
                      Way.
                    </p>
                    <Link
                      href="#offer_script"
                      className="btn btn-green-btn mb-5 fs-16 fw-600 mobile-fs-14"
                    >
                      Start Your #purplePremium Journey
                    </Link>
                  </div>
                  <div className="d-flex align-items-start gap-3 mt-2 position-relative justify-content-center mobile-respo-box-1">
                    <div className="w-148px">
                      <div className="card-box-border h-256px">
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

                    <div className="w-300px">
                      <div className="card-box-border">
                        <div className="mb-5 icon-box-position d-flex align-items-center gap-2 justify-content-start">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/desk-user.png"
                            className="mb-0"
                            alt=""
                          />
                          <span className="fs-12">Book feedback sessions</span>
                        </div>
                        <div className="calendar-box-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/bookcalendar.png" alt="" />
                        </div>
                      </div>
                    </div>

                    <div className="card-box-border d-flex gap-3 justify-content-start w-230px">
                      <div className="icon-box-position">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/user-edit.png" alt="" />
                      </div>
                      <div className="bg-light-box">
                        <h6>
                          Fast-tracked
                          <br />
                          applications
                        </h6>
                        <h6>+</h6>
                        <h6>Result-driven SOP</h6>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex mt-3 position-relative mobile-respo-box-2 mobile-block-flex">
                    <div className="w-85">
                      <div className="d-flex gap-3 justify-content-space align-items-start gap-3 mt-2">
                        <div className="w-250px m-last">
                          <h6 className="mb-0 text-black fs-11 lh-16 fw-500">
                            Simple, clear, useful
                          </h6>
                          <p className="fw-300 text-black fs-13 lh-full">
                            Using our experience, feedback from students who
                            made it, and insights from thousands of real
                            applications—we’ve built an approach that puts you,
                            the student, at the center ❤️
                          </p>
                        </div>
                        <div className="w-174px minus-5 h-244px mb-2">
                          <div className="card-box-border">
                            <div className="icon-box-position">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/assets/img/topy.png" alt="" />
                              <span className="fs-30 fw-500 text-black">+</span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/assets/img/stemp.png" alt="" />
                            </div>
                            <div className="bg-light-box mt-10">
                              <h6>Scholarship alerts</h6>
                              <h6>+</h6>
                              <h6>Key Checklists</h6>
                            </div>
                            <div className="bg-light-box mt-10">
                              <h6>Country-wise steps</h6>
                              <h6>+</h6>
                              <h6>Visa status</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-10 mb-10 w-65 m-last mobile-top-new">
                        <span className="fnt-family fs-40 text-black">“</span>
                        <p className="mb-0 fs-12 lh-full text-black">
                          {TESTIMONIAL_QUOTE}
                          <span className="fnt-family fs-40 text-black d-block m-last text-end">
                            ”
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="w-50 m-auto">
                      <div className="flot-box-img-set">
                        <div className="img-box-steps position-relative">
                          <span className="first-bg-step" />
                          <span className="second-bg-step" />
                          <span className="third-bg-step" />
                          <div className="caption-img-box">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/img/photo-2.jpg" alt="" />
                            <div className="d-flex position-relative z-100 justify-content-space px-4">
                              <div>
                                <h5 className="fs-35 lh-30 fnt-family text-white mb-0">
                                  {STUDENT_CAPTION.name}
                                </h5>
                                <p className="mb-0 fs-15 text-white mb-0">
                                  {STUDENT_CAPTION.label}
                                </p>
                              </div>
                              <div>
                                <h5 className="fs-35 lh-30 fnt-family text-white mb-0 mobile-nowrap">
                                  {STUDENT_CAPTION.country}
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
            </div>
          </div>
        </section>

        <section className="pt-2 minus-5">
          <div className="w-990px m-auto">
            <div className="col-lg-12">
              <div className="bg-black what-is-purple border-radius-10px pt-5">
                <div className="w-80 mobile-w-full">
                  <h5 className="text_purple fs-50 fw-500 mobile-fs-24 mobile-lh-full">
                    <span className="mobile-fs-20 mobile-d-block">What</span> Is
                    #purplePremium?
                    <span className="fnt-family fs-19 lh-22 text-red mobile-fs-32 mobile-non-title">
                      for non medical
                    </span>
                  </h5>
                  <h6 className="text-white now fs-16 fw-300 mb-1 d-flex gap-3 ">
                    <b className="nowrap fw-600 mobile-nowrap mobile-fs-14">
                      Short answer?
                    </b>
                    It’s your full study abroad counseling service.
                  </h6>
                  <h6 className="text-white now fs-16 fw-300 mb-1 d-flex gap-3 lh-19">
                    <b className="nowrap fw-600 mobile-nowrap mobile-fs-14">
                      Real answer?&nbsp;&nbsp;
                    </b>
                    It’s the only support system you’ll need to get from “Where
                    do I start?” to “I just landed at my dream university.
                  </h6>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-4 w-80 mt-3 mb-3 m-auto position-relative mobile-wrap mobile-reverse mobile-w-60 mobile-last">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/arrow-dot-yellow-right.png"
                    className="position-absolute img-arrow-set"
                    alt=""
                  />
                  <div className="mobile-d-block mobile-w-full mobile-text-end">
                    <h5 className="mb-0 text_purple fs-19 fw-500 lh-22 mobile-fs-14 mobile-lh-full">
                      Here’s what you’re getting out of it—
                    </h5>
                    <p className="mb-0 fw-300 text_purple fs-17 mobile-fs-14 mobile-lh-full">
                      (And this is where we stand out)
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-4 justify-content-start mobile-wrap">
                  <div className="w-60 mobile-w-full">
                    <div>
                      <h4 className="mb-0 text-white fs-19 lh-22 fw-600 mb-2 mobile-fs-14 mobile-lh-14">
                        🎯 1. AI + Human Profile Analysis
                      </h4>
                      <p className="text-white lh-20 fw-300 fs-16 px-5 mobile-fs-14 mobile-lh-16">
                        Our custom-built AI agents go through your CV, goals, and
                        requirements—quickly identifying strengths, concerns,
                        and what else can boost your profile. Then our
                        experienced counselors step in to cross-check those
                        insights, verify them against your documents, and build
                        a detailed profile tailored for your journey—bringing
                        human expertise where it counts.
                      </p>

                      <div className="mb-5 desktop-none">
                        <h4 className="mb-0 text-white fs-19 lh-22 fw-600 mb-2 mobile-fs-14 mobile-lh-14">
                          🧩 2. A Pathway Made Just for You
                        </h4>
                        <p className="text-white lh-20 fw-300 fs-16 px-5 mobile-fs-14 mobile-lh-16">
                          We don’t believe in one-size-fits-all. You’ll either
                          be guided through one of our proven admission pathways
                          or we’ll design a custom route that fits your academic
                          goals, timelines, and personal preferences.
                        </p>
                      </div>

                      <div className="mt-4 w-70 m-auto mb-3">
                        <h4 className="text-yellow fs-18 lh-25 mobile-fs-12 mobile-lh-12 mobile-text-center">
                          We use AI to assist—not{" "}
                          <span className="desktop-none">
                            <br />
                          </span>{" "}
                          replace—real experience.
                        </h4>
                        <div className="d-flex gap-3">
                          <div className="w-40">
                            <h3 className="text-green fw-500 mb-0">7x</h3>
                            <p className="text-white fw-500 mb-0 mobile-fs-12">
                              faster profiling
                            </p>
                            <div className="bg-green w-100 h-10px border-radius-6px mb-4" />
                            <div className="bg-dark-gray-1 w-40 h-10px border-radius-6px" />
                          </div>
                          <div className="w-40">
                            <h3 className="text-green fw-500 mb-0">5x</h3>
                            <p className="text-white fw-500 mb-0 mobile-fs-12">
                              faster profiling
                            </p>
                            <div className="bg-green w-100 h-10px border-radius-6px mb-4" />
                            <div className="bg-dark-gray-1 w-60 h-10px border-radius-6px" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mobile-none">
                      <h4 className="mb-0 text-white fs-19 lh-22 fw-600 mb-2 mobile-fs-14 mobile-lh-14">
                        🌍 4. A Growing Student Community
                      </h4>
                      <p className="text-white lh-20 fw-300 fs-16 px-5 mobile-fs-14 mobile-lh-16">
                        we’re building a secure forum where students can
                        connect, share their journeys, and support one
                        another—created for all our past, present, and future
                        students. As a #purplePremium student, you’ll be among
                        the first to join, at no extra cost.
                      </p>
                    </div>
                  </div>
                  <div className="w-60 mobile-w-full">
                    <div className="mb-5 mobile-none">
                      <h4 className="mb-0 text-white fs-19 lh-22 fw-600 mb-2 mobile-fs-14 mobile-lh-14">
                        🧩 2. A Pathway Made Just for You
                      </h4>
                      <p className="text-white lh-20 fw-300 fs-16 px-5 mobile-fs-14 mobile-lh-16">
                        We don’t believe in one-size-fits-all. You’ll either be
                        guided through one of our proven admission pathways or
                        we’ll design a custom route that fits your academic
                        goals, timelines, and personal preferences.
                      </p>
                    </div>
                    <br />

                    <div className="bg-black-light box-black-none align-items-start p-2 border-radius-10px mobile-box-style01 mobile-pb-10">
                      <div className="d-flex gap-2">
                        <div className="w-50 mobile-w-50 mobile-box-bg">
                          <h4 className="text-white fs-19 lh-22 fw-500 mb-2 mobile-fs-14 mobile-lh-full mobile-pb-4">
                            📌 3. End-to-End Support for Your Study Abroad
                            Journey—Every Step, Covered.
                          </h4>
                          <div className="d-flex justify-content-end align-items-start gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/assets/img/college-white-icon.png"
                              alt=""
                            />
                            <div className="vertcal-graph bg-purple border-green-6px h-143px w-20 border-radius-10px d-flex justify-content-center align-items-end">
                              <span className="fnt-family text-white fs-18 ">
                                Join
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-white lh-19 fw-400 fs-14 px-2 w-50 mb-1 mobile-w-50 mobile-pt-2 mobile-fs-14">
                          #purplePremium isn’t just about helping with the
                          application. We’ll be with you every step of the
                          way—from shortlisting universities to help craft your
                          SOP, guiding you through visa steps, and even helping
                          with your packing list. All the way until you’re
                          settled in at your university—and beyond that, if you
                          ever need us.
                        </p>
                      </div>
                    </div>

                    <div className="desktop-none">
                      <h4 className="mb-0 text-white fs-19 lh-22 fw-600 mb-2 mobile-fs-14 mobile-lh-14">
                        🌍 4. A Growing Student Community
                      </h4>
                      <p className="text-white lh-20 fw-300 fs-16 px-5 mobile-fs-14 mobile-lh-16">
                        we’re building a secure forum where students can
                        connect, share their journeys, and support one
                        another—created for all our past, present, and future
                        students. As a #purplePremium student, you’ll be among
                        the first to join, at no extra cost.
                      </p>
                    </div>

                    <div className="box-img-group mt-4 w-70 m-auto mobile-w-90">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="img-box-object">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/girl-pick-1.jpg" alt="" />
                        </div>
                        <div className="bg-black-light p-2 border-radius-10px">
                          <h5 className="text-yellow fnt-family fs-19 lh-20 mb-0">
                            Whatever your stream; design, STEM, or management
                            —this is your launchpad.
                          </h5>
                        </div>
                      </div>
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
                      From your first step to your final admit or medical
                      pathway — our expert counselors guide the entire journey
                      with you.
                      <span className="fnt-50 dot-flot-1">”</span>
                    </span>
                  </h5>
                  <div className="tag-comment lt-1">
                    <div className="tag-border">purpleguide.study</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-11 m-auto mobile-p-0">
                <h3 className="text-black fnt-family w-60 fs-38 lh-full text-center m-auto mobile-fs-24 mobile-w-full">
                  Unlock the full power of your personalized <br /> dashboard
                  with Purple Premium
                </h3>
                <div className="box-img-grid-gorup grid-block-size mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/restro-img.jpg"
                    className="border-radius-10px"
                    alt=""
                  />
                </div>
                <div className="line-active" />
                <div className="group-flex-items mt-4 d-flex wrap justify-content-space mobile-scrolling-nowrap">
                  {DASHBOARD_FEATURES.map((title) => (
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

        <section>
          <div className="w-990px m-auto">
            <div className="row">
              <div className="col-lg-12">
                <div className="liner-boder-section">
                  <div className="d-flex gap-5 justify-content-center align-items-center mobile-wrap">
                    <div className="w-50 mobile-w-full mobile-pt-0">
                      <div>
                        <h4 className="mb-3 fs-28 text-black lh-35 fw-500 mobile-fs-14 mobile-lh-full">
                          If you&apos;re aiming for one of those globally ranked
                          universities
                        </h4>
                        <p className="mb-5 text-black lh-28 fs-22 mobile-fs-14 mobile-lh-full">
                          You already know it’s a whole different game. Grades
                          and test scores aren’t enough. They’re after
                          originality, leadership, depth, and purpose. In short:
                          the full package.
                        </p>
                        <p className="fw-500 text-black mb-10 fs-19 lh-25 mobile-fs-14 mobile-lh-full mobile-mb-0">
                          We’ll help you build exactly that—step by step.
                        </p>
                      </div>
                      <br />
                      <h3 className="text-black fnt-family mb-3 mt-5 fs-38 fw-400 lh-full mobile-fs-24 mobile-text-center mobile-br-none">
                        Get your profile reviewed for <br /> entry into
                        world-class <br /> institutions.
                      </h3>
                      <button
                        type="button"
                        className="btn btn-black border-radius-10px fw-400 mobile-auto mobile-d-block"
                        onClick={openModal}
                      >
                        Evaluate Your Profile Today
                      </button>
                    </div>
                    <div className="w-50 position-relative mobile-w-full">
                      <div className="w-325px light-gray-1 w-90 d-flex align-items-start gap-2 m-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/watch.gif"
                          width={60}
                          className="mobile-w-40px"
                          alt=""
                        />
                        <div className="bg-black p-3 border-radius-10px mobile-w-60">
                          <h2 className="mb-0 fnt-family text-white fs-38 mobile-fs-28">
                            We open limited slots each month
                          </h2>
                        </div>
                      </div>
                      <br />
                      <div className="custom-frame d-flex align-items-start gap-3 mt-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/border-house.png"
                          className="moble-home-icon"
                          style={{
                            position: "absolute",
                            width: 48,
                            marginLeft: -79,
                            marginTop: 24,
                          }}
                          alt=""
                        />
                        <div className="fit-object-cover">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/mask-img.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <HighlightsSection />

      <div className="wrapper-content">
        <section
          className="pt-20 js-purplepremium-offer-section"
          id="offer_script"
        >
          <div className="w-899px m-auto">
            <div className="row justify-content-center mobile-row-0">
              <div className="mobile-p-0">
                <div className="box-gray-2 border-radius-10px">
                  <div className="w-90 m-auto">
                    <div className="w-95 card-box-border bg-white border-black pt-4 m-auto mobile-bg-white">
                      <h1 className="fnt-family text-black w-75 fs-50 lh-45 mb-0 mobile-fs-24 mobile-lh-full mobile-pb-4">
                        START YOUR USMLE JOURNEY WITH #PURPLEPREMIUM
                      </h1>
                      <p className="text-black fs-12 lh-18 w-75 mb-0 pb-4 mobile-lh-full mobile-fs-14">
                        Every student&apos;s journey takes time, attention, and
                        real mentorship. That&apos;s why we limit the number of
                        students each batch - so our experts can actually guide,
                        not just supervise.
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
                            35% off
                          </span>{" "}
                          <del className="fw-300 fs-25 mobile-fs-16">
                            was ₹ 509,999
                          </del>
                        </span>
                      </h6>
                      <h2 className="mb-4 text-white fw-800 fs-50 lh-30 mobile-text-center">
                        ₹ 65,0000
                      </h2>
                      <Link
                        className="btn btn-purple2 text-black fw-500 w-230px mt-2 fs-19"
                        href="/purplepremiumhome"
                      >
                        Enroll Now
                      </Link>
                    </div>
                    <h1 className="mb-0 fs-28 mt-4 fnt-family text-black mobile-fs-24">
                      What’s Included when you sign up:
                    </h1>
                    <p className="fw-400 fs-12 lh-16 text-black mobile-fs-14 mobile-lh-full">
                      A 10-point journey built by seeing what USMLE aspirants
                      really go through—and what kind of support actually makes
                      a difference.
                    </p>
                    <ul className="check-list">
                      {OFFER_INCLUDED.map((item) => (
                        <li key={item.main}>
                          <i className="bi bi-check-circle-fill" />
                          <div>
                            {item.main}
                            {"sub" in item && item.sub
                              ? item.sub.map((line) => (
                                  <span
                                    className="d-block fs-12 fw-300 lh-16 mobile-fs-14"
                                    key={line}
                                  >
                                    {line}
                                  </span>
                                ))
                              : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="group-of-box-bottom d-flex gap-2 align-items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/high-fiy.png" alt="" />
                  <h5 className="fw-400 text-black fs-12 lh-full mb-0">
                    You get full access for a year—and even after that, we’re
                    still here when you need us. From Step 1 to Step 2, we’ve
                    got the tools, tips, and real guidance to back you up.
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
                    Got questions about <br />
                    #purplePremium?{" "}
                  </h3>
                  <p className="text-green fs-17 fw-500 mobile-fs-14 mobile-lh-full mobile-w-50 mobile-mb-0">
                    Let’s clear them in one quick call.
                  </p>
                </div>
                <ul className="p-0 m-0">
                  {MEET_BULLETS.map((line) => (
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
                    MEET + GREET
                  </h5>
                  <h4 className="mb-0 fs-32 mobile-pb-2">
                    <b>With an Expert</b>
                  </h4>
                  <p className="mb-3 fs-12 fw-300">
                    Check the available slots & book your appointment.
                  </p>
                  <button
                    type="button"
                    className="btn btn-purple2 fs-19 fw-700"
                    style={{ width: 230 }}
                    onClick={openModal}
                  >
                    Schedule Now
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

        <FaqBlock />

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
                      91 95665 66298
                    </h6>
                    <h6 className="mb-2 text-black d-flex gap-2 fs-20 fw-500">
                      <span className="w-20 ml-3 px-1 bg-yellow fs-18 d-inline-block">
                        Email Us
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/phone.png" width={20} alt="" />
                      connect@purpleguide.study
                    </h6>
                  </div>
                  <div className="w-15">
                    <p className="text-black font-style-italic fs-15 lh-20">
                      Reach out on our helpline for fast bookings, expert
                      advice, and answers to all your study abroad questions.
                      We’ve also got dedicated mentor groups for medical and
                      non-medical courses—so you’re always connected to the
                      right people.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PgsPicksSection />
      </div>

      {modalOpen ? (
        <div
          className="mobile-applicant pgs-modal premium-modal-overlay"
          style={{ display: "flex" }}
        >
          <div className="premium-modal-container purple-modal d-flex">
            <div className="panel-left">
              <button
                className="close-btn desktop-none"
                type="button"
                aria-label="Close"
                onClick={() => setModalOpen(false)}
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
              <div className="sub-label fnt-family">#purplePremium</div>
              <p className="tagline lh-18ppx">
                Book a quick call or get your profile evaluated
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
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
              {modalDone ? (
                <div className="success-msg" style={{ display: "block" }}>
                  <div className="checkmark">🎉</div>
                  <h3>You&apos;re all set!</h3>
                  <p>
                    Thanks for reaching out.
                    <br />
                    We&apos;ll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={onModalSubmit}>
                  <div className="field-group">
                    <div className="field">
                      <input
                        type="text"
                        placeholder="Enter Name *"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        type="email"
                        placeholder="Email *"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        type="tel"
                        placeholder="Phone (Whatsapp number preffered)"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="cta-row mt-5">
                    <button className="cta-btn" type="submit">
                      Submit
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
