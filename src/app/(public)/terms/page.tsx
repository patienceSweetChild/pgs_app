import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";
import { getLegalDocument } from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default async function Page() {
  const doc = await getLegalDocument("terms");
  return (
    <LegalDocumentPage
      fallbackTitle="Terms & Conditions"
      title={doc?.title}
      body={doc?.body}
    />
  );
}
