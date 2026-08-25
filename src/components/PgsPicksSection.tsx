"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PICKS = [
  {
    image: "/assets/img/doctor-2.jpg",
    href: "/purplepremiumhome",
    title: "For Clinical Rotation Click Here",
    subtitle: "Reach out to us.",
  },
  {
    image: "/assets/img/doctor-2.jpg",
    href: "/purplepremiumhome",
    title: "For Clinical Rotation Click Here",
    subtitle: "Reach out to us.",
  },
  {
    image: "/assets/img/doctor-2.jpg",
    href: "/usmlerotation",
    title: "For Clinical Rotation Click Here",
    subtitle: "Reach out to us.",
  },
] as const;

/** #Pgs picks strip from pathway / unitieup HTML. */
export function PgsPicksSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PICKS.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  function prev() {
    setIndex((i) => (i - 1 + PICKS.length) % PICKS.length);
  }
  function next() {
    setIndex((i) => (i + 1) % PICKS.length);
  }

  const visible = [PICKS[index], PICKS[(index + 1) % PICKS.length]];

  return (
    <section className="overflow-hidden p-0 mb-5 mobile-slider-pgs">
      <div>
        <h3 className="alt-font fw-700 ls-minus-1px text-dark-bab mb-0 mx-auto desktop-none">
          #Pgs picks
        </h3>
        <div className="row align-items-center justify-content-center">
          <div className="w-20 position-relative text-center text-xl-start lg-mb-15px">
            <div className="d-flex align-items-center">
              <h3 className="alt-font fw-700 ls-minus-1px text-dark-bab mb-0 mx-auto mobile-none">
                #Pgs picks
              </h3>
              <div className="d-flex justify-content-center justify-content-xl-start flex-column gap-3">
                <button
                  type="button"
                  className="slider-one-slide-prev-1 text-dark-gray swiper-button-prev slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                  aria-label="Previous slide"
                  onClick={prev}
                >
                  <i className="fa-solid fa-arrow-left" />
                </button>
                <button
                  type="button"
                  className="slider-one-slide-next-1 text-dark-gray swiper-button-next slider-navigation-style-04 border border-1 border-color-extra-medium-gray"
                  aria-label="Next slide"
                  onClick={next}
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-7 overflow-hidden">
            <div className="outside-box-right-15 xl-outside-box-right-20 sm-outside-box-right-0">
              <div className="d-flex gap-4 pt-30px pb-30px flex-wrap">
                {visible.map((pick, i) => (
                  <div
                    className="review-style-06 flex-grow-1"
                    key={`${pick.href}-${index}-${i}`}
                    style={{ minWidth: 280, maxWidth: 420 }}
                  >
                    <div className="d-flex justify-content-center h-100 flex-column bg-white box-shadow-medium p-20px md-p-35px border-radius-6px last-paragraph-no-margin">
                      <div className="mb-20px d-flex align-items-center gap-3">
                        <div className="avatar-box-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pick.image} alt="" />
                        </div>
                        <div className="d-inline-block align-middle p-paragrph last-paragraph-no-margin">
                          <Link
                            href={pick.href}
                            className="alt-font text-dark-gray fw-600 fs-18 bg-dark text-decoration-none"
                          >
                            {pick.title}
                          </Link>
                          <p className="lh-24 d-block">{pick.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
