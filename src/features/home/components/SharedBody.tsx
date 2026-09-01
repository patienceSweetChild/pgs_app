"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { VerticalStatCounter } from "@/features/auth/VerticalStatCounter";
import "@/components/bump-premium-modal.css";
import "@/features/scholarship/scholarship.css";
import {
  CHECKLIST_MODAL_COPY,
  CHECKLIST_MODAL_GOALS,
  CHECKLIST_STUDY_OPTIONS,
  CHECKLIST_SUCCESS_MODAL,
  HOME_ABOUT_TEASER,
  HOME_APPLICATION_CHECKS,
  HOME_DASHBOARD,
  HOME_EDGE_TILES,
  HOME_FAQ,
  HOME_GALLERY,
  HOME_INTRO,
  HOME_MEDICAL_CHECKS,
  HOME_PREMIUM_PATHS,
  HOME_PREMIUM_STEM,
  HOME_QUOTE,
  HOME_STAT_FOOTNOTES,
  HOME_STATS,
} from "../content";
import {
  DifferentGoalsSection,
  HomeNewsSection,
  MasterclassSection,
  StudyJourneySection,
} from "./InteractiveSections";

function CheckList({
  items,
  itemClassName,
}: {
  items: readonly string[];
  itemClassName?: string;
}) {
  return (
    <div className="check_box">
      <ul>
        {items.map((item) => (
          <li key={item} className={itemClassName}>
            <i className="bi bi-check-circle-fill" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EdgeTile({
  label,
  className,
  align = "text-center",
}: {
  label: string;
  className: string;
  align?: "text-start" | "text-center";
}) {
  return (
    <div
      className={`card-custom ${className} ht-107px d-flex align-items-center justify-content-center bg-yellow border-radius-15px mb-0 p-3`}
    >
      <h5 className={`mb-0 p-5 fs-25 text-black ${align} card-1 p-4 lh-full`}>
        {label.split("\n").map((line, i) => (
          <span key={`${label}-${i}`}>
            {line}
            {i < label.split("\n").length - 1 ? <br /> : null}
          </span>
        ))}
      </h5>
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="about-section half-section overlap-height position-relative overflow-hidden pt-13">
      <div className="overlap-gap-section p-0 w-863px m-auto">
        <div className="row align-items-center justify-content-md-center m-0">
          <div className="col-lg-12 col-md-12 m-0">
            <div className="card card-comment">
              <h5>
                <span className="fnt-50">“</span>
                <span>
                  {HOME_QUOTE}
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
  );
}

function StatsSection() {
  return (
    <section className="pt-0 pb-5">
      <div className="w-863px m-auto">
        <div className="d-flex justify-content-space counter-style-04 mobile-grid mobile-grid-2 full-width-mobile">
          {HOME_STATS.map((stat) => (
            <div
              className="w-128px last-paragraph-no-margin text-center sm-mb-40px"
              key={stat.label}
            >
              {stat.kind === "static" ? (
                <h3 className="d-inline-flex alt-font text-green fw-700 ls-minus-3px m-0 cutsom-count-1">
                  {stat.value}
                </h3>
              ) : (
                <VerticalStatCounter to={stat.to} suffix="%" />
              )}
              <p className={"paragraphClass" in stat ? stat.paragraphClass : undefined}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-80 m-auto nowrap mobile-none">
        <div className="row row-cols-4 row-cols-md-4 pt-4 pb-0 row-cols-sm-2 justify-content-end counter-style-05">
          <div className="w-313px last-paragraph-no-margin text-center sm-mb-40px">
            {HOME_STAT_FOOTNOTES.map((note) => {
              const star = note.match(/^\*+/)?.[0] ?? "";
              const rest = note.slice(star.length);
              return (
                <div key={note}>
                  <p>
                    <span>{star}</span>
                    {rest}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="home-intro-pgs">
      <div className="overlap-gap-section p-0">
        <div className="mb-10px w-922px m-auto d-flex gap-2 align-items-center mobil-items-start">
          <div style={{ textIndent: 20 }}>
            <h6 className="mb-0 text-black fs-17 fw-600 nowrap mobile-nowrap lh-17 m-fs-12 mb-5">
              {HOME_INTRO.eyebrow}
            </h6>
            <h1 className="text-black fw-600 fs-75 m-fs-34px nowrap mobile-nowrap lh-30">
              {HOME_INTRO.title}
            </h1>
          </div>
          <span className="text-black fs-14 text-gray fw-400 lh-20 d-inline-block mobile-w-half">
            <b>{HOME_INTRO.bodyLead}</b>
            {HOME_INTRO.bodyRest}
          </span>
        </div>
        <div className="position-relative md-mb-50px sm-mb-40px w-880px m-auto p-0">
          <figure className="position-relative m-0 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HOME_INTRO.image}
              alt=""
              className="w-100 border-radius-6px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className="mobile-dashboard-box pt-5">
      <div className="w-998px m-auto overlap-gap-section p-0">
        <div className="fnt-family fs-38 lh-full text-black w-40 m-auto mb-4">
          {HOME_DASHBOARD.title} <br />
          {HOME_DASHBOARD.titleLine2}
        </div>
        <div className="row justify-content-center position-relative">
          <div className="col-lg-9">
            <div className="section-img-setup">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOME_DASHBOARD.gif} alt="" />
            </div>
          </div>
          <div className="bg-flot-box-dashboard">
            <div className="like-floting-button">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOME_DASHBOARD.heart} alt="" />
            </div>
            <div className="light-blue-text">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOME_DASHBOARD.checkIcon} alt="" /> {HOME_DASHBOARD.badge}
            </div>
            <p className="mb-0 fs-14 lh-21 text-white fw-400 m-fs-14-update">
              {HOME_DASHBOARD.whiteCopy}
            </p>
          </div>
          <div className="flot-green-box-dashboard text-black">
            <p className="mb-2 fs-16 lh-19 fw-400">{HOME_DASHBOARD.greenCopy}</p>
            <h5 className="mb-0 fs-17 lh-22 fw-500">
              {HOME_DASHBOARD.greenHeading}
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustEdgeMobile() {
  return (
    <section className="trust-box half-section overlap-height pgs-box-setup desktop-none position-relative mt-10">
      <div className="w-956px overlap-gap-section p-0 m-auto">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
          <div className="mb-10px gap-5">
            <div className="text-center">
              <h5 className="text-black fw-700">
                The #PGS Edge & why students trust us
              </h5>
            </div>
          </div>
        </div>
        <div
          className="d-flex gap-1 bg-black border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px mobile-wrap"
          style={{ paddingBottom: 7 }}
        >
          <div className="border-radius-10px custom-gap-1 mobile-w-40">
            <div className="card-custom d-flex bg-white border-radius-15px justify-content-center mb-5 p-3 mt-2 w-150px ht-107px">
              <h5 className="mb-0 p-5 fs-25 lh-full fw-400 d-flex align-items-center text-black text-center card-1 p-4">
                Visa Prep <br />
                & Support
              </h5>
            </div>
            <div className="ht-343px w-150px card-custom bg-yellow border-radius-15px h-100 mb-2 p-3 d-flex align-items-center">
              <h4 className="mb-0 p-5 lh-full fw-400 fs-28 text-black text-center">
                Personalized Roadmap
                <br /> for STEM, <br />
                MBA & Other <br /> Courses
              </h4>
            </div>
          </div>
          <div className="mobile-w-55">
            <div className="d-flex align-items-center gap-3">
              <figure className="w-150px ht-222px position-relative fixed-img m-0 text-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/player-1.png" alt="" />
              </figure>
              <div className="w-309px ht-222px calendar-box p-5">
                <div className="desktop-none text-calendar">
                  Feedback Session for Your Path
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/calendar.png"
                  alt=""
                  className="w-100"
                />
              </div>
            </div>
            <div className="mobile-d-flex">
              <div>
                <div className="banner-points bg-light-dark p-5 border-radius-10px w-469px ht-224px">
                  <h5 className="w-100 fw-400 pt-2 lh-22">for applications</h5>
                  <div className="w-100 d-flex align-items-center justify-content-center">
                    <CheckList
                      items={HOME_APPLICATION_CHECKS}
                      itemClassName="mb-5"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <EdgeTile
                  label={"bank \nloans"}
                  className="w-150px"
                  align="text-center"
                />
                <EdgeTile
                  label={"scholarship\nprep"}
                  className="w-76px"
                  align="text-start"
                />
                <EdgeTile label="research roadmap" className="w-150px" />
                <EdgeTile label="career sessions" className="w-150px" />
              </div>
            </div>
          </div>
          <div className="d-flex full-box-1">
            <div className="w-310px pt-10 pb-10 banner-points bg-light-dark p-5 border-radius-10px mt-2">
              <div className="d-flex gap-3">
                <h5 className="w-50 pt-2">
                  medical <br />
                  pathway <br />
                  support <br />
                </h5>
                <div className="w-50 mobile-w-60">
                  <CheckList items={HOME_MEDICAL_CHECKS} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustEdgeDesktop() {
  return (
    <section className="trust-box half-section overlap-height position-relative mt-10 mobile-none">
      <div className="w-956px overlap-gap-section p-0 m-auto">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
          <div className="mb-10px gap-5">
            <div className="text-center">
              <h5 className="text-black fw-700">
                The #PGS Edge & why students trust us
              </h5>
            </div>
          </div>
        </div>
        <div
          className="d-flex gap-1 bg-black border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px"
          style={{ paddingBottom: 7 }}
        >
          <div className="border-radius-10px custom-gap-1">
            <div className="card-custom d-flex bg-white border-radius-15px justify-content-center mb-5 p-3 mt-2 w-150px ht-107px">
              <h5 className="mb-0 p-5 fs-25 lh-full fw-400 d-flex align-items-center text-black text-center card-1 p-4">
                Visa Prep <br />
                & Support
              </h5>
            </div>
            <div className="ht-343px w-150px card-custom bg-yellow border-radius-15px h-100 mb-2 p-3 d-flex align-items-center">
              <h4 className="mb-0 p-5 lh-full fw-400 fs-28 text-black text-center">
                Personalized Roadmap
                <br /> for STEM, <br />
                MBA & Other <br /> Courses
              </h4>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center gap-3">
              <figure className="w-150px ht-222px position-relative fixed-img m-0 text-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/player-1.png" alt="" />
              </figure>
              <div className="w-309px ht-222px calendar-box p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/calendar.png"
                  alt=""
                  className="w-100"
                />
              </div>
            </div>
            <div className="banner-points bg-light-dark p-5 border-radius-10px w-469px ht-224px">
              <div className="d-flex gap-3">
                <h5 className="w-50 pt-2">
                  medical <br />
                  pathway <br />
                  support <br />
                </h5>
                <div className="w-50">
                  <CheckList items={HOME_MEDICAL_CHECKS} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-310px pt-10 pb-10 banner-points bg-light-dark p-5 border-radius-10px mt-2">
              <h5 className="w-100 fw-400 pt-2 lh-22">for applications</h5>
              <div className="w-100 d-flex align-items-center justify-content-center">
                <CheckList
                  items={HOME_APPLICATION_CHECKS}
                  itemClassName="mb-5"
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-2" style={{ flexWrap: "wrap" }}>
              {HOME_EDGE_TILES.map((tile) => (
                <EdgeTile
                  key={tile.label}
                  label={tile.label}
                  className={tile.className}
                  align={tile.align}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentCard({
  image,
  name,
  role,
  school,
  country,
  tag,
}: {
  image: string;
  name: string;
  role: string;
  school: string;
  country: string;
  tag: string;
}) {
  return (
    <div className="card-img-box">
      <figure className="position-relative fixed-gallery-1 m-0 text-center mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" />
      </figure>
      <div className="img-catptio">
        <div className="avatar-name d-flex align-items-center justify-content-space gap-4">
          <div>
            <h5 className="mb-0">{name}</h5>
            <h6 className="mb-0">{role}</h6>
            <h6 className="mb-0">
              {school} <b>{country}</b>
            </h6>
          </div>
          <div>
            <h5 className="fs-28 lh-22 fw-500 fnt-family">{tag}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaptionCard({
  image,
  name,
  subtitle,
  program,
  tag,
}: {
  image: string;
  name: string;
  subtitle: string;
  program: string;
  tag: string;
}) {
  return (
    <div className="caption-img-box-new small-caption">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" />
      <div className="d-flex position-absolute-css z-100 justify-content-space px-4">
        <div>
          <h5 className="fs-19 lh-22 fw-500 fnt-family text-white mb-0">
            {name}
          </h5>
          <p className="mb-0 fs-9 lh-8 text-white">{subtitle}</p>
        </div>
        <div className="minus-10 flot-text">
          <h5 className="fs-16 lh-16 fw-500 fnt-family text-white mb-0">
            {program}
          </h5>
          <h5 className="fs-25 lh-22 fw-500 fnt-family text-white mb-0">
            {tag}
          </h5>
        </div>
      </div>
    </div>
  );
}

function GallerySection() {
  const s = HOME_GALLERY.student;
  return (
    <section className="half-section home-gallery-mobile overlap-height position-relative overflow-hidden mt-8">
      <div className="w-903px m-auto overlap-gap-section p-0">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
          <div className="mb-10px gap-5">
            <div className="text-start mb-4">
              <h5 className="w-80 text-black fw-700 m-auto fs-28 lh-35 fw-500 mobile-compact-1">
                No matter the stage, our team has helped students
                <br />
                just like you get to their goal.
              </h5>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px grid-mobile-compact">
          <div className="w-30 m-w-48 overflow-hidden border-radius-10px">
            <div className="full-photo border-radius-15px mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOME_GALLERY.frame} alt="" />
            </div>
            <div className="desktop-none">
              <StudentCard {...s} />
              <StudentCard {...s} />
              <div className="card-img-box mobile-none">
                <div className="paragraph-1">{HOME_GALLERY.quote}</div>
              </div>
            </div>
          </div>
          <div className="m-w-48">
            <div>
              {HOME_GALLERY.captionCards.map((card, i) => (
                <CaptionCard key={`${card.name}-${i}`} {...card} />
              ))}
            </div>
            <div className="card-img-box desktop-none">
              <div className="paragraph-1">{HOME_GALLERY.quote}</div>
            </div>
          </div>
          <div className="w-35 m-w-48 mobile-none">
            <div>
              <StudentCard {...s} />
              <StudentCard {...s} />
              <div className="card-img-box mobile-none">
                <div className="paragraph-1">{HOME_GALLERY.quote}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathCard({
  href,
  title,
  subtitle,
  body,
}: {
  href: string;
  title: string;
  subtitle: string;
  body: string;
}) {
  return (
    <Link href={href} className="card-line">
      <div className="black-header">
        <h5>{title}</h5>
        <h6>{subtitle}</h6>
      </div>
      <p>{body}</p>
    </Link>
  );
}

function ChecklistCta({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="border-radius-6px overflow-hidden">
      <div className="gradient-border">
        <div className="gradient-border-inner">
          <h5>Download our Application Planning Checklist (Free PDF)</h5>
          <button
            type="button"
            className="btn btn-small-large cm-buttom-1 border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
            onClick={onOpen}
          >
            <span>
              <span
                className="btn-double-text ls-minus-05px fs-15"
                data-text="Request it here"
              >
                Request it here
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WebcomePanel({ mobile = false }: { mobile?: boolean }) {
  const fs = mobile ? "fs-14" : "fs-24";
  return (
    <div className="card-box-webcome">
      <div className="header-web">
        <div className="webcome-buttons">
          <span className="bg-red" />
          <span className="bg-yellow" />
          <span className="bg-green" />
        </div>
        <div className="webcome-buttons">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/resize-icon.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/lines-icon.png" alt="" />
        </div>
      </div>
      <div>
        <div className="fit-cover-webcome position-relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/read-you-girl.jpg" alt="" />
          <h6
            className={`position-absolute top-0 w-100 h-100 d-flex align-items-center justify-content-center ${fs} text-uppercase text-white mb-0 lh-full fw-400`}
            style={{ background: "#0000003d" }}
          >
            YOU
          </h6>
        </div>
        <div className="fit-cover-webcome position-relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/girl-mentor.jpg" alt="" />
          <h6
            className={`position-absolute top-0 w-100 h-100 d-flex align-items-center justify-content-center ${fs} text-center text-white mb-0 lh-full fw-400`}
            style={{ background: "#0000003d" }}
          >
            your <br /> mentor
          </h6>
        </div>
        <div className="fit-cover-webcome dark-pink-bg d-flex align-items-center justify-content-center">
          <h6 className={`${fs} text-white mb-0 lh-full fw-400`}>
            Team <br /> #PGS
          </h6>
        </div>
      </div>
    </div>
  );
}

function StemCard() {
  return (
    <Link
      href={HOME_PREMIUM_STEM.href}
      className="card-line ht-535px"
      style={{ paddingBottom: 150, marginLeft: -78 }}
    >
      <div className="black-header-2">
        {HOME_PREMIUM_STEM.titles.map((t) => (
          <h5 key={t}>{t} </h5>
        ))}
      </div>
      <br />
      <p className="mt-0">{HOME_PREMIUM_STEM.body}</p>
    </Link>
  );
}

function PremiumJumpSection() {
  const [usmle, amc, plab, rotation] = HOME_PREMIUM_PATHS;
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studyPlan, setStudyPlan] = useState<string>(CHECKLIST_STUDY_OPTIONS[0].value);
  const [goals, setGoals] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHECKLIST_MODAL_GOALS.map((g) => [g, true])),
  );

  useEffect(() => {
    if (!modalOpen && !successOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen, successOpen]);

  function openChecklistModal() {
    setSuccessOpen(false);
    setModalOpen(true);
  }

  function closeChecklistModals() {
    setModalOpen(false);
    setSuccessOpen(false);
  }

  function onChecklistSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setModalOpen(false);
    setSuccessOpen(true);
  }

  return (
    <>
    <section className="half-section overlap-height position-relative overflow-hidden mobile-premium-section">
      <div className="w-873px m-auto overlap-gap-section p-0">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px pb-sm-0">
          <div className="mb-10px gap-5">
            <div className="text-center mb-4">
              <span className="small-caption fs-15 lh-full text-uppercase fw-600 mobile-fs-14">
                Built for aspirers
              </span>
              <h5 className="w-100 text-black fs-25 mt-1 mb-2 fw-500 lh-full m-auto mobile-fs-16">
                Jump into directly to our premium section
              </h5>
              <p className="w-75 fs-15 lh-full text-center m-auto mobile-fs-14">
                No generic advice—just solid guidance, proven routes, and
                personalized plans for USMLE, PLAB, STEM, MBA, or whatever path
                you&apos;re aiming for.
              </p>
            </div>
          </div>
        </div>

        <div className="mobile-none d-flex gap-3 border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px mobile-flex-wrap">
          <div className="w-35">
            <PathCard {...usmle} />
            <PathCard {...amc} />
            <PathCard {...plab} />
          </div>
          <div>
            <PathCard {...rotation} />
            <ChecklistCta onOpen={openChecklistModal} />
            <div className="card-line-ht w-362px">
              <h5>#purplePremium</h5>
              <div className="black-header-1">
                Now open for the Class of 2025, 2026, and 2027.
              </div>
            </div>
          </div>
          <div className="w-35">
            <StemCard />
            <WebcomePanel />
          </div>
        </div>

        <div className="desktop-none border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px p-4">
          <div className="card-line-ht w-362px">
            <h5>#purplePremium</h5>
            <div className="black-header-1">
              Now open for the Class of 2025, 2026, and 2027.
            </div>
          </div>
          <div className="border-radius-6px overflow-hidden mt-5">
            <div className="gradient-border">
              <div className="gradient-border-inner">
                <h5>Download our Application Planning Checklist (Free PDF)</h5>
                <button
                  type="button"
                  className="btn btn-small-large cm-buttom-1 border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
                  onClick={openChecklistModal}
                >
                  <span>
                    <span
                      className="btn-double-text ls-minus-05px fs-15"
                      data-text="Request it here"
                    >
                      Request it here
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3 px-3">
            <div className="w-50 pt-2">
              <PathCard {...usmle} />
              <PathCard {...amc} />
              <PathCard {...plab} />
              <PathCard {...rotation} />
            </div>
            <div className="w-50 pt-2">
              <StemCard />
              <WebcomePanel mobile />
            </div>
          </div>
        </div>
      </div>
    </section>

    {modalOpen ? (
      <div
        className="mobile-applicant pgs-modal pgs-modalSc pgs-modalSplit premium-modal-overlay"
        style={{ display: "flex" }}
      >
        <div className="premium-modal-container purple-modal d-flex">
          <div className="panel-left">
            <button
              className="close-btn desktop-none"
              type="button"
              aria-label="Close"
              onClick={closeChecklistModals}
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
              {CHECKLIST_MODAL_COPY.subLabel}
            </div>
            <p className="tagline lh-18ppx">{CHECKLIST_MODAL_COPY.tagline}</p>
            <div className="boost-wrap">
              <div className="mobile-none" style={{ margin: "0 0 0 auto" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/arrow-modal.png"
                  style={{ width: 95, marginLeft: -10 }}
                  alt=""
                />
                <span className="w-full d-block fs-16 text-white lh-18">
                  {CHECKLIST_MODAL_COPY.boostDesktop.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < CHECKLIST_MODAL_COPY.boostDesktop.length - 1 ? (
                        <br />
                      ) : null}
                    </span>
                  ))}
                </span>
              </div>
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/bump.png" alt="" />
              </div>
              <div className="desktop-none">
                <p className="mb-0 fs-14 lh-20 fw-400 text-white">
                  {CHECKLIST_MODAL_COPY.boostMobile}
                </p>
              </div>
            </div>
          </div>

          <div className="panel-right">
            <button
              className="close-btn mobile-none"
              type="button"
              aria-label="Close"
              onClick={closeChecklistModals}
            >
              ✕
            </button>

            <form onSubmit={onChecklistSubmit}>
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
                    placeholder={CHECKLIST_MODAL_COPY.phonePlaceholder}
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <p className="section-label mb-0">
                  {CHECKLIST_MODAL_COPY.aimLabel}
                </p>
                <div className="toggle-list" style={{ marginTop: 12 }}>
                  {CHECKLIST_MODAL_GOALS.map((goal) => (
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
                  {CHECKLIST_MODAL_COPY.studyLabel}
                </p>
                <div className="d-flex gap-3">
                  <select
                    className="modal-btn-pgs text-center"
                    value={studyPlan}
                    onChange={(e) => setStudyPlan(e.target.value)}
                  >
                    {CHECKLIST_STUDY_OPTIONS.map((o) => (
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

              <div className="cta-row">
                <button className="cta-btn" type="submit">
                  {CHECKLIST_MODAL_COPY.cta}
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
        className="pgs-modal premium-modal-overlay modal-pgsamc-2 scholarship-success-overlay"
        style={{ display: "flex" }}
      >
        <div className="premium-modal-container purple-modal d-flex bg-white pgs-modal-2 scholarship-success">
          <button
            className="close-btn"
            type="button"
            aria-label="Close"
            onClick={closeChecklistModals}
          >
            ✕
          </button>
          <div className="scholarship-success__hero text-center">
            <h5 className="fw-700 fs-48 text-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/check-12.png"
                style={{ width: 50 }}
                alt=""
              />
              {CHECKLIST_SUCCESS_MODAL.title}
            </h5>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/okk.png"
              className="scholarship-success__hand"
              alt=""
            />
            <h5 className="fw-400 fs-24 fnt-family text-black mb-0">
              {CHECKLIST_SUCCESS_MODAL.nextTitle}
            </h5>
          </div>

          <div className="scholarship-success__side mobile-none">
            <div className="scholarship-success__copy">
              {CHECKLIST_SUCCESS_MODAL.paragraphs.map((p) => (
                <p key={p} className="fs-13 fw-400 mb-3 text-black lh-15">
                  {p}
                </p>
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="scholarship-success__heart"
              src="/assets/img/heart.gif"
              alt=""
            />
            <div className="scholarship-success__cta">
              <p className="fs-13 lh-15 text-white mb-2">
                {CHECKLIST_SUCCESS_MODAL.stripLines[0]}
              </p>
              <p className="fs-13 lh-15 text-white mb-0">
                <Link
                  href="/contact"
                  className="text-white text-decoration-underline"
                >
                  {CHECKLIST_SUCCESS_MODAL.stripLines[1]}
                </Link>
              </p>
            </div>
          </div>

          <div className="scholarship-success__mobile desktop-none">
            {CHECKLIST_SUCCESS_MODAL.paragraphs.map((p) => (
              <p key={p} className="fs-13 fw-400 mb-3 text-black lh-15">
                {p}
              </p>
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/img/heart.gif"
              style={{
                width: 50,
                borderRadius: 10,
                margin: "8px auto 12px",
                display: "block",
              }}
              alt=""
            />
            <div className="scholarship-success__cta">
              <p className="fs-13 lh-15 text-white mb-2">
                {CHECKLIST_SUCCESS_MODAL.stripLines[0]}
              </p>
              <p className="fs-13 lh-15 text-white mb-0">
                <Link
                  href="/contact"
                  className="text-white text-decoration-underline"
                >
                  {CHECKLIST_SUCCESS_MODAL.stripLines[1]}
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

function AboutTeaserSection() {
  return (
    <section className="pt-3 mobile-aboutus">
      <div className="w-503px m-auto overlap-gap-section p-0">
        <div className="position-relative bg-gray bg-very-light-green xl-p-4 md-p-50px sm-p-30px border-radius-10px pl-6-pt-6">
          <div className="mb-10px">
            <div className="mt-10 mt-10 mobile-px-4">
              <h2 className="mb-1 mt-30 text-uppercase fnt-bab text-black fs-38 fw-400 fnt-family mobile-fs-20 mobile-lh-18">
                about us
              </h2>
              <Link
                href="/about"
                style={{ padding: "8px 30px" }}
                className="mb-2 mobile-px-3 btn btn-small-large border-radius-10px btn-base-color btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-5px"
              >
                <span>
                  <span
                    className="btn-double-text ls-minus-05px fs-15"
                    data-text="get to know #pgs"
                  >
                    get to know #pgs
                  </span>
                </span>
              </Link>
              <p className="text-black fs-16 lh-19 mt-6 mb-30 mobile-fs-14 mobile-pb-30">
                {HOME_ABOUT_TEASER.body}
              </p>
            </div>
            <figure className="about-floting-img m-0 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HOME_ABOUT_TEASER.image}
                alt=""
                className="border-radius-6px"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="half-section overlap-height position-relative overflow-hidden">
      <div className="container overlap-gap-section p-0">
        <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
          <div className="mb-10px gap-5">
            <div className="text-center mb-2">
              <span className="small-caption" style={{ color: "#6A5ED9" }}>
                Let&apos;s Go
              </span>
              <h5 className="w-100 text-black fs-40 mb-2 fw-700 m-auto mobile-fs-18">
                Ready to get started?
              </h5>
              <p className="w-40 text-center m-auto mobile-get-start">
                Let’s chart your study abroad path, together with Team #PGS.
              </p>
              <Link
                href="/login?signup=1"
                style={{ padding: "8px 30px", backgroundColor: "#6A5ED9" }}
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
  );
}

function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  const items = faqs.length > 0 ? faqs : [...HOME_FAQ];

  return (
    <section className="pt-0 faq_section">
      <div className="container overlap-gap-section p-0">
        <div className="col-lg-10 bg-very-light-green xl-p-4 md-p-50px sm-p-30px m-auto">
          <h2 className="fac-title">FAQ’s</h2>
          <div className="accordion accordion-style-02">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  className={`accordion-item${isOpen ? " active-accordion" : ""}`}
                  key={`${item.q}-${i}`}
                >
                  <div
                    className={`accordion-header ${
                      i === items.length - 1
                        ? "border-color-transparent"
                        : "border-color-extra-medium-gray"
                    }`}
                  >
                    <a
                      href={`#home-faq-${i}`}
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
                        <span className="fw-600 fs-16 lh-20 ls-minus-05px mobile-fs-14 mobile-fw-500 mobile-lh-18">
                          {item.q}
                        </span>
                      </div>
                    </a>
                  </div>
                  {isOpen ? (
                    <div className="accordion-collapse collapse show">
                      <div
                        className={`accordion-body last-paragraph-no-margin ${
                          i === items.length - 1
                            ? "border-color-transparent"
                            : "border-color-light-medium-gray"
                        }`}
                      >
                        <p className="fw-400 fs-14 lh-19">{item.a}</p>
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

/** Shared marketing body for all home experience variants (from home.html). */
export function SharedBody({
  faqs,
}: {
  faqs?: { q: string; a: string }[];
} = {}) {
  return (
    <>
      <QuoteSection />
      <StatsSection />
      <IntroSection />
      <DashboardSection />
      <TrustEdgeMobile />
      <TrustEdgeDesktop />
      <DifferentGoalsSection />
      <StudyJourneySection />
      <GallerySection />
      <PremiumJumpSection />
      <AboutTeaserSection />
      <HomeNewsSection />
      <MasterclassSection />
      <CtaSection />
      <FaqSection faqs={faqs ?? []} />
    </>
  );
}
