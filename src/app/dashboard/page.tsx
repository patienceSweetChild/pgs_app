import type { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { listFeedUpcomingEvents } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const upcomingEvents = await listFeedUpcomingEvents();
  return <DashboardPage upcomingEvents={upcomingEvents} />;
}
