"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ExperienceProvider } from "@/lib/auth/experience";
import type {
  CmsHighlight,
  CmsNotice,
  CmsSocial,
  CmsTestimonial,
} from "@/lib/catalog/cms-types";
import type { UnivMeetConfig } from "@/lib/content/univmeet";
import { CmsShellProvider } from "./cms-shell";
import { DevRoleSwitcher } from "./DevRoleSwitcher";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ShellUiProvider } from "./shell-ui";
import "@/components/bump-premium-modal.css";

export function SiteShell({
  children,
  socialLinks,
  univMeet,
  marquee,
  highlights,
  testimonials,
}: {
  children: React.ReactNode;
  socialLinks?: CmsSocial[];
  univMeet?: UnivMeetConfig | null;
  marquee?: CmsNotice[];
  highlights?: CmsHighlight[];
  testimonials?: CmsTestimonial[];
}) {
  const pathname = usePathname() || "";
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ops") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/cms-preview");

  useEffect(() => {
    if (!bare) {
      document.documentElement.classList.remove("pgs-admin-html");
      document.body.classList.remove("pgs-admin-body");
      document.documentElement.classList.remove("pgs-ops-html");
      document.body.classList.remove("pgs-ops-body");
    }
  }, [bare]);

  if (bare) {
    return <ExperienceProvider>{children}</ExperienceProvider>;
  }

  return (
    <ExperienceProvider>
      <CmsShellProvider highlights={highlights} testimonials={testimonials}>
        <ShellUiProvider>
          <div id="pgs-toast-container" aria-live="polite" />
          <Header />
          <Sidebar univMeet={univMeet ?? undefined} />
          {marquee && marquee.length > 0 ? (
            <div className="marquee-section bg-black text-white p-1 overflow-hidden">
              <div className="marquees-text">
                {marquee.map((n, i) =>
                  n.linkUrl ? (
                    <a key={`${n.text}-${i}`} href={n.linkUrl}>
                      {n.text}{" "}
                    </a>
                  ) : (
                    <span key={`${n.text}-${i}`}>{n.text} </span>
                  ),
                )}
              </div>
            </div>
          ) : null}
          <main>{children}</main>
          <Footer socialLinks={socialLinks} />
          <DevRoleSwitcher />
        </ShellUiProvider>
      </CmsShellProvider>
    </ExperienceProvider>
  );
}
