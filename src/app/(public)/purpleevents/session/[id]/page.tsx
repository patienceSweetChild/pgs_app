import type { Metadata } from "next";
import { EventSessionPage } from "@/features/purpleevents/PurpleEventsPage";
import { getLiveEventById, listLiveEvents } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "Event Session",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [detail, sessions] = await Promise.all([
    getLiveEventById(id),
    listLiveEvents(),
  ]);
  return (
    <EventSessionPage sessionId={id} detail={detail} sessions={sessions} />
  );
}
