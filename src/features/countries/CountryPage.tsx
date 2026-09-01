"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type CountryPageContent,
  type CountryTab,
  type DocGroup,
  DEFAULT_VISA_INTRO,
  DEFAULT_VISA_PLAN_REVIEW,
  DEFAULT_SCHOLARSHIP_SIDEBAR_LINKS,
  DEFAULT_TRACKS_SIDEBAR_LINKS,
  type PgsBanner,
  resolveCostPgsBanner,
  resolveScholarshipGuide,
  type ScholarshipRow,
  type StatBlock,
  type Study101Reasons,
  type TrackSection,
  type VisaStep,
} from "./content";
import "./countries.css";

function StatSidebar({ stats }: { stats: StatBlock }) {
  return (
    <div className="country-stat-sidebar">
      <div className="country-stat-values stat-box text-start">
        {stats.values.map((v) => (
          <div key={`${v.value}-${v.label}`}>
            <h3 className="fw-700 mb-0 text-black lh-30 country-stat-number">
              {v.value}
            </h3>
            <small className="text-black">
              {v.label.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < v.label.split("\n").length - 1 ? <br /> : null}
                </span>
              ))}
            </small>
          </div>
        ))}
      </div>
      <p className="text-black fnt-family fw-400 country-stat-caption">
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

type TabSidebarVariant =
  | "country-study-sidebar"
  | "country-budgeting-card"
  | "country-visa-sidebar"
  | "country-short-sidebar"
  | "country-scholarship-sidebar"
  | "country-tracks-sidebar";

function TabSidebarCard({
  variant,
  links,
  stats,
}: {
  variant: TabSidebarVariant;
  links: { id: string; label: string }[];
  stats: StatBlock;
}) {
  return (
    <div className={`info-card-countries-usa ${variant}`}>
      <div className={`${variant}__header`}>
        {links.map((link) => (
          <a
            href={`#${link.id}`}
            className="fw-bold text-black mb-2"
            key={link.id}
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className={`${variant}__spacer`} aria-hidden="true" />
      <div className={`${variant}__footer`}>
        <StatSidebar stats={stats} />
      </div>
      {stats.sourceNote ? (
        <span className={`${variant}__source`}>{stats.sourceNote}</span>
      ) : null}
    </div>
  );
}

function CountryPgsBanner({ banner }: { banner: PgsBanner | string }) {
  const headline =
    typeof banner === "string"
      ? banner
      : banner.headline;
  const body = typeof banner === "string" ? null : banner.body;

  return (
    <div className="country-pgs-banner-wrap" id="cost_pgs_banner">
      <div className="pgs-track1-card-wrap country-pgs-card-wrap">
        <div className="pgs-badge fnt-family fw-500">#PGS</div>
        <div
          className="bg-pgs-content px-4 py-4 border-radius-10px"
          style={{ backgroundImage: "url('/assets/img/Subtract.png')" }}
        >
          <h5 className="text-black fs-17 lh-22 fw-600 mb-2">{headline}</h5>
          {body ? (
            <p className="mb-0 text-dark-gray lh-19 fs-14">{body}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReasonsCardGrid({ reasons }: { reasons: Study101Reasons }) {
  return (
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
                <h6>{reasons.research}</h6>
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
                  <h6 className="fs-14">{reasons.universities}</h6>
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
                  <h6 className="mb-0 fs-17 lh-19 fw-500">{reasons.alumni}</h6>
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
                <h6>{reasons.famousUnis}</h6>
              </div>
              <div className="bg-light-box mt-10 mobile-none">
                <h6>{reasons.startup}</h6>
              </div>
              <div className="d-flex gap-3 desktop-none align-items-center">
                <div className="bg-light-box">
                  <h6>{reasons.famousUnis}</h6>
                </div>
                <span>+</span>
                <div className="bg-light-box">
                  <h6>{reasons.startup}</h6>
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
                <h6 className="mb-0 fs-17 lh-19 fw-500">{reasons.alumni}</h6>
              </div>
            </div>
          </div>
          <p className="fs-14 lh-20 text-gray fw-400 mobile-w-50 mobile-fs-14">
            <b className="mb-2 d-block text-black">{reasons.tagline}</b>
            <span className="fnt-family">“</span>
            {reasons.quote}
            <span className="fnt-family">”</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Study101Panel({ tab }: { tab: Extract<CountryTab, { id: "study101" }> }) {
  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard
          variant="country-study-sidebar"
          links={tab.sidebarLinks}
          stats={tab.stats}
        />
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

          <ReasonsCardGrid reasons={tab.reasons} />
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
  const reasons: Study101Reasons = tab.reasons ?? {
    research:
      tab.spendItems[0] ??
      "Tuition Fees — This is almost always the largest single cost.",
    universities: "Well-known Universities",
    alumni: "To be part of a strong alumni network",
    famousUnis:
      "The U.S. is home to world-famous universities like MIT, Harvard, Stanford, and many more.",
    startup: "Good startup & VC Culture",
    tagline: "Learn. Do. Succeed.",
    quote:
      "Studying in the U.S. means more than just classes — you get real-world experience, STEM OPT extensions, scholarships, internships, and a chance to build your future while you study. It's where top education meets real opportunity.",
  };

  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard
          variant="country-budgeting-card"
          links={tab.sidebarLinks}
          stats={tab.stats}
        />
      </div>
      <div className="w-80 mobile-w-full country-cost-main">
        {tab.sidebarLinks.map((link, i) => (
          <div id={link.id} key={link.id}>
            <h5
              className={`countriesUSA-title ${
                i === 0 ? "mt-3 mb-3" : "mt-5 mb-3"
              }`}
            >
              {link.label}
            </h5>
            {i === 0 ? (
              <>
                {(tab.budgetIntro ?? []).map((p) => (
                  <p className="countriesUSA-contain mb-2" key={p.slice(0, 40)}>
                    {p}
                  </p>
                ))}
                {tab.budgetQs.map((q) => (
                  <p
                    className="countriesUSA-contain mb-2 fw-600 fst-italic"
                    key={q}
                  >
                    {q}
                  </p>
                ))}
              </>
            ) : null}
            {i === 1 ? <ReasonsCardGrid reasons={reasons} /> : null}
          </div>
        ))}

        <div className="country-cost-premium-block">
          <CountryPgsBanner banner={resolveCostPgsBanner(tab.pgsBanner)} />

          <div className="premium-section country-cost-premium">
            <div className="premium-img country-cost-premium__portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tab.premiumCta.image ?? "/assets/img/step.png"}
                alt=""
              />
            </div>
            <div className="premium-text country-cost-premium__copy">
              <h4 className="country-cost-premium__heading">
                <span className="country-cost-premium__join">JOIN</span>
                <span className="fnt-family country-cost-premium__brand">
                  #purplepremium
                </span>
              </h4>
              <p>{tab.premiumCta.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseVisaStep(step: VisaStep, index: number) {
  const stepLabel = `Step ${index + 1}`;
  const parts = step.title.split(/\s*[—-]\s*/);
  if (parts.length >= 2 && /^Step \d+$/i.test(parts[0] ?? "")) {
    return {
      step: parts[0] ?? stepLabel,
      label: parts.slice(1).join(" — "),
      detail: step.detail,
    };
  }
  return {
    step: stepLabel,
    label: step.title.replace(/^Step \d+\s*[—-]?\s*/i, ""),
    detail: step.detail,
  };
}

function VisaDocGroupCard({ group }: { group: DocGroup }) {
  if (group.title === "Notes") {
    return (
      <div className="Document-Notes">
        <div
          className="doc-card notes mobile-mt-0 mobile-w-full country-visa-notes-card"
        >
          <h3>Notes</h3>
          <ol className="country-visa-notes-list">
            {group.items.map((item, i) => (
              <li key={item}>
                <span className="country-visa-notes-list__num">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  const wrapperClass =
    group.title === "Primary Documents"
      ? "Document-primary"
      : group.title === "Academic Documents"
        ? "Document-Academic"
        : "Document-Financial";

  return (
    <div className={wrapperClass}>
      <div className="icon-top">
        {group.title === "Primary Documents" ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/assets/img/user-edit.png" alt="" />
        ) : group.title === "Academic Documents" ? (
          <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-sack-dollar" aria-hidden="true" />
        )}
      </div>
      <div className="doc-card">
        <h3>{group.title}</h3>
        <ul>
          {group.items.map((item) => (
            <li key={item}>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VisaPanel({ tab }: { tab: Extract<CountryTab, { id: "visa" }> }) {
  const intro = tab.intro?.trim() || DEFAULT_VISA_INTRO;
  const planReview = tab.planReview ?? DEFAULT_VISA_PLAN_REVIEW;
  const notesGroup = tab.docGroups.find((g) => g.title === "Notes");
  const checklistGroups = tab.docGroups.filter((g) => g.title !== "Notes");
  const dosDontsLink = tab.sidebarLinks[3];
  const helpLink = tab.sidebarLinks[4];

  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard
          variant="country-visa-sidebar"
          links={tab.sidebarLinks}
          stats={tab.fundingStats}
        />
      </div>
      <div className="w-80 mobile-w-full country-visa-main">
        <div className="visa-section start">
          <section className="visa-section">
            <div id={tab.sidebarLinks[0]?.id ?? "visa_sticky_1"}>
              <div className="intro">
                <h5 className="countriesUSA-title mt-3 mb-3">
                  {tab.sidebarLinks[0]?.label}
                </h5>
                <p className="countriesUSA-contain mb-2">{intro}</p>
              </div>

              <div className="visa-types">
                {tab.visaTypes.map((visa, i) => (
                  <div
                    className={`visa-card${
                      i === tab.visaTypes.length - 1 ? " visa-card--narrow" : ""
                    }`}
                    key={visa.name}
                  >
                    <h3>{visa.name}</h3>
                    <p>{visa.description}</p>
                  </div>
                ))}
                <p className="countriesUSA-contain">{intro}</p>
              </div>

              <div id={tab.sidebarLinks[1]?.id ?? "visa_sticky_2"}>
                <h5 className="countriesUSA-title mt-3 mb-0">
                  {tab.sidebarLinks[1]?.label}
                </h5>
                <div className="docs-grid">
                  {checklistGroups.map((group) => (
                    <VisaDocGroupCard group={group} key={group.title} />
                  ))}
                  {notesGroup ? (
                    <div className="country-visa-notes-wrap">
                      <VisaDocGroupCard group={notesGroup} />
                      <div className="country-visa-plan-review">
                        <h5 className="countriesUSA-contain mt-3 mb-0 fw-bold">
                          {planReview.title}
                        </h5>
                        <ol className="p-0 country-visa-plan-review__list">
                          {planReview.items.map((item) => (
                            <li className="fs-15 lh-20 mt-1" key={item}>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          className="step-section"
          id={tab.sidebarLinks[2]?.id ?? "visa_sticky_3"}
        >
          <h5 className="countriesUSA-title mt-3 mb-3">
            {tab.sidebarLinks[2]?.label}
          </h5>
          <div className="steps">
            {tab.steps.map((step, i) => {
              const parsed = parseVisaStep(step, i);
              return (
                <div className="step-card mt-0 mb-0" key={step.title}>
                  <h3>{parsed.step}</h3>
                  <p>{parsed.label}</p>
                  <span className="custom-fnt-10">{parsed.detail}</span>
                </div>
              );
            })}
          </div>

          <div
            id={dosDontsLink?.id ?? "visa_sticky_4"}
            className="mobile-w-90 mobile-auto"
          >
            <h5 className="countriesUSA-title mt-3 mb-3">
              {dosDontsLink?.label}
            </h5>
            <div className="dos-donts mobile-none">
              <table>
                <tbody>
                  <tr>
                    <th className="countriesUSA-title mt-3 mb-3">Criteria</th>
                    <th className="countriesUSA-title mt-3 mb-3">Do&apos;s</th>
                    <th className="countriesUSA-title mt-3 mb-3">
                      Don&apos;ts
                    </th>
                  </tr>
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
            <div className="desktop-none mobile-points-usa">
              <h6>Criteria</h6>
              {tab.dosDonts.map((row) => (
                <p key={`criteria-${row.criteria}`}>{row.criteria}</p>
              ))}
              <h6>Do&apos;s</h6>
              {tab.dosDonts.map((row) => (
                <p key={`dos-${row.criteria}`}>{row.dos}</p>
              ))}
              <h6>Don&apos;s</h6>
              {tab.dosDonts.map((row) => (
                <p key={`donts-${row.criteria}`}>{row.donts}</p>
              ))}
            </div>
          </div>

          <div
            id={helpLink?.id ?? "visa_sticky_5"}
            className="mobile-w-90 mobile-auto"
          >
            <div className="helper-box-new">
              <h5 className="countriesUSA-title mt-3 mb-2">
                {tab.helpCta.title}
              </h5>
              <p>{tab.helpCta.body}</p>
              <Link href="/contact" className="talk-button">
                {tab.helpCta.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShortTermPanel({
  tab,
}: {
  tab: Extract<CountryTab, { id: "shortTerm" }>;
}) {
  const links = tab.sidebarLinks ?? [
    {
      id: "short_term_intro",
      label: "Internships. Certificates. Let’s Talk.",
    },
    {
      id: "short_term_mentor",
      label: "Start Here. Personalize With a Mentor.",
    },
  ];
  const introLink = links[0];
  const mentorLink = links[1];

  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard variant="country-short-sidebar" links={links} stats={tab.stats} />
      </div>
      <div className="w-70 mobile-w-full country-short-main">
        <div id={introLink?.id}>
          <h5 className="countriesUSA-title mt-3 mb-3">{introLink?.label}</h5>
          {tab.intro.map((p) => (
            <p className="countriesUSA-contain mb-2" key={p.slice(0, 40)}>
              {p}
            </p>
          ))}
          <div className="internship-cta mt-3 mobile-pt-5">
            <Link href="/contact" className="country-short-cta">
              {tab.ctaLabel ?? "Talk to our expert today and get clarity."}
            </Link>
            {tab.ctaHelper ? (
              <p className="usa-lineheight fs-14 mt-1 mobile-pt-2 mobile-br-none">
                {tab.ctaHelper}
              </p>
            ) : null}
          </div>
        </div>

        <section className="country-short-mentor-section" id={mentorLink?.id}>
          <div className="mobile-box-style-3 country-short-mentor-box">
            <h4 className="countriesUSA-title mt-2 country-short-mentor-title">
              {tab.mentorTitle ?? mentorLink?.label}
            </h4>
            <div className="country-short-mentor-copy">
              <p className="usa-lineheight">{tab.mentorBlurb}</p>
            </div>
            <div className="mobile-start country-short-courses">
              {tab.courses.map((course, i) => (
                <div
                  className="county-box-short"
                  key={course.id ?? `${course.title}-${i}`}
                >
                  <div className="img-box-fit position-relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.image ?? "/assets/img/half-cut-girl.png"}
                      alt=""
                    />
                    <div className="tag-flot-usa">{course.tag}</div>
                  </div>
                  <div className="mobile-pb-23 country-short-course-body">
                    <div className="fs-17 fw-600 mb-1 text-black">
                      {course.id ? (
                        <Link href={`/programsfull/program/${course.id}`}>
                          {course.title}
                        </Link>
                      ) : (
                        course.title
                      )}
                    </div>
                    <div className="fs-14 lh-full mb-4">{course.blurb}</div>
                    {course.categoryTag ? (
                      <div className="country-short-course-cat">
                        <span>{course.categoryTag}</span>
                      </div>
                    ) : null}
                    {course.metric ? (
                      <div className="country-short-course-metric">
                        <i
                          className="bi bi-check-circle-fill"
                          aria-hidden="true"
                        />
                        <h5 className="fnt-family fs-24 mb-0 text-black">
                          {course.metric}
                        </h5>
                      </div>
                    ) : null}
                    <div className="country-short-course-heart">
                      <button type="button" aria-label="Save course">
                        <i className="bi bi-suit-heart-fill" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ScholarshipIntroParagraph({
  text,
  index,
}: {
  text: string;
  index: number;
}) {
  if (index === 0) {
    return (
      <p className="countriesUSA-contain mb-2">
        <strong>{text}</strong>
      </p>
    );
  }
  if (index === 1) {
    const dot = text.indexOf(". ");
    if (dot > 0) {
      return (
        <p className="countriesUSA-contain mb-2">
          <strong>{text.slice(0, dot + 1)}</strong>
          {text.slice(dot + 1)}
        </p>
      );
    }
  }
  return (
    <p className="countriesUSA-contain mb-2" key={text.slice(0, 32)}>
      {text}
    </p>
  );
}

function MajorScholarshipsGrid({ rows }: { rows: ScholarshipRow[] }) {
  return (
    <div className="MajorScholarships">
      <div className="column">
        <h3>Scholarship Name</h3>
        {rows.map((row) => (
          <p key={row.name}>{row.name}</p>
        ))}
      </div>
      <div className="column">
        <h3>Type</h3>
        {rows.map((row) => (
          <p key={`${row.name}-type`}>{row.type}</p>
        ))}
      </div>
      <div className="column">
        <h3>Provided By</h3>
        {rows.map((row) => (
          <p key={`${row.name}-by`}>{row.providedBy}</p>
        ))}
      </div>
    </div>
  );
}

function ScholarshipsPanel({
  tab,
}: {
  tab: Extract<CountryTab, { id: "scholarships" }>;
}) {
  const links = tab.sidebarLinks ?? DEFAULT_SCHOLARSHIP_SIDEBAR_LINKS;
  const majorLink = links[0];
  const guideLink = links[1];
  const guide = resolveScholarshipGuide(tab.guide);

  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard
          variant="country-scholarship-sidebar"
          links={links}
          stats={tab.stats}
        />
      </div>
      <div className="w-70 mobile-w-full country-scholarship-main">
        <section className="pt-0 pb-0">
          <div className="countriesUSA-contain mb-3 mt-3">
            {tab.intro.map((p, i) => (
              <ScholarshipIntroParagraph text={p} index={i} key={p.slice(0, 40)} />
            ))}
          </div>
        </section>

        <section className="pt-0 pb-0" id={majorLink?.id}>
          <h5 className="countriesUSA-title mt-3 mb-3">
            {majorLink?.label}
          </h5>
          <MajorScholarshipsGrid rows={tab.rows} />
        </section>

        <section className="pt-0 pb-0" id={guideLink?.id}>
          <h5 className="countriesUSA-title mt-3 mb-3">
            {guideLink?.label ?? guide.title}
          </h5>
          <div className="ScholarshipApplyGuide">
            {guide.paragraphs.map((p, i) => (
              <p className="countriesUSA-contain mb-2" key={`${i}-${p.slice(0, 24)}`}>
                {/^At #PGS/i.test(p.trim()) ? <strong>{p}</strong> : p}
              </p>
            ))}
            {guide.helpItems.length ? (
              <>
                <p className="countriesUSA-contain mb-2">{guide.helpIntro}</p>
                <ul className="list-of-view-1">
                  {guide.helpItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {guide.closing ? (
              <p className="countriesUSA-contain mb-2">
                <strong>{guide.closing}</strong>
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function TracksIntroParagraph({ text, index }: { text: string; index: number }) {
  if (index === 0) {
    const marker = "According to data from";
    const splitIdx = text.indexOf(marker);
    if (splitIdx > 0) {
      const lead = text.slice(0, splitIdx).trim();
      const sevisTailIdx = text.indexOf("SEVIS,");
      const afterSevis =
        sevisTailIdx >= 0 ? text.slice(sevisTailIdx + 6) : text.slice(splitIdx + marker.length);

      return (
        <p className="countriesUSA-contain mb-2 mt-3">
          {lead}{" "}
          <strong>
            According to data from{" "}
            <span className="text-black text-underline">Open Doors</span> and{" "}
            <span className="text-black text-underline">SEVIS</span>
            {afterSevis}
          </strong>
        </p>
      );
    }
  }

  return (
    <p
      className={`countriesUSA-contain mb-2${index > 0 ? " fs-16 fw-300" : ""}`}
    >
      {text}
    </p>
  );
}

function TrackSectionGrid({
  section,
  id,
}: {
  section: TrackSection;
  id?: string;
}) {
  return (
    <div className="border-section-set country-tracks-section" id={id}>
      <h4>{section.title}</h4>
      <div className="d-flex gap-5 justify-content-spacebeetbeen country-tracks-columns">
        <div>
          <h6>Track</h6>
          {section.rows.map((row) => (
            <p key={`${row.track}-track`}>{row.track}</p>
          ))}
        </div>
        <div>
          <h6>Field</h6>
          {section.rows.map((row) => (
            <p key={`${row.track}-field`}>{row.field}</p>
          ))}
        </div>
        <div>
          <h6>Ideal For</h6>
          {section.rows.map((row) => (
            <p key={`${row.track}-ideal`}>{row.idealFor}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function TracksPanel({ tab }: { tab: Extract<CountryTab, { id: "tracks" }> }) {
  const links = tab.sidebarLinks ?? DEFAULT_TRACKS_SIDEBAR_LINKS;
  const sectionLinks = links.slice(0, tab.sections.length);
  const headsUpLink = links[links.length - 1];

  return (
    <div className="d-flex gap-3 mobile-wrap">
      <div className="w-35 mobile-w-full">
        <TabSidebarCard variant="country-tracks-sidebar" links={links} stats={tab.stats} />
      </div>
      <div className="w-70 mobile-w-full country-tracks-main">
        <div>
          {tab.intro.map((p, i) => (
            <TracksIntroParagraph text={p} index={i} key={p.slice(0, 40)} />
          ))}
        </div>

        {tab.sections.map((section, i) => (
          <TrackSectionGrid
            section={section}
            id={sectionLinks[i]?.id}
            key={section.title}
          />
        ))}

        <div id={headsUpLink?.id}>
          <h5 className="mb-2 mt-3 fs-25 fw-500 countriesUSA-title">
            {tab.headsUpTitle ?? headsUpLink?.label ?? "A Heads Up"}
          </h5>
          {tab.headsUp.map((p, i) => (
            <p className="fs-15 lh-20 mb-3 countriesUSA-contain" key={p.slice(0, 40)}>
              {p}
            </p>
          ))}
          <h3 className="mb-0 fnt-family fw-500 fs-40 text-black">
            {tab.punchline}
          </h3>
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
export function CountryPage({
  content,
  activeTabId,
  onTabChange,
}: {
  content: CountryPageContent;
  /** CMS preview: sync tab bar to editor top tab (ignores "page"). */
  activeTabId?: CountryTab["id"] | "page";
  onTabChange?: (id: CountryTab["id"]) => void;
}) {
  const [tabId, setTabId] = useState<CountryTab["id"]>("study101");

  useEffect(() => {
    if (!activeTabId || activeTabId === "page") return;
    if (content.tabs.some((t) => t.id === activeTabId)) {
      setTabId(activeTabId);
    }
  }, [activeTabId, content.tabs]);

  function selectTab(id: CountryTab["id"]) {
    setTabId(id);
    onTabChange?.(id);
  }

  const active = content.tabs.find((t) => t.id === tabId) ?? content.tabs[0];

  return (
    <div className="countriesUSA">
      <section className="pt-4 position-relative pb-0 minus-5 mobile-hero-coutry">
        <div className="overlap-gap-section p-0 country-hero-stack">
          <div className="country-hero-topline">
            <div className="country-hero-flag-slot card-box-img position-relative p-0 border-radius-10px bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.hero.flagImage}
                className="border-radius-10px flag"
                alt=""
                width={158}
                height={68}
              />
            </div>
          </div>
          <div className="card-box-img hero-country-box position-relative p-0 border-radius-10px bg-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero.desktopImage}
              className="border-radius-10px mobile-none"
              alt={content.name}
              width={1366}
              height={303}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero.mobileImage}
              className="border-radius-10px desktop-none"
              alt={content.name}
              width={390}
              height={400}
            />
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
                          selectTab(tab.id);
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
