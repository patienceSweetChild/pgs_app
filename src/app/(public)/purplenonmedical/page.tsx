import type { Metadata } from "next";
import { PurpleNonMedicalPage } from "@/features/purplenonmedical/PurpleNonMedicalPage";

export const metadata: Metadata = {
  title: "Purple Premium — Non-Medical",
};

export default function Page() {
  return <PurpleNonMedicalPage />;
}
