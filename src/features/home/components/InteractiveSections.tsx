"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MASTERCLASS_BY_TAB,
  MASTERCLASS_TABS,
  NEWS_CARDS,
  STUDY_JOURNEY_OPTIONS,
  type MasterclassTabId,
} from "../content";
import "./masterclass.css";

export function DifferentGoalsSection() {
  return (
    <section className="pt-3 half-section overlap-height position-relative overflow-hidden mt-8 pt-0 section-video-category">
      <div className="w-773px overlap-gap-section p-0 m-auto">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-10px">
          <div className="mb-10px">
            <div>
              <h6 className="mb-1 text-black fs-28 lh-35 fw-500">
                Different goals need different plans! <br />
                Medical PG? MBA or STEM? Law or Undergrad abroad?
              </h6>
              <p className="text-black fs-22 lh-22 mb-8">
                Each path calls for a different approach—so we&apos;ve built
                custom roadmap for <br /> our students that actually match their
                journey.
              </p>
            </div>

            <div className="d-flex align-items-center gap-1 mt-2">
              <div className="bg-path">
                <span>path 1</span>
                <br />
                <i className="bi bi-arrow-right-short fs-40" />
              </div>
              <h5 className="mb-0 fs-22 lh-28 text-black bg-gray border-radius-8px p-05 fw-500">
                For all from — <br />
                STEM, MBA or Masters, Law & Undergrad abroad.
              </h5>
            </div>
            <div className="d-flex align-items-center gap-1 mt-2">
              <div className="bg-path">
                <span>path 2</span>
                <br />
                <i className="bi bi-arrow-right-short fs-40" />
              </div>
              <h5 className="mb-0 fs-22 lh-28 text-black bg-gray border-radius-8px p-05 fw-500">
                For Everything Medical-Related — We&apos;ve Got Two Dedicated
                Tracks:
                <br />
                Track 1: Medical Pathways — USMLE, PLAB, AMC.
                <br />
                Track 2: Nursing, Allied Health, Physiotherapy & More
              </h5>
            </div>
            <div className="arrow-box-top m-auto d-flex align-items-center justify-content-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/dots-top-arrow.png"
                alt=""
                style={{ width: 70, marginLeft: 200 }}
              />
              <p className="mb-0 text-black fs-12 lh-15 fw-500 mt-10 mobile-fs-12">
                Our Counsellors & Mentors <br />
                help you pick the right path <br />
                from day one
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-md-start mt-5 gap-5 mobile-gap-3">
          <div className="col-lg-5 col-md-5 position-relative md-mb-50px sm-mb-40px">
            <figure
              className="position-relative m-0 text-center"
              style={{ height: 492 }}
            >
              <video
                src="/assets/videos/uhd_25fps.mp4"
                className="border-radius-6px flip-horizontal"
                autoPlay
                muted
                loop
                playsInline
              />
            </figure>
          </div>
          <div className="col-lg-7 col-md-7 position-relative md-mb-50px sm-mb-40px">
            <div className="d-flex justify-content-start counter-style-04 gap-4 flex-wrap">
              {[
                "Clear stepwise timeline update for each exam",
                "Expert profile reviews in 24 hrs",
                "100% personalized licensing roadmap",
                "+50% stronger SOP drafts",
                "Access to proven scholarship prep guides",
              ].map((text) => (
                <div className="card-light" key={text}>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />{" "}
          {option}
        </label>
      ))}
    </>
  );
}

export function StudyJourneySection() {
  const [step, setStep] = useState(1);
  const [youare, setYouare] = useState("");
  const [stream, setStream] = useState("");
  const [country, setCountry] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [plan, setPlan] = useState("");
  const [countries, setCountries] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => `${(step / 4) * 100}%`, [step]);

  function goNext() {
    if (step === 1 && (!youare || !stream)) return;
    if (step === 2 && (!country || !studyLevel)) return;
    if (step === 3 && (!plan || !countries)) return;
    setStep((s) => Math.min(4, s + 1));
  }

  function labelAfterPipe(value: string) {
    const i = value.indexOf("|");
    return i >= 0 ? value.slice(i + 1) : value;
  }

  async function finish() {
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured.");
        return;
      }
      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createSupabaseBrowserClient();
      const pathway = labelAfterPipe(stream);
      const message = [
        `You are: ${youare}`,
        `Stream: ${pathway}`,
        `Journey step: ${country}`,
        `Study level: ${labelAfterPipe(studyLevel)}`,
        `Intake: ${plan}`,
        `Countries: ${countries}`,
      ].join("\n");

      const { error: insertError } = await supabase
        .from("study_journey_enquiries")
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          pathway,
          message,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="pt-15 half-section overlap-height position-relative step-progress-mobile">
      <div className="w-969px m-auto overlap-gap-section p-0 d-flex align-items-center">
        <div className="col-lg-4">
          <figure className="step-progress-img m-0 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/step.png"
              alt=""
              className="border-radius-6px"
            />
          </figure>
        </div>
        <div className="position-relative bg-gray w-667px bg-very-light-green xl-p-4 md-p-50px sm-p-30px border-radius-10px pl-6-pt-6 ">
          <h2 className="mb-1 bg-text-step text-black fs-34">
            Not Sure Where to Begin?
          </h2>
          <h4 className="mb-4 text-black fs-38 lh-22 fw-400 bg-text-step-1 mb-2 mt-2 mobile-fs-20">
            Start Your Study Abroad Journey Here!
          </h4>
          <p className="text-black fs-17 lh-22 text-center mobile-fs-14 mobile-text-start">
            A few quick questions so we know where you stand — and from there,
            our mentors will guide you step by step.
          </p>

          {done ? (
            <div className="card-stps que-step-header p-3">
              <h5 className="text-black mb-2">Thanks — we got your details.</h5>
              <p className="mb-0 text-black fs-14">
                A counsellor will follow up on {email}.
              </p>
            </div>
          ) : (
            <form
              id="studyJourneyForm"
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 4) void finish();
                else goNext();
              }}
            >
              <div className="card-stps que-step-header">
                <div>
                  <span className="fs-19 lh-25 text-black" id="step-counter">
                    Step {step} of 4
                  </span>
                  <div className="que-progress">
                    <div
                      className="que-progress-bar"
                      id="progress-bar"
                      style={{ width: progress }}
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-black mb-2" role="alert" style={{ color: "#b91c1c" }}>
                    {error}
                  </p>
                ) : null}

                {step === 1 ? (
                  <div className="step step-1">
                    <h3 className="que-yellow-label">
                      You are a <span className="req">*</span>
                    </h3>
                    <RadioGroup
                      name="youare"
                      options={STUDY_JOURNEY_OPTIONS.youare}
                      value={youare}
                      onChange={setYouare}
                    />

                    <h3 className="que-yellow-label mb-4">
                      Pick your stream <span className="req">*</span>
                    </h3>
                    <div className="que-path-section">
                      <div
                        className="questions"
                        style={{ justifyContent: "space-between", gap: 0 }}
                      >
                        {(
                          [
                            ["Medical Path", "medical1", STUDY_JOURNEY_OPTIONS.medical1],
                            ["Masters Path", "masters", STUDY_JOURNEY_OPTIONS.masters],
                            ["Undergrad Path", "undergrad", STUDY_JOURNEY_OPTIONS.undergrad],
                            ["Medical Path 2", "medical2", STUDY_JOURNEY_OPTIONS.medical2],
                          ] as const
                        ).map(([title, group, opts]) => (
                          <div key={group}>
                            <h4>{title}</h4>
                            {opts.map((option) => {
                              const val = `${group}|${option}`;
                              return (
                                <label key={val}>
                                  <input
                                    type="radio"
                                    name="stream"
                                    value={val}
                                    checked={stream === val}
                                    onChange={() => setStream(val)}
                                  />{" "}
                                  {option}
                                </label>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-next"
                        style={{ borderRadius: 10 }}
                        onClick={goNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="step step-2">
                    <h3 className="que-yellow-label">
                      What step of your journey are you currently in?{" "}
                      <span className="req">*</span>
                    </h3>
                    <RadioGroup
                      name="country"
                      options={STUDY_JOURNEY_OPTIONS.country}
                      value={country}
                      onChange={setCountry}
                    />
                    <h3 className="que-yellow-label">
                      Level of your study <span className="req">*</span>
                    </h3>
                    <div className="que-path-section">
                      <div className="questions">
                        {(
                          [
                            ["Medical Path", "medicalpath", STUDY_JOURNEY_OPTIONS.medicalpath],
                            ["Masters Path", "masterpath", STUDY_JOURNEY_OPTIONS.masterpath],
                            ["Undergrad Path", "undergradpath", STUDY_JOURNEY_OPTIONS.undergradpath],
                          ] as const
                        ).map(([title, group, opts]) => (
                          <div key={group}>
                            <h4>{title}</h4>
                            {opts.map((option) => {
                              const val = `${group}|${option}`;
                              return (
                                <label key={val}>
                                  <input
                                    type="radio"
                                    name="study_level"
                                    value={val}
                                    checked={studyLevel === val}
                                    onChange={() => setStudyLevel(val)}
                                  />{" "}
                                  {option}
                                </label>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-back"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        style={{ borderRadius: 10 }}
                        onClick={goNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="step step-3">
                    <div>
                      <h3 className="que-yellow-label">
                        Which intake year are you aiming for?{" "}
                        <span className="req">*</span>
                      </h3>
                      <RadioGroup
                        name="plan"
                        options={STUDY_JOURNEY_OPTIONS.plan}
                        value={plan}
                        onChange={setPlan}
                      />
                    </div>
                    <div>
                      <h3
                        className="que-yellow-label"
                        style={{ height: "auto" }}
                      >
                        Which countries are you considering?
                        <span
                          className="fs-15 fw-400 d-block"
                          style={{ marginTop: -8 }}
                        >
                          (for masters and undergrad path)
                        </span>
                      </h3>
                      <RadioGroup
                        name="countries"
                        options={STUDY_JOURNEY_OPTIONS.countries}
                        value={countries}
                        onChange={setCountries}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-back"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        style={{ borderRadius: 10 }}
                        onClick={goNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="step step-4">
                    <div className="mb-2">
                      <h3 className="que-yellow-label">
                        Your Name <span className="req">*</span>
                      </h3>
                      <input
                        className="form-control py-2 px-3"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={120}
                        autoComplete="name"
                      />
                    </div>
                    <div className="mb-2">
                      <h3 className="que-yellow-label">
                        Email <span className="req">*</span>
                      </h3>
                      <input
                        className="form-control py-2 px-3"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={180}
                        autoComplete="email"
                      />
                    </div>
                    <div className="mb-2">
                      <h3 className="que-yellow-label">
                        Phone No. <span className="req">*</span>
                      </h3>
                      <input
                        className="form-control py-2 px-3"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-back"
                        onClick={() => setStep(3)}
                        disabled={submitting}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn-next"
                        onClick={() => void finish()}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting…" : "Submit"}
                      </button>
                    </div>
                  </div>
                ) : null}

                <figure className="step-progress-img progress-small m-0 text-center desktop-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/step.png"
                    alt=""
                    className="border-radius-6px"
                  />
                </figure>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function HomeNewsSection() {
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
          <div className="col-lg-9 m-auto d-flex gap-5 border-radius-10px overflow-hidden flex-wrap justify-content-center pt-30px pb-30px">
            {NEWS_CARDS.map((card) => (
              <div className="box-light w-284px mobile-m-auto" key={card.logo}>
                <div className="header-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.logo} alt="" />
                </div>
                <p className="w-100">{card.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MasterclassSection() {
  const [tab, setTab] = useState<MasterclassTabId>("study_abroad");
  const [openByTab, setOpenByTab] = useState<Record<MasterclassTabId, number>>({
    study_abroad: 0,
    online_meet_event: 0,
    new_visit: 0,
  });

  return (
    <section className="bg-tranquil position-relative mobile-faq-cart-box overflow-hidden">
      <div className="w-895px m-auto">
        <div className="row align-items-center mb-4">
          <div className="col-xl-12 lg-mb-30px text-center text-xl-start mobile-mb-0">
            <h3 className="alt-font text-black m-auto text-center fw-500 lh-40 fs-32 mb-3 mobile-fs-16 mobile-bold mobile-lh-full">
              Plan Your Study Abroad Like a Pro—Free <br /> Masterclass Inside
            </h3>
          </div>
          <div className="col-xl-12 tab-style-03 tab-style-new text-center">
            <ul className="portfolio-filter fw-500 nav nav-tabs justify-content-center border-0">
              {MASTERCLASS_TABS.map((t) => (
                <li
                  key={t.id}
                  className={`nav${tab === t.id ? " active" : ""}`}
                >
                  <a
                    href={`#${t.id}`}
                    data-filter={`.${t.id}`}
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

        <div className="row">
          <div className="col-12 filter-content p-md-0">
            <ul className="portfolio-wrapper grid gutter-extra-large pgs-masterclass-stage m-0 p-0">
              <li className="grid-sizer" aria-hidden />
              {MASTERCLASS_TABS.map((t) => {
                const m = MASTERCLASS_BY_TAB[t.id];
                const open = openByTab[t.id];
                const active = tab === t.id;
                return (
                  <li
                    key={t.id}
                    className={`grid-item ${t.id} transition-inner-all w-100 pgs-masterclass-item${
                      active ? " is-active" : ""
                    }`}
                    aria-hidden={!active}
                  >
                    <div className="row mobile-reverse-row">
                      <div className="col-lg-6 mobile-p-0 mobile-pt-10">
                        <h5 className="text-black moble-m-auto fw-400 mb-1 w-60 fs-25 lh-28 mobile-fs-19 mobile-lh-22 mobile-text-center">
                          {m.subtitle}
                        </h5>
                        <div className="mobile-px-5">
                          <p className="mobile-mt-13px mb-0 text-black fs-12 lh-12 mobile-fs-12">
                            More sessions coming up for Medical & STEM aspirants
                            — reach out to our counsellors.
                          </p>
                        </div>
                        <div className="accordion accordion-style-02">
                          {m.accordion.map((item, i) => {
                            const isOpen = open === i;
                            return (
                              <div
                                className={`accordion-item${
                                  isOpen ? " active-accordion" : ""
                                }`}
                                key={item.q}
                              >
                                <div className="accordion-header border-bottom border-color-extra-medium-gray">
                                  <a
                                    href={`#acc-${t.id}-${i}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenByTab((prev) => ({
                                        ...prev,
                                        [t.id]: isOpen ? -1 : i,
                                      }));
                                    }}
                                  >
                                    <div className="accordion-title mb-0 position-relative text-black">
                                      <i
                                        className={`feather ${
                                          isOpen
                                            ? "icon-feather-minus"
                                            : "icon-feather-plus"
                                        }`}
                                      />
                                      <span className="fw-600 fs-16 lh-20 ls-minus-05px mobile-fs-14">
                                        {item.q}
                                      </span>
                                    </div>
                                  </a>
                                </div>
                                {isOpen ? (
                                  <div className="accordion-collapse collapse show">
                                    <div className="accordion-body last-paragraph-no-margin border-bottom border-color-light-medium-gray">
                                      <p className="fw-400 fs-14 lh-19">
                                        {item.a}
                                      </p>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-lg-5 mobile-p-0 offset-lg-1">
                        <div className="overflow-hidden border-radius-16px w-383px">
                          <div className="card-box-gradiant border p-4">
                            <div className="card-box-gradiant-header purple-dot">
                              <h5 className="mb-0">{m.title}</h5>
                            </div>
                            <div className="date-box">
                              <div>
                                <div className="box-date-info">
                                  <span className="date">
                                    {m.startLabel.day}
                                  </span>
                                  <span className="month">
                                    {m.startLabel.month}
                                  </span>
                                </div>
                                <p className="mb-0 text-black fw-600 fs-12 lh-16 mt-2">
                                  {m.startLabel.time}
                                </p>
                                {m.startLabel.mode ? (
                                  <p className="mb-0 text-black fw-600 fs-12 lh-16 mt-1">
                                    {m.startLabel.mode}
                                  </p>
                                ) : null}
                              </div>
                              <div>
                                <div className="box-date-info">
                                  <span className="date">
                                    {m.endLabel.day}
                                  </span>
                                  <span className="month">
                                    {m.endLabel.month}
                                  </span>
                                </div>
                                <p className="mb-0 text-black fw-600 fs-12 lh-16 mt-2">
                                  {m.endLabel.time}
                                </p>
                                {m.endLabel.host ? (
                                  <p className="mb-0 text-black fw-600 fs-12 lh-16 mt-1">
                                    {m.endLabel.host}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            <div className="btn-content w-50">
                              <h5 className="mb-0 text-black fw-400 fs-20">
                                Who&apos;s It For?
                              </h5>
                              <p className="mb-0 fs-14 lh-18 text-black">
                                {m.who.map((line) => (
                                  <span key={line}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </p>
                            </div>
                            <div className="text-content">
                              <h5 className="mb-0 text-black fw-400 fs-20">
                                Topics Covered
                              </h5>
                              {m.topics.map((topic) => (
                                <h6
                                  className="mb-0 text-black fw-400 fs-15 lh-20 "
                                  key={topic}
                                >
                                  {topic}
                                </h6>
                              ))}
                            </div>
                            <div className="d-flex justify-content-space">
                              <Link
                                href="/purpleevents"
                                className="sop-learn-btn bg-blue-500 mt-4 lh-25"
                              >
                                Learn More
                              </Link>
                            </div>
                            <div className="img-left-absoulute">
                              <figure className="position-relative m-0 text-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={m.image} alt="" />
                              </figure>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
