"use client";

import { FormEvent, useState } from "react";
import { HighlightsSection } from "@/components/HighlightsSection";
import { PgsPicksSection } from "@/components/PgsPicksSection";

const PARTNER_GOALS = [
  "University Visits",
  "Exchange & Rotation Programs",
  "Student pathways",
] as const;

/**
 * University partnerships — from standalone-html/unitieup.html
 */
export function UnitieupPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [goals, setGoals] = useState<Record<string, boolean>>({
    "University Visits": true,
    "Exchange & Rotation Programs": true,
    "Student pathways": true,
  });

  function openPartnerModal() {
    setSuccessOpen(false);
    setModalOpen(true);
  }

  function closeModals() {
    setModalOpen(false);
    setSuccessOpen(false);
  }

  function onPartnerSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setModalOpen(false);
    setSuccessOpen(true);
  }

  return (
    <>
      <section className="pt-3 position-relative mobile-pt-4">
        <div className="m-auto w-85 p-0">
          <div className="row justify-content-center">
            <div className="col-lg-12 p-0">
              <h6 className="mb-5 text-black fs-24 mt-0 w-40 m-auto lh-25 fw-400 mobile-w-42 mobile-fs-14 mobile-lh-18">
                Indian universities and institutions seeking international
                visits and exchange programs can connect with us for conference
                visits and program participation opportunities that give
                students real global exposure and academic experiences.
              </h6>
              <div className="card-box-img bg-gray p-4 pb-5 pt-5 border-gradient-purple-pink-1">
                <div className="d-flex gap-2 align-items-start justify-content-center w-80 m-auto mobile-gap-1 mobile-w-full">
                  <div className="w-30 mobile-w-50">
                    <div className="d-flex gap-2 align-items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/my-college.png"
                        className="w-10 mobile-fs-30"
                        alt=""
                      />
                      <div className="text-black">
                        <h1 className="fnt-family fs-38 mb-0 mobile-fs-24 mobile-lh-full">
                          with university <br />
                          partnerships
                        </h1>
                        <p className="fs-16 lh-19 mb-3 mt-1 mobile-fs-14 mobile-lh-full mobile-pt-4 mobile-pb-4">
                          Connect your students with global opportunities
                          through our comprehensive international programs
                        </p>
                        <button
                          type="button"
                          style={{ textTransform: "capitalize" }}
                          className="btn btn-black border-radius-10px fs-11"
                          onClick={openPartnerModal}
                        >
                          Partner With Us
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-35 mobile-w-50">
                    <div className="text-black bg-white border-radius-10px p-3">
                      <h5 className="fs-16 text-center fw-500 mobile-mb-0 mobile-pt-4 mobile-p-2 mobile-lh-full">
                        Partnership Impact
                      </h5>
                      <div className="d-flex gap-5 justify-content-space mobile-wrap">
                        <div className="w-50 mobile-w-full mobile-pt-0">
                          <h4 className="fs-16 fw-500 mb-1 lh-25">150+</h4>
                          <h4 className="mb-0 lh-19 fs-14">
                            Students <br />
                            participated in <br /> Exchange Program
                          </h4>
                        </div>
                        <div className="w-50 mobile-w-full mobile-pt-0">
                          <h4 className="fs-16 fw-500 mb-1 lh-25">5</h4>
                          <h4 className="mb-0 fs-14 lh-19">
                            Universities <br /> participated in <br />{" "}
                            international events
                          </h4>
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

      <div className="wrapper-content">
        <section className="pt-5">
          <div className="container">
            <div className="row justify-content-end">
              <div className="col-lg-2 text-center" />
              <div className="col-lg-7 text-center">
                <div className="row">
                  <div className="col-lg-12">
                    <h1 className="fnt-family text-black fs-36 text-start mb-3 mobile-fs-24 mobile-text-center">
                      Co-Developed Initiatives
                    </h1>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-6 mobile-w-80">
                    <div className="col-lg-12">
                      <p className="text-black mb-0">
                        No courses available yet. Courses added in admin will
                        appear here.
                      </p>
                    </div>
                    <div className="bottom-scrolling-hr mobile-pb-10">
                      <button type="button" className="btn p-0 border-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/down-arrow-scroll.png" alt="" />
                      </button>
                      <button type="button" className="btn p-0 border-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/top-arrow-scroll.png" alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 mobile-none">
                    <div className="row justify-content-center position-sticky">
                      <div className="col-lg-12">
                        <div className="bg-gray-100 border-gradient-purple-pink-1 py-5 px-4">
                          <div className="m-auto text-center">
                            <div className="text-black pt-1">
                              <h1 className="mb-5 fnt-family fs-36 text-start">
                                Ready to <br /> Partner With <br /> Us?
                              </h1>
                              <h6 className="fs-16 lh-22 mb-2 text-start w-80 mt-10">
                                Join leading institutions worldwide in
                                providing global opportunities to your students.
                                Let&apos;s create transformative international
                                experiences together.
                              </h6>
                              <button
                                type="button"
                                className="btn btn-black border-radius-10px text-captilize fs-20 border-radius-15px mt-10 mb-7 px-3"
                                onClick={openPartnerModal}
                              >
                                Schedule a Call
                              </button>
                              <div className="d-flex gap-1 align-items-center justify-content-center mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="/assets/img/black-mail.png"
                                  width={30}
                                  alt=""
                                />
                                <h4 className="fs-16 lh-20 fw-500 text-black mb-0">
                                  partnerships@purpleguide.study
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-1 text-center" />
            </div>
          </div>
        </section>
      </div>

      <HighlightsSection />

      <PgsPicksSection />

      {modalOpen ? (
        <div
          className="mobile-applicant pgs-modal pgs-modal-uni pgs-modalamc premium-modal-overlay"
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
              <div className="sub-label fnt-family">PARTNERSHIPS</div>
              <p className="tagline lh-18ppx">
                We work with institutions to create international exposure,
                structured programs, and real outcomes.
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
                onClick={closeModals}
              >
                ✕
              </button>
              <form id="formContent" onSubmit={onPartnerSubmit}>
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
                  <p className="section-label mb-0">
                    What are you aiming to sort out?
                  </p>
                  <div className="toggle-list" style={{ marginTop: 12 }}>
                    {PARTNER_GOALS.map((goal) => (
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
                <br />
                <div className="divider" />
                <div className="cta-row">
                  <button className="cta-btn" type="submit">
                    Let’s build something
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
          className="pgs-modal premium-modal-overlay modal-pgsamc-2 pgs-modal-uni-2"
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
                you’re in
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/okk.png" className="w-50" alt="" />
              <h5 className="fw-400 fs-24 fnt-family text-black">
                lets get things moving.
              </h5>
            </div>
            <div className="w-180px mobile-none">
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                Our partnerships team will review your details and reach out to
                you shortly.
              </p>
              <p className="fs-13 fw-400 mb-5 text-black lh-15">
                A PGS advisor will contact you shortly
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
