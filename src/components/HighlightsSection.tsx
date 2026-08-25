"use client";

import { useEffect, useRef } from "react";
import { useCmsShell } from "@/components/layout/cms-shell";
import "./highlights-carousel.css";

export const HIGHLIGHT_IMAGES = [
  "/assets/img/g-1.jpg",
  "/assets/img/g-3.jpg",
  "/assets/img/g-3.jpg",
  "/assets/img/g-3.jpg",
] as const;

type HighlightsSectionProps = {
  copy?: {
    title?: string;
    location?: string;
    body?: string;
  };
  images?: string[];
};

const DEFAULT_COPY = {
  title:
    "Students, in action —presenting their posters at an international medical conference.",
  location: "Washington, D.C.",
  body: "Our NETWORK students* had a great time presenting their posters at an international medical conference—meeting med students from the U.S. and future doctors from around the world. It was solid exposure, good conversations, yep—definitely a strong addition to their resume.",
};

/**
 * #higlights strip — matches standalone-html swiper layout
 * (copy column + multi-slide peek carousel with autoplay).
 */
export function HighlightsSection({ copy, images }: HighlightsSectionProps) {
  const { highlights } = useCmsShell();
  const first = highlights[0];
  const text = {
    ...DEFAULT_COPY,
    ...(first
      ? { title: first.title, body: first.body, location: "Highlights" }
      : null),
    ...copy,
  };
  const imgs =
    images && images.length > 0
      ? images
      : highlights.length > 0
        ? highlights.map((h) => h.image)
        : [...HIGHLIGHT_IMAGES];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = window.setInterval(() => {
      const slide = track.querySelector(
        ".pgs-highlights-slide",
      ) as HTMLElement | null;
      if (!slide) return;
      const step = slide.offsetWidth;
      const max = track.scrollWidth - track.clientWidth;
      const next = track.scrollLeft + step;
      track.scrollTo({
        left: next >= max - 4 ? 0 : next,
        behavior: "smooth",
      });
    }, 4000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="overlap-height position-relative mobile-higlights overflow-hidden">
      <div className="overlap-gap-section p-0">
        <div className="row justify-content-end p-0">
          <div className="col-lg-8 mobile-p-0">
            <div className="d-flex justify-content-end gap-3 border-radius-10px col-lg-12 col-md-10 position-relative md-mb-50px sm-mb-40px mobile-wrap">
              <div className="w-35 overflow-hidden border-radius-10px">
                <h3 className="mb-0 fnt-family text-black fs-38">#higlights</h3>
                <p className="mb-2 fw-400 lh-20 text-black fs-16">{text.title}</p>
                <h6 className="text-black fs-16">
                  <i className="bi bi-geo-alt-fill" /> {text.location}
                </h6>
                <p className="fs-14 text-black lh-18">{text.body}</p>
              </div>

              <div
                className="pgs-highlights-swiper magic-cursor slider-highlists"
                ref={trackRef}
              >
                <div className="pgs-highlights-track">
                  {imgs.map((src, i) => (
                    <div className="pgs-highlights-slide" key={`${src}-${i}`}>
                      <div className="overflow-hidden border-radius-10px">
                        <div className="full-photo h-600px border-radius-15px mb-5 p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
