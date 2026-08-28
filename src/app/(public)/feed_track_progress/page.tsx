import type { Metadata } from "next";
import { ProgressPage } from "@/features/progress/ProgressPage";

export const metadata: Metadata = {
  title: "Track Progress",
};

export default function Page() {
  return <ProgressPage />;
}
