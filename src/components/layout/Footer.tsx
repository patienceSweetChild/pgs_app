"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BumpPremiumModal,
  REFERRAL_BUMP_CONFIG,
} from "@/components/BumpPremiumModal";
import {
  SOCIAL_ICON_MAP,
  type CmsSocial,
} from "@/lib/catalog/cms-types";

const DEFAULT_SOCIALS: CmsSocial[] = [
  { platform: "instagram", url: "https://instagram.com" },
  { platform: "facebook", url: "https://facebook.com" },
  { platform: "threads", url: "https://threads.net" },
  { platform: "youtube", url: "https://youtube.com" },
  { platform: "linkedin", url: "https://linkedin.com" },
];

export function Footer({ socialLinks }: { socialLinks?: CmsSocial[] }) {
  const [joinOpen, setJoinOpen] = useState(false);
  const socials =
    socialLinks && socialLinks.length > 0 ? socialLinks : DEFAULT_SOCIALS;

  return (
    <div className="footer-bg">
      <section className="footer">
        <div className="flot-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/top.png" alt="" />
        </div>
        <div className="container pt-5 pb-8">
          <div className="row justify-content-center">
            <div className="col-lg-2">
              <div className="card-bg-pruple text-center w-210px">
                <h4 className="mb-0 fs-20 lh-full mt-7">
                  Currently studying? Become a mentor <br /> and help students.
                </h4>
                <button
                  type="button"
                  className="btn btn-join"
                  onClick={() => setJoinOpen(true)}
                >
                  Join The Team!
                </button>
              </div>
            </div>
            <div className="col-lg-5 offset-1">
              <div className="yellow-bg">General Enquiries</div>
              <div className="d-flex gap-2 fs-20 text-white mt-2 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/mail.png" width={25} alt="" />{" "}
                hello@purpleguide.study
              </div>
              <div className="yellow-bg mt-3">General Enquiries</div>
              <div className="d-flex gap-2 fs-20 text-white mt-2 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/mail.png" width={25} alt="" />{" "}
                connect@purpleguide.study
              </div>
              <div className="social-flex mt-5 mb-3 d-flex align-items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/right.png" alt="" />
                <h6 className="mb-0 text-white fs-20">Our Socials</h6>
                <div className="social-img d-flex align-items-center gap-3">
                  {socials.map((s) => {
                    const key = s.platform.toLowerCase();
                    const icon =
                      SOCIAL_ICON_MAP[key] || SOCIAL_ICON_MAP.instagram;
                    return (
                      <a
                        key={`${s.platform}-${s.url}`}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={icon} alt={s.platform} />
                      </a>
                    );
                  })}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/left.png" alt="" />
              </div>
              <div className="terms-content mt-6">
                <Link
                  href="/privacy"
                  className="d-block fs-20 fw-500 mt-1 text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="d-block fs-20 fw-500 mt-1 text-white"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/refund"
                  className="d-block fs-20 fw-500 mt-1 text-white"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="fs-14 lh-full mb-5 text-white">
                <span className="fs-15"> For</span>
                <br />
                Feedback, <br /> Escalations <br /> &amp; Complaints
              </div>
              <div className="d-flex gap-2 fs-20 text-white mt-2 align-items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/mail.png" width={25} alt="" />
                <div>
                  <span style={{ whiteSpace: "nowrap" }}>
                    hey@purpleguide.study
                  </span>
                  <p className="fs-14 fw-400 mb-0 mt-4 lh-full">
                    We&apos;re a project-first team, and we try to sort out
                    complaints within 7 business days. Good vibes or tough love:
                    your feedback actually helps us level up.
                  </p>
                  <p className="fs-14 fw-400 mb-0 mt-4 lh-full">
                    All emails sent to this address will stay anonymous—unless we
                    spot any signs of misuse or suspicious activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="copyrght">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex justify-content-center">
                <h4 className="w-20 text-white">#PGS</h4>
                <div className="d-flex align-items-center gap-4">
                  <button
                    type="button"
                    className="text-white fs-24 fw-700 lh-28 cursor-pointer bg-transparent border-0 text-start p-0"
                    onClick={() => setJoinOpen(true)}
                  >
                    (For Mentors) Help Students Choose <br />
                    Smarter – Earn with Our Referral Program
                  </button>
                  <Link
                    href="/unitieup"
                    className="text-white fw-700 fs-24 lh-28"
                  >
                    (For Universities) Give Your Students a <br />
                    Global Edge – Partner with #PGS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BumpPremiumModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        config={REFERRAL_BUMP_CONFIG}
      />
    </div>
  );
}
