import type { Metadata } from "next";
import { PurpleBoardPage } from "@/features/purpleboard/PurpleBoardPage";
import { listLiveCourses } from "@/lib/catalog/public";
import { listWeeklyWall } from "@/lib/catalog/cms-public";
import type { BoardCourse } from "@/features/purpleboard/content";

export const metadata: Metadata = {
  title: "Purple Board",
};

export default async function Page() {
  const [cards, wall] = await Promise.all([
    listLiveCourses(),
    listWeeklyWall(),
  ]);
  const courses: BoardCourse[] = cards.map((c) => ({
    id: c.id,
    title: c.title,
    duration: c.details.find((d) => d.label === "Duration")?.value || "—",
    perkTitle: "Mode",
    perkDetail: c.details.find((d) => d.label === "Mode")?.value || "—",
    tags: c.tags.length ? c.tags : ["#Course"],
    badge: "Open",
    deadlineDays: "--",
    deadlineDate: "",
    href: c.href,
  }));
  return (
    <PurpleBoardPage
      courses={courses}
      weeklyWall={wall.map((w) => ({ title: w.title }))}
    />
  );
}
