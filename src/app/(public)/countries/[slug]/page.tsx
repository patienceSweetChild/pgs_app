import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryPage } from "@/features/countries/CountryPage";
import {
  COUNTRY_SLUGS,
  getCountryContent,
  isCountrySlug,
} from "@/features/countries/content";
import { getPublishedCountryBySlug } from "@/lib/catalog/cms-public";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COUNTRY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fromDb = await getPublishedCountryBySlug(slug);
  const content = fromDb ?? getCountryContent(slug);
  return {
    title: content ? `Study in ${content.name}` : "Country",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!isCountrySlug(slug)) notFound();
  const fromDb = await getPublishedCountryBySlug(slug);
  const content = fromDb ?? getCountryContent(slug);
  if (!content) notFound();
  return <CountryPage content={content} />;
}
