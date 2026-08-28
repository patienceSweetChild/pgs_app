import type { Metadata } from "next";
import { ChangePasswordPage } from "@/features/auth/ChangePasswordPage";

export const metadata: Metadata = {
  title: "Change password",
};

export default function Page() {
  return <ChangePasswordPage />;
}
