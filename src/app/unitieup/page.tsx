import type { Metadata } from "next";
import { UnitieupPage } from "@/features/unitieup/UnitieupPage";

export const metadata: Metadata = {
  title: "University partnerships",
};

export default function Page() {
  return <UnitieupPage />;
}
