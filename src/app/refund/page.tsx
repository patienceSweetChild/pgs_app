import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/LegalDocumentPage";
import { getLegalDocument } from "@/lib/catalog/cms-public";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default async function Page() {
  const doc = await getLegalDocument("refund");
  return (
    <LegalDocumentPage
      fallbackTitle="Refund Policy"
      title={doc?.title}
      body={doc?.body}
    />
  );
}
