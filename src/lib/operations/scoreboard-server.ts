import { opsHref } from "@pgs/shared";
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
import { loadOperationsActivity } from "@/lib/operations/activity-server";
import type { OperationsActivityItem } from "@/lib/operations/activity";

export type ScoreboardMetric = {
  key: string;
  label: string;
  value: number;
  href?: string;
  description?: string;
  attention?: boolean;
};

export type OperationsScoreboardModel = {
  scope: "organization" | "assigned_students" | "restricted";
  title: string;
  description: string;
  metrics: ScoreboardMetric[];
  activity: OperationsActivityItem[];
  operate: Array<{ href: string; label: string }>;
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

export async function loadOperationsScoreboard(options?: {
  mentorPreviewTargetId?: string;
}): Promise<OperationsScoreboardModel> {
  const actor = await resolveActorContext();
  if (!actor.staff || !canViewOperationsScoreboard(actor.staff)) {
    throw new Error("Forbidden");
  }

  const mentorId = options?.mentorPreviewTargetId ?? actor.userId!;
  const scope = options?.mentorPreviewTargetId
    ? "assigned_students"
    : resolveOperationsScoreboardScope(actor.staff);
  const supabase = await createSupabaseServerClient();

  if (scope === "restricted") {
    return {
      scope,
      title: "Restricted view",
      description: "Your current role does not include operational metrics.",
      metrics: [{ key: "restricted", label: "Access", value: 0 }],
      activity: [],
      operate: [],
    };
  }

  if (scope === "assigned_students") {
    const { count } = await supabase
      .from("mentor_assignments")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", mentorId)
      .eq("status", "active");

    const { count: targetCount } = await supabase
      .from("staff_targets")
      .select("*", { count: "exact", head: true })
      .eq("staff_user_id", mentorId)
      .in("status", ["open", "in_progress", "pending"]);

    return {
      scope,
      title: "My caseload",
      description: "Metrics for students currently assigned to you.",
      metrics: [
        { key: "assigned", label: "My students", value: count ?? 0, href: opsHref("/ops/students") },
        { key: "targets", label: "Open targets", value: targetCount ?? 0, href: opsHref("/ops/work") },
      ],
      activity: [],
      operate: [
        { href: opsHref("/ops/students"), label: "Open my students" },
        { href: opsHref("/ops/work"), label: "Open my work" },
      ],
    };
  }

  const canReadStaff = staffHasPermission(actor.staff, "staff.read");
  const canReadAudit = staffHasPermission(actor.staff, "audit.read");

  const [
    { count: totalStudents },
    { count: premiumCount },
    unassignedCount,
    staffCount,
    activity,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("premium_entitlements").select("*", { count: "exact", head: true }).eq("status", "active"),
    countPremiumUnassigned(supabase),
    canReadStaff
      ? supabase
          .from("staff_profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")
          .then(({ count }) => count ?? 0)
      : Promise.resolve(0),
    canReadAudit ? loadOperationsActivity(null, 8).catch(() => []) : Promise.resolve([]),
  ]);

  const metrics: ScoreboardMetric[] = [
    { key: "total", label: "Total students", value: totalStudents ?? 0, href: opsHref("/ops/students") },
    {
      key: "premium",
      label: "Premium active",
      value: premiumCount ?? 0,
      href: `${opsHref("/ops/students")}?plan=premium`,
    },
    {
      key: "unassigned",
      label: "Premium unassigned",
      value: unassignedCount,
      href: `${opsHref("/ops/students")}?plan=premium&mentor=unassigned`,
      attention: unassignedCount > 0,
      description: "Premium students waiting for a mentor",
    },
  ];
  if (canReadStaff) {
    metrics.push({ key: "staff", label: "Active staff", value: staffCount, href: opsHref("/ops/team") });
  }

  return {
    scope,
    title: "Organization scoreboard",
    description: "Role-scoped operational metrics for the authorized student registry.",
    metrics,
    activity,
    operate: [
      { href: opsHref("/ops/students"), label: "Student registry" },
      {
        href: `${opsHref("/ops/students")}?plan=premium&mentor=unassigned`,
        label: "Assign Premium students",
      },
      { href: opsHref("/ops/work"), label: "Staff targets" },
    ],
  };
}
