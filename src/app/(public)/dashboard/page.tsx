import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { requireStudentViewer } from "@/lib/auth/student-access";
import { listFeedUpcomingEvents } from "@/lib/catalog/public";
import { resolveActorContext } from "@/lib/auth/actor-context";
import {
  loadDashboardPreviewIdentity,
  loadPublishedDashboardContent,
} from "@/lib/dashboard-content-server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const studentId =
    typeof params.studentId === "string" ? params.studentId : undefined;

  if (studentId) {
    try {
      await requireStudentViewer(studentId, "read");
    } catch {
      redirect("/ops/students");
    }
  }

  const actor = await resolveActorContext();
  const contentStudentId = studentId ?? actor.userId ?? null;

  const [upcomingEvents, content, previewIdentity] = await Promise.all([
    listFeedUpcomingEvents(),
    contentStudentId
      ? loadPublishedDashboardContent(contentStudentId).catch(() => null)
      : Promise.resolve(null),
    studentId
      ? loadDashboardPreviewIdentity(studentId).catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <DashboardPage
      upcomingEvents={upcomingEvents}
      staffStudentId={studentId}
      content={content}
      previewIdentity={previewIdentity ?? undefined}
      forceUnlocked={Boolean(studentId) || actor.isPremium}
    />
  );
}
