"use client";

import { useExperience } from "@/lib/auth/experience";
import { SharedBody } from "./components/SharedBody";
import {
  ExplorePgs,
  GuestHero,
  StudentIdentityCard,
  WelcomePremium,
} from "./components/HeroTops";

/**
 * Three home compositions (product truth from standalone-html/home.html):
 * - anonymous: GuestHero + shared body
 * - authenticated_standard: StudentIdentityCard + ExplorePgs + shared body
 * - authenticated_premium: StudentIdentityCard(approved) + WelcomePremium + shared body
 */
export function HomePage({
  faqs,
}: {
  faqs?: { q: string; a: string }[];
} = {}) {
  const { experience } = useExperience();

  return (
    <div className="wrapper-content">
      {experience === "anonymous" ? <GuestHero /> : null}

      {experience === "authenticated_standard" ? (
        <>
          <StudentIdentityCard premium="none" />
          <ExplorePgs />
        </>
      ) : null}

      {experience === "authenticated_premium" ? (
        <>
          <StudentIdentityCard premium="approved" />
          <WelcomePremium />
        </>
      ) : null}

      <SharedBody faqs={faqs} />
    </div>
  );
}
