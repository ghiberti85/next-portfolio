import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseSpotlight from "@/components/MouseSpotlight";
import CustomCursor from "@/components/CustomCursor";
import SkipLink from "@/components/SkipLink";
import AskFernando from "@/components/AskFernando";
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

export const metadata: Metadata = {
  title: "Fernando Ghiberti — Senior Fullstack Developer",
  description:
    "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations. Available for new opportunities.",
  keywords: ["Fernando Ghiberti", "Senior Fullstack Developer", "React", "Next.js", "TypeScript", "Supabase", "AI"],
  authors: [{ name: "Fernando Ghiberti", url: "https://github.com/ghiberti85" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://next-portfolio-ghiberti85.vercel.app",
    siteName: "Fernando Ghiberti Portfolio",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
    images: [
      {
        url: "https://github.com/ghiberti85.png",
        width: 400,
        height: 400,
        alt: "Fernando Ghiberti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fernando Ghiberti — Senior Fullstack Developer",
    description:
      "Portfolio of Fernando Ghiberti, Senior Fullstack Developer specializing in React, Next.js, TypeScript, and AI integrations.",
    images: ["https://github.com/ghiberti85.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <SkipLink />
            <div className="mesh-blob mesh-blob-1" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-2" aria-hidden="true" />
            <div className="mesh-blob mesh-blob-3" aria-hidden="true" />
            <CustomCursor />
            <MouseSpotlight />
            <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 relative z-10 overflow-x-hidden">{children}</div>
            <AskFernando />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
