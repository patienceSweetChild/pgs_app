import type { Metadata } from "next";
import { UsmleRotationPage } from "@/features/usmlerotation/UsmleRotationPage";

export const metadata: Metadata = {
  title: "USMLE Clinical Rotation",
};

export default function Page() {
  return <UsmleRotationPage />;
}
