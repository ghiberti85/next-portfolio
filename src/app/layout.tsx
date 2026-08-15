import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import "./globals.css";
import SkipLink from "@/components/SkipLink";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import PointerOnlyEffects from "@/components/PointerOnlyEffects";
const AskFernando = dynamic(() => import("@/components/AskFernando"), {
  loading: () => (
    <div
      aria-hidden="true"
      className="fixed bottom-8 left-8 z-50 w-36 h-12 rounded-full animate-pulse"
      style={{ background: "var(--card-bg)" }}
    />
  ),
});
const CommandPalette = dynamic(() => import("@/components/CommandPalette"));
const InteractiveTerminal = dynamic(() => import("@/components/InteractiveTerminal"));
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
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <ScrollProgressBar />
            <SkipLink />
            <div className="mesh-blob mesh-blob-1" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-2" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-3" aria-hidden="true" />
            <PointerOnlyEffects />
            <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 relative z-10 overflow-x-hidden">{children}</div>
            <AskFernando />
            <CommandPalette />
            <InteractiveTerminal />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
