"use client";

import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/cards/ProgramCard";
import {
  BOARD_COURSES,
  BOARD_HERO,
  WEEKLY_WALL,
  boardCourseToProgramCard,
} from "./content";
import "./purple-board.css";

/**
 * #purpleboard — Figma all-pages-v6 node 17046:8403
 */
export function PurpleBoardPage({
  courses: coursesProp,
  weeklyWall,
}: {
  courses?: typeof BOARD_COURSES;
  weeklyWall?: readonly { title: string }[];
} = {}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const source =
    coursesProp && coursesProp.length > 0 ? coursesProp : BOARD_COURSES;
  const wall =
    weeklyWall && weeklyWall.length > 0 ? weeklyWall : WEEKLY_WALL;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, source]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / 5));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * 5, safePage * 5 + 5);

  return (
    <div className="wrapper-content pgs-purpleboard">
      <section className="pt-0 about-section half-section overlap-height position-relative minus-5 mobile-scholarship-cart mobile-ml-80">
        <div className="container overlap-gap-section p-0">
          <div className="row justify-content-center">
            <div className="w-611px">
              <div className="m-auto text-center mobile-text-start mobile-w-85">
                <h1 className="text-black fw-500 fs-75 fnt-family pt-0 mb-7 mobile-fs-30 mobile-lh-full mobile-mb-0 mobile-pb-2 mobile-w-full">
                  {BOARD_HERO.title}
                </h1>
                <p className="mb-0 lh-24 fs-17 text-black w-90 text-start m-auto mobile-m-0 mobile-fs-14 mobile-lh-20">
                  {BOARD_HERO.body}
                </p>
              </div>
              <div className="w-100 m-auto pgs-board-search">
                <div className="search-box flex-group-icon w-100">
                  <input
                    type="search"
                    className="from-control"
                    placeholder={BOARD_HERO.searchPlaceholder}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(0);
                    }}
                  />
                  <i className="bi bi-search" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 board-list-pgs half-section overlap-height position-relative">
        <div className="pgs-board-list w-100 m-auto overlap-gap-section p-0">
          {visible.length === 0 ? (
            <p className="text-muted text-center py-5 mb-0">
              No openings match that search.
            </p>
          ) : (
            visible.map((course) => (
              <ProgramCard
                key={course.id}
                data={boardCourseToProgramCard(course)}
              />
            ))
          )}
          <div className="arrows-section mt-2 mb-4">
            <div className="dummy-arrows">
              <button
                type="button"
                className="border-0 bg-transparent p-0"
                aria-label="Previous section"
                onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/down-arrow-scroll.png"
                  width={38}
                  style={{ rotate: "92deg" }}
                  alt=""
                />
              </button>
              <button
                type="button"
                className="border-0 bg-transparent p-0"
                aria-label="Next section"
                onClick={() => setPage((p) => (p + 1) % pageCount)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/down-arrow-scroll.png"
                  width={38}
                  style={{ rotate: "272deg" }}
                  alt=""
                />
              </button>
            </div>
            <p className="mb-0 mt-2 text-black fs-12 lh-19 text-center">
              Section {safePage + 1}
            </p>
          </div>
        </div>
      </section>

      <section
        id="weeklywall"
        style={{ scrollMarginTop: 140 }}
        className="pt-0 half-section overlap-height position-relative overflow-hidden mobile-weeklywall pgs-board-wall"
      >
        <div className="col-lg-11 m-auto overlap-gap-section p-0">
          <div className="row align-items-start justify-content-md-start">
            <h3 className="fnt-family text-black bg-light-greeen border-radius-10px d-inline-block fs-75">
              #weeklywall
            </h3>
            <div className="flex-wrap">
              {wall.map((post, i) => (
                <div className="box-style-3" key={`${post.title}-${i}`}>
                  <div className="mini-box">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/clip.png" alt="" />
                  </div>
                  <div className="box-border">
                    <div className="ht-150px">
                      <div className="pgs-board-wall-fill" />
                    </div>
                    <p className="w-90 text-black fs-16 lh-20 mt-3 mb-0 wall-title">
                      {post.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="pgs-board-cta w-70 m-auto">
            <div>
              <h5 className="mb-0 text-black fs-20 mobile-fs-16 mobile-pb-2">
                Simple, clear, useful
              </h5>
              <p className="text-blac lh-25 fs-17 w-40 mobile-w-full mobile-fs-14 mobile-lh-full">
                Using our experience, feedback from students who made it, and
                insights from thousands of real applications—we&apos;ve built an
                approach that puts you, the student, at the center ❤️
              </p>
            </div>
            <div className="row justify-content-end">
              <div className="col-lg-7 d-flex gap-5 align-items-center mobile-avatar-info">
                <div className="wiriter-info">
                  <h5 className="writter-name">Build your own lane</h5>
                  <p className="text-black text-center fs-15 lh-22">
                    Need to figure something out or have a question? Don&apos;t
                    hesitate, reach out to our Help Hub!
                  </p>
                </div>
                <div className="author-box-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/author.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
