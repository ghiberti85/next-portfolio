import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// Imported here (not in SkillsSlider.tsx, which loads via next/dynamic) so
// this CSS shares the main stylesheet's precedence instead of being loaded
// as a separate, sequentially-blocking stylesheet — see SkillsSlider.tsx.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SkipLink from "@/components/SkipLink";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import PointerOnlyEffects from "@/components/PointerOnlyEffects";
import DeferredOverlays from "@/components/DeferredOverlays";
import MotionProvider from "@/components/MotionProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://fernando-ghiberti.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Fernando Ghiberti — Senior Fullstack Developer",
  description:
    "Fernando Ghiberti — Senior Fullstack Developer building with React, Next.js, TypeScript, Node.js, Supabase, and AI integrations. Open to new opportunities.",
  keywords: [
    "Fernando Ghiberti",
    "Senior Fullstack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Supabase",
    "AI",
    "Portfolio",
    "Brazil",
  ],
  authors: [{ name: "Fernando Ghiberti", url: "https://github.com/ghiberti85" }],
  creator: "Fernando Ghiberti",
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Fernando Ghiberti Portfolio",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
    creator: "@ghiberti85",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${BASE_URL}/#profilepage`,
      url: BASE_URL,
      name: "Fernando Ghiberti — Senior Fullstack Developer",
      inLanguage: "en",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#person` },
      mainEntity: { "@id": `${BASE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Fernando Ghiberti",
      url: BASE_URL,
      jobTitle: "Senior Fullstack Developer",
      email: "ghiberti85@gmail.com",
      image: "https://github.com/ghiberti85.png",
      sameAs: [
        "https://github.com/ghiberti85",
        "https://linkedin.com/in/fernando-ghiberti",
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Supabase",
        "PostgreSQL",
        "AI Integration",
        "Groq",
        "Framer Motion",
        "Tailwind CSS",
      ],
      address: { "@type": "PostalAddress", addressCountry: "BR" },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Fernando Ghiberti Portfolio",
      description: "Personal portfolio of Fernando Ghiberti, Senior Fullstack Developer.",
      inLanguage: "en",
      author: { "@id": `${BASE_URL}/#person` },
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading headers() forces this route to render dynamically per request,
  // which Next.js's own nonce-based CSP script injection requires (its
  // internal inline scripts are threaded with the same per-request nonce
  // src/proxy.ts sets — that only stays consistent if the route isn't
  // statically cached). We don't consume the header's value ourselves: see
  // the comment on the JSON-LD <script> below for why.
  await headers();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        {/*
          No CSP nonce on this script on purpose: `application/ld+json` is
          inert data, never executed as script, so `script-src` doesn't
          govern it. Giving it the per-request nonce caused a hydration
          mismatch — the value used to render this attribute during SSR
          didn't consistently match what hydration expected, forcing React
          to discard the SSR output and fully re-render client-side on
          every load (a major, largely invisible perf hit — see CHANGELOG).
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <MotionProvider>
              <ScrollProgressBar />
              <SkipLink />
              <div className="mesh-blob mesh-blob-1" aria-hidden="true" />
              <div className="mesh-blob mesh-blob-2" aria-hidden="true" />
              <div className="mesh-blob mesh-blob-3" aria-hidden="true" />
              <PointerOnlyEffects />
              <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 relative z-10 overflow-x-hidden">{children}</div>
              <DeferredOverlays />
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
        {/* Privacy-friendly, cookieless visit counting — served from Vercel's
            own /_vercel/insights/* same-origin routes, so it needs no CSP
            changes and no consent banner. */}
        <Analytics />
      </body>
    </html>
  );
}
