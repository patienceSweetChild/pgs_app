import type { Metadata } from "next";
import { ResetPasswordPage } from "@/features/auth/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function Page() {
  return <ResetPasswordPage />;
}
