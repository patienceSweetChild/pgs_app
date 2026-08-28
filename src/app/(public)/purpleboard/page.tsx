import type { Metadata } from "next";
import { PurpleBoardPage } from "@/features/purpleboard/PurpleBoardPage";
import { listPurpleboardCards } from "@/lib/catalog/public";
import { listWeeklyWall } from "@/lib/catalog/cms-public";
import { listSavedCardIdsForCurrentUser } from "@/features/saved/save-actions";

export const metadata: Metadata = {
  title: "Purple Board",
};

export default async function Page() {
  const savedIds = await listSavedCardIdsForCurrentUser();
  const savedSet = new Set(savedIds);
  const [cards, wall] = await Promise.all([
    listPurpleboardCards(savedSet),
    listWeeklyWall(),
  ]);
  return (
    <PurpleBoardPage
      courses={cards}
      weeklyWall={wall.map((w) => ({ title: w.title }))}
      initialSavedIds={savedIds}
    />
  );
}
