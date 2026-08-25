import type { Metadata } from "next";
import { CvReadyProgramPage } from "@/features/cvreadyprogram/CvReadyProgramPage";
import { listLivePrograms } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "CV Ready Program",
};

export default async function Page() {
  const cards = await listLivePrograms();
  const programs = cards.map((c) => ({
    title: c.title,
    tags: c.tags,
  }));
  return <CvReadyProgramPage programs={programs} />;
}
