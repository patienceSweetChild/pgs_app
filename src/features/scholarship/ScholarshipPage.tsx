"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useCmsShell } from "@/components/layout/cms-shell";
import {
  APPLICATION_STEPS,
  EXAMPLE_SCHOLARSHIPS,
  FAQ_ITEMS,
  FAQ_TAB_PLACEHOLDERS,
  FAQ_TABS,
  MODAL_COUNTRIES,
  MODAL_LEVELS,
  PROCESS_CHECKLIST,
  SCENARIO_CARDS,
  TESTIMONIALS,
  TIP_SLIDES,
} from "./content";
import "./scholarship.css";

function KnowSection() {
  const [tab, setTab] = useState<(typeof FAQ_TABS)[number]["id"]>("tab_1");
  const [openQ, setOpenQ] = useState(0);

  return (
    <section className="pt-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h5 className="text-black fs-25 mb-1 mobile-fs-20">
              Things you should know
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
                          href={`#scholarship-${t.id}`}
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
                      {FAQ_ITEMS.map((item, i) => {
                        const open = openQ === i;
                        return (
                          <div
                            className={`accordion-item border-bottom${
                              open ? " active-accordion" : ""
                            }${i === 0 ? " pt-0" : ""}`}
                            key={item.q}
                          >
                            <div
                              className={`accordion-header border-color-extra-medium-gray${
                                i === 0 ? " pt-0" : ""
                              }`}
                            >
                              <a
                                href={`#scholarship-faq-${i}`}
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
                                  <span className="fw-600 fs-17 mobile-fs-14 mobile-lh-full lh-22 ls-minus-05px">
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
                      ? FAQ_TAB_PLACEHOLDERS.tab_2
                      : FAQ_TAB_PLACEHOLDERS.tab_3}
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

function TipsCarousel() {
  const [index, setIndex] = useState(0);
  const len = TIP_SLIDES.length;
  const tip = TIP_SLIDES[index];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 3000);
    return () => window.clearInterval(id);
  }, [len]);

  return (
    <section className="overflow-hidden mb-5">
      <div className="scholarship-tip-carousel">
        <div className="scholarship-tip-carousel__track">
          <button
            type="button"
            className="scholarship-tip-carousel__nav"
            aria-label="Previous tip"
            onClick={() => setIndex((i) => (i - 1 + len) % len)}
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="card-gray-1 text-center scholarship-tip-carousel__card">
            <h5 className="fw-500 bg-black text-black d-inline-block text-white fs-20 px-2 border-radius-6px mb-2 mobile-fs-14">
              {tip.tag}
            </h5>
            <h3 className="mb-0 fs-19 lh-full w-80 m-auto text-black text-uppercase mobile-fs-14 mobile-lh-full">
              {tip.body}
            </h3>
          </div>
          <button
            type="button"
            className="scholarship-tip-carousel__nav"
            aria-label="Next tip"
            onClick={() => setIndex((i) => (i + 1) % len)}
          >
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
        <div
          className="scholarship-tip-dots"
          role="tablist"
          aria-label="Tip slides"
        >
          {TIP_SLIDES.map((slide, i) => (
            <button
              key={`${slide.tag}-${i}`}
              type="button"
              className={i === index ? "is-active" : ""}
              aria-label={`Go to tip ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock() {
  const { testimonials } = useCmsShell();
  const [index, setIndex] = useState(0);
  const items =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          quote: t.quote,
          name: t.name,
          role: t.role,
          image: t.image || "/assets/img/selfe.jpg",
        }))
      : [...TESTIMONIALS];
  const len = Math.max(1, items.length);
  const t = items[index % len];

  return (
    <div className="d-flex mobile-juftify-center">
      <div className="mb-5 w-15 mt-1 text-start text-black" />
      <div className="w-300px mt-2 testimonials-section">
        <div className="justify-content-cente position-relative">
          <div className="overflow-hidden m-auto">
            <div className="xl-outside-box-right-20 sm-outside-box-right-0">
              <div className="pt-30px pb-30px">
                <div className="testimonials full-items-width">
                  <div className="item-clients">
                    <div className="fit-object-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.image} alt="" />
                    </div>
                    <div className="review-content bg-black p-3">
                      <p className="text-white lh-18 fs-10 w-90 mb-2">
                        {t.quote}
                      </p>
                      <div className="author-info">
                        <h6 className="mb-0 fs-11 lh-18 text-white">{t.name}</h6>
                        <p className="text-white fs-9 lh-14 mb-2 mt-2 opacity-08">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-2">
            <button
              type="button"
              className="slider-one-slide-prev-1 text-dark-gray swiper-button-prev slider-navigation-style-04"
              aria-label="Previous testimonial"
              onClick={() => setIndex((i) => (i - 1 + len) % len)}
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            <button
              type="button"
              className="slider-one-slide-next-1 text-dark-gray swiper-button-next slider-navigation-style-04"
              aria-label="Next testimonial"
              onClick={() => setIndex((i) => (i + 1) % len)}
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Scholarship guide page — from standalone-html/scholarship.html
 */
export function ScholarshipPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<string>(MODAL_COUNTRIES[0].value);
  const [level, setLevel] = useState<string>(MODAL_LEVELS[0].value);

  function openModal() {
    setSuccessOpen(false);
    setModalOpen(true);
  }

  function closeModals() {
    setModalOpen(false);
    setSuccessOpen(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setModalOpen(false);
    setSuccessOpen(true);
  }

  return (
    <>
      <div className="wrapper-content">
        <section
          id="scholarship"
          className="pt-0 about-section half-section overlap-height position-relative minus-5 mobile-scholarship-cart"
        >
          <div className="container overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="w-75 m-auto text-center mobile-text-start">
                  <h1 className="text-black fw-500 fs-36 pt-0 mb-1 lh-40">
                    #PGS Scholarship Guide
                  </h1>
                  <p className="mb-0 lh-20 fs-16 mobile-fs-14 mobile-lh-full mobile-pb-4">
                    Personalized help to get the scholarships that actually fit
                    you. We help you zero in on the ones that make sense for
                    you, based on your profile and the path you’re aiming for.
                  </p>
                  <h6 className="mb-0 text-black fs-16 mt-0 mobile-fs-12 mobile-lh-15 mobile-pb-4">
                    For Medical, STEM, and More—We’ve Got You Covered
                  </h6>
                  <button
                    type="button"
                    className="btn btn-purple mt-1 bg-black-btn fs-11 mt-1 mb-0 px-1 mobile-fs-15 mobile-text-start"
                    onClick={openModal}
                  >
                    Book Your Free Scholarship Call
                  </button>
                  <p className="mb-0 fs-12 lh-15 mt-1 text-black">
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
              <div className="w-877px p-0">
                <div className="card-box-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/music.png" alt="" />
                  <div className="minus-5">
                    <h4 className="fnt-family mb-0 fs-95 text-black">
                      Step into
                    </h4>
                    <h4 className="mb-0 fs-95 text-black d-flex gap-3 align-items-end lh-80">
                      <span className="fnt-family">#purplepremium </span>
                      <span className="fs-28 fw-500 lh-34 mb-2">
                        For Scholarships{" "}
                      </span>
                    </h4>
                  </div>
                </div>
                <p className="text-center fs-22 mobile-pt-3">
                  Backed by experience. Trusted by students since 2006 (formerly
                  CEG).
                </p>
              </div>
              <div className="col-lg-7 mt-5 mobile-w-60 mobile-auto">
                <div className="mobile-pb-10">
                  <p className="text-black mb-1 fs-19 lh-25 mobile-fs-14 mobile-lh-full mobile-pb-4">
                    Scholarships are one of the best ways to reduce the cost of
                    studying abroad.{" "}
                    <b className="italic-texts">
                      And when you land a well-known one, it doesn’t just save
                      money, it makes your profile stand out!
                    </b>
                  </p>
                  <p className="text-black mb-3 fs-19 lh-25 mobile-fs-14 mobile-lh-full ">
                    There are all kinds of scholarships available : merit-based,
                    need-based, university-specific, and even ones offered
                    through government tie-ups between countries.
                  </p>
                  <h5 className="mb-1 text-black fs-19 lh-25 mobile-fs-16 mobile-lh-16 mobie-pb-2">
                    For example -
                  </h5>
                  <ul className="check-list fs-18">
                    {EXAMPLE_SCHOLARSHIPS.map((s) => (
                      <li className="fs-14 lh-20" key={s.name}>
                        <i className="bi bi-check-circle-fill" />
                        <b>{s.label}</b> {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-1 mt-3 text-black fs-19 lh-25 mobile-fs-14 mobile-lh-full moblie-bold">
                    What Most Students Get Wrong
                  </h5>
                  <div className="d-flex align-items-center gap-3 mb-3 w-50 mobile-pt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/cross.png" width={30} alt="" />
                    <div>
                      <div className="tag-perks d-inline-block">Myth</div>
                      <br />
                      <h5 className="cardbox-scholarship fs-20 mb-0">
                        Scholarships are only for top students.
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3 w-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/check.png" width={30} alt="" />
                    <div>
                      <div className="tag-perks d-inline-block">Truth</div>
                      <br />
                      <h5 className="cardbox-scholarship fs-20 mb-0 lh-25">
                        There are scholarships for all types of profiles, from
                        academics to financial need, leadership to volunteering,
                        and even creative or sports backgrounds.
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-3 about-section half-section overlap-height position-relative mobile-student-boxpdf">
          <div className="container overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="col-lg-11 text-center">
                <div className="w-90 m-auto mobile-text-start">
                  <h1 className="text-black fnt-family fw-500 fs-38 pt-0 mb-1 mobile-fs-24 mobile-lh-full">
                    We’ve added a few common student
                    <br />
                    scenarios below
                  </h1>
                  <p className="text-black w-70 m-auto fs-19 lh-25 mobile-w-full mobile-fs-14 mobile-lh-full">
                    These are about 90% of the scholarship requests we typically
                    receive.We’ve added a few notes below to help guide you on
                    how to move forward with each one.
                  </p>
                </div>
                <div
                  className="mb-5 w-35 d-flex align-items-center mt-1 gap-3 text-start text-black desktop-none"
                  style={{ margin: "auto" }}
                >
                  <h5 className="text-black fs-18 lh-15 fs-11 mb-4 pt-7">
                    The top 6 above are the most common topics and we&apos;re
                    pretty sure you&apos;ve been thinking about them too.
                  </h5>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    width={65}
                    src="/assets/img/down-arrow-1.png"
                    alt=""
                    style={{ rotate: "280deg", marginTop: 58 }}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-center mb-15 gap-4">
                  <div className="d-flex w-750px wrap gap-3 mt-4 justify-content-center">
                    {SCENARIO_CARDS.map((card) => (
                      <div className="card-box-pdf" key={card.n}>
                        <div className="d-flex align-items-center justify-content-space mb-10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/pdf-icon.png"
                            width={70}
                            alt=""
                          />
                          <h2 className="text-black fnt-family">{card.n}</h2>
                        </div>
                        <p className="h-120px fs-16 lh-20 text-black w-80 text-start mt-4 pt-5 pb-0 mb-0">
                          {card.question}
                        </p>
                        <h5 className="text-start fs-12 lh-16 mb-0 text-black w-70">
                          <i className="bi bi-check-circle-fill text-dark-green d-block mb-1" />
                          {card.note}
                        </h5>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mb-5 mt-1 text-start text-black mobile-none flex-shrink-0"
                    style={{ width: 180, marginLeft: 24 }}
                  >
                    <h5 className="text-black fs-18 lh-25 fs-18 mb-4 pt-7">
                      The top 6 above are the most common topics and we&apos;re
                      pretty sure you&apos;ve been thinking about them too.
                    </h5>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={65}
                      src="/assets/img/down-arrow-1.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-0 mt-3 about-section half-section overlap-height position-relative minus-5 mobile-student-apply">
          <div className="container overlap-gap-section p-0">
            <div className="row align-items-center">
              <div className="w-900px m-auto">
                <div className="text-center mb-3 m-auto">
                  <h5 className="bg-black-yellow mb-0 fnt-family fs-38 lh-full w-70 p-1">
                    get Your Personalized Scholarship Plan
                  </h5>
                  <br />
                  <h5
                    className="cursor-pointer bg-yellow-white mb-0 fnt-family fs-38 lh-28 w-70 py-1"
                    onClick={openModal}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openModal();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/heart.gif"
                      width={30}
                      className="border-radius-10px"
                      alt=""
                    />
                    &nbsp; apply with #PGS
                  </h5>
                </div>

                <div className="mobile-w-60 mobile-auto">
                  <p className="text-black fs-19 lh-25">
                    At #PGS, we don&apos;t believe in giving you a list of
                    scholarships to apply and hope for the best.
                  </p>
                  <p className="text-black fs-19 lh-25">
                    We&apos;ve built our own proven process through real student
                    cases.
                  </p>
                  <p className="text-black fs-19 lh-25">
                    First, we understand your profile and get a rough idea of
                    where you stand. Then we shortlist the scholarships that
                    actually might work for you. From there, we work backwards
                    (we call it reverse engineering), shaping your documents,
                    profile and fitting scholarship eligibility requirements.
                  </p>
                </div>

                <div className="mobile-w-85">
                  <h5 className="fs-22 lh-28 fw-500 text-black">
                    It&apos;s a system that works. And it&apos;s what makes our
                    students stand out. <br /> We have listed few key steps
                    below.
                  </h5>
                  <ul className="check-list fs-18">
                    {PROCESS_CHECKLIST.map((item) => (
                      <li className="lh-19" key={item}>
                        <i className="bi bi-check-circle-fill" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-900px m-auto mt-5 mobile-scrolling-left">
                <div className="w-w-80">
                  <h1 className="text-black fnt-family fw-500 fs-36 pt-0 mb-2 mobile-pt-10">
                    steps involved in <br /> your scholarship
                    <br />
                    application
                  </h1>
                </div>
                <div className="d-flex gap-3">
                  {APPLICATION_STEPS.map((step) => (
                    <div
                      className={`card-box-pdf w-80 mb-4${
                        step.title === "Step 1" ? " pb-10" : ""
                      }`}
                      key={step.title}
                    >
                      <div className="d-flex align-items-center justify-content-space mb-10">
                        <h2 className="text-black text-red fs-28 lh-100 fnt-family mb-0">
                          {step.title}
                        </h2>
                      </div>
                      <p className={step.bodyClass}>
                        {step.title === "Step 2" ? (
                          <>
                            Shortlist <br />
                            &amp; <br />
                            Mentor Discussion
                          </>
                        ) : step.title === "Step 3" ? (
                          <>
                            Apply, track <br />
                            &amp; <br />
                            Wait
                          </>
                        ) : (
                          step.body
                        )}
                      </p>
                      {step.items.map((item, i) => (
                        <div
                          className={`d-flex gap-3 align-items-start${
                            i < step.items.length - 1 && step.items.length > 1
                              ? " mb-3"
                              : ""
                          }`}
                          key={item.text}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/edit-check.png"
                            width={19}
                            alt=""
                          />
                          <h5
                            className={`text-start mb-0 text-black ${item.className}`}
                          >
                            {item.text}
                          </h5>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <TestimonialsBlock />

            <div className="mb-5 w-10 mt-1 text-start text-black" />
            <div className="row justify-content-center align-items-center mobile-w-75 m-auto">
              <div className="w-850px mt-10">
                <h5 className="text-black fs-22 mobile-pb-2 lh-28 fw-500 mb-1">
                  Don’t worry if it feels overwhelming. We’ve helped 100s of
                  students apply.
                </h5>
                <h4
                  className="bg-black text-white px-2 fs-25 d-inline-block graidant-border cursor-pointer"
                  onClick={openModal}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openModal();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  Let’s Find Your Scholarships
                </h4>
                <div
                  className="mb-5 w-70 mobile-w-full text-start text-black d-flex align-items-start"
                  style={{ margin: "auto" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img width={96} src="/assets/img/up-arrow.png" alt="" />
                  <h5 className="text-black lh-19 fw-600 fs-12 mb-0 pt-7 w-50">
                    Because of the lengthy timeline and time commitment
                    involved, we&apos;re currently providing full scholarship
                    application support only for our existing students and
                    #PurplePremium members. However, we do offer introductions
                    and profile checks for all applicants so they don&apos;t
                    miss out on opportunities.
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </section>

        <KnowSection />
        <TipsCarousel />
      </div>

      {modalOpen ? (
        <div
          className="mobile-applicant pgs-modal pgs-modalSc premium-modal-overlay"
          style={{ display: "flex" }}
        >
          <div className="premium-modal-container purple-modal d-flex">
            <div className="panel-left">
              <button
                className="close-btn desktop-none"
                type="button"
                aria-label="Close"
                onClick={closeModals}
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
              <div className="sub-label fnt-family">scholarships Await</div>
              <p className="tagline lh-18ppx">
                Different scholarships have different criteria, figure out which
                alls you can stand in.
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
                    lets get your <br />
                    options <br /> ready
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
                onClick={closeModals}
              >
                ✕
              </button>
              <form onSubmit={onSubmit}>
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
                <div>
                  <p className="section-label mb-2">Country aiming for</p>
                  <div className="d-flex gap-3">
                    <select
                      className="modal-btn-pgs text-center"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {MODAL_COUNTRIES.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/arrow-btn.png"
                      style={{ width: 26, height: 26 }}
                      alt=""
                    />
                  </div>
                </div>
                <br />
                <div className="divider" />
                <div>
                  <p className="section-label mb-2">Course Level </p>
                  <div className="d-flex gap-3">
                    <select
                      className="modal-btn-pgs text-center"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      {MODAL_LEVELS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/arrow-btn.png"
                      style={{ width: 26, height: 26 }}
                      alt=""
                    />
                  </div>
                </div>
                <br />
                <div className="divider" />
                <div className="cta-row">
                  <button className="cta-btn" type="submit">
                    share update
                    <span className="arrow">←</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {successOpen ? (
        <div
          className="pgs-modal premium-modal-overlay modal-pgsamc-2"
          style={{ display: "flex" }}
        >
          <div
            className="premium-modal-container purple-modal d-flex bg-white pgs-modal-2"
            style={{ borderRadius: "20px" }}
          >
            <button
              className="close-btn"
              type="button"
              aria-label="Close"
              onClick={closeModals}
            >
              ✕
            </button>
            <div className="text-center">
              <h5 className="fw-700 fs-48 text-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/check-12.png"
                  style={{ width: 50 }}
                  alt=""
                />
                you’re in
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/okk.png" className="w-50%" alt="" />
              <h5 className="fw-400 fs-24 fnt-family text-black">
                lets get things moving.
              </h5>
              <div className="w-180px desktop-none">
                <p className="fs-13 fw-400 mb-5 text-black lh-15">
                  We’ve sent the #PGS Scholarship Guide to your email.
                </p>
                <p className="fs-13 fw-400 mb-5 text-black lh-15">
                  This covers the basics you actually need.
                </p>
                <p className="fs-13 fw-400 mb-5 text-black lh-15">
                  We’ll send your study toolkit and important updates on
                  WhatsApp (If you shared your WhatsApp number). No spam.
                  Unsubscribe anytime.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="mobile-none"
                  src="/assets/img/heart.gif"
                  style={{
                    width: 50,
                    borderRadius: 10,
                    margin: "0 0 0 auto",
                    display: "block",
                  }}
                  alt=""
                />
                <div style={{ background: "#150035" }} className="p-3 mt-4">
                  <p className="fs-13 lh-15 text-white mb-4">
                    Need to sort out the study journey?
                  </p>
                  <p className="fs-13 lh-15 text-white mb-4">
                    <Link href="/contact" className="text-white">
                      Book a free 15min clarity call
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-180px mobile-none">
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                We’ve sent the #PGS Scholarship Guide to your email.
              </p>
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                This covers the basics you actually need.
              </p>
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                We’ll send your study toolkit and important updates on WhatsApp
                (If you shared your WhatsApp number). No spam. Unsubscribe
                anytime.
              </p>
            </div>
            <div className="mobile-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mobile-none"
                src="/assets/img/heart.gif"
                style={{
                  width: 50,
                  borderRadius: 10,
                  margin: "0 0 0 auto",
                  display: "block",
                }}
                alt=""
              />
              <div style={{ background: "#150035" }} className="p-3 mt-4">
                <p className="fs-13 lh-15 text-white mb-4">
                  Need to sort out the study journey?
                </p>
                <p className="fs-13 lh-15 text-white mb-4">
                  <Link href="/contact" className="text-white">
                    Book a free 15min clarity call
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
