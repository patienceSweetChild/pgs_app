import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";
import { getLegalDocument } from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function Page() {
  const doc = await getLegalDocument("privacy");
  return (
    <LegalDocumentPage
      fallbackTitle="Privacy Policy"
      title={doc?.title}
      body={doc?.body}
    />
  );
}
