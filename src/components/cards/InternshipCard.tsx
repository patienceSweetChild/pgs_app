"use client";

import { HeartToggle } from "./HeartToggle";
import { PillTags } from "./PillTags";
import type { InternshipCardData } from "./types";

type InternshipCardProps = {
  data: InternshipCardData;
  onToggleSave?: (saved: boolean) => void;
};

export function InternshipCard({ data, onToggleSave }: InternshipCardProps) {
  return (
    <div className="pgs-cards pgs-internship-card">
      <div className="county-box-short">
        <div className="img-box-fit position-relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt={data.title} />
          {data.overlayBadge ? (
            <div className="tag-flot-usa">{data.overlayBadge}</div>
          ) : null}
        </div>
        <div className="mobile-pb-23 pgs-internship-body">
          <div className="fs-17 fw-600 mb-1 text-black">{data.title}</div>
          <div className="fs-14 lh-full mb-2 text-black">{data.description}</div>
          <PillTags
            tags={data.tags}
            className="pgs-internship-tags mb-2"
            tagClassName="pgs-internship-tag"
          />
          <div className="d-flex align-items-center justify-content-between gap-2">
            {data.batchLabel ? (
              <div className="d-flex align-items-center gap-2">
                <i
                  className="bi bi-check-circle-fill"
                  style={{ fontSize: 22, color: "forestgreen" }}
                  aria-hidden
                />
                <h5 className="fnt-family fs-18 mb-0 text-success text-uppercase">
                  {data.batchLabel}
                </h5>
              </div>
            ) : (
              <span />
            )}
            <HeartToggle
              initialSaved={data.saved ?? true}
              onToggle={onToggleSave}
              className="pgs-internship-heart"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
