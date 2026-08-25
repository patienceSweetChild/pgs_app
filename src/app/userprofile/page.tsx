import type { Metadata } from "next";
import { UserProfilePage } from "@/features/userprofile/UserProfilePage";

export const metadata: Metadata = {
  title: "User Profile",
};

export default function Page() {
  return <UserProfilePage />;
}
