import "server-only";

import {
  resolveActorContext,
  staffHasPermission,
} from "@/lib/auth/actor-context";
import {
  canViewOperationsScoreboard,
  resolveOperationsScoreboardScope,
} from "@/lib/operations/authorization";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ScoreboardMetric = {
  key: string;
  label: string;
  value: number;
  href?: string;
  description?: string;
};

async function countPremiumUnassigned(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): Promise<number> {
  const { data, error } = await supabase.rpc("ops_count_premium_unassigned");
  if (!error) return Number(data ?? 0);

  const [{ data: premiumRows }, { data: assignedRows }] = await Promise.all([
    supabase.from("premium_entitlements").select("student_id").eq("status", "active"),
    supabase.from("mentor_assignments").select("student_id").eq("status", "active"),
  ]);

  const assigned = new Set((assignedRows ?? []).map((row) => row.student_id));
  return (premiumRows ?? []).filter((row) => !assigned.has(row.student_id)).length;
}

export async function loadOperationsScoreboard(): Promise<ScoreboardMetric[]> {
  const actor = await resolveActorContext();
  if (!actor.staff || !canViewOperationsScoreboard(actor.staff)) {
    throw new Error("Forbidden");
  }

  const scope = resolveOperationsScoreboardScope(actor.staff);
  const supabase = await createSupabaseServerClient();

  if (scope === "restricted") {
    return [{ key: "restricted", label: "Access", value: 0 }];
  }

  if (scope === "assigned_students") {
    const { count } = await supabase
      .from("mentor_assignments")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", actor.userId!)
      .eq("status", "active");

    const { count: targetCount } = await supabase
      .from("staff_targets")
      .select("*", { count: "exact", head: true })
      .eq("staff_user_id", actor.userId!)
      .in("status", ["open", "in_progress"]);

    return [
      {
        key: "assigned",
        label: "My students",
        value: count ?? 0,
        href: "/ops/students",
      },
      {
        key: "targets",
        label: "Open targets",
        value: targetCount ?? 0,
        href: "/ops/work",
      },
    ];
  }

  const canReadStaff = staffHasPermission(actor.staff, "staff.read");

  const [
    { count: totalStudents },
    { count: premiumCount },
    unassignedCount,
    staffCount,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("premium_entitlements")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    countPremiumUnassigned(supabase),
    canReadStaff
      ? supabase
          .from("staff_profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")
          .then(({ count }) => count ?? 0)
      : Promise.resolve(0),
  ]);

  const metrics: ScoreboardMetric[] = [
    {
      key: "total",
      label: "Total students",
      value: totalStudents ?? 0,
      href: "/ops/students",
    },
    {
      key: "premium",
      label: "Premium active",
      value: premiumCount ?? 0,
      href: "/ops/students?plan=premium",
    },
    {
      key: "unassigned",
      label: "Premium unassigned",
      value: unassignedCount,
      href: "/ops/students?plan=premium&mentor=unassigned",
    },
  ];

  if (canReadStaff) {
    metrics.push({
      key: "staff",
      label: "Active staff",
      value: staffCount,
      href: "/ops/team",
    });
  }

  return metrics;
}
