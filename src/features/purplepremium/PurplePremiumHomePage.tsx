"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import { useCmsShell } from "@/components/layout/cms-shell";
import type { CmsPremiumContent } from "@/lib/catalog/cms-types";
import {
  CONTACT_STRIP,
  MARQUEE_TEXT,
  MEDICINE_PATHS,
  NO_LIST,
  PARTNER_HIGHLIGHTS,
  PARTNER_LOGOS,
  PATH_LINKS,
  STATS,
  TESTIMONIALS,
  WHY_REASONS,
  YES_LIST,
} from "./content";
import "./why-purple.css";

function TestimonialsCarousel() {
  const { testimonials } = useCmsShell();
  const [index, setIndex] = useState(0);
  const source =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          quote: t.quote,
          name: t.name,
          role: t.role,
          image: t.image || "/assets/img/selfe.jpg",
        }))
      : [...TESTIMONIALS];
  const len = Math.max(1, source.length);

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
    source[index % len],
    source[(index + 1) % len],
    source[(index + 2) % len],
  ];

  return (
    <section className="position-relative testimonial-custom-mobile">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 m-auto">
            <div>
              <h4 className="top-heading-client mobile-w-75 text-black fs-25 mobile-fs-20 text-center mb-1 fw-500 mobile-auto mobile-text-start mobile-pb-4">
                A word from <span>Our learners</span>
              </h4>
              <p className="text-center text-black w-60 m-auto fs-16 lh-22 mobile-text-start mobile-fs-14 mobile-lh-full">
                Also at <b>#PGS,</b> we believe that with the right prep,
                skills, and a solid game plan, most students{" "}
                <b>3x their portfolio </b>and{" "}
                <b>gain real-world skills along the way.</b>
              </p>
              <div className="row">
                <div className="overflow-hidden m-auto">
                  <div className="xl-outside-box-right-20 sm-outside-box-right-0">
                    <div className="d-flex gap-4 pt-30px pb-30px overflow-hidden justify-content-center sm-p-0">
                      {visible.map((t, i) => (
                        <div
                          className="testimonials full-items-width flex-shrink-0"
                          style={{ width: "min(288px, 85%)" }}
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
                                <h6 className="mb-0 fs-18 text-white">
                                  {t.name}
                                </h6>
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
      </div>
    </section>
  );
}

/** Purple Premium landing — from standalone-html/purplepremiumhome.html */
export function PurplePremiumHomePage({
  videoContent,
  meetupContent,
}: {
  videoContent?: CmsPremiumContent | null;
  meetupContent?: CmsPremiumContent | null;
} = {}) {
  const videoTitle = videoContent?.title?.trim() || "Step into";
  const videoHref = videoContent?.linkUrl?.trim() || "";
  const meetupTitle = meetupContent?.title?.trim();
  const meetupBody = meetupContent?.body?.trim();
  const meetupHref = meetupContent?.linkUrl?.trim() || "/contact";
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      {toast ? (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 bg-black text-white px-4 py-2 border-radius-10px"
          style={{ zIndex: 9999 }}
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <div className="wrapper-content">
        {/* 1. Hero CTA */}
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
                    For Medical, STEM, and More—We&apos;ve Got You Covered
                  </h6>
                  <Link
                    href="/contact"
                    className="btn btn-purple mt-1 bg-black-btn fs-11 mt-1 mb-0"
                  >
                    Set Up a Quick Call
                  </Link>
                  <p className="mb-0 fs-12 lh-15 mt-1">
                    Clear All Your Doubts in 30 Minutes, Figure out your
                    scholarship path.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Video / hero image card */}
        <section className="pt-0 position-relative mobile-frame-video">
          <div className="container overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="card-box-img position-relative p-0 border-radius-10px bg-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/premium-2.png"
                    className="border-radius-20px aspact-ratio-16-9"
                    alt=""
                  />
                  <div className="position-static-img d-flex gap-3">
                    {videoHref ? (
                      <a
                        href={videoHref}
                        className="play-circular-button text-decoration-none"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-play-circle fs-80 text-white" />
                        <div className="play-click-arrow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/yellow-noun-arrow.png"
                            width={90}
                            alt=""
                          />
                          <span className="text-yellow d-block fnt-family text-end fs-25">
                            click here
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div className="play-circular-button">
                        <i className="bi bi-play-circle fs-80 text-white" />
                        <div className="play-click-arrow">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/img/yellow-noun-arrow.png"
                            width={90}
                            alt=""
                          />
                          <span className="text-yellow d-block fnt-family text-end fs-25">
                            click here
                          </span>
                        </div>
                      </div>
                    )}
                    <h4 className="fnt-family fs-75 text-white pb-1">
                      {videoTitle.includes("#") ? (
                        <>
                          {videoTitle.split("#")[0]}
                          <br />#{videoTitle.split("#").slice(1).join("#")}
                        </>
                      ) : (
                        <>
                          {videoTitle} <br /> #purplepremium
                        </>
                      )}
                    </h4>
                  </div>
                </div>
                {meetupTitle ? (
                  <div className="mt-4 p-4 bg-very-light-green border-radius-10px">
                    <h5 className="text-black fs-28 mb-2">{meetupTitle}</h5>
                    {meetupBody ? (
                      <p className="text-black fs-16 lh-24 mb-3">{meetupBody}</p>
                    ) : null}
                    <Link href={meetupHref} className="text-black fw-600">
                      Learn more
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Path chooser */}
        <section className="pt-8 mt-3 about-section half-section overlap-height position-relative minus-5">
          <div className="overlap-gap-section p-0">
            <div className="row justify-content-center">
              <div className="w-870px text-center mobile-text-start">
                <div className="w-90 m-auto">
                  <h1 className="text-black fnt-family fw-500 m-auto fs-38 pt-0 mb-1 lh-42 mobile-fs-24 mobile-lh-full mobile-w-60 mobile-br-none mobile-auto">
                    With #PurplePremium, you can choose <br />
                    the path that matches your goals.
                  </h1>
                </div>
                <div className="d-flex gap-3 mt-4 justify-content-center mobile-wrap">
                  <div>
                    <div className="img-box-fit-about position-relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/girl-with-book.jpg"
                        className="parent-img"
                        alt=""
                      />
                      <div className="caption-img-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/start-now-icon.png" alt="" />
                      </div>
                    </div>
                  </div>
                  <div className="w-80 mobile-comments-board">
                    {PATH_LINKS.map((path) => (
                      <div
                        className={`d-flex align-items-start gap-1 w-100 mb-3${
                          path.multiline ? " mt-6" : ""
                        }`}
                        key={path.href}
                      >
                        <span className="bg-blue-hash text-black">#</span>
                        <Link
                          href={path.href}
                          className="bg-black text-white d-block fs-45 fw-500 text-uppercase w-95 lh-50 p-2"
                        >
                          {path.multiline ? (
                            <>
                              Masters, STEM <br />
                              UG, MBA &amp; Others
                            </>
                          ) : (
                            path.label
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Stats gray box */}
        <section className="pt-3 mobile-count-pgs-board">
          <div>
            <div className="row justify-content-center">
              <div className="w-960px m-auto">
                <div className="card-box-gray p-5">
                  <div className="d-flex align-items-center gap-1 m-auto justify-content-center mobile-wrap">
                    <div className="w-50 mobile-w-full">
                      <h2 className="mb-0 text-black fs-38 fnt-family fw-400">
                        With #PurplePremium, <br />
                        we aim to give our aspirants:
                      </h2>
                      <div className="grid-count-box d-flex flex-wrap gap-4 mt-5">
                        {STATS.map((s) => (
                          <div className="w-45 mb-2" key={s.label}>
                            <h3 className="mb-0 text-green fw-500 fs-45 lh-50">
                              {s.value}
                            </h3>
                            <p className="mb-0 text-black fs-19 lh-25 fw-500">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-40">
                      <div className="bg-black padding-custom-10">
                        <div className="text-end padding-custom-11">
                          <h2 className="text_purple mb-0 fw-800 fs-50 lh-40">
                            #PGS
                          </h2>
                          <p className="text_purple fs-500 fs-17">
                            #PurplePremium
                          </p>
                        </div>
                        <div>
                          <p className="mb-0 text-white w-50 fnt-family-1 fs-19 m-end fw-400 lh-full">
                            Your roadmap to a smarter, well-guided study abroad
                            journey.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Student dashboard */}
        <section className="mobile-dashboard-box pt-5 mobile-dashboard-box pt-5">
          <div className="w-998px m-auto overlap-gap-section p-0">
            <div className="fnt-family fs-38 lh-full text-black text-start m-auto mb-4 mobile-fs-24 mobile-lh-full mobile-w-60 mobile-auto mobile-pb-2 w-60 m-auto">
              One of the best parts of #PGS? The Student Dashboard.
            </div>
            <div className="row justify-content-center position-relative">
              <div className="col-lg-9">
                <div className="section-img-setup">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/dashboard-gif.png" alt="" />
                </div>
              </div>
              <div className="bg-flot-box-dashboard">
                <div className="like-floting-button">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/heart.gif" alt="" />
                </div>
                <div className="light-blue-text">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/check-icon.png" alt="icon" /> Mentor +
                  Dashboard + Admission Counseling — #PGS Advantage
                </div>
                <p className="mb-0 fs-14 lh-21 text-white fw-400 m-fs-14-update">
                  Your full admission guide. Get expert advice, real data, and
                  hands-on support so you can seamlessly turn your goals into
                  admission success.
                </p>
              </div>
              <div className="flot-green-box-dashboard text-black">
                <p className="mb-2 fs-16 lh-19 fw-400">
                  Get real-time updates, mentor feedback, and full progress
                  tracking—every step from Day 1 to your admit. Everything stays
                  mapped, organized, and right here in one place.
                </p>
                <h5 className="mb-0 fs-17 lh-22 fw-500">
                  Stay on track. Get admitted with confidence.
                </h5>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <TestimonialsCarousel />

        {/* 7. Partner universities */}
        <section className="partner-container">
          <div>
            <div className="row p-0 justify-content-center">
              <div className="w-903px p-0">
                <div className="card-box-gray-1 border-radius-10px mobile-bg-gray">
                  <div className="w-698px m-auto mobile-w-60 mobile-m-auto">
                    <h5 className="text-black mb-0 fs-19 lh-19 mb-1 fw-500 mobile-fs-14">
                      Discover Top Universities in Every Country — With
                      Scholarships &amp; Fee Waivers
                    </h5>
                    <h6 className="text-black fs-17 lh-22 mb-0 mobile-fs-14 mobile-lh-full">
                      Explore our global university tie-ups and map out your
                      perfect path — we&apos;re here to guide you.
                    </h6>
                    <span className="text-black fs-12 fw-500 mobile-fs-12 mobile-heading-college">
                      Your College Journey Starts Here
                    </span>
                    <h5 className="text-black mb-0 fs-17 fw-500 mt-2 d-flex wrap gap-4 mobile-fs-12 mobile-gap-0 mobile-lh-16">
                      {PARTNER_HIGHLIGHTS.map((h) => (
                        <span key={h}>{h}</span>
                      ))}
                    </h5>
                  </div>
                  <div className="top-partners-style mt-5">
                    <div
                      className="flex-wrap d-flex w-698px m-auto align-items-center justify-content-center"
                      style={{ gap: 17 }}
                    >
                      {PARTNER_LOGOS.map((src, i) => (
                        <div className="client-box-top" key={`${src}-${i}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="top-client" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 mobile-mt-10">
                    <h5 className="fnt-family fs-38 text-black d-flex justify-content-center mb-8 mobile-fs-24 mobile-lh-25 mobile-mb-0 mobile-w-60 mobile-auto mobile-text-start mobile-pb-2 mobile-br-none">
                      Medicine. engineering. Allied <br />
                      Health. masters.management
                    </h5>
                  </div>
                  <div className="d-flex gap-3 align-items-center justify-content-center mobile-wrap">
                    <h5 className="text-black w-35 fs-28 fw-400 lh-35 mobile-lh-16 mobile-fs-14 mobile-w-60 mobile-auto mobile-pb-2">
                      Connect with our expert today and kickstart your study
                      abroad journey!
                    </h5>
                    <div className="box-white-card w-470px mobile-box-winner">
                      <div className="d-flex justify-content-center align-items-center gap-3">
                        <div className="position-relative">
                          <div className="bg-white border-radius-10px lh-35 py-1 d-inline-block w-186px text-center border-radius-10">
                            <span className="text-black fs-28 fw-300 lh-35">
                              +
                            </span>
                            &nbsp;&nbsp;
                            <span className="text-black fs-28">MBA</span>
                          </div>
                          <div className="floting-plus-icon">
                            <i className="bi bi-plus-circle" />
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div className="yellow-border-box">
                            <i className="bi bi-check" />
                          </div>
                          <div className="arrow-yellow-bg">
                            {MEDICINE_PATHS.map((p) => (
                              <span
                                className="d-flex gap-2 bg-yellow mb-4 px-3 py-1 text-black border-radius-10px w-90px"
                                key={p}
                              >
                                <i className="bi bi-arrow-right-circle-fill fs-14" />
                                <span className="fnt-family fs-16">{p}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center justify-content-center mobile-wrap mobile-space-evenly mobile-pb-2 mobile-pt-2">
                        <div className="green-box-radius border-radius-20px">
                          <h6 className="fnt-family text-white fs-16 lh-15 text-center fw-400 mb-0">
                            Scholarship + Fee Waiver
                          </h6>
                        </div>
                        <div className="desktop-none">
                          <div className="d-flex gap-1 align-items-center">
                            <h4 className="mb-0 text-black fs-19 fw-700 lh-19 d-flex nowrap mt-2">
                              98%
                            </h4>
                            <span
                              className="h-20px d-block bg-black"
                              style={{ width: 1 }}
                            />
                            <h6 className="text-black fs-11 lh-16 mb-0 nowrap fw-700">
                              <span className="text-uppercase">
                                <b>VISA SUCESS RATE</b>
                              </span>
                            </h6>
                          </div>
                        </div>
                        <div className="d-flex gap-2 w-70 mobile-w-75">
                          <div className="bg-purple d-flex gap-2 align-items-center p-1">
                            <h5
                              className="mb-0 w-80px fs-17 mb-0 lh-16 fw-600 text-uppercase text-black bg-white"
                              style={{ width: "45px" }}
                            >
                              Engi
                              <br />
                              neer
                              <br />
                              ing
                            </h5>
                            <h6 className="mb-0 w-80 mb-0 fs-10 lh-12 text-white">
                              Computer Science / AI / Data Science Software
                              &amp; Web Development <br />
                              Mechanical / Electrical / Civil / Aerospace
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex mt-4 align-items-start gap-3">
                        <div className="w-55 d-flex gap-2 align-items-center">
                          <h4 className="mb-0 text-black fs-38 fw-700 d-flex nowrap mt-2 lh-19 mobile-nowrap mobile-fs-28">
                            95%
                          </h4>
                          <span
                            className="h-25px d-block bg-black"
                            style={{ width: 3 }}
                          />
                          <h6 className="text-black fs-11 lh-full mb-0 fw-400">
                            <span className="text-uppercase">
                              <b>offer letter</b>
                            </span>
                            —delivered in less than 4 weeks with our tie-up
                            universities.
                          </h6>
                        </div>
                        <div className="w-40 mobile-w-60">
                          <div className="bg-light-blue border-radius-4px mb-4">
                            <h6 className="text-black fs-9 lh-12 p-2 mb-2">
                              Physiotherapy / Nursing Speech &amp; Language
                              Therapy Clinical Embryology
                            </h6>
                          </div>
                          <div className="d-flex gap-1 align-items-center mobile-none">
                            <h4 className="mb-0 text-black fs-19 fw-700 lh-19 d-flex nowrap mt-2">
                              98%
                            </h4>
                            <span
                              className="h-20px d-block bg-black"
                              style={{ width: 1 }}
                            />
                            <h6 className="text-black fs-11 lh-16 mb-0 nowrap fw-700">
                              <span className="text-uppercase">
                                <b>VISA SUCESS RATE</b>
                              </span>
                            </h6>
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

        {/* 8. Expense breakdown */}
        <section className="position-relative pb-100 mobile-aboutus">
          <div className="w-903px p-0 m-auto p-0 pb-100">
            <div className="row align-items-center justify-content-center d-flex gap-5">
              <div className="position-relative bg-gray w-504px bg-very-light-green xl-p-4 md-p-50px sm-p-30px border-radius-10px px-5">
                <div className="mb-10px">
                  <div className="mt-10 mt-10 mobile-px-4">
                    <h2 className="mb-1 text-uppercase fnt-bab text-black fs-38 mobile-br-none mobile-fs-20 mobile-lh-20 mobile-w-60">
                      Need a detailed expense <br />
                      breakdown for your <br />
                      journey?
                    </h2>
                    <Link
                      href="/contact"
                      style={{ padding: "8px 30px" }}
                      className="mb-2 mobile-px-3 btn btn-small-large border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
                      onClick={() =>
                        showToast("Request noted — we'll email you shortly.")
                      }
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
                    <p className="text-black mt-3 mb-3">
                      — we&apos;ll send it straight to your inbox.
                    </p>
                    <p className="text-black fs-16 lh-19 mt-6 mb-30 mobile-fs-14 mobile-pb-30">
                      Whether you&apos;re just getting started or planning ahead
                      for all three steps, knowing the costs involved can help
                      you make better decisions. From registration fees and
                      travel expenses to prep materials and clinical rotations —
                      we&apos;ve mapped out the full journey. Just drop a
                      request and get a clear picture of what to expect, without
                      surprises.
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

        {/* 9. Why #purplepremium */}
        <section className="why-purple mobile-aboutus">
          <div>
            <div className="row">
              <div className="w-861px m-auto p-0">
                <div className="gray-box-style-5">
                  <div className="pgs-why-top">
                    <div className="pgs-why-callout">
                      <h4>
                        why
                        <br />
                        #purplepremium?
                      </h4>
                    </div>
                    <div className="pgs-why-reasons">
                      {WHY_REASONS.map((r) => (
                        <div
                          className={`pgs-why-reason${r.num === "02" ? " is-wide" : ""}`}
                          key={r.num}
                        >
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="icon-box">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/assets/img/icon-traingal.png" alt="" />
                            </span>
                            <h2>{r.num}</h2>
                          </div>
                          <h6>{r.text}</h6>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pgs-why-also">
                    <div className="fit-object-reading">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/reading-book-boy.png"
                        className="fit-object-img"
                        alt=""
                      />
                    </div>
                    <div className="pgs-why-also-copy">
                      <h4 className="also-title">&amp;ALSO</h4>
                      <p>
                        over the years, we&apos;ve noticed a pattern with
                        students. No matter which path they take, many
                        succeed—and they&apos;ve truly earned it. But the
                        reality is, 7 out of 10 still run into the same common
                        roadblocks. They start strong, inspired by others
                        who&apos;ve &ldquo;made it&rdquo; (on social media or in
                        real life), and try to figure things out on their own.
                        But somewhere around the halfway point, they hit a
                        wall—losing time, money, and momentum. That&apos;s when
                        things start to feel like they&apos;re back to square
                        one—or worse, stuck in a &ldquo;I&apos;m lost and
                        don&apos;t see the point anymore&rdquo; loop.{" "}
                        <b>SOUNDS FAMILIAR ?</b>
                      </p>
                      <p>
                        That&apos;s why we took a closer look at the journeys
                        we&apos;ve seen again and again. And that&apos;s what
                        led us to one simple solution: <b> #purplePremium.</b>
                      </p>
                    </div>
                  </div>

                  <div className="pgs-why-bridge">
                    <div className="arrow-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/yellow-arrow-down.png" alt="" />
                    </div>
                    <h5>
                      Below, we&apos;ve laid out some of the biggest challenges
                      students face—and more importantly, how we at #pgs help
                      you avoid them.
                    </h5>
                  </div>

                  <div className="box-with-vs position-relative">
                    <div className="d-flex justify-content-center mobile-wrap">
                      <div className="w-45 cross-icon-box">
                        <h1 className="fnt-family text-red fs-80">NO</h1>
                        <div className="dark-gray">
                          <h4 className="text-dark-gray fs-17 lh-24">
                            The &ldquo;Figure It Out&rdquo; <br />
                            Struggle
                          </h4>
                          <ul className="m-0 p-0">
                            {NO_LIST.map((item) => (
                              <li key={item.slice(0, 40)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/assets/img/cross-red.png" alt="" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="w-10 px-2 py-2">
                        <h5 className="text-black mb-0 fnt-family pt-4">VS</h5>
                      </div>
                      <div className="w-45 check-icon-box">
                        <h1 className="fnt-family text-green fs-80">YES</h1>
                        <div
                          className="box-shadow-black"
                          style={{ height: "98%" }}
                        >
                          <div className="light-blue-bg">
                            <h4 className="text-dark-gray fs-17 lh-24 d-flex justify-content-space">
                              With <br />
                              #PurplePremium
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/assets/img/heart.gif" alt="" />
                            </h4>
                            <ul className="m-0 p-0">
                              {YES_LIST.map((item) => (
                                <li key={item.slice(0, 40)}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src="/assets/img/check-green.png"
                                    alt=""
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="marquee-section bg-black text-white p-1 mt-5 overflow-hidden">
                    <div className="marquees-text">
                      <h5 className="mb-0 text-white fs-16 lh-25 pt-1 text-nowrap">
                        {MARQUEE_TEXT}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Ready CTA */}
        <section
          id="cta"
          className="pt-10 half-section overlap-height position-relative overflow-hidden lets-start-mobile"
        >
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
                  <Link
                    href="/contact"
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

        {/* 11. #PGS contact strip */}
        <section className="pt-0 mobile-pgs-info mobilepb-10">
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
                      Reach out on our helpline for fast bookings, expert
                      advice, and answers to all your study abroad questions.
                      We&apos;ve also got dedicated mentor groups for medical
                      and non-medical courses—so you&apos;re always connected to
                      the right people.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 12. #Pgs picks */}
      <PgsPicksSection />
    </>
  );
}
