import { HomePage } from "@/features/home/HomePage";
import { listPublishedFaqs } from "@/lib/catalog/cms-public";

export default async function Page() {
  const faqs = await listPublishedFaqs();
  return <HomePage faqs={faqs} />;
}
