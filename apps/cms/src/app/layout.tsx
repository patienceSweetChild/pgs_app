import "@/app/globals.css";
import "@/features/auth/staff-login/staff-login.css";
import { AppProviders } from "@/components/layout/AppProviders";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="no-js">
      <body data-mobile-nav-style="classic" className="custom-cursor">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
