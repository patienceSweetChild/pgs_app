import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PathwayPage } from "@/features/pathway/PathwayPage";
import { PurpleNonMedicalPage } from "@/features/purplenonmedical/PurpleNonMedicalPage";
import {
  getPathwayContent,
  isPathwaySlug,
  PATHWAY_SLUGS,
  type PathwayPageContent,
} from "@/features/pathway/page-content";
import { getPublishedPathwayBySlug } from "@/lib/catalog/cms-public";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PATHWAY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPathwaySlug(slug)) return { title: "Pathway" };
  const published = await getPublishedPathwayBySlug(slug);
  const name = published?.name ?? slug.toUpperCase();
  return { title: `${name} pathway` };
}

function resolveContent(
  slug: string,
  published: Awaited<ReturnType<typeof getPublishedPathwayBySlug>>,
): PathwayPageContent | null {
  if (published?.page_content) return published.page_content;
  if (isPathwaySlug(slug)) return getPathwayContent(slug);
  return null;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!isPathwaySlug(slug)) notFound();

  const published = await getPublishedPathwayBySlug(slug);
  const content = resolveContent(slug, published);
  if (!content) notFound();

  const template = published?.template ?? (slug === "stem" || slug === "mba" ? "nonmedical" : "medical");

  if (template === "nonmedical") {
    return <PurpleNonMedicalPage content={content as Parameters<typeof PurpleNonMedicalPage>[0]["content"]} />;
  }

  return <PathwayPage content={content as Parameters<typeof PathwayPage>[0]["content"]} />;
}
