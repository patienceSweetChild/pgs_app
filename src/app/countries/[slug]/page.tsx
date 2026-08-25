import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryPage } from "@/features/countries/CountryPage";
import {
  COUNTRY_SLUGS,
  getCountryContent,
  isCountrySlug,
} from "@/features/countries/content";

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
  const content = getCountryContent(slug);
  return {
    title: content ? `Study in ${content.name}` : "Country",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!isCountrySlug(slug)) notFound();
  const content = getCountryContent(slug);
  if (!content) notFound();
  return <CountryPage content={content} />;
}
