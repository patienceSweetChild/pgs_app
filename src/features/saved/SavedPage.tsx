"use client";

import { SavedFeed } from "@/components/cards/SavedFeed";
import { DEFAULT_AVATAR, useExperience } from "@/lib/auth/experience";
import { SAVED_ITEMS, SAVED_PROFILE } from "./content";
import "./saved.css";

/**
 * Saved items list — profile header + CMS-shaped modular card feed
 */
export function SavedPage() {
  const { fullName, avatarUrl, email, pgsCode, isPremium } = useExperience();
  const displayName = fullName?.trim() || SAVED_PROFILE.name;
  const displayHandle = email
    ? `@${email.split("@")[0]}`
    : SAVED_PROFILE.handle;
  const displayId = pgsCode || SAVED_PROFILE.id;
  const displayAvatar = avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="wrapper-content pgs-saved-page">
      <section className="pt-0 mobile-student-cart about-section half-section overlap-height position-relative pgs-identity-card">
        <div className="pgs-saved-header">
          <div className="w-729px p-0 m-auto">
            <div className="card-box-avatar">
              <div className="avatar-info position-relative">
                <div className="avatar-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayAvatar}
                    alt=""
                    className="border-radius-6px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="avatar_name">
                    <h5 className="mb-3">{displayName}</h5>
                    <span>{displayHandle}</span>
                    {displayId ? <span>id: {displayId}</span> : null}
                  </div>
                </div>
                <div className="title-info">
                  <h5 className="mb-0">{SAVED_PROFILE.premiumLabel}</h5>
                  <h6 className="mb-0">{SAVED_PROFILE.pathway}</h6>
                </div>
              </div>
              <div className="avatar-heading-right-box">
                <h4 className="mb-0">
                  {isPremium ? "#PURPLEPREMIUM" : "#purplePremium"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 saved-list-pgs board-list-pgs half-section overlap-height position-relative overflow-hidden">
        <div className="w-990px m-auto overlap-gap-section p-0">
          <SavedFeed items={SAVED_ITEMS} />
        </div>
      </section>
    </div>
  );
}
