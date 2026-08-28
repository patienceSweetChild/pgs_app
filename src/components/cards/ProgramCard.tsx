"use client";

import Link from "next/link";
import { CmsHtml, looksLikeHtml } from "@/components/CmsHtml";
import { badgeChipStyle } from "@/components/cards/badge-chip-style";
import { HeartToggle } from "./HeartToggle";
import { PillTags } from "./PillTags";
import type { ProgramCardData } from "./types";
import "./cards.css";

const DEFAULT_BADGE_ICON = "/assets/img/purpleboard/fire.gif";
const DEFAULT_DOWNLOAD = "/assets/img/download.png";
const DEFAULT_DATES_RAIL = "Dates You Should Be Aware off.";

type ProgramCardProps = {
  data: ProgramCardData;
  onToggleSave?: (saved: boolean) => void;
};

function DetailValue({ value }: { value: string }) {
  if (looksLikeHtml(value)) {
    return <CmsHtml as="span" html={value} preWrap={false} />;
  }
  const valueLines = value.split("\n").filter(Boolean);
  return (
    <>
      {valueLines.map((line, i) => (
        <span key={`${line}-${i}`}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

export function ProgramCard({ data, onToggleSave }: ProgramCardProps) {
  const isCompact = data.variant === "compact";
  const showFullRail = !isCompact;

  return (
    <div className={`pgs-cards${data.closed ? " closed-status" : ""}`}>
      <article className={`cardbox${isCompact ? " cardbox--compact" : ""}`}>
        <div className="cardbox-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pgs-board-campus" src={data.image} alt="" />
          {data.badge ? (
            <div
              className="cardbox-tag"
              style={badgeChipStyle(data.badgeColor, data.badgeTextColor)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.badgeIcon ?? DEFAULT_BADGE_ICON} alt="" />
              {data.badge}
            </div>
          ) : null}
          {data.logo ? (
            <div className="cardbox-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.logo} alt={data.logoAlt ?? ""} />
            </div>
          ) : null}
        </div>

        <div className="cardbox-middle">
          <h3>{data.title}</h3>
          {data.details.map((detail, index) => {
            if (detail.label === "About") {
              return (
                <div className="cardbox-highlight" key={`${detail.label}-${index}`}>
                  <span className="cardbox-highlight-label">{detail.label}:</span>
                  <br />
                  <span className="cardbox-highlight-value">
                    <DetailValue value={detail.value} />
                  </span>
                </div>
              );
            }
            return (
              <div className="cardbox-detail-stack" key={`${detail.label}-${index}`}>
                <div className="cardbox-detail-label">{detail.label}</div>
                <div className="cardbox-detail-value">
                  <DetailValue value={detail.value} />
                </div>
              </div>
            );
          })}
          <PillTags tags={data.tags} />
        </div>

        <div className="cardbox-right">
          {showFullRail ? (
            <div className="pgs-dates-rail">
              <span>{data.datesRail ?? DEFAULT_DATES_RAIL}</span>
            </div>
          ) : null}

          <HeartToggle
            saved={data.saved}
            initialSaved={data.saved}
            onToggle={onToggleSave}
          />

          {showFullRail && data.deadline ? (
            <div className="pgs-board-deadline">
              <div className="pgs-deadline">
                <p className="pgs-deadline-caption">
                  {data.deadline.caption ?? "Deadline In"}
                </p>
                <div className="pgs-deadline-strip">
                  <span className="pgs-deadline-num">{data.deadline.days}</span>
                  <span className="pgs-deadline-unit">days</span>
                </div>
              </div>
              <p className="pgs-deadline-date mb-0">{data.deadline.date}</p>
            </div>
          ) : null}

          {showFullRail && data.promo ? (
            <div className="pgs-board-deadline">
              <div className="pgs-deadline">
                <p className="pgs-deadline-caption pgs-deadline-caption--stacked">
                  {data.promo.title.split("\n").map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </p>
                <div className="pgs-deadline-strip pgs-deadline-strip--text">
                  {data.promo.subtitle.split("\n").map((line, i) => (
                    <span
                      key={`${line}-${i}`}
                      className={
                        i === 0 ? "pgs-deadline-num" : "pgs-deadline-unit"
                      }
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              {data.promo.date ? (
                <p className="pgs-deadline-date mb-0">{data.promo.date}</p>
              ) : null}
            </div>
          ) : null}

          <div
            className={`pgs-board-qr-col${isCompact ? " pgs-board-qr-col--compact" : ""}`}
          >
            {showFullRail && data.qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="pgs-board-qr" src={data.qrSrc} alt="" />
            ) : null}
            <Link href={data.href} className="cardbox-learn-btn">
              {data.ctaLabel || "Learn More"}
            </Link>
          </div>

          {showFullRail && data.showDownload ? (
            <button type="button" className="cardbox-download" aria-label="Download">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.downloadIcon ?? DEFAULT_DOWNLOAD} alt="" />
            </button>
          ) : null}
        </div>
      </article>

      {data.closed ? (
        <div className="closed-box-status">
          <div className="closed-box">{data.closed}</div>
        </div>
      ) : null}
    </div>
  );
}
