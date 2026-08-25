import type { Metadata } from "next";
import { DocumentsPage } from "@/features/documents/DocumentsPage";

export const metadata: Metadata = {
  title: "Upload Your Docs",
};

export default function Page() {
  return <DocumentsPage />;
}
