"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CRM_STAGES,
  CRM_STAGE_LABELS,
  CRM_STREAMS,
  crmTargetYearOptions,
  derivedCrmGroups,
  type StudentCrmProfile,
  type StudentCrmTag,
} from "@/lib/operations/student-crm";

type Props = {
  profile: StudentCrmProfile;
  availableTags: StudentCrmTag[];
  canCreateTags: boolean;
};

export function StudentCrmIdentityPanel({
  profile,
  availableTags,
  canCreateTags,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const unusedTags = availableTags.filter(
    (tag) => !profile.tags.some((attached) => attached.id === tag.id),
  );
  const derived = derivedCrmGroups(profile);

  async function mutate(body: Record<string, unknown>, success: string) {
    setBusy(true);
    setError(false);
    setStatus("Saving…");
    const response = await fetch(`/api/staff/students/${profile.id}/crm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(true);
      setStatus(result.message ?? "Unable to save CRM details.");
      setBusy(false);
      return;
    }
    setStatus(success);
    setBusy(false);
    router.refresh();
  }

  return (
    <section className="pgs-ops__detail-panel" aria-labelledby="student-crm-heading">
      <h2 id="student-crm-heading">CRM identity</h2>

      <dl className="pgs-ops__facts">
        <div>
          <dt>PGS ID</dt>
          <dd>
            <code className="pgs-ops__code">{profile.pgsCode}</code>
          </dd>
        </div>
        <div>
          <dt>Study level</dt>
          <dd>{profile.studyLevel || "Not set"}</dd>
        </div>
        <div>
          <dt>Country</dt>
          <dd>{profile.preferredStudyCountry || "Not set"}</dd>
        </div>
        <div>
          <dt>Stream</dt>
          <dd>{profile.stream || "Not set"}</dd>
        </div>
        <div>
          <dt>Target year</dt>
          <dd>{profile.targetYear ?? "Not set"}</dd>
        </div>
        <div>
          <dt>Join date</dt>
          <dd>{profile.joinedAt}</dd>
        </div>
      </dl>

      <div className="pgs-ops__detail-subsection">
        <h3>Derived groups</h3>
        <ul className="pgs-ops__badge-list" aria-label="Derived CRM groups">
          {derived.map((group) => (
            <li key={group}>
              <span className="pgs-ops__badge">{group}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pgs-ops__detail-subsection">
        <h3>Manual tags</h3>
        {profile.tags.length ? (
          <ul className="pgs-ops__tag-list" aria-label="Manual student tags">
            {profile.tags.map((tag) => (
              <li key={tag.id} className="pgs-ops__tag-row">
                <span className="pgs-ops__badge">#{tag.name}</span>
                {profile.canMutate ? (
                  <button
                    className="pgs-ops__btn pgs-ops__btn--ghost"
                    disabled={busy}
                    onClick={() =>
                      mutate({ intent: "detach", tag_id: tag.id }, `${tag.name} removed.`)
                    }
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="pgs-ops__note">No manual tags attached.</p>
        )}
      </div>

      {profile.canMutate ? (
        <div className="pgs-ops__edit-block">
          <h3>Update CRM facts</h3>
          <form
            className="pgs-ops__form-toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void mutate(
                {
                  intent: "facts",
                  stream: String(form.get("stream") ?? ""),
                  target_year: String(form.get("target_year") ?? ""),
                  stage: String(form.get("stage") ?? ""),
                },
                "CRM facts saved.",
              );
            }}
          >
            <label>
              <span>Stream</span>
              <select defaultValue={profile.stream ?? ""} name="stream">
                <option value="">Not set</option>
                {CRM_STREAMS.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Target year</span>
              <select
                defaultValue={profile.targetYear ? String(profile.targetYear) : ""}
                name="target_year"
              >
                <option value="">Not set</option>
                {crmTargetYearOptions(undefined, profile.targetYear).map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>CRM stage</span>
              <select defaultValue={profile.stage} name="stage">
                {CRM_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {CRM_STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </label>
            <button className="pgs-ops__btn" disabled={busy} type="submit">
              Save
            </button>
          </form>
        </div>
      ) : null}

      {profile.canMutate && unusedTags.length ? (
        <div className="pgs-ops__edit-block">
          <h3>Attach tag</h3>
          <form
            className="pgs-ops__form-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const tagId = String(new FormData(event.currentTarget).get("tag_id") ?? "");
              if (tagId) void mutate({ intent: "attach", tag_id: tagId }, "Tag attached.");
            }}
          >
            <label>
              <span>Tag</span>
              <select name="tag_id" required>
                <option value="">Choose a tag</option>
                {unusedTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="pgs-ops__btn" disabled={busy} type="submit">
              Attach
            </button>
          </form>
        </div>
      ) : null}

      {canCreateTags ? (
        <div className="pgs-ops__edit-block">
          <h3>Create tag</h3>
          <form
            className="pgs-ops__form-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const name = String(new FormData(event.currentTarget).get("name") ?? "");
              if (name) void mutate({ intent: "create_tag", name }, `${name} created.`);
              event.currentTarget.reset();
            }}
          >
            <label>
              <span>Tag name</span>
              <input maxLength={40} minLength={2} name="name" placeholder="e.g. VIP" required type="text" />
            </label>
            <button className="pgs-ops__btn" disabled={busy} type="submit">
              Create
            </button>
          </form>
        </div>
      ) : null}

      {status ? (
        <p className={error ? "pgs-ops__alert" : "pgs-ops__status"} role="status">
          {status}
        </p>
      ) : null}
    </section>
  );
}
