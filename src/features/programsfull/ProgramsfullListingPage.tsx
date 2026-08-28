"use client";

import { ProgramCard } from "@/components/cards/ProgramCard";
import type { ProgramCardData } from "@/components/cards/types";
import "@/components/cards/cards.css";
import "./programsfull.css";

const HERO = {
  title: "Courses That Actually Count",
  body: "Short-term courses, internships, clinical visits, and more — each with its own standalone program page. Click Learn More on any card.",
} as const;

/** Public courses catalog — cards link to /programsfull/program/[id]. */
export function ProgramsfullListingPage({
  courses,
}: {
  courses: ProgramCardData[];
}) {
  return (
    <div className="wrapper-content pgs-programsfull pgs-programsfull--listing">
      <section className="pt-0 about-section half-section overlap-height position-relative minus-5">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="w-90 m-auto text-center mobile-text-start">
                <h1 className="text-black fw-500 fs-50 lh-full fnt-family pt-0 mb-3">
                  {HERO.title}
                </h1>
                <p className="mb-10 lh-24 text-black fs-19 fw-400 text-start">
                  {HERO.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {courses.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">
                  No published courses yet. In Admin → Courses, open the course,
                  set preview to <strong>Publish</strong> (or check Published),
                  save, then refresh this page.
                </p>
              ) : (
                <div className="d-flex flex-column gap-4 align-items-stretch">
                  {courses.map((course) => (
                    <ProgramCard key={course.id} data={course} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
