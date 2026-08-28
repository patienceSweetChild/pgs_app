import type { Metadata } from "next";
import { CvReadyProgramPage } from "@/features/cvreadyprogram/CvReadyProgramPage";
import {
  listCvReadyFeatured,
  listCvReadyPrograms,
} from "@/lib/catalog/public";
import { listSavedCardIdsForCurrentUser } from "@/features/saved/save-actions";

export const metadata: Metadata = {
  title: "CV Ready Program",
};

export default async function Page() {
  const savedIds = await listSavedCardIdsForCurrentUser();
  const savedSet = new Set(savedIds);
  const [featured, programs] = await Promise.all([
    listCvReadyFeatured(savedSet),
    listCvReadyPrograms(savedSet),
  ]);
  return (
    <CvReadyProgramPage
      featured={featured}
      programs={programs}
      initialSavedIds={savedIds}
    />
  );
}
