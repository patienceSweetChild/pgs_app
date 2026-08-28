import type { Metadata } from "next";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { getMedicalPathwayContent } from "@/features/pathway/page-content";

export const metadata: Metadata = {
  title: "PLAB pathway",
};

export default function Page() {
  return <PathwayPage content={getMedicalPathwayContent("plab")!} />;
}
