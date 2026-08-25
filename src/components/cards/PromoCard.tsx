"use client";

import Link from "next/link";
import { HeartToggle } from "./HeartToggle";
import { PillTags } from "./PillTags";
import type { PromoCardData } from "./types";

type PromoCardProps = {
  data: PromoCardData;
  onToggleSave?: (saved: boolean) => void;
};

export function PromoCard({ data, onToggleSave }: PromoCardProps) {
  return (
    <div className="pgs-cards pgs-promo-card">
      <div className="sop-card-unique">
        <div className="sop-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt={data.title} />
          {data.seatBadge ? (
            <div className="sop-top-label">
              {data.seatBadgeIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.seatBadgeIcon} alt="" />
              ) : null}
              {data.seatBadge}
            </div>
          ) : null}
          {data.overlayBadge ? (
            <div className="sop-start-free">{data.overlayBadge}</div>
          ) : null}
          <div className="sop-heart-icon pgs-promo-heart">
            <HeartToggle
              initialSaved={data.saved}
              onToggle={onToggleSave}
              className="pgs-promo-heart-btn"
            />
          </div>
        </div>

        <div className="sop-content">
          <div className="sop-title">{data.title}</div>
          {data.description ? (
            <div className="sop-subtext">{data.description}</div>
          ) : null}
          <PillTags
            tags={data.tags}
            extraCount={data.extraTagCount}
            className="sop-tags"
            tagClassName="sop-tag"
          />
          <div className="d-flex justify-content-space align-items-center gap-2">
            <Link
              href={data.href}
              className="sop-learn-btn text-decoration-none d-inline-flex align-items-center justify-content-center"
            >
              Learn More
            </Link>
            {data.closesOn ? (
              <div className="sop-close-date">{data.closesOn}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
