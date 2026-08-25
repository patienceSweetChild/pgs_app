"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_AVATAR, useExperience } from "@/lib/auth/experience";

export function GuestHero() {
  const router = useRouter();
  const [signupEmail, setSignupEmail] = useState("");

  function goSignup() {
    const email = signupEmail.trim();
    const qs = new URLSearchParams({ signup: "1" });
    if (email.includes("@")) qs.set("email", email);
    router.push(`/login?${qs.toString()}`);
  }

  return (
    <section className="about-section mobile-home-hero home-sec half-section overlap-height position-relative pb-200">
      <div className="container overlap-gap-section p-0">
        <div className="row position-relative align-items-center justify-content-center">
          <div className="col-lg-11">
            <div
              className="full-width-img"
              style={{
                backgroundImage: "url('/assets/img/img-about-1.png')",
              }}
            >
              <div className="mobile-space-400">
                <h3 className="fw-400 fnt-family text-dark-gray ls-minus-1px fancy-text-style-4 mb-5">
                  turn your Global <small className="rotated">&gt;</small>
                  <small className="italic-text">study</small>{" "}
                  <span>Journey in</span>
                </h3>
                <h4>
                  <span
                    className="fix-width fnt-family"
                    style={{ color: "#009C70" }}
                  >
                    /&nbsp;<span>business</span>
                  </span>
                  <span className="fnt-family text-white">
                    <span
                      className="fnt-normal fw-400"
                      style={{ color: "#009C70" }}
                    >
                      |
                    </span>{" "}
                    a reality.
                  </span>
                </h4>
              </div>
            </div>

            <div className="sinup-box d-flex absolute-about-signup w-671px align-items-center">
              <div className="w-224px">
                <Link
                  href="/login?signup=1"
                  className="btn btn-google mb-0 d-inline-flex align-items-center justify-content-center text-decoration-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/img/google.png" alt="" />
                  Sign up with Google
                </Link>
                <span className="d-block text-center mt-1 mb-1 text-black">
                  OR
                </span>
                <div className="form-controls position-relative">
                  <div className="input-groups">
                    <input
                      type="email"
                      id="homeHeroSignupEmail"
                      className="form-control"
                      placeholder="name@email.com"
                      autoComplete="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          goSignup();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-btn-flot"
                      onClick={goSignup}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-50 text-black">
                <h5 className="mb-5 fs-16 fw-500 lh-full">
                  Join #PGS — whether it&apos;s Medical Pathway, STEM,
                  Master&apos;s, or other programs, we&apos;ve got your
                  admission roadmap.
                </h5>
                <p className="fs-14 lh-full mb-0">
                  Admission Counsellors, backed by experience. Trusted by
                  students since 2006 (formerly <br /> CEG).{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="full-width-img-after mobile-none" />
        </div>
      </div>
    </section>
  );
}

export function StudentIdentityCard({
  premium,
}: {
  premium: "none" | "pending" | "approved";
}) {
  const { logout, fullName, email, avatarUrl, pgsCode } = useExperience();
  const displayName = fullName?.trim() || "Student";
  const displayEmail = email || "";
  const avatarSrc = avatarUrl || DEFAULT_AVATAR;

  return (
    <section className="pt-0 about-section half-section mobile-student-cart overlap-height position-relative overflow-hidden mb-100 pgs-identity-card">
      <div className="w-729px p-0 m-auto">
        <div className="card-box-avatar">
          <div className="avatar-info position-relative">
            <div className="avatar-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt=""
                className="border-radius-6px"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
              />
              <div className="avatar_name">
                <h5 className="mb-3">{displayName}</h5>
                {displayEmail ? <span>{displayEmail}</span> : null}
                {pgsCode ? <span>id: {pgsCode}</span> : null}
                <span>
                  <a
                    href="#logout"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </a>
                </span>
              </div>
            </div>
            <div className="title-info">
              <h5 className="mb-0">#purplePremium</h5>
              <h6 className="mb-0">STEM PATHWAY</h6>
            </div>
          </div>
          <div
            className={`avatar-heading-right-box${
              premium !== "approved" ? " justify-content-start" : ""
            }`}
            style={
              premium !== "approved" ? { paddingLeft: 10 } : undefined
            }
          >
            {premium === "approved" ? (
              <h4 className="mb-0">#PURPLEPREMIUM</h4>
            ) : premium === "pending" ? (
              <h4 className="mb-0 text-yellow">
                Already <br /> Applied
              </h4>
            ) : (
              <h4 className="mb-0" style={{ cursor: "pointer" }}>
                <Link
                  href="/purplepremiumhome"
                  className="premium-unlock-link text-black text-decoration-none"
                  style={{ display: "inline-block" }}
                >
                  Yet to <br /> Unlock Full <br /> Access
                </Link>
              </h4>
            )}
          </div>
        </div>
      </div>
      <br />
      <br />
    </section>
  );
}

export function ExplorePgs() {
  return (
    <section className="pt-0 position-relative mobile-w-80 mobile-m-auto">
      <div className="container overlap-gap-section p-0">
        <div className="row align-items-center justify-content-md-center">
          <div className="col-lg-8 col-md-12 explore-section">
            <div className="card card-explore border-color-transparent">
              <h6
                className="mb-5 fs-14 lh-19 mobile-fs-12 mobile-lh-full w-230px mobile-w-60 text-gray-600 mobile-mb-40px"
                style={{ margin: "0 0 0 auto" }}
              >
                Choose this if you&apos;re exploring your options or aiming for
                direct entry into top partner universities, we&apos;ll help you
                make the right move.
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/down-arrow.png"
                  className="position-absolute flot-arrow-1"
                  alt=""
                />
              </h6>
              <h3 className="mb-3 fnt-family text-center text-black fs-51 mobile-fs-24">
                Explore #PGS
              </h3>
              <h5 className="w-520px m-auto ">
                <span>
                  Talk to a mentor or reach out to our{" "}
                  <a href="#" className="text-purple">
                    {" "}
                    Help Hub{" "}
                  </a>
                  , we&apos;ll align your goals and get your study abroad plan
                  moving towards getting an offer letter or admission done.
                </span>
              </h5>
              <h3 className="mb-3 fnt-family text-center text-black mt-4 fs-51 mobile-fs-24">
                OR
              </h3>
              <h5 className="w-520px m-auto">
                <span>
                  Going for AIMING for top universities or USMLE, PLAB, AMC, or
                  ? Join{" "}
                  <Link href="/purplepremiumhome" className="text-purple">
                    #purplePremium{" "}
                  </Link>{" "}
                  for a complete, guided roadmap with expert support from start
                  to admit.
                </span>
              </h5>
              <h6
                className="mb-5 w-30 fs-14 lh-19 d-flex mt-5 align-items-center mobile-fs-12 mobile-lh-full mobile-w-60"
                style={{ margin: "0 0 0 auto" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/img/up-arrow.png"
                  className="flot-arrow-2"
                  alt=""
                />{" "}
                <br />
                If you&apos;re aiming for top admits or medical pathway and need
                a peer-driven, full-support system this is for you.
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WelcomePremium() {
  return (
    <section className="pt-0 half-section overlap-height position-relative overflow-hidden mobile-pb-0">
      <div className="container overlap-gap-section p-0">
        <div className="row align-items-center justify-content-md-center">
          <div className="col-lg-8 col-md-12 explore-section">
            <div className="card card-explore border-color-transparent mobile-m-auto mobile-w-80">
              <h3 className="mb-3 fnt-family text-center text-black fs-51 mobile-fs-24">
                welcome to #PGS
              </h3>
              <h6 className="m-auto fs-18 lh-full fw-500 mb-3 mobile-fs-14">
                You&apos;ve just taken the first step toward your study abroad
                journey and we&apos;re here to walk it with you. From building
                your <span className="text-red">roadmap</span> to guiding you
                through documents, deadlines, and decisions, consider this your
                launchpad.
              </h6>
              <h6 className="m-auto fs-18 lh-full fw-500 mb-3 mobile-fs-14">
                Your dashboard&apos;s now your personal HQ track your progress,
                connect with mentors, and access tools that actually move the
                needle. Let&apos;s get started.
              </h6>
              <h6 className=" fs-18 lh-full fw-500 mb-2 mobile-fs-14">
                Wishing you the very best,{" "}
              </h6>
              <h6 className=" fs-18 lh-full fw-500 mb-3 mobile-fs-14">
                Team #PGS
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
