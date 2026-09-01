import "@/app/globals.css";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="no-js">
      <body data-mobile-nav-style="classic" className="custom-cursor">
        {children}
      </body>
    </html>
  );
}
