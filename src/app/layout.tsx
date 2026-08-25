import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  getUnivMeetSlots,
  listActiveMarquee,
  listPublishedHighlights,
  listPublishedTestimonials,
  listSocialLinks,
} from "@/lib/catalog/cms-public";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Purple Guide Study | #PGS",
    template: "%s | Purple Guide Study",
  },
  description:
    "Admission guidance hub for medical and STEM study-abroad pathways — USMLE, AMC, PLAB, and more.",
  icons: {
    icon: "/assets/img/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [socialLinks, univMeet, marquee, highlights, testimonials] =
    await Promise.all([
      listSocialLinks(),
      getUnivMeetSlots(),
      listActiveMarquee(),
      listPublishedHighlights(),
      listPublishedTestimonials(),
    ]);

  return (
    <html lang="en" className="no-js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="stylesheet" href="/assets/css/vendors.min.css" />
        <link rel="stylesheet" href="/assets/css/icon.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>
      <body data-mobile-nav-style="classic" className="custom-cursor">
        <SiteShell
          socialLinks={socialLinks}
          univMeet={univMeet}
          marquee={marquee}
          highlights={highlights}
          testimonials={testimonials}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
