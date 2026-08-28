import type { Metadata } from "next";
import { SignupPage } from "@/features/auth/SignupPage";

export const metadata: Metadata = {
  title: "Complete your profile",
};

export default function Page() {
  return <SignupPage />;
}
