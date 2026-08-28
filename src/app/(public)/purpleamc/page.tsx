import type { Metadata } from "next";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { getMedicalPathwayContent } from "@/features/pathway/page-content";

export const metadata: Metadata = {
  title: "AMC pathway",
};

export default function Page() {
  return <PathwayPage content={getMedicalPathwayContent("amc")!} />;
}
