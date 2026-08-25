"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BumpPremiumModal,
  UNLOCK_BUMP_CONFIG,
} from "@/components/BumpPremiumModal";
import { SoftLock } from "@/components/SoftLock";
import { useExperience } from "@/lib/auth/experience";
import {
  COMPLETED,
  COUNSELOR_NOTES,
  DRAFT_METER,
  DRAFT_PHASE,
  IMPORTANT_ALERTS,
  IN_PROGRESS,
  JOURNEY_MAP,
  RESOURCE_DROP,
  REVIEW_QUEUE,
  TIP_SLIDES,
} from "./content";
import "./progress.css";

/**
 * Progress board — locked (!premium) / unlocked (premium).
 * From Figma + standalone-html/progress-locked.html
 */
export function ProgressPage() {
  const { isLoggedIn, isPremium } = useExperience();
  const router = useRouter();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const locked = !isPremium;

  function openUnlock() {
    if (!isLoggedIn) {
      router.push("/login?redirect=/feed_track_progress");
      return;
    }
    setUnlockOpen(true);
  }

  return (
    <div className="wrapper-content">
      <section className="pt-6 about-section half-section overlap-height position-relative overflow-hidden minus-5 mobile-doc-section">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-md-center align-items-center ">
            <div className="col-lg-7 d-flex gap-10 align-items-center">
              <div className="w-300px d-flex align-items-center justify-content-end">
                <h1 className="text-start text-black fnt-family fw-400 fs-50 lh-full pt-0 mb-0">
                  your <br /> custom <br />
                  progress
                  <br /> board
                </h1>
              </div>
              <div className="yellow-box-style-3 w-300px position-relative">
                {locked ? <SoftLock onUnlock={openUnlock} /> : null}
                <div className="header-yellow-box-style-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/bell.gif" className="w-10" alt="" />
                  Important Alerts
                </div>
                <ol>
                  {IMPORTANT_ALERTS.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="row justify-content-md-center mt-3">
            <div className="col-lg-6">
              <p className="mb-0 text-black m-auto fs-16 lh-19">
                This section is built to guide you from Day 1 to your final
                university admit. It shows every step of your study journey in
                one clear view. Your mentor will create a personalized map based
                on your profile. Think of it like your own Kanban board—split
                into draft, in progress, and completed stages. You’ll always
                know what’s done, what’s next, and what needs work. No
                guesswork, no confusion—just your path, laid out clearly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="group-chart-section pt-0 mobile-doc-section ">
        <div className="w-780px m-auto">
          <div className="row justify-content-center position-relative border-radius-10">
            {locked ? (
              <SoftLock onUnlock={openUnlock} style={{ borderRadius: 10 }} />
            ) : null}
            <div className="m-auto p-0">
              <div className="card-box">
                <div className="list-of-graphs">
                  <div className="d-flex-group">
                    <p className="mb-0 text-black">#draftMeter</p>
                  </div>
                  {DRAFT_METER.map((label) => (
                    <div className="d-flex-group" key={label}>
                      <div className="graph-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/meeter.png" alt="" />
                      </div>
                      <span className="mobile-roted">|</span>
                      <div className="graph-box-content">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="count-of-grpah">
                  <span>+</span>
                  <p className="mb-0 fnt-family fs-100 lh-full">3</p>
                  <span>completed</span>
                </div>
              </div>

              <div className="card-box">
                <div className="list-of-graphs">
                  <div className="d-flex-group">
                    <p className="mb-0 text-black" id="review-notes">
                      #reviewQueue
                    </p>
                  </div>
                  {REVIEW_QUEUE.map((item, i) => (
                    <div className="d-flex-group" key={`${item.label}-${i}`}>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          readOnly
                          disabled
                        />
                        <span className="slider" />
                      </label>
                      <span className="mobile-roted">|</span>
                      <div className="graph-box-content">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="count-of-grpah">
                  <span>+</span>
                  <p className="mb-0 fnt-family fs-100 lh-full">2</p>
                  <span>completed</span>
                </div>
              </div>

              <div className="card-box list-of-notes">
                <div className="list-of-graphs">
                  <div className="d-flex-group">
                    <p className="mb-0 text-black">#counselorNotes</p>
                  </div>
                  {COUNSELOR_NOTES.map((note, i) => (
                    <div className="d-flex-group gap-3" key={`${note}-${i}`}>
                      <div className="graph-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/img/avatar-icon.png" alt="" />
                      </div>
                      <div className="card-border-1">
                        <span className="count-of">{i + 1}</span>
                        <h5>{note}</h5>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="count-of-grpah">
                  <span>+</span>
                  <p className="mb-0 fnt-family fs-100 lh-full">4</p>
                  <span>pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-0 mobile-doc-section margin-mobile-row">
        <div className="w-586px m-auto">
          <div className="text-center">
            <h2 className="mb-2 fnt-family text-black fs-38 lh-full fw-400">
              #PGS Loopboard
            </h2>
          </div>
          <div className="row justify-content-center">
            <div className="p-0">
              <p className="mb-2 fw-400 text-black fs-16 lh-19">
                At PurpleGuide.study, we believe targeted success starts with a
                clear, well-thought-out study path. Most students waste time
                going in circles—trying things, pausing, rethinking, and
                starting over. We’ve seen it happen way too often. But the ones
                who truly succeed? They know exactly what they’re doing at every
                step.
              </p>
              <p className="mb-2 fw-400 text-black fs-16 lh-19">
                That’s where we come in.
              </p>
              <p className="mb-2 fw-400 text-black fs-16 lh-19">
                At #PGS, we help you build that clarity from day one. After a
                detailed chat with your counselor and mentor, we reverse-engineer
                your journey—starting from your goal and working backward to
                build the right steps for you.
              </p>
              <p className="mb-2 fw-400 text-black fs-16 lh-19">
                Below, you’ll find your custom roadmap, broken into four key
                sections. This isn’t some generic plan—it’s built just for you.
                Our goal? Every PurpleGuide student should know their path from
                the very beginning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-0 col-lg-11 m-auto mobile-doc-section">
        <div className="container-fluid bg-black border-radius-6px p-2 mobile-custom-pd-20 position-relative">
          {locked ? (
            <SoftLock
              onUnlock={openUnlock}
              style={{ borderRadius: 10, top: 0, left: 0, zIndex: 1000 }}
            />
          ) : null}
          <div className="row mobile-row-scrolling">
            <div className="col-lg-3">
              <div className="card-white-box">
                <h5 className="mb-2 fs-22 fw-500 text-black text-uppercase">
                  JOURNEY MAP
                </h5>
                {JOURNEY_MAP.map((card, i) =>
                  "bullets" in card ? (
                    <div
                      className="pink-box-card card-sm mb-3"
                      key={`jm-${i}`}
                    >
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                        {"important" in card && card.important ? (
                          <span className="highlight-tag">Important</span>
                        ) : null}
                      </div>
                      <ul>
                        {card.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ) : "plain" in card && card.plain ? (
                    <div className="card-sm mb-1 text-black" key={`jm-${i}`}>
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                      </div>
                      <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                    </div>
                  ) : (
                    <div
                      className="pink-box-card card-sm mb-3"
                      key={`jm-${i}`}
                    >
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14">{card.title}</h6>
                      </div>
                      <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="card-white-box">
                <h5 className="mb-2 fs-22 fw-500 text-black text-uppercase">
                  IN PROGRESS
                </h5>
                {IN_PROGRESS.map((card, i) =>
                  card.kind === "green" ? (
                    <div className="green-box-card card-sm mb-3" key={`ip-${i}`}>
                      <p className="text-black mb-0 fs-12 lh-full">{card.body}</p>
                    </div>
                  ) : (
                    <div
                      className="purple-box-card card-sm mb-3"
                      key={`ip-${i}`}
                    >
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                      </div>
                      <ul>
                        {card.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="card-white-box">
                <h5 className="mb-2 fs-22 fw-500 text-black text-uppercase">
                  draft phase
                </h5>
                {DRAFT_PHASE.map((card, i) => {
                  if (card.kind === "purple") {
                    return (
                      <div
                        className="purple-box-card card-sm mb-3"
                        key={`dp-${i}`}
                      >
                        <div className="d-flex justify-content-space mb-2">
                          <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                        </div>
                        <ul>
                          {card.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  if (card.kind === "pink") {
                    return (
                      <div
                        className="pink-box-card card-sm mb-3"
                        key={`dp-${i}`}
                      >
                        <div className="d-flex justify-content-space mb-2">
                          <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                        </div>
                        <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                      </div>
                    );
                  }
                  return (
                    <div className="card-sm mb-1 text-black" key={`dp-${i}`}>
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                      </div>
                      <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="card-white-box">
                <h5 className="mb-2 fs-22 fw-500 text-black text-uppercase">
                  completed
                </h5>
                {COMPLETED.map((card, i) => {
                  if (card.kind === "image") {
                    return (
                      <div
                        className="card-sm mb-3 card-sm-img text-black p-2"
                        key={`c-${i}`}
                      >
                        <div className="wrap-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.image}
                            className="border-radius-10px"
                            alt=""
                          />
                        </div>
                        <div className="d-flex align-items-center justify-content-space mt-3">
                          <h5 className="mb-0 fs-14 fw-700">{card.title}</h5>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/img/smile.png" className="w-10" alt="" />
                        </div>
                      </div>
                    );
                  }
                  if (card.kind === "dark") {
                    return (
                      <div className="bg-black card-sm mb-3" key={`c-${i}`}>
                        <div className="d-flex justify-content-space mb-2">
                          <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                        </div>
                        <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                      </div>
                    );
                  }
                  return (
                    <div className="green-bg card-sm mb-3" key={`c-${i}`}>
                      <div className="d-flex justify-content-space mb-2">
                        <h6 className="mb-0 fs-14 fw-700">{card.title}</h6>
                      </div>
                      <p className="mb-0 fs-12 lh-12 fw-400">{card.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TipsAndResources />

      <BumpPremiumModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        config={UNLOCK_BUMP_CONFIG}
      />
    </div>
  );
}

function TipsAndResources() {
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
    <section className="overflow-hidden mb-5 mobile-doc-section">
      <div className="w-1000px m-auto">
        <div className="row align-items-center justify-content-cente position-relative">
          <div className="text-center">
            <h3 className="alt-font fw-400 fs-38 ls-minus-1px text-dark-bab mb-3 mx-auto mobile-fs-24 mobile-pb-2">
              Useful Tips for Your Journey
            </h3>
            <div className="d-flex justify-content-center justify-content-xl-start align-cursor-center gap-3">
              <button
                type="button"
                className="slider-one-slide-prev-1 text-dark-gray swiper-button-prev slider-navigation-style-04"
                aria-label="Previous tip"
                onClick={() => setIndex((i) => (i - 1 + len) % len)}
              >
                <i className="fa-solid fa-arrow-left" />
              </button>
              <button
                type="button"
                className="slider-one-slide-next-1 text-dark-gray swiper-button-next slider-navigation-style-04"
                aria-label="Next tip"
                onClick={() => setIndex((i) => (i + 1) % len)}
              >
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden m-auto">
            <div className="outside-box-right-15 xl-outside-box-right-20 sm-outside-box-right-0">
              <div className="card-gray-1 text-center w-700px m-left-170px">
                <h5 className="fw-500 bg-black text-black d-inline-block text-white fs-20 px-2 border-radius-6px mb-2 mobile-fs-14">
                  {tip.tag}
                </h5>
                <h3 className="mb-0 fs-19 lh-full w-80 m-auto text-black text-uppercase mobile-fs-14 mobile-lh-full">
                  {tip.body}
                </h3>
              </div>
              <div className="progress-tip-dots w-700px m-left-170px" role="tablist" aria-label="Tip slides">
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
          </div>
        </div>

        <div className="row align-items-start mt-15">
          <div className="col-lg-4 offset-1">
            <h3 className="alt-font fw-700 ls-minus-1px fs-51 text-dark-bab mb-0 mx-auto mobile-fs-24 mobile-pb-2 mobile-text-center">
              Resource Drop
            </h3>
            <ul className="m-0 p-0 list-arrow mobile-w-60 mobile-m-auto">
              {RESOURCE_DROP.map((item, i) => (
                <li
                  key={item}
                  className={i === 0 ? "border-top border-color-black" : undefined}
                >
                  {item}{" "}
                  <span className="down-arrow">
                    <i className="bi bi-arrow-down-right" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
