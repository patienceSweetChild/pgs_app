import type { Metadata } from "next";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { PATHWAY_BY_ID } from "@/features/pathway/content";

export const metadata: Metadata = {
  title: "AMC pathway",
};

export default function Page() {
  return <PathwayPage content={PATHWAY_BY_ID.amc} />;
}
