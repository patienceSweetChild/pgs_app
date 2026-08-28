import type { Metadata } from "next";
import { ScholarshipPage } from "@/features/scholarship/ScholarshipPage";

export const metadata: Metadata = {
  title: "Scholarship",
};

export default function Page() {
  return <ScholarshipPage />;
}
