import Link from "next/link";
import type { ScoreboardMetric } from "@/lib/operations/scoreboard-server";

export function ScoreboardPanels({ metrics }: { metrics: ScoreboardMetric[] }) {
  return (
    <div className="pgs-ops__grid">
      {metrics.map((metric) => (
        <div className="pgs-ops__card" key={metric.key}>
          <p>{metric.label}</p>
          {metric.href ? (
            <Link href={metric.href}>
              <h3>{metric.value}</h3>
            </Link>
          ) : (
            <h3>{metric.value}</h3>
          )}
          {metric.description ? (
            <p className="pgs-ops__note" style={{ marginTop: "0.35rem" }}>
              {metric.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
