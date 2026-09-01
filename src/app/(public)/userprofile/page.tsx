import { UserProfilePage } from "@/features/userprofile/UserProfilePage";
import { resolveActorContext } from "@/lib/auth/actor-context";
import { loadPublishedDashboardContent } from "@/lib/dashboard-content-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
};

export default async function Page() {
  const actor = await resolveActorContext();
  const content = actor.userId
    ? await loadPublishedDashboardContent(actor.userId).catch(() => null)
    : null;

  return (
    <UserProfilePage
      pathwayLabel={content?.pathway_label}
      premiumLabel={content?.premium_label}
    />
  );
}
