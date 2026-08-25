"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CONTACT_STRIP,
  FILTER_TAGS,
  HERO,
  OUR_PROGRAM,
  PARTNER_LOGOS,
  PATH_SECTION,
  PROGRAM_INTRO,
  PROGRAMS,
  READY_CTA,
  SORT_TAGS,
  STATS,
  STUDY_JAM,
} from "./content";

/**
 * CV Ready Program — from standalone-html/cvreadyprogram.html
 * (wrapper-content through before footer)
 */
export function CvReadyProgramPage({
  programs: programsProp,
}: {
  programs?: { title: string; tags: string[] }[];
} = {}) {
  const [activeFilter, setActiveFilter] = useState("");
  const [activeSort, setActiveSort] = useState("order");
  const [query, setQuery] = useState("");
  const source = programsProp && programsProp.length > 0 ? programsProp : PROGRAMS;

  const programs = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = source.filter((p) => {
      if (activeFilter && !p.tags.includes(activeFilter)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    if (activeSort === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [activeFilter, activeSort, query, source]);

  return (
    <div className="wrapper-content">
      {/* 1. Hero */}
      <section className="pt-0 about-section half-section mobile-cvready-cart overlap-height position-relative minus-5">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="w-90 m-auto">
                <h1 className="text-black fw-500 fs-50 lh-full fnt-family pt-0 mb-3 w-30 m-auto">
                  {HERO.title}
                </h1>
                <p className="mb-10 lh-24 text-black w-100 text-start fs-19 lh-25 fw-400">
                  {HERO.body}
                </p>
              </div>
              <div>
                <div className="filer-tag fnt-update">
                  <h5 className="mb-0 text-black fs-19">Filter:</h5>
                  <div className="tag-highlights js-filter-tags">
                    {FILTER_TAGS.map((tag) => (
                      <span
                        key={tag.id}
                        className={`js-filter-tag${activeFilter === tag.filter ? " active" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveFilter(tag.filter)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveFilter(tag.filter);
                          }
                        }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="filer-tag mt-1">
                  <h5 className="mb-0 text-black fs-19">Sort:</h5>
                  <div className="tag-highlights js-sort-tags">
                    {SORT_TAGS.map((tag) => (
                      <span
                        key={tag.id}
                        className={`js-sort-tag${activeSort === tag.sort ? " active" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveSort(tag.sort)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveSort(tag.sort);
                          }
                        }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-80 m-auto d-flex justify-content-end align-items-baseline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/yellow-top-arrow.png" alt="" />
                  <h1 className="text-black fw-500 fs-36 fnt-family pt-0 mb-3 mobile-fs-24 mobile-lh-full mobile-br-none mobile-w-60 mobile-pb-4">
                    Filter out above <br /> or <br />
                    select a pre selected group below.
                  </h1>
                </div>
              </div>
              <div className="box-tags-card mt-1 w-730px m-auto d-flex flex-wrap gap-1 justify-content-start">
                <span className="text-muted">No tags yet.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top partners */}
      <section className="top-partners">
        <div className="w-888px m-auto">
          <div className="row justify-content-center">
            <h4 className="top-heading-client text-black fs-25 text-center">
              Our Top <span>Partners</span>
            </h4>
            <div className="col-lg-11 p-0 mobile-w-90 mobile-m-auto">
              <div className="flex-wrap d-flex align-items-center justify-content-space mobile-justify-center">
                {PARTNER_LOGOS.map((src) => (
                  <div className="client-box-top" key={src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="top-client" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Program intro */}
      <section className="pt-4">
        <div className="w-947px m-auto">
          <div className="row">
            <div className="col-lg-12 p-0 m-auto">
              <div className="yellow-bg-box-5">
                <h5 className="text-black text-center fs-25 fw-500 lh-32 mobile-fs-18 mobile-lh-full mobile-w-60 mobile-auto">
                  {PROGRAM_INTRO.heading}
                </h5>
                <div className="row mt-3">
                  <div className="box-style-45 d-flex align-items-stretch gap-3 justify-content-center flex-wrap">
                    <p className="text-muted">{PROGRAM_INTRO.empty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our program */}
      <section className="our-program pt-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div className="w-80 m-auto">
                <h4 className="top-heading-client fw-500 text-black fs-25 text-start">
                  {OUR_PROGRAM.headingPrefix}
                  <span>{OUR_PROGRAM.headingAccent}</span>
                </h4>
                <div>
                  <div className="search-box flex-group-icon left-side-icon w-576px">
                    <i className="bi bi-list left-0" />
                    <input
                      type="search"
                      id="programSearch"
                      className="from-control"
                      placeholder={OUR_PROGRAM.searchPlaceholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <i className="bi bi-search" />
                  </div>
                </div>
              </div>

              <div className="row mt-3 wrap mobile-all-w-47">
                <div className="d-flex wrap align-items-start gap-3 mt-3 justify-content-center">
                  {programs.length === 0 ? (
                    <p className="text-muted">{OUR_PROGRAM.empty}</p>
                  ) : (
                    programs.map((p) => (
                      <div key={p.title}>
                        <h5 className="text-black mb-1">{p.title}</h5>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="arrows-section mt-5">
                <div className="dummy-arrows">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/down-arrow-scroll.png"
                    width={38}
                    style={{ rotate: "92deg" }}
                    alt=""
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img/down-arrow-scroll.png"
                    width={38}
                    style={{ rotate: "272deg" }}
                    alt=""
                  />
                </div>
                <p className="mb-0 mt-2 text-black fs-12 lh-19 text-center">
                  {OUR_PROGRAM.sectionLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Count / stats */}
      <section className="count-box-style-1">
        <div className="container">
          <div className="row justify-content-center">
            {STATS.map((stat) => (
              <div className="col-lg-11 m-auto mb-2" key={stat.value}>
                <div className="flex-grid d-flex gap-3 align-items-center justify-content-center">
                  {stat.imageFirst ? (
                    <>
                      <div className="img-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={stat.image} alt="" />
                      </div>
                      <div>
                        <h5 className="text-green mb-0 fs-45 fw-500 lh-50">
                          {stat.value}
                        </h5>
                        <h6 className="text-black fs-19 lh-25">
                          {stat.labelLines.map((line, i) => (
                            <span key={line}>
                              {i > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </h6>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h5 className="text-green mb-0 fs-45 fw-500 lh-50">
                          {stat.value}
                        </h5>
                        <h6 className="text-black fs-19 lh-25">
                          {stat.labelLines.map((line, i) => (
                            <span key={line}>
                              {i > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </h6>
                      </div>
                      <div className="img-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={stat.image} alt="" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. More content — studyJam + path */}
      <section className="pt-4">
        <div className="w-947px m-auto">
          <div className="row">
            <div className="col-lg-12 p-0 m-auto">
              <div className="yellow-bg-box-5">
                <h5 className="text-black text-center fs-25 fw-500 lh-32 mobile-fs-18 mobile-lh-full mobile-w-60 mobile-auto">
                  {STUDY_JAM.heading}
                </h5>
                <div className="row mt-3">
                  <div className="box-style-45 d-flex align-items-start gap-3 justify-content-center flex-wrap">
                    <p className="text-muted">{STUDY_JAM.empty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="w-850px m-auto">
          <div className="row justify-content-center">
            <div className="p-0 m-auto mobile-w-75">
              <span className="text-black fs-14 lh-20">
                How to make best use of <b>#PGS</b> programs
              </span>
              <h5 className="text-black fs-27 lh-32 fw-400 mb-2">
                {PATH_SECTION.title}
              </h5>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/img/dots-slider.png"
                className=" mb-6"
                alt=""
              />

              <div className="step-check-grid d-flex gap-3 align-items-start">
                <div className="w-400px">
                  <h6 className="fs-19 lh-31 text-black mb-2">
                    {PATH_SECTION.pathTitle}
                  </h6>
                  <ul className="m-0 p-0">
                    <li>
                      <span className="box-dot" />
                      <p className="w-100">
                        Explore handpicked CV-ready programs (internships,
                        research, projects) matched to your future goal; whether
                        it&apos;s{" "}
                        <b>med school, MBA, a top STEM course &amp; more.</b>
                      </p>
                    </li>
                    <li>
                      <span className="box-dot" />
                      <p className="w-100">
                        Get real feedback from our counsellors.
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="img-box-fix">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PATH_SECTION.image} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Ready CTA */}
      <section className="pt-10 half-section overlap-height position-relative overflow-hidden ">
        <div className="container overlap-gap-section p-0">
          <div className="col-lg-12 bg-very-light-green xl-p-4 md-p-50px sm-p-30px">
            <div className="mb-10px gap-5">
              <div className="text-center mb-2">
                <span className="small-caption" style={{ color: "#6A5ED9" }}>
                  {READY_CTA.caption}
                </span>
                <h5 className="w-100 text-black fs-32 mb-2 fw-700 m-auto">
                  {READY_CTA.title}
                </h5>
                <p className="w-40 text-center m-auto">{READY_CTA.body}</p>
                <Link
                  href="/contact"
                  style={{
                    padding: "8px 30px",
                    backgroundColor: "#6A5ED9",
                  }}
                  className="mb-2 btn btn-small-large border-radius-10px text-white   btn-rounded btn-switch-text d-inline-block me-20px sm-me-10px align-middle left-icon mt-15px"
                >
                  <span>
                    <span
                      className="btn-double-text ls-minus-05px"
                      data-text={READY_CTA.button}
                    >
                      {READY_CTA.button}
                    </span>
                  </span>
                </Link>
              </div>
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
                    {CONTACT_STRIP.blurb}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
