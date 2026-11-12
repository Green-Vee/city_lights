import type { Metadata } from "next";
import { roboto } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://citylightsentertainment.com"),
  title: {
    default: "City Lights Entertainment | Music Production & Live Events",
    template: "%s | City Lights Entertainment",
  },
  description:
    "Official management and production portal for City Lights Entertainment. Music releases, studio booking, beat store, and live event management.",
  keywords: [
    "City Lights Entertainment",
    "Music Production",
    "Beat Store",
    "Studio Booking",
    "Live Events",
    "Record Label Dashboard",
  ],
  authors: [{ name: "City Lights Entertainment" }],
  creator: "City Lights Entertainment",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://citylightsentertainment.com",
    title: "City Lights Entertainment | Premier Music & Live Production",
    description:
      "Explore release catalogs, book studio sessions, and manage artist bookings with City Lights Entertainment.",
    siteName: "City Lights Entertainment",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "City Lights Entertainment Studio & Music Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "City Lights Entertainment",
    description: "Music production, studio bookings, and live entertainment.",
    images: ["/og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured Schema for Google SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "City Lights Entertainment",
  url: "https://citylightsentertainment.com",
  genre: ["Hip Hop", "Afrobeats", "Urban", "Electronic", "Pop"],
  description: "Music production company, beat store, and live event agency.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}