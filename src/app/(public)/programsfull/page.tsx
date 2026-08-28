import type { Metadata } from "next";
import { ProgramsfullListingPage } from "@/features/programsfull/ProgramsfullListingPage";
import { listLiveCourses } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "Courses That Actually Count",
};

/**
 * OG `/Programsfull` listing — parallel to `/purpleevents`.
 * Shows published + live CMS courses only (no mock filler).
 */
export default async function Page() {
  const courses = await listLiveCourses();
  return <ProgramsfullListingPage courses={courses} />;
}
