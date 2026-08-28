import Link from "next/link";
import { loadOperationsScoreboard } from "@/lib/operations/scoreboard-server";
import { ScoreboardPanels } from "@/features/operations/components/ScoreboardPanels";

export default async function OpsScoreboardPage() {
  const metrics = await loadOperationsScoreboard();

  return (
    <div className="pgs-ops__detail-page">
      <div className="pgs-ops__page-header">
        <div>
          <p className="pgs-ops__eyebrow">Operations</p>
          <h1>Scoreboard</h1>
          <p className="pgs-ops__page-meta">
            Role-scoped operational metrics for your caseload and organization.
          </p>
        </div>
        <Link href="/ops/students">Open student registry →</Link>
      </div>
      <ScoreboardPanels metrics={metrics} />
    </div>
  );
}
