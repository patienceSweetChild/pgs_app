import type { Metadata } from "next";
import { StudentResourcesPage } from "@/features/studentresources/StudentResourcesPage";
import {
  factsToSlides,
  groupKeyDates,
  listKeyDates,
  listPgsStats,
  listPublishedFaqs,
  listStudyAbroadFacts,
  listUrgentDeadlines,
  splitDeadlineColumns,
  statsToBlocks,
} from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "Student Resources",
};

export default async function Page() {
  const [keyDates, deadlines, stats, facts, faqs] = await Promise.all([
    listKeyDates(),
    listUrgentDeadlines(),
    listPgsStats(),
    listStudyAbroadFacts(),
    listPublishedFaqs(),
  ]);

  const deadlineCols = splitDeadlineColumns(deadlines);

  return (
    <StudentResourcesPage
      keyDateGroups={groupKeyDates(keyDates)}
      deadlineLeft={deadlineCols.left}
      deadlineRight={deadlineCols.right}
      statsBlocks={statsToBlocks(stats)}
      factSlides={factsToSlides(facts)}
      faqs={faqs}
    />
  );
}
