"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PgsPicksSection } from "@/components/PgsPicksSection";
import {
  CONTACT_STRIP,
  FEATURE_BULLETS,
  MEDICINE_PATHS,
  PARTNER_HIGHLIGHTS,
  PARTNER_LOGOS,
  PRIMARY_COUNTRIES,
  SECONDARY_COUNTRIES,
  type CountryOption,
} from "./content";
import "./explore-countries.css";

function CountryLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="pgs-country-line">
          {line}
        </span>
      ))}
    </>
  );
}

function FeaturedCountryCard({
  country,
  titleClassName,
  switcherClassName,
}: {
  country: CountryOption;
  titleClassName: string;
  switcherClassName: string;
}) {
  return (
    <div className="w-520px mobile-w-full pgs-featured-country">
      <div className="card-box-img bg-black">
        <div className="fit-object-cover-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/music.png" alt="" />
        </div>
        <div className="pt-3 d-flex justify-content-space align-items-start px-3 pb-3 pgs-featured-country-body">
          <div className={titleClassName}>
            <h4 className="fnt-family mb-1 fs-50 text-white">study in </h4>
            <h4 className={switcherClassName}>
              <span className="fnt-family pgs-country-title">
                <CountryLines lines={country.countryLines} />
              </span>
            </h4>
          </div>
          <div className="pgs-featured-country-cta">
            <Link
              href={country.href}
              className="btn btn-green-btn fs-16 mobile-fs-14"
            >
              UK 101: What to Know
            </Link>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/pointer.webp"
              alt=""
              className="pointer-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CountrySwitcher({
  countries,
  activeId,
  onSelect,
  itemClassName,
}: {
  countries: CountryOption[];
  activeId: string;
  onSelect: (c: CountryOption) => void;
  itemClassName: string;
}) {
  return (
    <div className="vs-box-set text-center pgs-country-switcher">
      {countries.map((c) => (
        <h1
          key={c.id}
          className={itemClassName}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(c)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(c);
            }
          }}
        >
          <span className={c.id === activeId ? "px-3 bg-purple" : undefined}>
            {c.label}
          </span>
        </h1>
      ))}
    </div>
  );
}

function FeatureCards({ showExploreBanner }: { showExploreBanner: boolean }) {
  return (
    <section
      className={`pt-0${showExploreBanner ? " mobile-box-explore" : " pb-0 mobile-box-explore"}`}
    >
      <div className="w-875px m-auto">
        <div className="row">
          <div className="col-lg-12 p-0">
            <div className="purple-gray-box">
              <div className="d-flex align-items-start gap-3 position-relative">
                <div className="w-148px 225px mobile-w-50">
                  <div className="card-box-border">
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
                  <div className="card-box-border d-flex gap-3 justify-content-start desktop-none mobile-wrap">
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
                <div className="w-230px mobile-none">
                  <div className="card-box-border d-flex gap-3 justify-content-start">
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
                <div
                  className={
                    showExploreBanner
                      ? "w-40 mobile-w-50"
                      : "w-40 w-40 mobile-w-50 mobile-pt-4"
                  }
                >
                  <h6 className="mb-0 text-black fs-14 lh-16 fw-600">
                    Simple, clear, useful
                  </h6>
                  <p
                    className={`fw-400 text-black fs-14 lh-full${showExploreBanner ? " mobile-fs-14" : ""}`}
                    style={{ color: "#000000A6" }}
                  >
                    Using our experience, feedback from students who made it,
                    and insights from thousands of real applications—we&apos;ve
                    built an approach that puts you, the student, at the center
                    ❤️
                  </p>

                  <ul className="w-100 p-0 m-0 flot-section-top pl-2 desktop-none">
                    {FEATURE_BULLETS.map((b) => (
                      <li
                        key={b}
                        className="text-black fs-16 mobile-fs-14 lh-20 mobile-lh-full mb-2 d-flex gap-2 align-items-center"
                      >
                        <span className="green-box-dot" />
                        <span className="mobile-w-90">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {showExploreBanner ? (
                    <div className="bg-pink box-flot-banner">
                      <h1 className="fnt-family text-black fs-28 w-65 m-auto pt-10 lh-28">
                        explore <br />
                        more
                        <br />
                        below
                      </h1>
                      <i className="bi bi-arrow-down-circle-fill fs-40 text-black position-absolute ms-22-flot-8" />
                      <div className="box-object-fit-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/degree-with-girl.png" alt="" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="d-flex align-items-start gap-3 position-relative mobile-none">
                <div className="w-148px 225px" />
                <ul
                  className={`w-100 p-0 m-0 flot-section-top pl-2${showExploreBanner ? " desktop-none" : ""}`}
                >
                  {FEATURE_BULLETS.map((b) => (
                    <li
                      key={`desk-${b}`}
                      className="text-black fs-16 lh-20 mb-2 d-flex gap-2 align-items-center"
                    >
                      <span className="green-box-dot" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Explore countries — from standalone-html/explorecountries.html
 */
export function ExploreCountriesPage() {
  const [primary, setPrimary] = useState<CountryOption>(
    PRIMARY_COUNTRIES.find((c) => c.id === "uk") ?? PRIMARY_COUNTRIES[0],
  );
  const [secondary, setSecondary] = useState<CountryOption>(
    SECONDARY_COUNTRIES.find((c) => c.id === "mur") ?? SECONDARY_COUNTRIES[0],
  );
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseDone, setExpenseDone] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseEmail, setExpenseEmail] = useState("");
  const [expensePhone, setExpensePhone] = useState("");

  function openExpenseModal() {
    setExpenseDone(false);
    setSuccessOpen(false);
    setExpenseOpen(true);
  }

  function closeExpenseModals() {
    setExpenseOpen(false);
    setSuccessOpen(false);
  }

  function onExpenseSubmit(e: FormEvent) {
    e.preventDefault();
    if (!expenseName.trim() || !expenseEmail.includes("@")) return;
    setExpenseOpen(false);
    setExpenseDone(true);
    setSuccessOpen(true);
  }

  return (
    <>
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

        {/* 2. Primary country card + switcher */}
        <section className="pt-0 pb-0 overlap-height position-relative mobile-section-step-1">
          <div className="w-725px m-auto overlap-gap-section p-0">
            <div className="d-flex gap-5 justify-content-center mobile-wrap">
              <FeaturedCountryCard
                country={primary}
                titleClassName=""
                switcherClassName="mb-0 fs-75 text-white lh-65 mobile-fs-50"
              />
              <div className="w-20 pgs-country-switcher">
                <CountrySwitcher
                  countries={PRIMARY_COUNTRIES}
                  activeId={primary.id}
                  onSelect={setPrimary}
                  itemClassName="fnt-family fs-86 text-black mb-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Feature cards (with explore banner) */}
        <FeatureCards showExploreBanner />

        {/* 4. Secondary country card + switcher */}
        <section className="pt-15 overlap-height position-relative pb-2 mobile-explore-2">
          <div className="w-821px mobile-w-full m-auto overlap-gap-section p-0 mobile-section-step-1">
            <div className="d-flex justify-content-center gap-10 mobile-wrap">
              <FeaturedCountryCard
                country={secondary}
                titleClassName="mobile-w-full"
                switcherClassName="mb-0 fs-75 text-white lh-65 mobile-fs-50"
              />
              <div className="w-25 mobile-w-95 mobile-fs-32 pgs-country-switcher">
                <CountrySwitcher
                  countries={SECONDARY_COUNTRIES}
                  activeId={secondary.id}
                  onSelect={setSecondary}
                  itemClassName="fnt-family fs-86 text-black mb-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Feature cards (no explore banner) */}
        <FeatureCards showExploreBanner={false} />

        {/* 6. Partner universities */}
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

        {/* 7. Expense request */}
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
                    <button
                      type="button"
                      style={{ padding: "8px 30px" }}
                      className="mb-2 mobile-px-3 btn btn-small-large border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
                      onClick={openExpenseModal}
                    >
                      <span>
                        <span
                          className="btn-double-text ls-minus-05px fs-15"
                          data-text="get to know #pgs"
                        >
                          Request it here
                        </span>
                      </span>
                    </button>
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

        {/* 8. #PGS contact strip */}
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

      {/* 9. #Pgs picks */}
      <PgsPicksSection />

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
                onClick={closeExpenseModals}
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
              <div className="sub-label fnt-family">FINANCIAL BLUEPRINT</div>
              <p className="tagline lh-18ppx">
                Planning to study abroad? Know your real costs first.
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
                onClick={closeExpenseModals}
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
                <form onSubmit={onExpenseSubmit}>
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
                      <button type="button" className="modal-btn-pgs">
                        Shortlisting countries
                      </button>
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

      {successOpen ? (
        <div
          className="pgs-modal premium-modal-overlay modal-pgsamc-2"
          style={{ display: "flex", background: "transparent" }}
        >
          <div
            className="premium-modal-container purple-modal d-flex bg-white pgs-modal-2"
            style={{ borderRadius: 20 }}
          >
            <button
              className="close-btn"
              type="button"
              aria-label="Close"
              onClick={closeExpenseModals}
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
                you&apos;re in
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/okk.png" className="w-50" alt="" />
              <h5 className="fw-400 fs-24 fnt-family text-black mobile-bottom-50">
                Your study abroad expense <br /> checklist is on its way.
              </h5>
            </div>
            <div className="w-180px">
              <div style={{ background: "#150035" }} className="p-3 mt-4">
                <p className="fs-13 lh-15 text-white mb-4">
                  Need to sort out the study journey?
                </p>
                <p className="fs-13 lh-15 text-white mb-4">
                  Book a free 15min clarity call
                </p>
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/heart.gif"
                className="mobile-none"
                style={{
                  width: 50,
                  borderRadius: 10,
                  margin: "0 0 0 auto",
                  display: "block",
                }}
                alt=""
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
