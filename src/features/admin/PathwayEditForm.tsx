"use client";

import { AdminRichTextField } from "./AdminRichTextField";
import { LineItemsField } from "./LineItemsField";
import { KeyValueTableField } from "./KeyValueTableField";
import { MediaAssetField } from "./MediaAssetField";
import { getMediaAssetPreview } from "./media-actions";
import {
  getTemplateFromDraft,
  parsePageContentFromRow,
  patchPageContent,
  type PathwayDraft,
} from "./pathway-preview-map";
import type {
  MedicalPathwayPageContent,
  NonMedicalPathwayPageContent,
  PathwayFaq,
  PathwayIntroContent,
  PathwayStat,
  PathwayStep,
} from "@/features/pathway/page-content";

type Props = {
  draft: PathwayDraft;
  onChange: (next: PathwayDraft) => void;
};

function linesToItems(value: string): string[] {
  return value.split(/\r?\n/).filter((l) => l.length > 0);
}

function itemsToLines(items: string[]): string {
  return items.join("\n");
}

async function mediaUrlForAsset(assetId: string | null): Promise<string> {
  if (!assetId) return "";
  try {
    const preview = await getMediaAssetPreview(assetId);
    return preview?.publicUrl ?? "";
  } catch {
    return "";
  }
}

type IntroImageSetter = (
  assetIdField: "stepIntoImageAssetId" | "purpleMapImageAssetId",
  urlField: "stepIntoImage" | "purpleMapImage",
  assetId: string | null,
  fallbackUrl: string,
) => void;

function IntroSections({
  intro,
  onPatch,
  onSetImage,
}: {
  intro: PathwayIntroContent;
  onPatch: (patch: Partial<PathwayIntroContent>) => void;
  onSetImage: IntroImageSetter;
}) {
  return (
    <>
      <section id="hero" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Hero</h2>
        <label>
          Title
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={intro.heroTitle}
            onChange={(e) => onPatch({ heroTitle: e.target.value })}
          />
        </label>
        <label>
          Subtitle
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={intro.heroSubtitle}
            onChange={(e) => onPatch({ heroSubtitle: e.target.value })}
          />
        </label>
        <label>
          Badge line
          <input
            className="pgs-admin-control"
            value={intro.heroBadgeLine}
            onChange={(e) => onPatch({ heroBadgeLine: e.target.value })}
          />
        </label>
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={intro.heroCtaLabel}
            onChange={(e) => onPatch({ heroCtaLabel: e.target.value })}
          />
        </label>
        <label>
          CTA subtext
          <input
            className="pgs-admin-control"
            value={intro.heroCtaSubtext}
            onChange={(e) => onPatch({ heroCtaSubtext: e.target.value })}
          />
        </label>
      </section>

      <section id="step-into" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Step into</h2>
        <MediaAssetField
          label="Hero image"
          value={intro.stepIntoImageAssetId ?? null}
          folder="pathways"
          onChange={(id) =>
            void onSetImage("stepIntoImageAssetId", "stepIntoImage", id, intro.stepIntoImage)
          }
        />
        <label>
          Badge line
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={intro.stepIntoBadgeLine}
            onChange={(e) => onPatch({ stepIntoBadgeLine: e.target.value })}
          />
        </label>
        <label>
          Trust line
          <input
            className="pgs-admin-control"
            value={intro.stepIntoTrustLine}
            onChange={(e) => onPatch({ stepIntoTrustLine: e.target.value })}
          />
        </label>
      </section>

      <section id="why-built" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Why built</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={intro.whyBuiltTitle}
            onChange={(e) => onPatch({ whyBuiltTitle: e.target.value })}
          />
        </label>
        <label>
          Subtitle
          <input
            className="pgs-admin-control"
            value={intro.whyBuiltSubtitle}
            onChange={(e) => onPatch({ whyBuiltSubtitle: e.target.value })}
          />
        </label>
        <LineItemsField
          label="Bullets"
          value={itemsToLines(intro.whyBuiltBullets)}
          onChange={(next) =>
            onPatch({ whyBuiltBullets: linesToItems(next) })
          }
          itemLabel="Bullet"
        />
      </section>

      <section id="purple-map" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Purple map</h2>
        <label>
          Headline
          <input
            className="pgs-admin-control"
            value={intro.purpleMapHeadline}
            onChange={(e) => onPatch({ purpleMapHeadline: e.target.value })}
          />
        </label>
        <label>
          Subhead
          <input
            className="pgs-admin-control"
            value={intro.purpleMapSubhead}
            onChange={(e) => onPatch({ purpleMapSubhead: e.target.value })}
          />
        </label>
        <label>
          Cross-link text
          <input
            className="pgs-admin-control"
            value={intro.purpleMapCrossLink}
            onChange={(e) => onPatch({ purpleMapCrossLink: e.target.value })}
          />
        </label>
        <label>
          Path title
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={intro.purpleMapPathTitle}
            onChange={(e) => onPatch({ purpleMapPathTitle: e.target.value })}
          />
        </label>
        <MediaAssetField
          label="Purple map image"
          value={intro.purpleMapImageAssetId ?? null}
          folder="pathways"
          onChange={(id) =>
            void onSetImage(
              "purpleMapImageAssetId",
              "purpleMapImage",
              id,
              intro.purpleMapImage,
            )
          }
        />
      </section>

      <section id="cv-checklist" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">CV checklist</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={intro.cvTitle}
            onChange={(e) => onPatch({ cvTitle: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={intro.cvBody}
          onChange={(cvBody) => onPatch({ cvBody })}
        />
        <label>
          Recruiter title
          <input
            className="pgs-admin-control"
            value={intro.cvRecruiterTitle}
            onChange={(e) => onPatch({ cvRecruiterTitle: e.target.value })}
          />
        </label>
        <label>
          Recruiter subtext
          <input
            className="pgs-admin-control"
            value={intro.cvRecruiterSubtext}
            onChange={(e) => onPatch({ cvRecruiterSubtext: e.target.value })}
          />
        </label>
        <KeyValueTableField
          label="Checklist items"
          columns={[
            { key: "dot", label: "Dot class" },
            { key: "text", label: "Text" },
          ]}
          value={intro.cvChecklist}
          onChange={(cvChecklist) => onPatch({ cvChecklist })}
          emptyRow={() => ({ dot: "bg-green", text: "" })}
          itemLabel="Item"
        />
        <label>
          Card title
          <input
            className="pgs-admin-control"
            value={intro.cvCardTitle}
            onChange={(e) => onPatch({ cvCardTitle: e.target.value })}
          />
        </label>
        <label>
          Card unplanned label
          <input
            className="pgs-admin-control"
            value={intro.cvCardUnplanned}
            onChange={(e) => onPatch({ cvCardUnplanned: e.target.value })}
          />
        </label>
        <label>
          Card researched label
          <input
            className="pgs-admin-control"
            value={intro.cvCardResearched}
            onChange={(e) => onPatch({ cvCardResearched: e.target.value })}
          />
        </label>
        <AdminRichTextField
          label="Card footer"
          value={intro.cvCardFooter}
          onChange={(cvCardFooter) => onPatch({ cvCardFooter })}
        />
      </section>
    </>
  );
}

function ClosingSections({
  content,
  onPatch,
  isMedical,
  onSetDocumentationImage,
  onSetDocumentationSideImage,
  onSetDashboardImage,
}: {
  content: MedicalPathwayPageContent | NonMedicalPathwayPageContent;
  onPatch: (patch: Partial<MedicalPathwayPageContent & NonMedicalPathwayPageContent>) => void;
  isMedical: boolean;
  onSetDocumentationImage?: (assetId: string | null) => void;
  onSetDocumentationSideImage?: (assetId: string | null) => void;
  onSetDashboardImage: (assetId: string | null) => void;
}) {
  return (
    <>
      <section id="counselor" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Counselor quote</h2>
        <AdminRichTextField
          label="Quote"
          value={content.counselorQuote}
          onChange={(counselorQuote) => onPatch({ counselorQuote })}
        />
        <label>
          Tag
          <input
            className="pgs-admin-control"
            value={content.counselorTag}
            onChange={(e) => onPatch({ counselorTag: e.target.value })}
          />
        </label>
      </section>

      {isMedical && "documentationTitle" in content ? (
        <section id="documentation" className="pgs-event-cms__section">
          <h2 className="pgs-event-cms__section-title">USCE documentation</h2>
          <label>
            Title
            <textarea
              className="pgs-admin-control"
              rows={2}
              value={content.documentationTitle}
              onChange={(e) =>
                onPatch({ documentationTitle: e.target.value })
              }
            />
          </label>
          <label>
            CTA label
            <input
              className="pgs-admin-control"
              value={content.documentationCta}
              onChange={(e) => onPatch({ documentationCta: e.target.value })}
            />
          </label>
          <AdminRichTextField
            label="Body"
            value={content.documentationBody}
            onChange={(documentationBody) => onPatch({ documentationBody })}
          />
          <MediaAssetField
            label="Main image"
            value={content.documentationImageAssetId ?? null}
            folder="pathways"
            onChange={(id) => void onSetDocumentationImage?.(id)}
          />
          <MediaAssetField
            label="Side image"
            value={content.documentationSideImageAssetId ?? null}
            folder="pathways"
            onChange={(id) => void onSetDocumentationSideImage?.(id)}
          />
        </section>
      ) : null}

      <section id="dashboard" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Dashboard</h2>
        <label>
          Title
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={content.dashboard.title}
            onChange={(e) =>
              onPatch({
                dashboard: { ...content.dashboard, title: e.target.value },
              })
            }
          />
        </label>
        <MediaAssetField
          label="Dashboard image"
          value={content.dashboard.imageAssetId ?? null}
          folder="pathways"
          onChange={(id) => void onSetDashboardImage(id)}
        />
        <LineItemsField
          label="Features (use line breaks within items)"
          value={itemsToLines(content.dashboard.features)}
          onChange={(next) =>
            onPatch({
              dashboard: {
                ...content.dashboard,
                features: linesToItems(next),
              },
            })
          }
          itemLabel="Feature"
        />
      </section>

      <section id="offer" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Offer & pricing</h2>
        <label>
          Headline
          <input
            className="pgs-admin-control"
            value={content.offer.headline}
            onChange={(e) =>
              onPatch({
                offer: { ...content.offer, headline: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Subtext"
          value={content.offer.subtext}
          onChange={(subtext) =>
            onPatch({ offer: { ...content.offer, subtext } })
          }
        />
        <label>
          Discount label
          <input
            className="pgs-admin-control"
            value={content.offer.discountLabel}
            onChange={(e) =>
              onPatch({
                offer: { ...content.offer, discountLabel: e.target.value },
              })
            }
          />
        </label>
        <label>
          Was price
          <input
            className="pgs-admin-control"
            value={content.offer.wasPrice}
            onChange={(e) =>
              onPatch({
                offer: { ...content.offer, wasPrice: e.target.value },
              })
            }
          />
        </label>
        <label>
          Price
          <input
            className="pgs-admin-control"
            value={content.offer.price}
            onChange={(e) =>
              onPatch({
                offer: { ...content.offer, price: e.target.value },
              })
            }
          />
        </label>
        <LineItemsField
          label="Included items"
          value={itemsToLines(content.offer.included)}
          onChange={(next) =>
            onPatch({
              offer: {
                ...content.offer,
                included: linesToItems(next),
              },
            })
          }
          itemLabel="Item"
        />
        <AdminRichTextField
          label="Footer note"
          value={content.offer.footerNote}
          onChange={(footerNote) =>
            onPatch({ offer: { ...content.offer, footerNote } })
          }
        />
      </section>

      <section id="meet-greet" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Meet & greet</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={content.meet.title}
            onChange={(e) =>
              onPatch({ meet: { ...content.meet, title: e.target.value } })
            }
          />
        </label>
        <LineItemsField
          label="Bullets"
          value={itemsToLines(content.meet.bullets)}
          onChange={(next) =>
            onPatch({
              meet: { ...content.meet, bullets: linesToItems(next) },
            })
          }
          itemLabel="Bullet"
        />
        <label>
          Card title
          <input
            className="pgs-admin-control"
            value={content.meet.cardTitle}
            onChange={(e) =>
              onPatch({
                meet: { ...content.meet, cardTitle: e.target.value },
              })
            }
          />
        </label>
        <label>
          Card subtitle
          <input
            className="pgs-admin-control"
            value={content.meet.cardSubtitle}
            onChange={(e) =>
              onPatch({
                meet: { ...content.meet, cardSubtitle: e.target.value },
              })
            }
          />
        </label>
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={content.meet.ctaLabel}
            onChange={(e) =>
              onPatch({
                meet: { ...content.meet, ctaLabel: e.target.value },
              })
            }
          />
        </label>
      </section>

      <section id="faq" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">FAQ</h2>
        <KeyValueTableField
          label="FAQ items"
          columns={[
            { key: "q", label: "Question" },
            { key: "a", label: "Answer", multiline: true },
          ]}
          value={content.faq}
          onChange={(faq) => onPatch({ faq: faq as PathwayFaq[] })}
          emptyRow={() => ({ q: "", a: "" })}
          itemLabel="FAQ"
        />
      </section>

      <section id="contact" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Contact strip</h2>
        <label>
          Phone
          <input
            className="pgs-admin-control"
            value={content.contact.phone}
            onChange={(e) =>
              onPatch({
                contact: { ...content.contact, phone: e.target.value },
              })
            }
          />
        </label>
        <label>
          Email
          <input
            className="pgs-admin-control"
            value={content.contact.email}
            onChange={(e) =>
              onPatch({
                contact: { ...content.contact, email: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Blurb"
          value={content.contact.blurb}
          onChange={(blurb) =>
            onPatch({ contact: { ...content.contact, blurb } })
          }
        />
      </section>
    </>
  );
}

function MedicalForm({
  content,
  onChange,
}: {
  content: MedicalPathwayPageContent;
  onChange: (next: MedicalPathwayPageContent) => void;
}) {
  const patch = (p: Partial<MedicalPathwayPageContent>) =>
    onChange({ ...content, ...p });

  async function setIntroImage(
    assetIdField: "stepIntoImageAssetId" | "purpleMapImageAssetId",
    urlField: "stepIntoImage" | "purpleMapImage",
    assetId: string | null,
    fallbackUrl: string,
  ) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      intro: {
        ...content.intro,
        [assetIdField]: assetId,
        [urlField]: url || fallbackUrl,
      },
    });
  }

  async function setDocumentationImage(assetId: string | null) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      documentationImageAssetId: assetId,
      documentationImage: url || content.documentationImage,
    });
  }

  async function setDocumentationSideImage(assetId: string | null) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      documentationSideImageAssetId: assetId,
      documentationSideImage: url || content.documentationSideImage,
    });
  }

  async function setDashboardImage(assetId: string | null) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      dashboard: {
        ...content.dashboard,
        imageAssetId: assetId,
        image: url || content.dashboard.image,
      },
    });
  }

  return (
    <>
      <IntroSections
        intro={content.intro}
        onPatch={(introPatch) =>
          patch({ intro: { ...content.intro, ...introPatch } })
        }
        onSetImage={(assetIdField, urlField, assetId, fallbackUrl) =>
          void setIntroImage(assetIdField, urlField, assetId, fallbackUrl)
        }
      />

      <section id="track-main" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Medical track</h2>
        <label>
          Section label
          <input
            className="pgs-admin-control"
            value={content.track.sectionLabel}
            onChange={(e) =>
              patch({
                track: { ...content.track, sectionLabel: e.target.value },
              })
            }
          />
        </label>
        <label>
          Track label
          <input
            className="pgs-admin-control"
            value={content.track.trackLabel}
            onChange={(e) =>
              patch({
                track: { ...content.track, trackLabel: e.target.value },
              })
            }
          />
        </label>
        <label>
          Track title
          <input
            className="pgs-admin-control"
            value={content.track.trackTitle}
            onChange={(e) =>
              patch({
                track: { ...content.track, trackTitle: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Track intro"
          value={content.track.trackIntro}
          onChange={(trackIntro) =>
            patch({ track: { ...content.track, trackIntro } })
          }
        />
        <AdminRichTextField
          label="Track body"
          value={content.track.trackBody}
          onChange={(trackBody) =>
            patch({ track: { ...content.track, trackBody } })
          }
        />
        <AdminRichTextField
          label="Bottom headline"
          value={content.track.bottomHeadline}
          onChange={(bottomHeadline) =>
            patch({ track: { ...content.track, bottomHeadline } })
          }
        />
        <AdminRichTextField
          label="Bottom body"
          value={content.track.bottomBody}
          onChange={(bottomBody) =>
            patch({ track: { ...content.track, bottomBody } })
          }
        />
      </section>

      <section id="track-testimonial" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Testimonial</h2>
        <AdminRichTextField
          label="Quote"
          value={content.track.testimonialQuote}
          onChange={(testimonialQuote) =>
            patch({ track: { ...content.track, testimonialQuote } })
          }
        />
      </section>

      <section id="path-intro" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Path intro</h2>
        <label>
          Path label
          <input
            className="pgs-admin-control"
            value={content.pathway.pathParen}
            onChange={(e) =>
              patch({
                pathway: { ...content.pathway, pathParen: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Intro"
          value={content.pathway.pathIntro}
          onChange={(pathIntro) =>
            patch({ pathway: { ...content.pathway, pathIntro } })
          }
        />
      </section>

      <section id="get-to-know" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Get to know</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={content.pathway.getToKnowTitle}
            onChange={(e) =>
              patch({
                pathway: {
                  ...content.pathway,
                  getToKnowTitle: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Gateway title
          <input
            className="pgs-admin-control"
            value={content.pathway.gatewayTitle}
            onChange={(e) =>
              patch({
                pathway: {
                  ...content.pathway,
                  gatewayTitle: e.target.value,
                },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Gateway body"
          value={content.pathway.gatewayBody}
          onChange={(gatewayBody) =>
            patch({ pathway: { ...content.pathway, gatewayBody } })
          }
        />
        <KeyValueTableField
          label="Steps"
          columns={[
            { key: "title", label: "Title" },
            { key: "detail", label: "Detail", multiline: true },
          ]}
          value={content.pathway.steps}
          onChange={(steps) =>
            patch({
              pathway: {
                ...content.pathway,
                steps: steps as PathwayStep[],
              },
            })
          }
          emptyRow={() => ({ title: "", detail: "" })}
          itemLabel="Step"
        />
        <KeyValueTableField
          label="Stats"
          columns={[
            { key: "value", label: "Value" },
            { key: "label", label: "Label" },
            { key: "dash", label: "Dash" },
          ]}
          value={content.pathway.stats}
          onChange={(stats) =>
            patch({
              pathway: {
                ...content.pathway,
                stats: stats as PathwayStat[],
              },
            })
          }
          emptyRow={() => ({ value: "", label: "", dash: "" })}
          itemLabel="Stat"
        />
      </section>

      <section id="what-you-get" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">What you get</h2>
        <label>
          Section title
          <input
            className="pgs-admin-control"
            value={content.pathway.whatYouGetTitle}
            onChange={(e) =>
              patch({
                pathway: {
                  ...content.pathway,
                  whatYouGetTitle: e.target.value,
                },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Network body"
          value={content.pathway.networkBody}
          onChange={(networkBody) =>
            patch({ pathway: { ...content.pathway, networkBody } })
          }
        />
        <LineItemsField
          label="Forms list"
          value={itemsToLines(content.pathway.forms)}
          onChange={(next) =>
            patch({
              pathway: {
                ...content.pathway,
                forms: linesToItems(next),
              },
            })
          }
          itemLabel="Form"
        />
        <LineItemsField
          label="Checklist"
          value={itemsToLines(content.pathway.checklist)}
          onChange={(next) =>
            patch({
              pathway: {
                ...content.pathway,
                checklist: linesToItems(next),
              },
            })
          }
          itemLabel="Item"
        />
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={content.pathway.ctaLabel}
            onChange={(e) =>
              patch({
                pathway: { ...content.pathway, ctaLabel: e.target.value },
              })
            }
          />
        </label>
      </section>

      <ClosingSections
        content={content}
        onPatch={patch}
        isMedical
        onSetDocumentationImage={(id) => void setDocumentationImage(id)}
        onSetDocumentationSideImage={(id) => void setDocumentationSideImage(id)}
        onSetDashboardImage={(id) => void setDashboardImage(id)}
      />
    </>
  );
}

function NonMedicalForm({
  content,
  onChange,
}: {
  content: NonMedicalPathwayPageContent;
  onChange: (next: NonMedicalPathwayPageContent) => void;
}) {
  const patch = (p: Partial<NonMedicalPathwayPageContent>) =>
    onChange({ ...content, ...p });

  async function setIntroImage(
    assetIdField: "stepIntoImageAssetId" | "purpleMapImageAssetId",
    urlField: "stepIntoImage" | "purpleMapImage",
    assetId: string | null,
    fallbackUrl: string,
  ) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      intro: {
        ...content.intro,
        [assetIdField]: assetId,
        [urlField]: url || fallbackUrl,
      },
    });
  }

  async function setDashboardImage(assetId: string | null) {
    const url = await mediaUrlForAsset(assetId);
    patch({
      dashboard: {
        ...content.dashboard,
        imageAssetId: assetId,
        image: url || content.dashboard.image,
      },
    });
  }

  return (
    <>
      <IntroSections
        intro={content.intro}
        onPatch={(introPatch) =>
          patch({ intro: { ...content.intro, ...introPatch } })
        }
        onSetImage={(assetIdField, urlField, assetId, fallbackUrl) =>
          void setIntroImage(assetIdField, urlField, assetId, fallbackUrl)
        }
      />

      <section id="track-deadlines" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Deadlines track</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={content.track.title}
            onChange={(e) =>
              patch({ track: { ...content.track, title: e.target.value } })
            }
          />
        </label>
        <label>
          Subtitle
          <input
            className="pgs-admin-control"
            value={content.track.subtitle}
            onChange={(e) =>
              patch({ track: { ...content.track, subtitle: e.target.value } })
            }
          />
        </label>
        <AdminRichTextField
          label="Body"
          value={content.track.body}
          onChange={(body) => patch({ track: { ...content.track, body } })}
        />
        <label>
          CTA label
          <input
            className="pgs-admin-control"
            value={content.track.ctaLabel}
            onChange={(e) =>
              patch({ track: { ...content.track, ctaLabel: e.target.value } })
            }
          />
        </label>
      </section>

      <section id="track-student" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Student caption</h2>
        <label>
          Name
          <input
            className="pgs-admin-control"
            value={content.track.studentName}
            onChange={(e) =>
              patch({
                track: { ...content.track, studentName: e.target.value },
              })
            }
          />
        </label>
        <label>
          Label
          <input
            className="pgs-admin-control"
            value={content.track.studentLabel}
            onChange={(e) =>
              patch({
                track: { ...content.track, studentLabel: e.target.value },
              })
            }
          />
        </label>
        <label>
          Country tag
          <input
            className="pgs-admin-control"
            value={content.track.studentCountry}
            onChange={(e) =>
              patch({
                track: { ...content.track, studentCountry: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Testimonial quote"
          value={content.track.testimonialQuote}
          onChange={(testimonialQuote) =>
            patch({ track: { ...content.track, testimonialQuote } })
          }
        />
      </section>

      <section id="program-main" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">What is PurplePremium</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={content.program.title}
            onChange={(e) =>
              patch({ program: { ...content.program, title: e.target.value } })
            }
          />
        </label>
        <label>
          Badge
          <input
            className="pgs-admin-control"
            value={content.program.badge}
            onChange={(e) =>
              patch({ program: { ...content.program, badge: e.target.value } })
            }
          />
        </label>
        <AdminRichTextField
          label="Short answer"
          value={content.program.shortAnswer}
          onChange={(shortAnswer) =>
            patch({ program: { ...content.program, shortAnswer } })
          }
        />
        <AdminRichTextField
          label="Real answer"
          value={content.program.realAnswer}
          onChange={(realAnswer) =>
            patch({ program: { ...content.program, realAnswer } })
          }
        />
      </section>

      <section id="program-pillars" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Support pillars</h2>
        <label>
          AI title
          <input
            className="pgs-admin-control"
            value={content.program.aiTitle}
            onChange={(e) =>
              patch({ program: { ...content.program, aiTitle: e.target.value } })
            }
          />
        </label>
        <AdminRichTextField
          label="AI body"
          value={content.program.aiBody}
          onChange={(aiBody) =>
            patch({ program: { ...content.program, aiBody } })
          }
        />
        <label>
          Pathway title
          <input
            className="pgs-admin-control"
            value={content.program.pathwayTitle}
            onChange={(e) =>
              patch({
                program: { ...content.program, pathwayTitle: e.target.value },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Pathway body"
          value={content.program.pathwayBody}
          onChange={(pathwayBody) =>
            patch({ program: { ...content.program, pathwayBody } })
          }
        />
        <AdminRichTextField
          label="Support body"
          value={content.program.supportBody}
          onChange={(supportBody) =>
            patch({ program: { ...content.program, supportBody } })
          }
        />
        <AdminRichTextField
          label="Community body"
          value={content.program.communityBody}
          onChange={(communityBody) =>
            patch({ program: { ...content.program, communityBody } })
          }
        />
        <label>
          Launchpad headline
          <input
            className="pgs-admin-control"
            value={content.program.launchpadHeadline}
            onChange={(e) =>
              patch({
                program: {
                  ...content.program,
                  launchpadHeadline: e.target.value,
                },
              })
            }
          />
        </label>
      </section>

      <section id="universities" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Universities CTA</h2>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={content.program.universitiesTitle}
            onChange={(e) =>
              patch({
                program: {
                  ...content.program,
                  universitiesTitle: e.target.value,
                },
              })
            }
          />
        </label>
        <AdminRichTextField
          label="Body 1"
          value={content.program.universitiesBody1}
          onChange={(universitiesBody1) =>
            patch({ program: { ...content.program, universitiesBody1 } })
          }
        />
        <AdminRichTextField
          label="Help line"
          value={content.program.universitiesBody2}
          onChange={(universitiesBody2) =>
            patch({ program: { ...content.program, universitiesBody2 } })
          }
        />
        <label>
          Profile review title
          <textarea
            className="pgs-admin-control"
            rows={2}
            value={content.program.profileReviewTitle}
            onChange={(e) =>
              patch({
                program: {
                  ...content.program,
                  profileReviewTitle: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Profile review CTA
          <input
            className="pgs-admin-control"
            value={content.program.profileReviewCta}
            onChange={(e) =>
              patch({
                program: {
                  ...content.program,
                  profileReviewCta: e.target.value,
                },
              })
            }
          />
        </label>
      </section>

      <ClosingSections
        content={content}
        onPatch={patch}
        isMedical={false}
        onSetDashboardImage={(id) => void setDashboardImage(id)}
      />
    </>
  );
}

export function PathwayEditForm({ draft, onChange }: Props) {
  const template = getTemplateFromDraft(draft);
  const content = parsePageContentFromRow(draft);

  return (
    <div className="pgs-event-cms__form-inner">
      <section id="meta" className="pgs-event-cms__section">
        <h2 className="pgs-event-cms__section-title">Meta</h2>
        <label>
          Name
          <input
            className="pgs-admin-control"
            value={String(draft.name ?? "")}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </label>
        <label>
          Slug
          <input
            className="pgs-admin-control"
            value={String(draft.slug ?? "")}
            onChange={(e) => onChange({ ...draft, slug: e.target.value })}
          />
        </label>
        <label>
          Template
          <select
            className="pgs-admin-control"
            value={template}
            onChange={(e) =>
              onChange({
                ...draft,
                template: e.target.value as "medical" | "nonmedical",
              })
            }
          >
            <option value="medical">Medical (USMLE / PLAB / AMC)</option>
            <option value="nonmedical">Non-medical (STEM / MBA)</option>
          </select>
        </label>
        <label>
          Display order
          <input
            className="pgs-admin-control"
            type="number"
            value={Number(draft.display_order ?? 0)}
            onChange={(e) =>
              onChange({
                ...draft,
                display_order: Number(e.target.value),
              })
            }
          />
        </label>
      </section>

      {template === "medical" && "pathway" in content ? (
        <MedicalForm
          content={content as MedicalPathwayPageContent}
          onChange={(next) => onChange(patchPageContent(draft, next))}
        />
      ) : "program" in content ? (
        <NonMedicalForm
          content={content as NonMedicalPathwayPageContent}
          onChange={(next) => onChange(patchPageContent(draft, next))}
        />
      ) : null}
    </div>
  );
}
