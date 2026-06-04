import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseSpotlight from "@/components/MouseSpotlight";
import AskFernando from "@/components/AskFernando";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fernando Ghiberti's Portfolio",
  description: "Showcasing the portfolio of Fernando Ghiberti, a senior frontend engineer.",
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
        <a href="#hero" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <div className="mesh-blob mesh-blob-1" aria-hidden="true" />
        <div className="mesh-blob mesh-blob-2" aria-hidden="true" />
        <div className="mesh-blob mesh-blob-3" aria-hidden="true" />
        <MouseSpotlight />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">{children}</div>
        <AskFernando />
      </body>
    </html>
  );
}
