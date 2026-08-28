import type { Metadata } from "next";
import { CourseDetailPage } from "@/features/programsfull/CourseDetailPage";
import { getCourseById } from "@/features/programsfull/content";
import { getLiveCourseById } from "@/lib/catalog/public";

export const metadata: Metadata = {
  title: "Program details",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Same API pattern as /purpleevents/session/[id] — live CMS row or mock fallback. */
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const detail = (await getLiveCourseById(id)) ?? getCourseById(id);
  return <CourseDetailPage courseId={id} detail={detail} />;
}
