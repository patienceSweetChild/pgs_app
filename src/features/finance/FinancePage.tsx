"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  COUNTRY_OPTIONS,
  FAQ_ITEMS,
  FUNDING_SECTION,
  HERO_CHECKS,
  HERO_SIDEBAR,
  LINKS_SETUP,
  LOAN_GOALS,
  MODAL_COPY,
  PARTNER_LOGO_TRACK,
  STATS_BOX,
  SUCCESS_MODAL,
} from "./content";

function PartnerMarquee({ className }: { className: string }) {
  return (
    <div className={className}>
      <div className="logo-slider">
        <div className="logo-track">
          {PARTNER_LOGO_TRACK.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${logo.alt}-${i}`}
              src={logo.src}
              alt={logo.alt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqBlock() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-10 faq_section bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
      <h2 className="fac-title">FAQ’s</h2>
      <div className="accordion accordion-style-02">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          const isLast = i === FAQ_ITEMS.length - 1;
          return (
            <div
              className={`accordion-item${isOpen ? " active-accordion" : ""}`}
              key={`${item.q}-${i}`}
            >
              <div
                className={`accordion-header ${
                  isLast
                    ? "border-color-transparent"
                    : "border-color-extra-medium-gray"
                }`}
              >
                <a
                  href={`#finance-faq-${i}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(isOpen ? -1 : i);
                  }}
                >
                  <div className="accordion-title mb-0 position-relative text-black">
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
                  <div
                    className={`accordion-body last-paragraph-no-margin ${
                      isLast
                        ? "border-color-transparent"
                        : "border-color-light-medium-gray"
                    }`}
                  >
                    <p className="fw-400">{item.a}</p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Finance / study-abroad loans — from standalone-html/finance.html
 */
export function FinancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<string>(COUNTRY_OPTIONS[0].value);
  const [goals, setGoals] = useState<Record<string, boolean>>(
    Object.fromEntries(LOAN_GOALS.map((g) => [g, true])),
  );

  function openEligibilityModal() {
    setSuccessOpen(false);
    setModalOpen(true);
  }

  function closeModals() {
    setModalOpen(false);
    setSuccessOpen(false);
  }

  function onEligibilitySubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setModalOpen(false);
    setSuccessOpen(true);
  }

  return (
    <>
      <div className="pt-4 mobile-finance">
        <section className="pt-0 about-section position-relative minus-5">
          <div className="container p-0">
            <div className="row align-items-start justify-content-center mobile-margin-row">
              <div className="w-288px position-sticky">
                <div className="bg-gray border-radius-10px">
                  <div className="border-radius-10px overflow-hidden">
                    <div className="ht-fit-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={HERO_SIDEBAR.image}
                        className="border-radius-10px"
                        alt=""
                      />
                    </div>
                    <div className="content-box">
                      <h6 className="text-black fs-17 lh-22 mobile-fs-14 mobile-lh-16 w-55 mb-5 mobile-fs-14 mobile-lh-full">
                        {HERO_SIDEBAR.text}
                      </h6>
                      <button
                        type="button"
                        className="btn btn-purple mt-1 fs-16 lh-25 mb-4 mobile-fs-14"
                        style={{ padding: "7px" }}
                        onClick={openEligibilityModal}
                      >
                        {HERO_SIDEBAR.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="w-90 mb-15 mobile-m-auto mobile-pt-10">
                  <h1 className="text-black fnt-family fw-400 fs-38 pt-0 mobile-fs-24 mobile-lh-full mobile-w-65 mobile-m-auto mobile-br-none">
                    Secure Your&nbsp;Abroad Education <br /> Loan&nbsp;starting
                    at 8.33%*
                  </h1>
                  <ul className="check-list mobile-pt-5">
                    {HERO_CHECKS.map((item) => (
                      <li className="fs-16" key={item}>
                        <i className="bi bi-check-circle-fill" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <PartnerMarquee className="w-100 flot-marquee-partnar desktop-none mobile-partners" />

                <div className="row justify-content-end mobile-margin-row">
                  <div className="col-lg-12 mt-5 mobile-w-95">
                    <div className="w-100">
                      <h1 className="text-black fnt-family fw-500 fs-38 lh-full pt-0 mobile-fs-24 mobile-lh-full">
                        {FUNDING_SECTION.titleLines[0]} <br />
                        {FUNDING_SECTION.titleLines[1]}
                      </h1>
                      <p className="text-black fs-17 lh-22 mobile-fs-14 mobile-lh-16">
                        {FUNDING_SECTION.paragraphs[0]}
                      </p>
                      <p className="text-black fs-17 lh-22 mobile-fs-14 mobile-lh-16">
                        {FUNDING_SECTION.paragraphs[1]}{" "}
                        <b>{FUNDING_SECTION.boldLeadIn}</b>
                      </p>
                      <p className="text-black fs-17 lh-22 mobile-fs-14 mobile-lh-16">
                        {FUNDING_SECTION.paragraphs[2]}
                      </p>

                      <h6 className="fs-19 lh-25 fw-500 mb-3 text-black mobile-fs-14">
                        {FUNDING_SECTION.teamLead}
                      </h6>

                      <ul className="check-list">
                        {FUNDING_SECTION.checks.map((item) => (
                          <li className="fs-16 lh-20 fw-400" key={item}>
                            <i className="bi bi-check-circle-fill" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="box-of-border-count">
                        <h5 className="mb-0 text-black fs-22 lh-28 fw-500 mofbile-fs-17 mobile-br-none mobile-lh-18">
                          Join Thousands Who Secured Their <br /> Study Abroad
                          Loan
                        </h5>
                        <div className="d-flex justify-content-center mt-4 gap-5">
                          {STATS_BOX.stats.map((stat) => (
                            <div key={stat.value}>
                              <h4 className="mb-0 fs-45 lh-50 fw-500">
                                {stat.value}
                              </h4>
                              <p className="mb-0 fw-600 fs-12 lh-12 mt-1">
                                {stat.label}
                              </p>
                              <p className="mb-0 fw-500 fs-10 lh-10 mt-1">
                                {stat.sub}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="links-setup">
                        <h2 className="text-black fnt-family fs-38 lh-full">
                          {LINKS_SETUP.titleLines[0]} <br />{" "}
                          {LINKS_SETUP.titleLines[1]}{" "}
                          <Link
                            href={LINKS_SETUP.href}
                            className="text-decoration fs-17 lh-22"
                          >
                            {LINKS_SETUP.cta}
                          </Link>
                        </h2>
                      </div>

                      <FaqBlock />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PartnerMarquee className="w-100 flot-marquee-partnar mobile-none" />
        </section>
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
              <div className="sub-label fnt-family">{MODAL_COPY.subLabel}</div>
              <p className="tagline lh-18ppx">{MODAL_COPY.tagline}</p>

              <div className="boost-wrap">
                <div className="mobile-none" style={{ margin: "0 0 0 auto" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/arrow-modal.png"
                    style={{ width: 95, marginLeft: -10 }}
                    alt=""
                  />
                  <span className="w-full d-block fs-16 text-white lh-18">
                    {MODAL_COPY.boostDesktop[0]} <br />
                    {MODAL_COPY.boostDesktop[1]} <br />
                    {MODAL_COPY.boostDesktop[2]} <br />
                    {MODAL_COPY.boostDesktop[3]}
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

              <form id="formContent" onSubmit={onEligibilitySubmit}>
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
                  <p className="section-label mb-0">{MODAL_COPY.aimLabel}</p>
                  <div className="toggle-list" style={{ marginTop: 12 }}>
                    {LOAN_GOALS.map((goal) => (
                      <label className="toggle-row" key={goal}>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!goals[goal]}
                            onChange={() =>
                              setGoals((prev) => ({
                                ...prev,
                                [goal]: !prev[goal],
                              }))
                            }
                          />
                          <span className="slider" />
                        </label>
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <p className="section-label mb-2">
                    {MODAL_COPY.countryLabel}
                  </p>
                  <div className="d-flex gap-3">
                    <select
                      id="selectOption"
                      className="modal-btn-pgs text-center"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {COUNTRY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="selectOption">
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
                    {MODAL_COPY.cta}
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
          className="pgs-modal premium-modal-overlay"
          style={{ display: "flex" }}
        >
          <div
            className="premium-modal-container purple-modal d-flex bg-white pgs-modal-2"
            style={{ borderRadius: 20 }}
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
                {SUCCESS_MODAL.title}
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/okk.png" className="w-50" alt="" />
              <h5 className="fw-400 fs-24 fnt-family text-black">
                {SUCCESS_MODAL.nextTitle}
              </h5>
            </div>
            <div className="w-180px">
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                {SUCCESS_MODAL.nextTitle}
              </p>
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                {SUCCESS_MODAL.nextBody}
              </p>
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                {SUCCESS_MODAL.advisor}
              </p>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
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
                  {SUCCESS_MODAL.stripLines[0]}
                </p>
                <p className="fs-13 lh-15 text-white mb-4">
                  <Link href="/contact" className="text-white">
                    {SUCCESS_MODAL.stripLines[1]}
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
