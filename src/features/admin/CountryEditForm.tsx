"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminRichTextField } from "./AdminRichTextField";
import { LineItemsField } from "./LineItemsField";
import { MediaAssetField } from "./MediaAssetField";
import { StatBlockField } from "./StatBlockField";
import { KeyValueTableField } from "./KeyValueTableField";
import { getMediaAssetPreview } from "./media-actions";
import { listCountryCoursePickerOptions } from "./country-actions";
import {
  getTabFromDraft,
  parsePageContentFromRow,
  patchPageContent,
  patchTab,
  type CountryDraft,
} from "./country-preview-map";
import type {
  DocGroup,
  ShortTermCourse,
  SidebarLink,
  VisaStep,
  VisaType,
} from "@/features/countries/content";

type Props = {
  draft: CountryDraft;
  onChange: (next: CountryDraft) => void;
  onSectionRef?: (id: string, el: HTMLElement | null) => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function linesToItems(value: string): string[] {
  return value.split(/\r?\n/).filter((l) => l.length > 0);
}

function itemsToLines(items: string[]): string {
  return items.join("\n");
}

function DocGroupsEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DocGroup[];
  onChange: (next: DocGroup[]) => void;
}) {
  const groups = value.length > 0 ? value : [{ title: "", items: [] }];

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
      </div>
      {groups.map((group, gi) => (
        <div key={`doc-group-${gi}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Group {gi + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(groups.filter((_, i) => i !== gi))}
            >
              Remove
            </button>
          </div>
          <label>
            Title
            <input
              className="pgs-admin-control"
              value={group.title}
              onChange={(e) =>
                onChange(
                  groups.map((g, i) =>
                    i === gi ? { ...g, title: e.target.value } : g,
                  ),
                )
              }
            />
          </label>
          <LineItemsField
            label="Items"
            value={itemsToLines(group.items)}
            onChange={(next) =>
              onChange(
                groups.map((g, i) =>
                  i === gi ? { ...g, items: linesToItems(next) } : g,
                ),
              )
            }
            itemLabel="Item"
          />
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...groups, { title: "", items: [] }])}
      >
        Add document group
      </button>
    </div>
  );
}

function VisaTypesEditor({
  value,
  onChange,
}: {
  value: VisaType[];
  onChange: (next: VisaType[]) => void;
}) {
  const rows = value.length > 0 ? value : [{ name: "", description: "" }];
  return (
    <KeyValueTableField
      label="Visa types"
      columns={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description", multiline: true },
      ]}
      value={rows}
      onChange={onChange}
      emptyRow={() => ({ name: "", description: "" })}
      itemLabel="Visa type"
    />
  );
}

function VisaStepsEditor({
  value,
  onChange,
}: {
  value: VisaStep[];
  onChange: (next: VisaStep[]) => void;
}) {
  const rows = value.length > 0 ? value : [{ title: "", detail: "" }];
  return (
    <KeyValueTableField
      label="Application steps"
      columns={[
        { key: "title", label: "Title" },
        { key: "detail", label: "Detail", multiline: true },
      ]}
      value={rows}
      onChange={onChange}
      emptyRow={() => ({ title: "", detail: "" })}
      itemLabel="Step"
    />
  );
}

function SidebarLinksField({
  value,
  onChange,
}: {
  value: SidebarLink[] | undefined;
  onChange: (next: SidebarLink[]) => void;
}) {
  return (
    <KeyValueTableField
      label="Sidebar links (left card + section headings)"
      columns={[
        { key: "id", label: "Anchor id" },
        { key: "label", label: "Label", multiline: true },
      ]}
      value={value ?? []}
      onChange={onChange}
      emptyRow={() => ({ id: "", label: "" })}
      itemLabel="Link"
    />
  );
}

function selectedCourseIds(tab: {
  courseIds?: string[];
  courses: ShortTermCourse[];
}): string[] {
  if (tab.courseIds?.length) return tab.courseIds;
  return tab.courses.map((c) => c.id).filter((id): id is string => Boolean(id));
}

function ShortTermCoursesEditor({
  value,
  selectedIds,
  onChange,
}: {
  value: ShortTermCourse[];
  selectedIds: string[];
  onChange: (next: { courseIds: string[]; courses: ShortTermCourse[] }) => void;
}) {
  const [options, setOptions] = useState<ShortTermCourse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listCountryCoursePickerOptions()
      .then((rows) => {
        if (!cancelled) {
          setOptions(rows);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load courses");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (course) =>
        course.title.toLowerCase().includes(q) ||
        (course.tag ?? "").toLowerCase().includes(q),
    );
  }, [options, query]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  function toggle(course: ShortTermCourse) {
    const id = course.id;
    if (!id) return;
    const nextIds = selectedSet.has(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    const byId = new Map(options.map((item) => [item.id, item]));
    for (const existing of value) {
      if (existing.id && !byId.has(existing.id)) byId.set(existing.id, existing);
    }
    onChange({
      courseIds: nextIds,
      courses: nextIds
        .map((item) => byId.get(item))
        .filter((item): item is ShortTermCourse => Boolean(item)),
    });
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Select courses</strong>
        <span>{selectedIds.length} selected</span>
      </div>
      <input
        className="pgs-admin-control"
        placeholder="Search courses"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? <p className="pgs-admin-help">Loading courses…</p> : null}
      {error ? <p className="pgs-admin-help">{error}</p> : null}
      {!loading && !error && options.length === 0 ? (
        <p className="pgs-admin-help">No courses in the catalog yet.</p>
      ) : null}
      <div className="pgs-country-course-picker">
        {filtered.map((course) => {
          const id = course.id ?? "";
          return (
            <label key={id} className="pgs-admin-checkbox">
              <input
                type="checkbox"
                checked={selectedSet.has(id)}
                onChange={() => toggle(course)}
              />
              <span>
                {course.title}
                {course.tag ? (
                  <small className="pgs-country-course-picker__tag">
                    {" "}
                    {course.tag}
                  </small>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function CountryEditForm({ draft, onChange, onSectionRef }: Props) {
  const content = parsePageContentFromRow(draft);
  const study101 = getTabFromDraft(draft, "study101");
  const cost = getTabFromDraft(draft, "cost");
  const visa = getTabFromDraft(draft, "visa");
  const shortTerm = getTabFromDraft(draft, "shortTerm");
  const scholarships = getTabFromDraft(draft, "scholarships");
  const tracks = getTabFromDraft(draft, "tracks");

  function patch(partial: CountryDraft) {
    onChange({ ...draft, ...partial });
  }

  function patchTitle(name: string) {
    const next: CountryDraft = { ...draft, name };
    if (!draft.id && !draft.slug) {
      next.slug = slugify(name);
    }
    onChange(next);
  }

  async function setHeroMedia(
    key: "flag" | "desktop" | "mobile",
    assetId: string | null,
  ) {
    const assetKey = `hero_${key}_asset_id` as const;
    const urlKey = `hero_${key}_url` as const;
    let url = "";
    if (assetId) {
      try {
        const preview = await getMediaAssetPreview(assetId);
        url = preview?.publicUrl ?? "";
      } catch {
        url = "";
      }
    }
    const heroPatch =
      key === "flag"
        ? { flagImage: url || content.hero.flagImage, flagImageAssetId: assetId }
        : key === "desktop"
          ? {
              desktopImage: url || content.hero.desktopImage,
              desktopImageAssetId: assetId,
            }
          : {
              mobileImage: url || content.hero.mobileImage,
              mobileImageAssetId: assetId,
            };

    onChange(
      patchPageContent(
        {
          ...draft,
          [assetKey]: assetId,
          [urlKey]: url,
        },
        (prev) => ({
          ...prev,
          hero: { ...prev.hero, ...heroPatch },
        }),
      ),
    );
  }

  function bindSection(id: string) {
    return (el: HTMLElement | null) => onSectionRef?.(id, el);
  }

  if (!study101 || !cost || !visa || !shortTerm || !scholarships || !tracks) {
    return <p>Invalid country template — missing tabs.</p>;
  }

  return (
    <div className="pgs-event-cms__form-inner">
      <section id="hero" className="pgs-event-cms__section" ref={bindSection("hero")}>
        <h2 className="pgs-event-cms__section-title">Hero</h2>
        <div className="pgs-country-hero-uploads">
          <MediaAssetField
            label="Flag strip (flag + small image)"
            value={
              (draft.hero_flag_asset_id as string | null) ??
              content.hero.flagImageAssetId ??
              null
            }
            onChange={(id) => void setHeroMedia("flag", id)}
            folder="countries"
          />
          <MediaAssetField
            label="Mobile hero image"
            value={
              (draft.hero_mobile_asset_id as string | null) ??
              content.hero.mobileImageAssetId ??
              null
            }
            onChange={(id) => void setHeroMedia("mobile", id)}
            folder="countries"
          />
        </div>
        <p className="pgs-country-hero-uploads__hint">
          Upload one strip for the top-right (flag + thumbnail together). Mobile
          hero is only used as the phone banner.
        </p>
        <MediaAssetField
          label="Desktop hero image"
          value={
            (draft.hero_desktop_asset_id as string | null) ??
            content.hero.desktopImageAssetId ??
            null
          }
          onChange={(id) => void setHeroMedia("desktop", id)}
          folder="countries"
        />
      </section>

      <section id="intro" className="pgs-event-cms__section" ref={bindSection("intro")}>
        <h2 className="pgs-event-cms__section-title">Intro</h2>
        <label>
          Title line 1
          <input
            className="pgs-admin-control"
            value={content.intro.titleLine1}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, titleLine1: e.target.value },
                })),
              )
            }
          />
        </label>
        <label>
          Title line 2
          <input
            className="pgs-admin-control"
            value={content.intro.titleLine2}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, titleLine2: e.target.value },
                })),
              )
            }
          />
        </label>
        <label>
          Subtitle
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={content.intro.subtitle}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, subtitle: e.target.value },
                })),
              )
            }
          />
        </label>
        <label>
          Tagline
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={content.intro.tagline}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, tagline: e.target.value },
                })),
              )
            }
          />
        </label>
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={content.intro.ctaLabel}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, ctaLabel: e.target.value },
                })),
              )
            }
          />
        </label>
        <label>
          CTA href
          <input
            className="pgs-admin-control"
            value={content.intro.ctaHref}
            onChange={(e) =>
              onChange(
                patchPageContent(draft, (prev) => ({
                  ...prev,
                  intro: { ...prev.intro, ctaHref: e.target.value },
                })),
              )
            }
          />
        </label>
      </section>

      <section id="meta" className="pgs-event-cms__section" ref={bindSection("meta")}>
        <h2 className="pgs-event-cms__section-title">Meta</h2>
        <label>
          Name
          <input
            className="pgs-admin-control"
            value={String(draft.name ?? "")}
            onChange={(e) => patchTitle(e.target.value)}
          />
        </label>
        <label>
          Slug
          <input
            className="pgs-admin-control"
            value={String(draft.slug ?? "")}
            onChange={(e) => patch({ slug: e.target.value })}
          />
        </label>
        <label>
          ISO code
          <input
            className="pgs-admin-control"
            value={String(draft.iso_code ?? "")}
            onChange={(e) => patch({ iso_code: e.target.value || null })}
          />
        </label>
        <label>
          Dial code
          <input
            className="pgs-admin-control"
            value={String(draft.dial_code ?? "")}
            onChange={(e) => patch({ dial_code: e.target.value || null })}
          />
        </label>
        <label>
          Flag code (flagcdn.com)
          <input
            className="pgs-admin-control"
            value={content.flagCode}
            onChange={(e) =>
              onChange(patchPageContent(draft, { flagCode: e.target.value }))
            }
          />
        </label>
        <label>
          Display order
          <input
            className="pgs-admin-control"
            type="number"
            value={Number(draft.display_order ?? 0)}
            onChange={(e) => patch({ display_order: Number(e.target.value) })}
          />
        </label>
        <label className="pgs-admin-checkbox">
          <input
            type="checkbox"
            checked={Boolean(draft.published)}
            onChange={(e) => patch({ published: e.target.checked })}
          />
          Published
        </label>
      </section>

      <section
        id="study101-stats"
        className="pgs-event-cms__section"
        ref={bindSection("study101-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Study 101 — Stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={study101.label}
            onChange={(e) =>
              onChange(patchTab(draft, "study101", { label: e.target.value }))
            }
          />
        </label>
        <StatBlockField
          value={study101.stats}
          onChange={(stats) => onChange(patchTab(draft, "study101", { stats }))}
        />
      </section>

      <section
        id="study101-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("study101-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Study 101 — Sidebar links</h2>
        <SidebarLinksField
          value={study101.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "study101", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="study101-why"
        className="pgs-event-cms__section"
        ref={bindSection("study101-why")}
      >
        <h2 className="pgs-event-cms__section-title">Study 101 — Why study</h2>
        <LineItemsField
          label="Why paragraphs"
          value={itemsToLines(study101.whyParagraphs)}
          onChange={(next) =>
            onChange(
              patchTab(draft, "study101", { whyParagraphs: linesToItems(next) }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
      </section>

      <section
        id="study101-overview"
        className="pgs-event-cms__section"
        ref={bindSection("study101-overview")}
      >
        <h2 className="pgs-event-cms__section-title">Study 101 — Quick overview</h2>
        <KeyValueTableField
          label="Overview table"
          columns={[
            { key: "label", label: "Label" },
            { key: "value", label: "Value", multiline: true },
          ]}
          value={study101.overviewRows}
          onChange={(overviewRows) =>
            onChange(patchTab(draft, "study101", { overviewRows }))
          }
          emptyRow={() => ({ label: "", value: "" })}
        />
      </section>

      <section
        id="study101-reasons"
        className="pgs-event-cms__section"
        ref={bindSection("study101-reasons")}
      >
        <h2 className="pgs-event-cms__section-title">Study 101 — Why students choose</h2>
        {(
          [
            ["research", "Research"],
            ["universities", "Universities"],
            ["alumni", "Alumni"],
            ["famousUnis", "Famous universities"],
            ["startup", "Startup culture"],
            ["tagline", "Tagline"],
            ["quote", "Quote"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <textarea
              className="pgs-admin-control"
              rows={key === "quote" ? 4 : 2}
              value={study101.reasons[key]}
              onChange={(e) =>
                onChange(
                  patchTab(draft, "study101", {
                    reasons: { ...study101.reasons, [key]: e.target.value },
                  }),
                )
              }
            />
          </label>
        ))}
      </section>

      {(
        [
          ["study101-stem", "STEM", "stemBlurb"],
          ["study101-usmle", "USMLE", "usmleBlurb"],
          ["study101-nonstr", "Non-STEM", "nonStemBlurb"],
        ] as const
      ).map(([sectionId, title, field]) => (
        <section
          key={sectionId}
          id={sectionId}
          className="pgs-event-cms__section"
          ref={bindSection(sectionId)}
        >
          <h2 className="pgs-event-cms__section-title">Study 101 — {title}</h2>
          <AdminRichTextField
            label={`${title} blurb`}
            value={study101[field]}
            onChange={(next) =>
              onChange(patchTab(draft, "study101", { [field]: next }))
            }
          />
        </section>
      ))}

      <section
        id="cost-stats"
        className="pgs-event-cms__section"
        ref={bindSection("cost-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — Stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={cost.label}
            onChange={(e) => onChange(patchTab(draft, "cost", { label: e.target.value }))}
          />
        </label>
        <StatBlockField
          value={cost.stats}
          onChange={(stats) => onChange(patchTab(draft, "cost", { stats }))}
        />
      </section>

      <section
        id="cost-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("cost-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — Sidebar links</h2>
        <SidebarLinksField
          value={cost.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "cost", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="cost-budgeting"
        className="pgs-event-cms__section"
        ref={bindSection("cost-budgeting")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — Budgeting</h2>
        <LineItemsField
          label="Budget intro paragraphs"
          value={itemsToLines(cost.budgetIntro ?? [])}
          onChange={(next) =>
            onChange(
              patchTab(draft, "cost", { budgetIntro: linesToItems(next) }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
        <LineItemsField
          label="Budget questions"
          value={itemsToLines(cost.budgetQs)}
          onChange={(next) =>
            onChange(patchTab(draft, "cost", { budgetQs: linesToItems(next) }))
          }
          itemLabel="Question"
        />
      </section>

      <section
        id="cost-spend"
        className="pgs-event-cms__section"
        ref={bindSection("cost-spend")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — Spending</h2>
        <LineItemsField
          label="Spend items (legacy list)"
          value={itemsToLines(cost.spendItems)}
          onChange={(next) =>
            onChange(patchTab(draft, "cost", { spendItems: linesToItems(next) }))
          }
          itemLabel="Item"
        />
        {(
          [
            ["research", "Tuition / primary cost card"],
            ["universities", "Universities card"],
            ["alumni", "Alumni card"],
            ["famousUnis", "Famous universities card"],
            ["startup", "Startup culture card"],
            ["tagline", "Tagline"],
            ["quote", "Quote"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <textarea
              className="pgs-admin-control"
              rows={key === "quote" ? 4 : 2}
              value={cost.reasons?.[key] ?? ""}
              onChange={(e) =>
                onChange(
                  patchTab(draft, "cost", {
                    reasons: {
                      ...(cost.reasons ?? {
                        research: "",
                        universities: "",
                        alumni: "",
                        famousUnis: "",
                        startup: "",
                        tagline: "",
                        quote: "",
                      }),
                      [key]: e.target.value,
                    },
                  }),
                )
              }
            />
          </label>
        ))}
      </section>

      <section
        id="cost-pgs-banner"
        className="pgs-event-cms__section"
        ref={bindSection("cost-pgs-banner")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — #PGS banner</h2>
        <label>
          Headline
          <input
            className="pgs-admin-control"
            value={
              typeof cost.pgsBanner === "string"
                ? cost.pgsBanner
                : (cost.pgsBanner?.headline ?? "")
            }
            onChange={(e) =>
              onChange(
                patchTab(draft, "cost", {
                  pgsBanner: {
                    headline: e.target.value,
                    body:
                      typeof cost.pgsBanner === "string"
                        ? ""
                        : (cost.pgsBanner?.body ?? ""),
                  },
                }),
              )
            }
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={
            typeof cost.pgsBanner === "string" ? "" : (cost.pgsBanner?.body ?? "")
          }
          onChange={(body) =>
            onChange(
              patchTab(draft, "cost", {
                pgsBanner: {
                  headline:
                    typeof cost.pgsBanner === "string"
                      ? cost.pgsBanner
                      : (cost.pgsBanner?.headline ?? ""),
                  body,
                },
              }),
            )
          }
        />
      </section>

      <section
        id="cost-premium"
        className="pgs-event-cms__section"
        ref={bindSection("cost-premium")}
      >
        <h2 className="pgs-event-cms__section-title">Study Cost — PurplePremium CTA</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={cost.premiumCta.title}
            onChange={(e) =>
              onChange(
                patchTab(draft, "cost", {
                  premiumCta: { ...cost.premiumCta, title: e.target.value },
                }),
              )
            }
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={cost.premiumCta.body}
          onChange={(body) =>
            onChange(
              patchTab(draft, "cost", {
                premiumCta: { ...cost.premiumCta, body },
              }),
            )
          }
        />
        <label>
          Image URL
          <input
            className="pgs-admin-control"
            value={cost.premiumCta.image ?? ""}
            onChange={(e) =>
              onChange(
                patchTab(draft, "cost", {
                  premiumCta: { ...cost.premiumCta, image: e.target.value },
                }),
              )
            }
          />
        </label>
      </section>

      <section
        id="visa-stats"
        className="pgs-event-cms__section"
        ref={bindSection("visa-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Funding stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={visa.label}
            onChange={(e) => onChange(patchTab(draft, "visa", { label: e.target.value }))}
          />
        </label>
        <StatBlockField
          label="Funding stats"
          value={visa.fundingStats}
          onChange={(fundingStats) =>
            onChange(patchTab(draft, "visa", { fundingStats }))
          }
        />
      </section>

      <section
        id="visa-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("visa-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Sidebar links</h2>
        <SidebarLinksField
          value={visa.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "visa", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="visa-types"
        className="pgs-event-cms__section"
        ref={bindSection("visa-types")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Intro &amp; visa types</h2>
        <AdminRichTextField
          label="Intro paragraph"
          value={visa.intro ?? ""}
          onChange={(intro) => onChange(patchTab(draft, "visa", { intro }))}
        />
        <VisaTypesEditor
          value={visa.visaTypes}
          onChange={(visaTypes) => onChange(patchTab(draft, "visa", { visaTypes }))}
        />
      </section>

      <section
        id="visa-docs"
        className="pgs-event-cms__section"
        ref={bindSection("visa-docs")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Documents</h2>
        <DocGroupsEditor
          label="Document groups"
          value={visa.docGroups}
          onChange={(docGroups) => onChange(patchTab(draft, "visa", { docGroups }))}
        />
        <label>
          Plan. Review. Submit. — title
          <input
            className="pgs-admin-control"
            value={visa.planReview?.title ?? "Plan. Review. Submit."}
            onChange={(e) =>
              onChange(
                patchTab(draft, "visa", {
                  planReview: {
                    title: e.target.value,
                    items: visa.planReview?.items ?? [],
                  },
                }),
              )
            }
          />
        </label>
        <LineItemsField
          label="Plan. Review. Submit. — checklist items"
          value={itemsToLines(visa.planReview?.items ?? [])}
          onChange={(next) =>
            onChange(
              patchTab(draft, "visa", {
                planReview: {
                  title: visa.planReview?.title ?? "Plan. Review. Submit.",
                  items: linesToItems(next),
                },
              }),
            )
          }
          itemLabel="Checklist item"
        />
      </section>

      <section
        id="visa-steps"
        className="pgs-event-cms__section"
        ref={bindSection("visa-steps")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Application steps</h2>
        <VisaStepsEditor
          value={visa.steps}
          onChange={(steps) => onChange(patchTab(draft, "visa", { steps }))}
        />
      </section>

      <section
        id="visa-dosdonts"
        className="pgs-event-cms__section"
        ref={bindSection("visa-dosdonts")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Do&apos;s &amp; Don&apos;ts</h2>
        <KeyValueTableField
          label="Criteria table"
          columns={[
            { key: "criteria", label: "Criteria" },
            { key: "dos", label: "Do's", multiline: true },
            { key: "donts", label: "Don'ts", multiline: true },
          ]}
          value={visa.dosDonts}
          onChange={(dosDonts) => onChange(patchTab(draft, "visa", { dosDonts }))}
          emptyRow={() => ({ criteria: "", dos: "", donts: "" })}
        />
      </section>

      <section
        id="visa-help"
        className="pgs-event-cms__section"
        ref={bindSection("visa-help")}
      >
        <h2 className="pgs-event-cms__section-title">Visa 101 — Help CTA</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={visa.helpCta.title}
            onChange={(e) =>
              onChange(
                patchTab(draft, "visa", {
                  helpCta: { ...visa.helpCta, title: e.target.value },
                }),
              )
            }
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={visa.helpCta.body}
          onChange={(body) =>
            onChange(
              patchTab(draft, "visa", {
                helpCta: { ...visa.helpCta, body },
              }),
            )
          }
        />
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={visa.helpCta.ctaLabel}
            onChange={(e) =>
              onChange(
                patchTab(draft, "visa", {
                  helpCta: { ...visa.helpCta, ctaLabel: e.target.value },
                }),
              )
            }
          />
        </label>
      </section>

      <section
        id="shortTerm-stats"
        className="pgs-event-cms__section"
        ref={bindSection("shortTerm-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Short-Term — Stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={shortTerm.label}
            onChange={(e) =>
              onChange(patchTab(draft, "shortTerm", { label: e.target.value }))
            }
          />
        </label>
        <StatBlockField
          value={shortTerm.stats}
          onChange={(stats) => onChange(patchTab(draft, "shortTerm", { stats }))}
        />
      </section>

      <section
        id="shortTerm-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("shortTerm-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Short-Term — Sidebar links</h2>
        <SidebarLinksField
          value={shortTerm.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "shortTerm", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="shortTerm-intro"
        className="pgs-event-cms__section"
        ref={bindSection("shortTerm-intro")}
      >
        <h2 className="pgs-event-cms__section-title">Short-Term — Intro</h2>
        <LineItemsField
          label="Intro paragraphs"
          value={itemsToLines(shortTerm.intro)}
          onChange={(next) =>
            onChange(
              patchTab(draft, "shortTerm", { intro: linesToItems(next) }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
      </section>

      <section
        id="shortTerm-courses"
        className="pgs-event-cms__section"
        ref={bindSection("shortTerm-courses")}
      >
        <h2 className="pgs-event-cms__section-title">Short-Term — Courses</h2>
        <ShortTermCoursesEditor
          value={shortTerm.courses}
          selectedIds={selectedCourseIds(shortTerm)}
          onChange={(next) =>
            onChange(
              patchTab(draft, "shortTerm", {
                courseIds: next.courseIds,
                courses: next.courses,
              }),
            )
          }
        />
      </section>

      <section
        id="shortTerm-contact"
        className="pgs-event-cms__section"
        ref={bindSection("shortTerm-contact")}
      >
        <h2 className="pgs-event-cms__section-title">Short-Term — Contact CTA</h2>
        <label>
          CTA button label
          <input
            className="pgs-admin-control"
            value={shortTerm.ctaLabel ?? ""}
            onChange={(e) =>
              onChange(patchTab(draft, "shortTerm", { ctaLabel: e.target.value }))
            }
          />
        </label>
        <AdminRichTextField
          label="CTA helper text"
          value={shortTerm.ctaHelper ?? ""}
          onChange={(ctaHelper) =>
            onChange(patchTab(draft, "shortTerm", { ctaHelper }))
          }
        />
        <label>
          Mentor section title
          <input
            className="pgs-admin-control"
            value={shortTerm.mentorTitle ?? ""}
            onChange={(e) =>
              onChange(
                patchTab(draft, "shortTerm", { mentorTitle: e.target.value }),
              )
            }
          />
        </label>
        <AdminRichTextField
          label="Mentor blurb"
          value={shortTerm.mentorBlurb}
          onChange={(mentorBlurb) =>
            onChange(patchTab(draft, "shortTerm", { mentorBlurb }))
          }
        />
      </section>

      <section
        id="scholarships-stats"
        className="pgs-event-cms__section"
        ref={bindSection("scholarships-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Scholarships — Stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={scholarships.label}
            onChange={(e) =>
              onChange(patchTab(draft, "scholarships", { label: e.target.value }))
            }
          />
        </label>
        <StatBlockField
          value={scholarships.stats}
          onChange={(stats) =>
            onChange(patchTab(draft, "scholarships", { stats }))
          }
        />
      </section>

      <section
        id="scholarships-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("scholarships-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Scholarships — Sidebar links</h2>
        <SidebarLinksField
          value={scholarships.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "scholarships", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="scholarships-intro"
        className="pgs-event-cms__section"
        ref={bindSection("scholarships-intro")}
      >
        <h2 className="pgs-event-cms__section-title">Scholarships — Intro</h2>
        <LineItemsField
          label="Intro paragraphs"
          value={itemsToLines(scholarships.intro)}
          onChange={(next) =>
            onChange(
              patchTab(draft, "scholarships", { intro: linesToItems(next) }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
      </section>

      <section
        id="scholarships-table"
        className="pgs-event-cms__section"
        ref={bindSection("scholarships-table")}
      >
        <h2 className="pgs-event-cms__section-title">Scholarships — Table</h2>
        <KeyValueTableField
          label="Scholarship rows"
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "providedBy", label: "Provided by" },
          ]}
          value={scholarships.rows}
          onChange={(rows) => onChange(patchTab(draft, "scholarships", { rows }))}
          emptyRow={() => ({ name: "", type: "", providedBy: "" })}
        />
      </section>

      <section
        id="scholarships-guide"
        className="pgs-event-cms__section"
        ref={bindSection("scholarships-guide")}
      >
        <h2 className="pgs-event-cms__section-title">Scholarships — Apply guide</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={scholarships.guide.title}
            onChange={(e) =>
              onChange(
                patchTab(draft, "scholarships", {
                  guide: { ...scholarships.guide, title: e.target.value },
                }),
              )
            }
          />
        </label>
        <LineItemsField
          label="Guide paragraphs"
          value={itemsToLines(
            scholarships.guide.paragraphs ??
              (scholarships.guide.body ? [scholarships.guide.body] : []),
          )}
          onChange={(next) =>
            onChange(
              patchTab(draft, "scholarships", {
                guide: {
                  ...scholarships.guide,
                  paragraphs: linesToItems(next),
                },
              }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
        <label>
          Help intro
          <input
            className="pgs-admin-control"
            value={scholarships.guide.helpIntro ?? "We help you:"}
            onChange={(e) =>
              onChange(
                patchTab(draft, "scholarships", {
                  guide: { ...scholarships.guide, helpIntro: e.target.value },
                }),
              )
            }
          />
        </label>
        <LineItemsField
          label="Help bullets"
          value={itemsToLines(scholarships.guide.helpItems ?? [])}
          onChange={(next) =>
            onChange(
              patchTab(draft, "scholarships", {
                guide: {
                  ...scholarships.guide,
                  helpItems: linesToItems(next),
                },
              }),
            )
          }
          itemLabel="Bullet"
        />
        <AdminRichTextField
          label="Closing line"
          value={scholarships.guide.closing ?? ""}
          onChange={(closing) =>
            onChange(
              patchTab(draft, "scholarships", {
                guide: { ...scholarships.guide, closing },
              }),
            )
          }
        />
      </section>

      <section
        id="tracks-stats"
        className="pgs-event-cms__section"
        ref={bindSection("tracks-stats")}
      >
        <h2 className="pgs-event-cms__section-title">Tracks — Stats</h2>
        <label>
          Tab label
          <input
            className="pgs-admin-control"
            value={tracks.label}
            onChange={(e) =>
              onChange(patchTab(draft, "tracks", { label: e.target.value }))
            }
          />
        </label>
        <StatBlockField
          value={tracks.stats}
          onChange={(stats) => onChange(patchTab(draft, "tracks", { stats }))}
        />
      </section>

      <section
        id="tracks-sidebar"
        className="pgs-event-cms__section"
        ref={bindSection("tracks-sidebar")}
      >
        <h2 className="pgs-event-cms__section-title">Tracks — Sidebar links</h2>
        <SidebarLinksField
          value={tracks.sidebarLinks}
          onChange={(sidebarLinks) =>
            onChange(patchTab(draft, "tracks", { sidebarLinks }))
          }
        />
      </section>

      <section
        id="tracks-intro"
        className="pgs-event-cms__section"
        ref={bindSection("tracks-intro")}
      >
        <h2 className="pgs-event-cms__section-title">Tracks — Intro</h2>
        <LineItemsField
          label="Intro paragraphs"
          value={itemsToLines(tracks.intro)}
          onChange={(next) =>
            onChange(patchTab(draft, "tracks", { intro: linesToItems(next) }))
          }
          itemLabel="Paragraph"
          rich
        />
      </section>

      <section
        id="tracks-tables"
        className="pgs-event-cms__section"
        ref={bindSection("tracks-tables")}
      >
        <h2 className="pgs-event-cms__section-title">Tracks — Track tables</h2>
        {tracks.sections.map((section, si) => (
          <div key={`track-section-${si}`} className="pgs-admin-line-items__row">
            <label>
              Section title
              <input
                className="pgs-admin-control"
                value={section.title}
                onChange={(e) =>
                  onChange(
                    patchTab(draft, "tracks", {
                      sections: tracks.sections.map((s, i) =>
                        i === si ? { ...s, title: e.target.value } : s,
                      ),
                    }),
                  )
                }
              />
            </label>
            <KeyValueTableField
              label="Rows"
              columns={[
                { key: "track", label: "Track" },
                { key: "field", label: "Field" },
                { key: "idealFor", label: "Ideal for", multiline: true },
              ]}
              value={section.rows}
              onChange={(rows) =>
                onChange(
                  patchTab(draft, "tracks", {
                    sections: tracks.sections.map((s, i) =>
                      i === si ? { ...s, rows } : s,
                    ),
                  }),
                )
              }
              emptyRow={() => ({ track: "", field: "", idealFor: "" })}
            />
          </div>
        ))}
        <button
          type="button"
          className="pgs-admin__btn pgs-admin__btn--ghost"
          onClick={() =>
            onChange(
              patchTab(draft, "tracks", {
                sections: [
                  ...tracks.sections,
                  { title: "", rows: [] },
                ],
              }),
            )
          }
        >
          Add track section
        </button>
      </section>

      <section
        id="tracks-punchline"
        className="pgs-event-cms__section"
        ref={bindSection("tracks-punchline")}
      >
        <h2 className="pgs-event-cms__section-title">Tracks — Punchline</h2>
        <label>
          Heads-up title
          <input
            className="pgs-admin-control"
            value={tracks.headsUpTitle ?? "A Heads Up"}
            onChange={(e) =>
              onChange(patchTab(draft, "tracks", { headsUpTitle: e.target.value }))
            }
          />
        </label>
        <LineItemsField
          label="Heads-up paragraphs"
          value={itemsToLines(tracks.headsUp)}
          onChange={(next) =>
            onChange(
              patchTab(draft, "tracks", { headsUp: linesToItems(next) }),
            )
          }
          itemLabel="Paragraph"
          rich
        />
        <label>
          Punchline
          <input
            className="pgs-admin-control"
            value={tracks.punchline}
            onChange={(e) =>
              onChange(patchTab(draft, "tracks", { punchline: e.target.value }))
            }
          />
        </label>
      </section>
    </div>
  );
}
