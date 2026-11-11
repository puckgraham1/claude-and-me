import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITE_URL } from "@/data";
import { RiseMark } from "@/components/RiseMark";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Read the Rise | Fly fishing river guides",
    template: "%s | Read the Rise",
  },
  description:
    "Interactive fly fishing river guides: what's hatching, what trout are eating, the best flies, and the science behind every rise.",
  openGraph: { siteName: "Read the Rise", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f3d47",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="logo" aria-label="Read the Rise home">
              <RiseMark size={30} />
              Read the Rise
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/deschutes">Deschutes</Link>
              <Link href="/rise-decoder">Rise decoder</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p>
              Read the Rise is a general guide. Hatch timing varies year to year and fly picks are starting points,
              so check with a local fly shop before your trip.
            </p>
            <p>Always follow current state fishing regulations. © {new Date().getFullYear()} Read the Rise</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
