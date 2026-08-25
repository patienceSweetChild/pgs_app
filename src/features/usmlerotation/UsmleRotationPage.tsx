"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import {
  BOOKING_STEPS,
  CLINICAL_ROTATION_BLURB,
  CONTACT_STRIP,
  EXPENSE_COPY,
  HERO_FEATURES,
  HERO_STATS,
  IMG_BENEFITS,
  IMG_CHANCES,
  LIVE_ACTIVITY,
  MODAL_TOGGLES,
  PRICING_INCLUDED,
  PURPLE_PREMIUM_CHECKLIST,
  ROTATION_TYPES,
  SUCCESS_STORIES,
  TESTIMONIALS,
  WHY_PICK_US,
} from "./content";
import "./usmle-rotation.css";

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const len = TESTIMONIALS.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 5000);
    return () => window.clearInterval(id);
  }, [len]);

  function prev() {
    setIndex((i) => (i - 1 + len) % len);
  }
  function next() {
    setIndex((i) => (i + 1) % len);
  }

  const visible = [
    TESTIMONIALS[index],
    TESTIMONIALS[(index + 1) % len],
    TESTIMONIALS[(index + 2) % len],
  ];

  return (
    <section className="position-relative">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 m-auto">
            <div>
              <h4 className="top-heading-client text-black fs-25 text-center mb-1 fw-500 mobile-fs-16">
                A word from <span className="fs-20s">Our learners</span>
              </h4>
              <p className="text-center text-black w-60 m-auto fs-16 lh-22 mobile-fs-14 mobile-text-start mobile-lh-16">
                Also at <b>#PGS,</b> we believe that with the right prep,
                skills, and a solid game plan, most students{" "}
                <b>3x their portfolio </b>and{" "}
                <b>gain real-world skills along the way.</b>
              </p>
              <div className="overflow-hidden m-auto">
                <div className="xl-outside-box-right-20 sm-outside-box-right-0">
                  <div className="d-flex gap-4 pt-30px pb-30px overflow-hidden ps-25px sm-p-0">
                    {visible.map((t, i) => (
                      <div
                        className="testimonials full-items-width flex-shrink-0"
                        style={{ width: "min(336px, 85%)" }}
                        key={`${t.name}-${index}-${i}`}
                      >
                        <div className="item-clients">
                          <div className="fit-object-img">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={t.image} alt="" />
                          </div>
                          <div className="review-content bg-black p-3">
                            <p className="text-white lh-18 fs-15 w-90">
                              {t.quote}
                            </p>
                            <div className="author-info">
                              <h6 className="mb-0 fs-18 text-white">{t.name}</h6>
                              <p className="text-white fs-13 mb-0 opacity-08">
                                {t.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <button
                      type="button"
                      className="slider-one-slide-prev-1 text-dark-gray swiper-button-prev slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                      aria-label="Previous testimonial"
                      onClick={prev}
                    >
                      <i className="fa-solid fa-arrow-left" />
                    </button>
                    <button
                      type="button"
                      className="slider-one-slide-next-1 text-dark-gray swiper-button-next slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                      aria-label="Next testimonial"
                      onClick={next}
                    >
                      <i className="fa-solid fa-arrow-right" />
                    </button>
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

/**
 * USMLE Clinical Rotations page — from standalone-html/usmlerotation.html
 */
export function UsmleRotationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDone, setModalDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [toggles, setToggles] = useState(() => MODAL_TOGGLES.map(() => true));

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
      <div className="USML-Erotatio-Css-Update minus-8">
      {/* 1. Hero */}
      <section className="pt-5 hero-usml-box">
        <div className="container">
          <div className="w-70 m-auto mobile-w-full mobile-pt-0 mobile-m-auto">
            <div className="bg-black border-radius-10px p-3 d-flex mobile-wrap gap-3">
              <div className="w-60 mobile-w-full mobile-pt-0">
                <div className="w-100 mobile-w-50 mobile-m-auto">
                  <div className="d-flex">
                    <h2 className="text-yellow fnt-family fs-38 lh-40 fw-500 mb-0 mobile-fs-24 mobile-text-black">
                      USA Clinical <br /> Rotations <br />
                    </h2>
                    <h5
                      className="usml-text-purple-start fs-22 fw-500"
                      style={{ marginTop: 43, marginLeft: -13 }}
                    >
                      with #PGS
                    </h5>
                  </div>
                  <h4 className="text-white fs-20 fw-400 mb-0 lh-25 mobile-text-black mobile-fs-14 mobile-lh-full">
                    Real-World U.S. Clinical Experiences
                    <br /> That Prepare You for the Match
                  </h4>
                </div>

                <div className="bg-black mt-8 w-95 mobile-w-full mobile-pt-0">
                  <div className="text-center">
                    <div className="border border-secondary rounded-3 p-4 mb-4">
                      <h5 className="text-white fs-4 mb-4 mobile-text-black">
                        Join Successful IMGs
                      </h5>
                      <div className="d-flex justify-content-center gap-5">
                        {HERO_STATS.map((s) => (
                          <div key={s.label}>
                            <h2 className="fw-bold text-success mb-0 fs-45 mobile-fs-32">
                              {s.value}
                            </h2>
                            <p className="text-white mb-0 fs-12 mobile-text-black mobile-font-bold">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mobile-w-70 mobile-m-auto">
                    <button
                      type="button"
                      className="btn USML-custom-btn px-4 py-2 mb-2 fw-500 mobile-fs-16"
                      style={{ textTransform: "none", fontSize: 14 }}
                      onClick={openModal}
                    >
                      Secure Your Spot Now
                    </button>
                    <div className="d-flex gap-4 flex-wrap text-white mobile-text-black mt-2 fs-12 mobile-gap-10px">
                      {HERO_FEATURES.map((f) => (
                        <div
                          className="mobile-w-full mobile-pt-0"
                          key={f}
                        >
                          <i className="bi bi-check-circle-fill text-success-green" />{" "}
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-50 mobile-w-full mobile-pt-4 mobile-black-bg-border-box">
                <div
                  className="border-radius-20px p-4 h-100 d-flex flex-column"
                  style={{ backgroundColor: "#f1f1f1" }}
                >
                  <p className="text-black fw-500 mb-4 fs-22 text-start">
                    Recent Success Stories
                  </p>
                  <div className="flex-grow-1">
                    {SUCCESS_STORIES.map((story, i) => (
                      <div
                        className={`USML-story-card${i < SUCCESS_STORIES.length - 1 ? " mb-3" : ""}`}
                        key={`story-${i}`}
                      >
                        <p className="text-black fw-400 mb-1 fs-19 mobile-fs-14 mobile-lh-16">
                          {story.name}
                        </p>
                        <span className="text-muted fs-12 fw-500 lh-15 mobile-fs-12">
                          {story.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="USML-highlight-box USML-highlight-box-mobile mt-auto USML-custom-btn d-flex align-items-center w-100 p-2"
                    onClick={openModal}
                  >
                    <span className="me-2">⚡</span>
                    <div className="text-start">
                      <p className="mb-0 fw-400 fs-16 lh-20 mobile-lh-16">
                        Last 24 hours: 23 students enrolled, 8 got matched!
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Activity */}
      <section className="bg-very-light-green-1 border-green p-0 pt-2 pb-2">
        <div className="container">
          <div className="d-flex gap-4 align-items-center mobile-wrap-scrolling">
            <div className="d-flex align-items-center w-10">
              <i className="text-green bi bi-dot fs-50 fw-800" />
              <h4 className="text-green mb-0 fs-22 lh-25 mobile-fs-20 mobile-lh-full">
                Live <br />
                Activity
              </h4>
            </div>
            {LIVE_ACTIVITY.map((item, i) => (
              <div
                className={`text-green fw-300 lh-20 ${i === 1 ? "w-20" : "w-25"}`}
                key={`${item.line}-${i}`}
              >
                <span>
                  {" "}
                  <i className="bi bi-check2-circle mr-1" />
                  <b>{item.name}</b>
                </span>
                <span className="fw-400 fs-14"> {item.line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrapper-content">
        {/* 3. IMG chances */}
        <section className="pt-180 pb-100 mobile-box-4 mobile-box-style-2 mobile-pt-10">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <h1 className="text-black fnt-family fw-500 fs-40 pt-0 text-center lh-53 mobile-fs-24 mobile-lh-full mobile-br-none mobile-text-start">
                  For International Medical Graduates (IMGs) going to the USA,{" "}
                  <br /> clinical rotations are your chance to:
                </h1>
                <div className="group-flex-items mt-5 d-flex wrap justify-content-space">
                  {IMG_CHANCES.map((text, i) => (
                    <div className="w-211px column-flex" key={text.slice(0, 24)}>
                      <div className="d-flex align-items-start gap-3 mb-5">
                        <span className="icon-box">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/icon-traingal.png" alt="" />
                        </span>
                        <h4 className="text-black mb-0 fs-50 lh-50 fw-500">
                          {String(i + 1).padStart(2, "0")}
                        </h4>
                      </div>
                      <h6 className="mb-0 fs-14 text-center lh-20 fw-400">
                        {text}
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. What is a clinical rotation */}
        <section className="py-5">
          <div className="container">
            <div
              className="text-center mb-6"
              style={{ maxWidth: 694, margin: "0 auto", textAlign: "center" }}
            >
              <h4 className="What-isa-Clinical">
                What is a Clinical Rotation or Clinical Experience?
              </h4>
              <p className="usml-a-clinical mx-3">{CLINICAL_ROTATION_BLURB}</p>
            </div>

            <div
              className="p-5 rounded-0 box-flot-half-1 desktop-none"
              style={{ backgroundColor: "#0ABF8C", height: "auto" }}
            >
              <p className="text-black text-uppercase mb-0 usml-be-part mobile-br-none">
                BE PART <br />
                OF <span className="usml-text-underline-show">THE </span>
                <br />
                <Link href="/purpleusme" className="text-black text-decoration-none">
                  <span className="usml-text-underline-show">SUCCESSFUL </span>
                  <br />
                  <span className="usml-text-underline-show">MATCH STORIES</span>
                </Link>
              </p>
            </div>

            <div className="row align-items-center g-4 justify-content-center">
              <div className="w-694px position-relative">
                <div className="d-flex h-100">
                  <div className="flex-fill bg-warning-subtle" />
                  <div className="flex-fill bg-secondary-subtle" />
                  <div className="flex-fill bg-info-subtle" />
                </div>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/USMLErotation2.png"
                    alt="Doctors"
                    style={{ width: "100%" }}
                    className="img-fluid rounded-3 mobile-full-ht"
                  />
                </div>
                <div className="bg-white border rounded-3 w-45 p-4 position-absolute USML-top-cm-50">
                  <p className="IMG-Benefits">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/usml-vector.png"
                      className="img-fluid rounded-3 w-35px"
                      alt=""
                    />{" "}
                    IMG Benefits
                  </p>
                  <ul className="list-unstyled mb-4 fs-19 text-black lh-25">
                    {IMG_BENEFITS.map((b, i) => (
                      <li
                        className={`d-flex align-items-center usml-title-g-10${i < IMG_BENEFITS.length - 1 ? " mb-4" : ""}`}
                        key={b}
                      >
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="position-absolute end-0 translate-middle-y p-5 rounded-0 box-flot-half-1 mobile-none"
                  style={{ backgroundColor: "#0ABF8C", height: "auto" }}
                >
                  <p className="text-black text-uppercase mb-0 usml-be-part">
                    BE PART <br />
                    OF <span className="usml-text-underline-show">THE </span>
                    <br />
                    <Link
                      href="/purpleusme"
                      className="text-black text-decoration-none"
                    >
                      <span className="usml-text-underline-show">
                        SUCCESSFUL{" "}
                      </span>
                      <br />
                      <span className="usml-text-underline-show">
                        MATCH STORIES
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Start your USA clinical experience + why pick us */}
        <section
          className="overlap-height position-relative"
          style={{ marginTop: 150 }}
        >
          <div className="container overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="position-relative mb-4 mobile-none">
                <div
                  className="card-box-img w-701px m-auto"
                  style={{
                    backgroundColor: "#f1f1f1",
                    padding: 15,
                    border: "1px solid gray",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/USMLErotation1.png"
                    className="w-100 rounded hero-img ht-160px"
                    alt="Student"
                  />
                  <div className="pt-2 pb-0 d-flex justify-content-between align-items-start">
                    <h1 className="usml-hero-title mb-0">
                      START YOUR USA <br />
                      CLINICAL EXPERIENCE <br />
                      THE RIGHT WAY.
                    </h1>
                  </div>
                  <div className="d-flex justify-content-end usml-black-heart">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/heart.gif"
                      className="mb-0"
                      style={{ width: 50, borderRadius: 5 }}
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="w-643px position-relative mb-4 mobile-wrap-column-2">
                <div className="row align-items-center">
                  <div className="col-sm-4 px-2">
                    <h4 className="fw-500 text-black fs-25 lh-30 mobile-fs-18 mobile-lh-20 d-flex justify-content-center mt-2">
                      Why Medical <br />
                      Students &amp; <br />
                      Doctors Pick Us
                    </h4>
                  </div>
                  {WHY_PICK_US.map((card) => (
                    <div className="col-sm-4 px-2" key={card.title}>
                      <div className="card text-dark mb-3 border-0">
                        <div
                          className="p-1 fw-500 text-center fs-26 mobile-fs-16 mobile-lh-ful"
                          style={{ backgroundColor: "#a6ffaf" }}
                        >
                          {card.title}
                        </div>
                        <div className="p-3 d-flex justify-content-center usml-card-tital2 lh-25">
                          {card.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Explore rotations / specialties */}
        <div className="w-996px m-auto">
          <section className="pt-0 pb-0">
            <div className="text-center">
              <div className="bg-black text-warning py-2 fs-38 fnt-family mobile-fs-24">
                EXPLORE ROTATIONS
              </div>
            </div>
          </section>

          <section className="pt-0 pb-0 usml-Click-Here-Section">
            <div className="text-center">
              <a
                href="#rotations-list"
                className="fs-20 btn btn-primary btn-lg no-hover usml-click-button mobile-fs-18 mobile-lh-20"
                style={{ textTransform: "none" }}
              >
                <span className="fs-14">Click Here</span> <br />
                for entire list
              </a>
            </div>
          </section>

          <section
            id="rotations-list"
            className="pt-0 saved-list-pgs half-section overlap-height position-relative overflow-hidden"
          >
            <div className="container overlap-gap-section p-0">
              <div className="row align-items-start justify-content-md-start">
                <div className="col-lg-12">
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      No courses available yet. Courses added in admin will
                      appear here.
                    </p>
                  </div>
                  <div className="upcoming-swiper bottom-scrolling-swiper-section d-flex justify-content-center justify-content-xl-start flex-column gap-3">
                    <span className="fs-12">Section 1</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 7. Book in 3 steps */}
        <section className="USMLErotation">
          <div className="w-80 m-auto">
            <div className="text-center mb-4">
              <h4
                className="fw-500 text-black fs-38 mobile-fs-28 mobile-lh-full"
                style={{ fontFamily: "Bebas Neue" }}
              >
                BOOK YOUR USCE IN 3 EASY STEPS – WITH #PGS
              </h4>
              <button
                type="button"
                className="btn USML-custom-btn px-4 py-2 mb-0 fw-400"
                style={{ textTransform: "none", height: 42 }}
                onClick={openModal}
              >
                Secure Your Spot Now
              </button>
            </div>
            <div className="d-flex gap-3 justify-content-center mobile-wrap">
              {BOOKING_STEPS.map((step) => (
                <div className="w-345px" key={step.title}>
                  <div className="step-box p-6 h-100 usml-update-css">
                    <h5 className="step-title usml-text-color-theme fw-500 mb-5 fnt-family fs-38 mobile-fs-28 mobile-lh-full">
                      {step.title}
                    </h5>
                    <h6 className="fw-500 text-black fs-25 lh-30 mobile-fs-18 mobile-lh-20">
                      {step.subtitle}
                    </h6>
                    <ul className="checklist text-black fw-400">
                      {step.items.map((item, itemIdx) => (
                        <li key={`${step.title}-${itemIdx}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/check-outline.png" alt="" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Purple Premium elevate */}
        <section className="pt-8 pb-8">
          <div className="container p-0">
            <div className="row justify-content-center purple-premium-section">
              <div className="purple-premium-box p-2">
                <div className="d-flex flex-column flex-md-row gap-2 p-2 ms-12 text-center text-md-start mobile-pt-10">
                  <div className="w-100">
                    <h2 className="PurplePremium-start">
                      Elevate Your Rotation With
                    </h2>
                    <h1 className="PurplePremium d-flex align-items-start gap-2 mb-0">
                      <Link
                        href="/purplepremiumhome"
                        className="text-decoration-none"
                        style={{ color: "inherit" }}
                      >
                        #PurplePremium
                      </Link>
                      <span
                        style={{
                          fontSize: 16,
                          fontFamily: "var(--Body-Large-Font, Roboto)",
                          color: "white",
                          lineHeight: "20px",
                        }}
                      >
                        optional but recommended
                      </span>
                    </h1>
                  </div>
                </div>

                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-1 ms-11 display-mobile-flex">
                  <div className="flex-shrink-0 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/PurplePremium1.png"
                      className="purple-image img-fluid"
                      alt="Statue of Liberty"
                    />
                  </div>
                  <div className="flex-grow-1 px-lg-4 pt-1 pt-lg-5 text-center text-lg-start w-345px mobile-w-60s">
                    <p className="title-our mb-2 mobile-text-start">
                      Our full mentorship suite built for{" "}
                      <br className="d-none d-lg-block" />
                      serious USMLE aspirants.
                    </p>
                    <p className="title-our-containt mb-0 opacity-75 w-345px mobile-text-start">
                      Want the full toolkit? Combine your USCE with
                      #PurplePremium — From form support and study planning to
                      LORs and mentorship—we help you stay on track, stress
                      less, and prep for the Match.
                    </p>
                  </div>
                  <div className="flex-grow-1 px-lg-4 text-center text-lg-start mobile-none">
                    <p className="right-title mb-0">
                      IMGs face tougher odds,{" "}
                      <br className="d-none d-lg-block" />
                      #PurplePremium helps level that playing field.
                    </p>
                  </div>
                </div>

                <div className="row align-items-start g-2 p-0 mobile-row-1">
                  <div className="col-lg-3 col-12 pt-4 pb-5">
                    <h2 className="heading-new text-center text-lg-start">
                      YOUR ROTATIONS + <br />
                      OUR ROADMAP = <br />
                      MATCH-READY <br />
                      CONFIDENCE.
                    </h2>
                  </div>
                  <div className="col-lg-4 col-4 pt-4 pb-0">
                    <ul className="check-list pricing-desc">
                      {PURPLE_PREMIUM_CHECKLIST.map((item, i) => (
                        <li className="checklist-new" key={`pp-check-${i}`}>
                          <i className="bi bi-check-circle-fill" /> {item}
                        </li>
                      ))}
                    </ul>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/heart.gif"
                      className="mb-0 flot-heart-icon mobile-none"
                      alt=""
                    />
                    <div className="text-center text-lg-start mt-5 mobile-none">
                      <p className="with-pgs">
                        with #pgs you get <br /> Fully Online Approach
                      </p>
                      <h3 className="SUPPORTED-bY">
                        SUPPORTED BY <br /> INFORMATION CENTERS &amp; <br />{" "}
                        OFFLINE EVENTS
                      </h3>
                    </div>
                  </div>

                  <div className="col-lg-5 mobile-w-70 mobile-m-auto desktop-none">
                    <div className="flex-grow-1 px-lg-4 text-start text-lg-start mobile-pt-10">
                      <p className="right-title mb-0 mobile-fs-14 mobile-lh-16">
                        IMGs face tougher odds,{" "}
                        <br className="d-none d-lg-block" />
                        #PurplePremium helps level that playing field.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-5 col-5 text-start pt-0 pb-2 mobile-w-full mobile-w-70 mobile-m-auto desktop-none">
                    <div className="text-center text-lg-start mt-5 mobile-pt-10 d-flex gap-3 align-items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/heart.gif"
                        className="mb-0"
                        width={40}
                        alt=""
                      />
                      <div>
                        <p className="with-pgs mobile-fs-16 mobile-text-start">
                          with #pgs you get <br /> Fully Online Approach
                        </p>
                        <h3 className="SUPPORTED-bY mobile-fs-24 mobile-text-start">
                          SUPPORTED BY <br /> INFORMATION CENTERS &amp; <br />{" "}
                          OFFLINE EVENTS
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-5 text-center pt-0 pb-2 mobile-w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/PurplePremium2.png"
                      className="img-fluid"
                      alt="Purple Premium Info"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Pricing */}
        <section className="pt-5 pb-0 USMLErotation">
          <div>
            <div className="row justify-content-center">
              <div className="col-lg-12 p-0">
                <div className="box-gray-2 border-radius-10px mobile-box-gray-2">
                  <div className="w-760px m-auto">
                    <div
                      className="w-95 card-box-border bg-white border-black pt-4 mobile-bg-white mobile-new-box-1"
                      style={{ marginLeft: 16 }}
                    >
                      <h1
                        className="fnt-family fs-51 mb-3 text-black w-100 mobile-fs-24 mobile-lh-full"
                        style={{ marginLeft: 10 }}
                      >
                        pricing for us clinical rotations
                      </h1>
                      <p
                        className="text-black fs-14 lh-full pt-0 mobile-fs-14"
                        style={{ marginLeft: 10 }}
                      >
                        Every student&apos;s journey takes time, attention, and
                        real mentorship. That&apos;s why we limit the number of
                        students each batch —so our experts can actually guide,
                        not just supervise.
                      </p>
                    </div>

                    <div className="usml-card" style={{ marginTop: -15 }}>
                      <h2 className="usml-fee d-flex gap-3">
                        $200 *{" "}
                        <span className="usml-fee-note text-white fs-14">
                          (or equivalent in INR)
                        </span>
                      </h2>
                      <span className="usml-badge">
                        Rotation Application Fee
                      </span>
                      <div className="usml-notes">
                        <p>
                          * Our rates for USCE depend on the institution and the
                          type of rotation you&apos;re doing: whether it&apos;s
                          hands-on, inpatient, tele-rotation, externships, or
                          Multiple Planned Rotations. After your introductory
                          meeting, we&apos;ll send you a customized pricing and
                          hospital list.
                        </p>
                      </div>
                      <div className="usml-notes fw-bold">
                        <p>
                          It typically ranges from $1,800 to $3,800 per
                          rotation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-700px m-auto pt-8">
                  <div className="usml-heading-usml">
                    <h1 className="usml-title p-1 border-radius-10px gr-mobile-1 mobile-w-50">
                      things you should know about
                    </h1>
                  </div>
                  <div className="pgs-pricing">
                    <div className="pricing-section">
                      <div className="pricing-card">
                        <div className="pricing-item">
                          <div className="step-number">1</div>
                          <div className="pricing-desc">
                            <div className="pricing-item d-flex gap-3">
                              <p className="pricing-label">
                                Program Fee Starts
                                <br />
                                From
                              </p>
                              <p className="pricing-value">$1800</p>
                            </div>
                            <div
                              className="pricing-item d-flex"
                              style={{ gap: "2.5rem" }}
                            >
                              <p className="pricing-label">Full In- Patient</p>
                              <p className="pricing-value">$2200 – $3800*</p>
                            </div>
                            <div className="pricing-item d-flex gap-3">
                              <p className="pricing-label">
                                Multiple Planned <br />
                                Rotations
                              </p>
                              <p className="pricing-value">
                                <span style={{ textDecoration: "line-through" }}>
                                  $800+
                                </span>{" "}
                                off
                              </p>
                            </div>
                            <p className="pricing-desc pricing-item">
                              For USMLE aspirants, we typically recommend three
                              USCE experiences to boost your rotations. You can
                              do them across multiple timelines or back-to-back
                              as a stretch. Connect with our mentoring and
                              scheduling team to guide you better—and when you
                              do all three, you get a price discount.
                            </p>
                            <div
                              className="d-flex justify-content-end"
                              style={{ gap: "2.5rem" }}
                            >
                              <p className="fw-400 fs-12 lh-16 mb-2 mt-4 mobile-fs-12">
                                *this is the typical max fee for <br /> our
                                participating institutions.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pricing-card mobile-new-custom-100">
                        <div className="pricing-item">
                          <div className="step-number">2</div>
                          <p className="pricing-desc-bold">
                            All rotations are 4 weeks long unless otherwise
                            mentioned.
                            <br />
                            Slots usually fill up in advance, so plan ahead to
                            lock in your preferred dates.
                          </p>
                        </div>
                      </div>

                      <div className="pricing-card mobile-new-custom-100">
                        <div className="pricing-item">
                          <div className="step-number">3</div>
                          <ul className="check-list pricing-desc">
                            {PRICING_INCLUDED.map((item, i) => (
                              <li key={`pricing-inc-${i}`}>
                                <i className="bi bi-check-circle-fill" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pricing-card mobile-new-custom-100">
                        <div className="pricing-item sticky-stp-4">
                          <div className="step-number">4</div>
                          <div className="pricing-desc">
                            <div className="overflow-x-auto mobile-none">
                              <div className="new-tabel-usml mb-2">
                                <table>
                                  <thead>
                                    <tr>
                                      <th className="fs-26">
                                        Type of <br />
                                        Rotation
                                      </th>
                                      <th className="fs-26">Price Range*</th>
                                      <th className="fs-26">What It Involves</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ROTATION_TYPES.map((r) => (
                                      <tr key={r.type}>
                                        <td className="usml-fw-700">{r.type}</td>
                                        <td>{r.price}</td>
                                        <td>{r.involves}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            {ROTATION_TYPES.map((r) => (
                              <table
                                className="table mobile-table-new-design"
                                key={`m-${r.type}`}
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <b>Type of Rotation</b>
                                    </td>
                                    <td>
                                      <span className="text-red">
                                        <b>{r.type}</b>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Price Range*</b>
                                    </td>
                                    <td>{r.price}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>What It Involves</b>
                                    </td>
                                    <td>{r.involves}</td>
                                  </tr>
                                </tbody>
                              </table>
                            ))}
                            <div className="d-flex justify-content-end pt-2">
                              <p className="usml-price-disclaimer mb-0">
                                Prices listed are approximate: we
                                <br />
                                make sure our students get the
                                <br />
                                best possible rates.
                              </p>
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

        <TestimonialsCarousel />

        {/* 10. Expense request */}
        <section className="position-relative pb-100 mobile-aboutus">
          <div className="w-903px p-0 m-auto pb-100">
            <div className="row align-items-center justify-content-center d-flex gap-5">
              <div className="position-relative bg-gray w-504px bg-very-light-green xl-p-4 md-p-50px sm-p-30px border-radius-10px px-5">
                <div className="mb-10px">
                  <div className="mt-10 mobile-px-4">
                    <h2 className="mb-1 text-uppercase fnt-bab text-black fs-38 mobile-br-none mobile-fs-20 mobile-lh-20 mobile-w-60">
                      Need a detailed expense <br />
                      breakdown for your <br />
                      journey?
                    </h2>
                    <Link
                      href="/contact"
                      style={{ padding: "8px 30px" }}
                      className="mb-2 mobile-px-3 btn btn-small-large border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
                    >
                      <span>
                        <span
                          className="btn-double-text ls-minus-05px fs-15"
                          data-text="get to know #pgs"
                        >
                          Request it here
                        </span>
                      </span>
                    </Link>
                    <p className="text-black mt-3 mb-3">{EXPENSE_COPY.inbox}</p>
                    <p className="text-black fs-16 lh-19 mt-6 mb-30 mobile-fs-14 mobile-pb-30">
                      {EXPENSE_COPY.body}
                    </p>
                  </div>
                  <figure className="about-floting-img m-0 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/img/doctor.png"
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
                    src="/assets/img/insta-girl.png"
                    alt=""
                    className="border-radius-6px"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Ready to get started */}
        <section className="pt-10 half-section overlap-height position-relative overflow-hidden lets-start-mobile">
          <div className="container overlap-gap-section p-0">
            <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
              <div className="mb-10px gap-5">
                <div className="text-center mb-2">
                  <span className="small-caption" style={{ color: "#6A5ED9" }}>
                    Let&apos;s Go
                  </span>
                  <h5 className="w-100 text-black fs-32 mb-2 fw-700 m-auto">
                    Ready to get started?
                  </h5>
                  <p className="w-40 text-center m-auto">
                    Let&apos;s chart your study abroad path, together with Team
                    #PGS.
                  </p>
                  <button
                    type="button"
                    style={{
                      padding: "8px 30px",
                      backgroundColor: "#6A5ED9",
                    }}
                    className="mb-2 btn btn-small-large border-radius-10px text-white btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-15px"
                    onClick={openModal}
                  >
                    <span>
                      <span
                        className="btn-double-text ls-minus-05px"
                        data-text="Start Your Journey"
                      >
                        Start Your Journey
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 12. #PGS contact strip */}
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
                      {CONTACT_STRIP.phone}
                    </h6>
                    <h6 className="mb-2 text-black d-flex gap-2 fs-20 fw-500">
                      <span className="w-20 ml-3 px-1 bg-yellow fs-18 d-inline-block">
                        Email Us
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/phone.png" width={20} alt="" />
                      {CONTACT_STRIP.email}
                    </h6>
                  </div>
                  <div className="w-15">
                    <p className="text-black font-style-italic fs-15 lh-20">
                      {CONTACT_STRIP.blurb}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PgsPicksSection />
      </div>
      </div>

      {modalOpen ? (
        <div
          className="mobile-applicant pgs-modal pgs-modalamc premium-modal-overlay"
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
              <div className="sub-label fnt-family">for usmle ROTATION </div>
              <p className="tagline lh-18ppx">
                Stuck between USMLE steps, rotations, and match strategy?
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
                    boost your <br />
                    PREP <br />
                    deserves
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
                    Your personalised checklist is on its way.
                    <br />
                    Check your inbox soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={onModalSubmit}>
                  <div className="field-group">
                    <div className="field">
                      <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <input
                        type="email"
                        placeholder="Email"
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
                    <p className="section-label mb-0">
                      Stuck between USMLE steps, rotations, and match strategy?
                    </p>
                    <div className="toggle-list" style={{ marginTop: 12 }}>
                      {MODAL_TOGGLES.map((label, i) => (
                        <label className="toggle-row" key={label}>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={toggles[i]}
                              onChange={() =>
                                setToggles((prev) =>
                                  prev.map((v, idx) => (idx === i ? !v : v)),
                                )
                              }
                            />
                            <span className="slider" />
                          </label>
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <br />
                  <div className="divider" />
                  <div>
                    <p className="section-label mb-2">What describes you best?</p>
                    <div className="d-flex gap-3">
                      <select
                        id="usmle-rotation-stage"
                        className="modal-btn-pgs"
                        defaultValue="1"
                      >
                        <option value="1"> Pre-Step 1</option>
                        <option value="2">Pre-Step 2</option>
                      </select>
                      <label htmlFor="usmle-rotation-stage">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/arrow-btn.png"
                          style={{ width: 26, height: 26 }}
                          alt=""
                        />
                      </label>
                    </div>
                  </div>
                  <div className="cta-row">
                    <button className="cta-btn" type="submit">
                      i need to join
                      <span className="arrow">←</span>
                    </button>
                  </div>
                  <p className="fs-12 mt-3 mb-0">
                    Or{" "}
                    <Link href="/contact" className="text-decoration-underline">
                      contact us
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
