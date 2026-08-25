"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type CountryPageContent,
  type CountryTab,
  type StatBlock,
} from "./content";

function StatSidebar({ stats }: { stats: StatBlock }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 25 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className="stat-box text-start"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "10px 16px",
            borderRadius: 8,
          }}
        >
          {stats.values.map((v) => (
            <div key={`${v.value}-${v.label}`}>
              <h3 className="fw-700 mb-0 text-black fs-32 lh-30">{v.value}</h3>
              <small className="text-black">{v.label}</small>
            </div>
          ))}
        </div>
      </div>
      <p className="text-black mb-0 fnt-family fs-20 lh-25 fw-400">
        {stats.caption.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < stats.caption.split("\n").length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </div>
  );
}

function SidebarNav({
  links,
  stats,
}: {
  links: { id: string; label: string }[];
  stats?: StatBlock;
}) {
  return (
    <div className="info-card-countries-usa">
      {links.map((link, i) => (
        <a
          href={`#${link.id}`}
          className={`fw-bold text-black ${i === 0 ? "mb-4" : "mb-2"}${
            i === links.length - 1 ? " mb-8" : ""
          }`}
          key={link.id}
        >
          {link.label}
        </a>
      ))}
      {stats ? (
        <>
          <StatSidebar stats={stats} />
          {stats.sourceNote ? (
            <span className="flot-small-p">{stats.sourceNote}</span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Study101Panel({ tab }: { tab: Extract<CountryTab, { id: "study101" }> }) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <SidebarNav links={tab.sidebarLinks} stats={tab.stats} />
      </div>
      <div className="w-80 mobile-w-full">
        <div id={tab.sidebarLinks[0]?.id}>
          <h5 className="countriesUSA-title mt-3 mb-3">
            {tab.sidebarLinks[0]?.label}
          </h5>
          {tab.whyParagraphs.map((p) => (
            <p className="countriesUSA-contain mb-2" key={p.slice(0, 40)}>
              {p}
            </p>
          ))}
        </div>

        <div id={tab.sidebarLinks[1]?.id}>
          <h5 className="countriesUSA-title mt-5 mb-0 fs-30">
            {tab.sidebarLinks[1]?.label}
          </h5>
          <div className="table-responsive w-60 table-border-overflow">
            <table
              className="table table-bordered mb-0"
              style={{
                overflow: "hidden",
                border: "1px solid black",
                borderRadius: 10,
              }}
            >
              <tbody>
                {tab.overviewRows.map((row) => (
                  <tr key={row.label}>
                    <th className="countriesUSA-title-table-left">{row.label}</th>
                    <td className="countriesUSA-title-table-right">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id={tab.sidebarLinks[2]?.id}>
          <h5 className="countriesUSA-title mt-5 mb-1">
            Why Students Choose the USA
            <br />
            for Higher Studies
          </h5>

          <section className="pt-0 pb-0">
            <div className="usa-counrty-usa-purple-gray-box">
              <div className="d-flex align-items-start gap-3 mt-2 position-relative mobile-wrap">
                <div className="w-65 mobile-w-48">
                  <div className="card-box-border h-250px">
                    <div className="icon-box-position">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/list-check.png" alt="" />
                    </div>
                    <div className="bg-light-box mt-10 mobile-mt-0">
                      <h6>{tab.reasons.research}</h6>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-start gap-3 position-relative mobile-w-48">
                  <div className="w-100">
                    <div className="card-box-border d-flex gap-3 justify-content-start mobile-wrap">
                      <div className="icon-box-position">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/user-edit.png"
                          className="mobile-35px"
                          style={{ width: 80 }}
                          alt=""
                        />
                      </div>
                      <div className="bg-light-box">
                        <h6 className="fs-14">{tab.reasons.universities}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="w-100 mobile-none">
                    <div className="card-box-border d-flex gap-3 justify-content-start">
                      <div className="icon-box-position">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/img/heart.gif"
                          className="border-radius-10px"
                          style={{ width: 40 }}
                          alt=""
                        />
                      </div>
                      <div className="pt-50 w-60 m-last">
                        <h6 className="mb-0 fs-17 lh-19 fw-500">
                          {tab.reasons.alumni}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-65 mobile-w-full">
                  <div className="card-box-border h-400px">
                    <div className="icon-box-position">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/topy.png" alt="" />
                      <span className="fs-30 fw-500 text-black">+</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/stemp.png" alt="" />
                    </div>
                    <div className="bg-light-box mt-10 mobile-none">
                      <h6>{tab.reasons.famousUnis}</h6>
                    </div>
                    <div className="bg-light-box mt-10 mobile-none">
                      <h6>{tab.reasons.startup}</h6>
                    </div>
                    <div className="d-flex gap-3 desktop-none align-items-center">
                      <div className="bg-light-box">
                        <h6>{tab.reasons.famousUnis}</h6>
                      </div>
                      <span>+</span>
                      <div className="bg-light-box">
                        <h6>{tab.reasons.startup}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-50 mobile-w-full mobile-d-flex">
                <div className="w-100 desktop-none">
                  <div className="card-box-border d-flex gap-3 justify-content-start">
                    <div className="icon-box-position">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/assets/img/heart.gif"
                        className="border-radius-10px"
                        style={{ width: 40 }}
                        alt=""
                      />
                    </div>
                    <div className="pt-50 w-60 m-last">
                      <h6 className="mb-0 fs-17 lh-19 fw-500">
                        {tab.reasons.alumni}
                      </h6>
                    </div>
                  </div>
                </div>
                <p className="fs-14 lh-20 text-gray fw-400 mobile-w-50 mobile-fs-14">
                  <b className="mb-2 d-block text-black">{tab.reasons.tagline}</b>
                  <span className="fnt-family">“</span>
                  {tab.reasons.quote}
                  <span className="fnt-family">”</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <div id={tab.sidebarLinks[3]?.id} className="mt-5">
          <h5 className="countriesUSA-title mb-2">{tab.sidebarLinks[3]?.label}</h5>
          <p className="countriesUSA-contain mb-2">{tab.stemBlurb}</p>
        </div>
        <div id={tab.sidebarLinks[4]?.id} className="mt-4">
          <h5 className="countriesUSA-title mb-2">{tab.sidebarLinks[4]?.label}</h5>
          <p className="countriesUSA-contain mb-2">{tab.usmleBlurb}</p>
        </div>
        <div id={tab.sidebarLinks[5]?.id} className="mt-4 mb-4">
          <h5 className="countriesUSA-title mb-2">{tab.sidebarLinks[5]?.label}</h5>
          <p className="countriesUSA-contain mb-2">{tab.nonStemBlurb}</p>
        </div>
      </div>
    </div>
  );
}

function CostPanel({ tab }: { tab: Extract<CountryTab, { id: "cost" }> }) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <SidebarNav links={tab.sidebarLinks} stats={tab.stats} />
      </div>
      <div className="w-80 mobile-w-full">
        <h5 className="countriesUSA-title mt-3 mb-3">{tab.sidebarLinks[0]?.label}</h5>
        {tab.budgetQs.map((q) => (
          <p className="countriesUSA-contain mb-2 fw-600" key={q}>
            {q}
          </p>
        ))}
        <h5 className="countriesUSA-title mt-5 mb-3">{tab.sidebarLinks[1]?.label}</h5>
        <ul className="p-0">
          {tab.spendItems.map((item) => (
            <li className="countriesUSA-contain mb-2" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <div className="pgs-section mt-5 p-4 bg-very-light-green border-radius-10px">
          <h5 className="countriesUSA-title mb-2">{tab.premiumCta.title}</h5>
          <p className="countriesUSA-contain mb-3">{tab.premiumCta.body}</p>
          <Link href="/purplepremiumhome" className="btn btn-custom">
            JOIN #PURPLEPREMIUM
          </Link>
        </div>
      </div>
    </div>
  );
}

function VisaPanel({ tab }: { tab: Extract<CountryTab, { id: "visa" }> }) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <SidebarNav links={tab.sidebarLinks} stats={tab.fundingStats} />
      </div>
      <div className="w-80 mobile-w-full">
        <h5 className="countriesUSA-title mt-3 mb-3">Student Visa Types</h5>
        <div className="d-flex flex-wrap gap-3 mb-4">
          {tab.visaTypes.map((v) => (
            <div className="card-box-border p-3" key={v.name} style={{ minWidth: 200, flex: 1 }}>
              <h6 className="fw-700 text-black mb-1">{v.name}</h6>
              <p className="countriesUSA-contain mb-0">{v.description}</p>
            </div>
          ))}
        </div>

        <h5 className="countriesUSA-title mt-4 mb-3">Documents Checklist</h5>
        {tab.docGroups.map((g) => (
          <div className="mb-4" key={g.title}>
            <h6 className="text-black fw-600 mb-2">{g.title}</h6>
            <ul>
              {g.items.map((item) => (
                <li className="countriesUSA-contain" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h5 className="countriesUSA-title mt-4 mb-3">Application Steps</h5>
        <ol>
          {tab.steps.map((s, i) => (
            <li className="countriesUSA-contain mb-2" key={s.title}>
              <strong>
                {i + 1}. {s.title}
              </strong>
              — {s.detail}
            </li>
          ))}
        </ol>

        <h5 className="countriesUSA-title mt-4 mb-3">Do’s &amp; Don’ts</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Do’s</th>
                <th>Don’ts</th>
              </tr>
            </thead>
            <tbody>
              {tab.dosDonts.map((row) => (
                <tr key={row.criteria}>
                  <td>{row.criteria}</td>
                  <td>{row.dos}</td>
                  <td>{row.donts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 border-radius-10px bg-very-light-green">
          <h5 className="countriesUSA-title mb-2">{tab.helpCta.title}</h5>
          <p className="countriesUSA-contain mb-3">{tab.helpCta.body}</p>
          <Link href="/contact" className="btn btn-custom">
            {tab.helpCta.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ShortTermPanel({
  tab,
}: {
  tab: Extract<CountryTab, { id: "shortTerm" }>;
}) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <div className="info-card-countries-usa">
          <StatSidebar stats={tab.stats} />
          {tab.stats.sourceNote ? (
            <span className="flot-small-p">{tab.stats.sourceNote}</span>
          ) : null}
        </div>
      </div>
      <div className="w-80 mobile-w-full">
        {tab.intro.map((p) => (
          <p className="countriesUSA-contain mb-2" key={p.slice(0, 32)}>
            {p}
          </p>
        ))}
        <p className="countriesUSA-contain mb-4 fw-600">{tab.mentorBlurb}</p>
        <div className="d-flex flex-wrap gap-3">
          {tab.courses.map((c) => (
            <div
              className="county-box-short border-radius-10px p-3"
              key={c.title}
              style={{ minWidth: 220, flex: 1, background: "#f8f9fa" }}
            >
              <span className="sop-tag">{c.tag}</span>
              <h6 className="text-black mt-2 mb-1">{c.title}</h6>
              <p className="countriesUSA-contain mb-1">{c.blurb}</p>
              {c.metric ? (
                <small className="text-black fw-600">{c.metric}</small>
              ) : null}
            </div>
          ))}
        </div>
        <Link href="/contact" className="btn btn-custom mt-4">
          Talk to our expert today and get clarity.
        </Link>
      </div>
    </div>
  );
}

function ScholarshipsPanel({
  tab,
}: {
  tab: Extract<CountryTab, { id: "scholarships" }>;
}) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <div className="info-card-countries-usa">
          <StatSidebar stats={tab.stats} />
          {tab.stats.sourceNote ? (
            <span className="flot-small-p">{tab.stats.sourceNote}</span>
          ) : null}
        </div>
      </div>
      <div className="w-80 mobile-w-full">
        {tab.intro.map((p) => (
          <p className="countriesUSA-contain mb-2" key={p.slice(0, 32)}>
            {p}
          </p>
        ))}
        <div className="table-responsive mt-3">
          <table className="table table-bordered MajorScholarships">
            <thead>
              <tr>
                <th>Scholarship</th>
                <th>Type</th>
                <th>Provided By</th>
              </tr>
            </thead>
            <tbody>
              {tab.rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.providedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-very-light-green border-radius-10px">
          <h5 className="countriesUSA-title mb-2">{tab.guide.title}</h5>
          <p className="countriesUSA-contain mb-0">{tab.guide.body}</p>
        </div>
      </div>
    </div>
  );
}

function TracksPanel({ tab }: { tab: Extract<CountryTab, { id: "tracks" }> }) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <div className="info-card-countries-usa">
          <StatSidebar stats={tab.stats} />
          {tab.stats.sourceNote ? (
            <span className="flot-small-p">{tab.stats.sourceNote}</span>
          ) : null}
        </div>
      </div>
      <div className="w-80 mobile-w-full">
        {tab.intro.map((p) => (
          <p className="countriesUSA-contain mb-2" key={p.slice(0, 32)}>
            {p}
          </p>
        ))}
        {tab.sections.map((section) => (
          <div className="border-section-set mt-4" key={section.title}>
            <h5 className="countriesUSA-title mb-3">{section.title}</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Track</th>
                    <th>Field</th>
                    <th>Ideal For</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={row.track}>
                      <td>{row.track}</td>
                      <td>{row.field}</td>
                      <td>{row.idealFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <div className="mt-4">
          {tab.headsUp.map((p) => (
            <p className="countriesUSA-contain mb-2" key={p.slice(0, 40)}>
              {p}
            </p>
          ))}
          <h4 className="fnt-family text-black fs-40 mt-3">{tab.punchline}</h4>
        </div>
      </div>
    </div>
  );
}

function TabPanel({ tab }: { tab: CountryTab }) {
  switch (tab.id) {
    case "study101":
      return <Study101Panel tab={tab} />;
    case "cost":
      return <CostPanel tab={tab} />;
    case "visa":
      return <VisaPanel tab={tab} />;
    case "shortTerm":
      return <ShortTermPanel tab={tab} />;
    case "scholarships":
      return <ScholarshipsPanel tab={tab} />;
    case "tracks":
      return <TracksPanel tab={tab} />;
    default:
      return null;
  }
}

/**
 * Country detail — from standalone-html/countries*.html
 * (non-USA HTML currently shares USA body with title/label overrides)
 */
export function CountryPage({ content }: { content: CountryPageContent }) {
  const [tabId, setTabId] = useState<CountryTab["id"]>("study101");
  const active = content.tabs.find((t) => t.id === tabId) ?? content.tabs[0];

  return (
    <div className="countriesUSA">
      <section className="pt-4 position-relative pb-0 minus-5 mobile-hero-coutry">
        <div className="overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div
              className="col-lg-9 m-auto"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <div className="card-box-img position-relative p-0 border-radius-10px bg-transparent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.hero.flagImage}
                  className="border-radius-10px flag"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-10 p-0 m-auto">
              <div className="card-box-img hero-country-box position-relative p-0 border-radius-10px bg-transparent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.hero.desktopImage}
                  className="border-radius-10px mobile-none"
                  alt={content.name}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.hero.mobileImage}
                  className="border-radius-10px desktop-none"
                  alt={content.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrapper-content mt-4">
        <div className="w-964px m-auto">
          <section className="py-5 mobile-usa-content">
            <div className="row mt-0">
              <div className="col-md-6">
                <h3 className="mb-2 text-black font-semibold usa-section-title fs-32 lh-35">
                  {content.intro.titleLine1} <br /> {content.intro.titleLine2}
                </h3>
                <p
                  className="mb-1 fs-14 lh-20 mobile-fs-14 mobile-lh-full"
                  style={{ color: "#000" }}
                >
                  {content.intro.subtitle}
                </p>
                <p
                  className="mb-0 usa-section-contain fs-16 mobile-fs-14 mobile-lh-full"
                  style={{ color: "#000" }}
                >
                  {content.intro.tagline}
                </p>
              </div>
              <div className="col-md-4 mt-2 mt-md-0 mb-8">
                <Link href={content.intro.ctaHref} className="btn btn-custom">
                  {content.intro.ctaLabel}
                </Link>
              </div>
            </div>
          </section>

          <section className="py-5 pt-1 mobile-box-country">
            <div className="row align-items-center header-country">
              <div className="col-xl-12 tab-style-03 country-usa-tab-style-new text-center mb-2">
                <ul className="portfolio-filter fw-500 nav nav-tabs border-0 country-usa-tab-full-width">
                  {content.tabs.map((tab) => (
                    <li
                      className={`nav${tab.id === tabId ? " active" : ""}`}
                      key={tab.id}
                    >
                      <a
                        href={`#${tab.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setTabId(tab.id);
                        }}
                      >
                        {tab.id === "tracks" ? (
                          <span className="btn btn-dark active fw-bold rounded-pill header_btn-active fs-14 d-inline-flex align-items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://flagcdn.com/w20/${content.flagCode}.png`}
                              alt=""
                            />
                            {tab.label}
                          </span>
                        ) : (
                          tab.label
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-12 filter-content p-md-0">
                <div className="grid-item transition-inner-all w-100">
                  <TabPanel tab={active} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
