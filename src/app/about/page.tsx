import type { Metadata } from "next";
import { AboutPage } from "@/features/about/AboutPage";
import {
  listContentPeople,
  listPublishedFaqs,
} from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "About",
};

export default async function Page() {
  const [founders, advisory, faqs] = await Promise.all([
    listContentPeople("founder"),
    listContentPeople("advisory"),
    listPublishedFaqs(),
  ]);
  return (
    <AboutPage
      founder={founders[0] ?? null}
      advisory={advisory}
      faqs={faqs}
    />
  );
}
