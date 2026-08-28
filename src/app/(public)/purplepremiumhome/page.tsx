import type { Metadata } from "next";
import { PurplePremiumHomePage } from "@/features/purplepremium/PurplePremiumHomePage";
import { getPublishedPremiumContent } from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "Purple Premium",
};

export default async function Page() {
  const [video, meetup] = await Promise.all([
    getPublishedPremiumContent("video"),
    getPublishedPremiumContent("meetup"),
  ]);
  return (
    <PurplePremiumHomePage
      videoContent={video}
      meetupContent={meetup}
    />
  );
}
