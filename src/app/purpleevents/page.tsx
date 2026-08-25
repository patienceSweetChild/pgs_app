import type { Metadata } from "next";
import { PurpleEventsPage } from "@/features/purpleevents/PurpleEventsPage";
import { listLiveEvents } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "Purple Events",
};

export default async function Page() {
  const sessions = await listLiveEvents();
  return <PurpleEventsPage sessions={sessions} />;
}
