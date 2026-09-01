"use client";

import { AdminRichTextField } from "@/features/admin/AdminRichTextField";
import { MediaAssetField } from "@/features/admin/MediaAssetField";
import { getMediaAssetPreview } from "@/features/admin/media-actions";
import {
  onboardingPercentageFromChecklist,
  type DashboardChecklistItem,
  type DashboardComment,
  type DashboardDestination,
  type DashboardShortlistItem,
  type DashboardTaskBadge,
  type DashboardTaskItem,
  type DashboardTopPick,
  type DashboardTrackerItem,
  type DashboardUniCard,
  type DashboardUpcomingItem,
  type StudentDashboardContent,
} from "@/features/dashboard/content";

type DashCatalogOption = {
  kind: "event" | "course";
  id: string;
  title: string;
  date: string;
  time: string;
  blurb: string;
  mode: string;
  startsAt: string | null;
  label: string;
};

export const DASH_EDIT_SECTIONS = [
  { id: "identity", label: "Identity" },
  { id: "top-picks", label: "Top picks" },
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes" },
  { id: "aspirant", label: "Aspirant card" },
  { id: "onboarding", label: "Where you stand" },
  { id: "prep", label: "Prep status" },
  { id: "unis", label: "Finalized unis" },
  { id: "tasks", label: "Tasks" },
  { id: "comments", label: "Comments" },
  { id: "upcoming", label: "Upcoming events" },
] as const;

const DOT_OPTIONS = [
  "yellow-bg",
  "blue-bg",
  "red-bg",
  "purple-bg",
  "yellow-dark-bg",
] as const;

type Props = {
  draft: StudentDashboardContent;
  onChange: (next: StudentDashboardContent) => void;
  catalogOptions?: DashCatalogOption[];
};

function patchList<T>(items: T[], index: number, next: T): T[] {
  return items.map((item, i) => (i === index ? next : item));
}

export function DashEditForm({
  draft,
  onChange,
  catalogOptions = [],
}: Props) {
  function patch(partial: Partial<StudentDashboardContent>) {
    onChange({ ...draft, ...partial });
  }

  async function setPickImage(index: number, assetId: string | null) {
    const current = draft.top_picks[index];
    if (!current) return;
    if (!assetId) {
      patch({
        top_picks: patchList(draft.top_picks, index, {
          ...current,
          image_asset_id: null,
          image: "/assets/img/computer.jpg",
        }),
      });
      return;
    }
    try {
      const preview = await getMediaAssetPreview(assetId);
      patch({
        top_picks: patchList(draft.top_picks, index, {
          ...current,
          image_asset_id: assetId,
          image: preview?.publicUrl || current.image,
        }),
      });
    } catch {
      patch({
        top_picks: patchList(draft.top_picks, index, {
          ...current,
          image_asset_id: assetId,
        }),
      });
    }
  }

  async function setUniImage(index: number, assetId: string | null) {
    const current = draft.finalized_unis[index];
    if (!current) return;
    if (!assetId) {
      patch({
        finalized_unis: patchList(draft.finalized_unis, index, {
          ...current,
          image_asset_id: null,
          image: "/assets/img/uni.jpg",
        }),
      });
      return;
    }
    try {
      const preview = await getMediaAssetPreview(assetId);
      patch({
        finalized_unis: patchList(draft.finalized_unis, index, {
          ...current,
          image_asset_id: assetId,
          image: preview?.publicUrl || current.image,
        }),
      });
    } catch {
      patch({
        finalized_unis: patchList(draft.finalized_unis, index, {
          ...current,
          image_asset_id: assetId,
        }),
      });
    }
  }

  return (
    <div className="pgs-event-cms__form-inner">
      <section id="identity" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Identity labels</h3>
        <label>
          Pathway
          <input
            className="pgs-admin-control"
            value={draft.pathway_label}
            onChange={(e) => patch({ pathway_label: e.target.value })}
          />
        </label>
        <label>
          Premium label
          <input
            className="pgs-admin-control"
            value={draft.premium_label}
            onChange={(e) => patch({ premium_label: e.target.value })}
          />
        </label>
      </section>

      <section id="top-picks" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Top picks</h3>
        {draft.top_picks.map((pick, i) => (
          <TopPickFields
            key={`pick-${i}`}
            index={i}
            pick={pick}
            onChange={(next) =>
              patch({ top_picks: patchList(draft.top_picks, i, next) })
            }
            onImage={(id) => void setPickImage(i, id)}
            onRemove={() =>
              patch({
                top_picks: draft.top_picks.filter((_, idx) => idx !== i),
              })
            }
          />
        ))}
        <button
          type="button"
          className="pgs-admin__btn pgs-admin__btn--ghost"
          onClick={() =>
            patch({
              top_picks: [
                ...draft.top_picks,
                {
                  title: "",
                  tag: "InProgress",
                  highlight: "",
                  dot: "yellow-bg",
                  image: "/assets/img/computer.jpg",
                  image_asset_id: null,
                },
              ],
            })
          }
        >
          Add top pick
        </button>
      </section>

      <section id="overview" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Quick overview</h3>
        <label>
          Universities applied
          <input
            className="pgs-admin-control"
            type="number"
            min={0}
            value={draft.overview.universities_applied}
            onChange={(e) =>
              patch({
                overview: {
                  ...draft.overview,
                  universities_applied: Number(e.target.value) || 0,
                },
              })
            }
          />
        </label>
        <label>
          Offers received
          <input
            className="pgs-admin-control"
            type="number"
            min={0}
            value={draft.overview.offers_received}
            onChange={(e) =>
              patch({
                overview: {
                  ...draft.overview,
                  offers_received: Number(e.target.value) || 0,
                },
              })
            }
          />
        </label>
        <label className="pgs-event-cms__checkbox">
          <input
            type="checkbox"
            checked={draft.overview.tuition_receipt_uploaded}
            onChange={(e) =>
              patch({
                overview: {
                  ...draft.overview,
                  tuition_receipt_uploaded: e.target.checked,
                },
              })
            }
          />
          Tuition receipt uploaded
        </label>
        <label className="pgs-event-cms__checkbox">
          <input
            type="checkbox"
            checked={draft.overview.visa_applied}
            onChange={(e) =>
              patch({
                overview: {
                  ...draft.overview,
                  visa_applied: e.target.checked,
                },
              })
            }
          />
          Visa applied
        </label>
      </section>

      <section id="notes" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Notes</h3>
        <AdminRichTextField
          label="Notes"
          value={draft.notes_html}
          onChange={(notes_html) => patch({ notes_html })}
          rows={6}
        />
      </section>

      <section id="aspirant" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Aspirant card</h3>
        <label>
          Title
          <input
            className="pgs-admin-control"
            value={draft.aspirant.title}
            onChange={(e) =>
              patch({
                aspirant: { ...draft.aspirant, title: e.target.value },
              })
            }
          />
        </label>
        <label>
          Gender
          <input
            className="pgs-admin-control"
            value={draft.aspirant.gender}
            onChange={(e) =>
              patch({
                aspirant: { ...draft.aspirant, gender: e.target.value },
              })
            }
          />
        </label>
        <label>
          Location
          <input
            className="pgs-admin-control"
            value={draft.aspirant.location}
            onChange={(e) =>
              patch({
                aspirant: { ...draft.aspirant, location: e.target.value },
              })
            }
          />
        </label>
        {draft.aspirant.destinations.map((dest, i) => (
          <div key={`dest-${i}`} className="pgs-admin-line-items__row">
            <div className="pgs-admin-line-items__row-head">
              <span>Destination {i + 1}</span>
              <button
                type="button"
                className="pgs-admin__btn pgs-admin__btn--ghost"
                onClick={() =>
                  patch({
                    aspirant: {
                      ...draft.aspirant,
                      destinations: draft.aspirant.destinations.filter(
                        (_, idx) => idx !== i,
                      ),
                    },
                  })
                }
              >
                Remove
              </button>
            </div>
            <label>
              Label
              <input
                className="pgs-admin-control"
                value={dest.name}
                onChange={(e) =>
                  patch({
                    aspirant: {
                      ...draft.aspirant,
                      destinations: patchList(
                        draft.aspirant.destinations,
                        i,
                        { ...dest, name: e.target.value },
                      ),
                    },
                  })
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="pgs-admin__btn pgs-admin__btn--ghost"
          onClick={() =>
            patch({
              aspirant: {
                ...draft.aspirant,
                destinations: [
                  ...draft.aspirant.destinations,
                  { code: "", name: "", flag: "/assets/img/US.png" } satisfies DashboardDestination,
                ],
              },
            })
          }
        >
          Add destination
        </button>
      </section>

      <section id="onboarding" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Where you stand</h3>
        <p className="pgs-event-cms__hint">
          Onboarding progress is calculated from completed checklist items:{" "}
          <strong>
            {onboardingPercentageFromChecklist(draft.onboarding_checklist)}%
          </strong>{" "}
          (
          {
            draft.onboarding_checklist.filter(
              (item) => item.checked && item.text.trim(),
            ).length
          }{" "}
          of {draft.onboarding_checklist.filter((item) => item.text.trim()).length}{" "}
          done).
        </p>
        <ChecklistFields
          label="Onboarding checklist"
          items={draft.onboarding_checklist}
          onChange={(onboarding_checklist) =>
            patch({
              onboarding_checklist,
              onboarding_percentage:
                onboardingPercentageFromChecklist(onboarding_checklist),
            })
          }
        />
        <label>
          Feedback session title
          <input
            className="pgs-admin-control"
            value={draft.feedback_session_title}
            onChange={(e) =>
              patch({ feedback_session_title: e.target.value })
            }
          />
        </label>
        <ChecklistFields
          label="Feedback items"
          items={draft.feedback_session_items}
          onChange={(feedback_session_items) =>
            patch({ feedback_session_items })
          }
        />
      </section>

      <section id="prep" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Prep status</h3>
        <TrackerFields
          label="Documents tracker"
          items={draft.documents_tracker}
          onChange={(documents_tracker) => patch({ documents_tracker })}
        />
        <ShortlistFields
          items={draft.uni_shortlist}
          onChange={(uni_shortlist) => patch({ uni_shortlist })}
        />
      </section>

      <section id="unis" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Finalized universities</h3>
        {draft.finalized_unis.map((uni, i) => (
          <div key={`uni-${i}`} className="pgs-dash-cms__card">
            <label>
              Name
              <input
                className="pgs-admin-control"
                value={uni.name}
                onChange={(e) =>
                  patch({
                    finalized_unis: patchList(draft.finalized_unis, i, {
                      ...uni,
                      name: e.target.value,
                    }),
                  })
                }
              />
            </label>
            <label>
              Tag
              <input
                className="pgs-admin-control"
                value={uni.tag}
                onChange={(e) =>
                  patch({
                    finalized_unis: patchList(draft.finalized_unis, i, {
                      ...uni,
                      tag: e.target.value,
                    }),
                  })
                }
              />
            </label>
            <MediaAssetField
              label="Image"
              value={uni.image_asset_id}
              onChange={(id) => void setUniImage(i, id)}
              folder="dash"
            />
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() =>
                patch({
                  finalized_unis: draft.finalized_unis.filter(
                    (_, idx) => idx !== i,
                  ),
                })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="pgs-admin__btn pgs-admin__btn--ghost"
          onClick={() =>
            patch({
              finalized_unis: [
                ...draft.finalized_unis,
                {
                  name: "",
                  tag: "",
                  image: "/assets/img/uni.jpg",
                  image_asset_id: null,
                } satisfies DashboardUniCard,
              ],
            })
          }
        >
          Add university
        </button>
      </section>

      <section id="tasks" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Tasks</h3>
        <TaskFields
          label="Currently working on"
          items={draft.currently_working_on}
          onChange={(currently_working_on) => patch({ currently_working_on })}
        />
        <TaskFields
          label="Future tasks"
          items={draft.future_tasks}
          onChange={(future_tasks) => patch({ future_tasks })}
        />
      </section>

      <section id="comments" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Comments</h3>
        <p className="pgs-event-cms__hint">
          These counselor notes appear on the student feed. Students can still
          add their own comments on the live page.
        </p>
        <CommentFields
          items={draft.comments}
          onChange={(comments) => patch({ comments })}
        />
      </section>

      <section id="upcoming" className="pgs-event-cms__section">
        <h3 className="pgs-event-cms__section-title">Upcoming events</h3>
        <p className="pgs-event-cms__hint">
          Optional. Leave empty to show the site-wide live events calendar.
          Pick published courses or events, or add a custom item.
        </p>
        <UpcomingFields
          items={draft.upcoming_events}
          catalogOptions={catalogOptions}
          onChange={(upcoming_events) => patch({ upcoming_events })}
        />
      </section>
    </div>
  );
}

function TopPickFields({
  index,
  pick,
  onChange,
  onImage,
  onRemove,
}: {
  index: number;
  pick: DashboardTopPick;
  onChange: (next: DashboardTopPick) => void;
  onImage: (id: string | null) => void;
  onRemove: () => void;
}) {
  return (
    <div className="pgs-dash-cms__card">
      <strong>Pick {index + 1}</strong>
      <label>
        Title
        <input
          className="pgs-admin-control"
          value={pick.title}
          onChange={(e) => onChange({ ...pick, title: e.target.value })}
        />
      </label>
      <label>
        Tag
        <input
          className="pgs-admin-control"
          value={pick.tag}
          onChange={(e) => onChange({ ...pick, tag: e.target.value })}
        />
      </label>
      <label>
        Highlight
        <input
          className="pgs-admin-control"
          value={pick.highlight}
          onChange={(e) => onChange({ ...pick, highlight: e.target.value })}
        />
      </label>
      <label>
        Dot
        <select
          className="pgs-admin-control"
          value={pick.dot}
          onChange={(e) => onChange({ ...pick, dot: e.target.value })}
        >
          {DOT_OPTIONS.map((dot) => (
            <option key={dot} value={dot}>
              {dot}
            </option>
          ))}
        </select>
      </label>
      <MediaAssetField
        label="Image"
        value={pick.image_asset_id}
        onChange={onImage}
        folder="dash"
      />
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}

function ChecklistFields({
  label,
  items,
  onChange,
}: {
  label: string;
  items: DashboardChecklistItem[];
  onChange: (next: DashboardChecklistItem[]) => void;
}) {
  const labeled = items.filter((item) => item.text.trim());
  const done = labeled.filter((item) => item.checked).length;
  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
        <span>
          {done} of {labeled.length} complete
        </span>
      </div>
      {items.map((item, i) => (
        <div key={`${label}-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Item {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Label
            <input
              className="pgs-admin-control"
              value={item.text}
              placeholder="e.g. Profile Setup Complete"
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, text: e.target.value }))
              }
            />
          </label>
          <label className="pgs-event-cms__checkbox">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) =>
                onChange(
                  patchList(items, i, { ...item, checked: e.target.checked }),
                )
              }
            />
            Mark complete
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...items, { text: "", checked: false }])}
      >
        Add item
      </button>
    </div>
  );
}

function TrackerFields({
  label,
  items,
  onChange,
}: {
  label: string;
  items: DashboardTrackerItem[];
  onChange: (next: DashboardTrackerItem[]) => void;
}) {
  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
        <span>{items.length} rows</span>
      </div>
      {items.map((item, i) => (
        <div key={`${label}-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Row {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Count
            <input
              className="pgs-admin-control"
              value={item.count}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, count: e.target.value }))
              }
            />
          </label>
          <label>
            Label
            <input
              className="pgs-admin-control"
              value={item.label}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, label: e.target.value }))
              }
            />
          </label>
          <label className="pgs-event-cms__checkbox">
            <input
              type="checkbox"
              checked={item.danger}
              onChange={(e) =>
                onChange(
                  patchList(items, i, { ...item, danger: e.target.checked }),
                )
              }
            />
            Highlight red
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() =>
          onChange([...items, { count: "0", label: "", danger: false }])
        }
      >
        Add row
      </button>
    </div>
  );
}

function ShortlistFields({
  items,
  onChange,
}: {
  items: DashboardShortlistItem[];
  onChange: (next: DashboardShortlistItem[]) => void;
}) {
  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Uni shortlist</strong>
        <span>{items.length} rows</span>
      </div>
      {items.map((item, i) => (
        <div key={`short-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Row {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Count
            <input
              className="pgs-admin-control"
              value={item.count}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, count: e.target.value }))
              }
            />
          </label>
          <label>
            Label
            <input
              className="pgs-admin-control"
              value={item.label}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, label: e.target.value }))
              }
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...items, { count: "0", label: "" }])}
      >
        Add row
      </button>
    </div>
  );
}

function TaskFields({
  label,
  items,
  onChange,
}: {
  label: string;
  items: DashboardTaskItem[];
  onChange: (next: DashboardTaskItem[]) => void;
}) {
  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>{label}</strong>
        <span>{items.length} tasks</span>
      </div>
      {items.map((item, i) => (
        <div key={`${label}-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Task {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Label
            <input
              className="pgs-admin-control"
              value={item.label}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, label: e.target.value }))
              }
            />
          </label>
          <label>
            Badge
            <select
              className="pgs-admin-control"
              value={item.badge ?? ""}
              onChange={(e) =>
                onChange(
                  patchList(items, i, {
                    ...item,
                    badge: (e.target.value || null) as DashboardTaskBadge | null,
                  }),
                )
              }
            >
            <option value="">No badge</option>
            <option value="URGENT">URGENT</option>
            <option value="IMP">IMP</option>
            </select>
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() => onChange([...items, { label: "", badge: null }])}
      >
        Add task
      </button>
    </div>
  );
}

function newDashId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function CommentFields({
  items,
  onChange,
}: {
  items: DashboardComment[];
  onChange: (next: DashboardComment[]) => void;
}) {
  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Feed comments</strong>
        <span>{items.length} comments</span>
      </div>
      {items.map((item, i) => (
        <div key={item.id || `cmt-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>Comment {i + 1}</span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Author
            <input
              className="pgs-admin-control"
              value={item.authorName}
              onChange={(e) =>
                onChange(
                  patchList(items, i, { ...item, authorName: e.target.value }),
                )
              }
            />
          </label>
          <label>
            Comment
            <textarea
              className="pgs-admin-control"
              rows={3}
              value={item.body}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, body: e.target.value }))
              }
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newDashId("cmt"),
              authorName: "Counselor",
              avatarUrl: "/assets/img/avatar.jpg",
              body: "",
              createdAt: new Date().toISOString(),
              score: 0,
              userVote: null,
            },
          ])
        }
      >
        Add comment
      </button>
    </div>
  );
}

function UpcomingFields({
  items,
  catalogOptions,
  onChange,
}: {
  items: DashboardUpcomingItem[];
  catalogOptions: DashCatalogOption[];
  onChange: (next: DashboardUpcomingItem[]) => void;
}) {
  const events = catalogOptions.filter((row) => row.kind === "event");
  const courses = catalogOptions.filter((row) => row.kind === "course");
  const selected = new Set(
    items.map((item) =>
      item.catalog_id ? `${item.kind}:${item.catalog_id}` : "",
    ),
  );

  function addFromCatalog(value: string) {
    const option = catalogOptions.find(
      (row) => `${row.kind}:${row.id}` === value,
    );
    if (!option) return;
    if (selected.has(`${option.kind}:${option.id}`)) return;
    onChange([
      ...items,
      {
        id: newDashId("up"),
        kind: option.kind,
        catalog_id: option.id,
        title: option.title,
        date: option.date,
        time: option.time,
        blurb: option.blurb,
        mode: option.mode,
        startsAt: option.startsAt,
      },
    ]);
  }

  return (
    <div className="pgs-admin-line-items">
      <div className="pgs-admin-line-items__head">
        <strong>Selected items</strong>
        <span>{items.length} on the feed</span>
      </div>
      <label>
        Add from catalog
        <select
          className="pgs-admin-control"
          defaultValue=""
          onChange={(e) => {
            addFromCatalog(e.target.value);
            e.currentTarget.selectedIndex = 0;
          }}
        >
          <option value="">Choose a published event or course…</option>
          {events.length ? (
            <optgroup label="Events">
              {events.map((row) => (
                <option
                  key={`event-${row.id}`}
                  value={`${row.kind}:${row.id}`}
                  disabled={selected.has(`${row.kind}:${row.id}`)}
                >
                  {row.label}
                </option>
              ))}
            </optgroup>
          ) : null}
          {courses.length ? (
            <optgroup label="Courses">
              {courses.map((row) => (
                <option
                  key={`course-${row.id}`}
                  value={`${row.kind}:${row.id}`}
                  disabled={selected.has(`${row.kind}:${row.id}`)}
                >
                  {row.label}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </label>
      {items.map((item, i) => (
        <div key={item.id || `up-${i}`} className="pgs-admin-line-items__row">
          <div className="pgs-admin-line-items__row-head">
            <span>
              {item.kind === "course"
                ? "Course"
                : item.kind === "event"
                  ? "Event"
                  : "Custom"}{" "}
              {i + 1}
            </span>
            <button
              type="button"
              className="pgs-admin__btn pgs-admin__btn--ghost"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
          <label>
            Title
            <input
              className="pgs-admin-control"
              value={item.title}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, title: e.target.value }))
              }
            />
          </label>
          <label>
            Date
            <input
              className="pgs-admin-control"
              value={item.date}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, date: e.target.value }))
              }
            />
          </label>
          <label>
            Time
            <input
              className="pgs-admin-control"
              value={item.time}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, time: e.target.value }))
              }
            />
          </label>
          <label>
            Blurb
            <input
              className="pgs-admin-control"
              value={item.blurb}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, blurb: e.target.value }))
              }
            />
          </label>
          <label>
            Mode
            <input
              className="pgs-admin-control"
              value={item.mode}
              onChange={(e) =>
                onChange(patchList(items, i, { ...item, mode: e.target.value }))
              }
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        className="pgs-admin__btn pgs-admin__btn--ghost"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newDashId("up"),
              kind: "custom",
              catalog_id: null,
              title: "",
              date: "TBA",
              time: "",
              blurb: "",
              mode: "Online",
              startsAt: null,
            },
          ])
        }
      >
        Add custom item
      </button>
    </div>
  );
}
