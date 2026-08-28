import type { Metadata } from "next";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { getMedicalPathwayContent } from "@/features/pathway/page-content";

export const metadata: Metadata = {
  title: "USMLE pathway",
};

export default function Page() {
  const content = getMedicalPathwayContent("usmle")!;
  return <PathwayPage content={content} />;
}
