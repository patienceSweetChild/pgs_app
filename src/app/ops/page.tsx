import Link from "next/link";
import { redirect } from "next/navigation";
import { loginPathForSurface, opsHref } from "@pgs/shared";
import { loadOperationsScoreboard } from "@/lib/operations/scoreboard-server";
import { ScoreboardPanels } from "@/features/operations/components/ScoreboardPanels";
import { getStaffPreviewContext } from "@/lib/operations/staff-preview-server";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";

export default async function OpsScoreboardPage() {
  const actor = await resolveActorContext();
  if (!actor.staff) redirect(loginPathForSurface("ops", opsHref("/ops")));
  if (!staffHasPermission(actor.staff, "overview.read")) {
    redirect(opsHref("/ops/students"));
  }
  const preview = await getStaffPreviewContext(actor.staff);
  const model = await loadOperationsScoreboard({
    mentorPreviewTargetId: preview?.mode === "mentor" ? preview.targetId : undefined,
  });

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Scoreboard</p>
          <h1>{model.title}</h1>
          <p className="pgs-ops__page-meta">{model.description}</p>
        </div>
        <div className="pgs-ops__header-actions">
          {model.operate.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <ScoreboardPanels metrics={model.metrics} />
      {model.activity.length ? (
        <section className="pgs-ops__detail-panel">
          <h2>Recent activity</h2>
          <ul className="pgs-ops__list">
            {model.activity.map((item) => (
              <li key={item.id} className="pgs-ops__list-row">
                <span>
                  {item.eventLabel}
                  {item.targetLabel ? ` · ${item.targetLabel}` : ""}
                </span>
                <small>{new Date(item.occurredAt).toLocaleString("en-GB")}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
