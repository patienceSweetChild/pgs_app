import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { requireStudentViewer } from "@/lib/auth/student-access";
import { listFeedUpcomingEvents } from "@/lib/catalog/public";

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

  const upcomingEvents = await listFeedUpcomingEvents();
  return <DashboardPage upcomingEvents={upcomingEvents} staffStudentId={studentId} />;
}
