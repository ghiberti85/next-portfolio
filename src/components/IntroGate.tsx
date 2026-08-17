"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TerminalIntro from "@/components/TerminalIntro";
import ErrorBoundary from "@/components/ErrorBoundary";
import GitHubActivity from "@/components/GitHubActivity";
import AnimatedSection from "@/components/AnimatedSection";
import type { GitHubStats } from "@/lib/github";

// DIAGNOSTIC: ssr:false removed. react-slick renders fine server-side
// (verified via renderToString), so this was never strictly required.
// Testing whether this remaining next/dynamic(..., { ssr: false })
// boundary — the last one in the tree still part of the initial
// hydration pass — is what triggers the React #418 hydration error
// PSI keeps flagging. AskFernando/CommandPalette/InteractiveTerminal
// are also ssr:false but mount well after hydration (gated behind a
// ready flag), so they were never candidates the same way this is.
const SkillsSlider = dynamic(() => import("@/components/SkillsSlider"));

interface IntroGateProps {
  github?: GitHubStats | null;
}

export default function IntroGate({ github = null }: IntroGateProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("portfolio-intro-seen");
    if (seen) return;
    // Mounting TerminalIntro schedules a rapid chain of its own setTimeout
    // re-renders (character-by-character typing) starting immediately.
    // SkillsSlider is still a next/dynamic(..., { ssr: false }) boundary
    // whose chunk fetch+eval also kicks off around now — on a throttled
    // CPU (real Lighthouse mobile runs, never a fast local dev machine)
    // PSI intermittently flags a React #418 hydration error under this
    // exact combination. A short delay here lets that async work get a
    // head start before TerminalIntro starts churning, which is a cheap,
    // safe mitigation regardless of the precise mechanism.
    const timerId = setTimeout(() => setShowIntro(true), 50);
    return () => clearTimeout(timerId);
  }, []);

  const handleIntroDone = () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    setExiting(true);
  };

  useEffect(() => {
    if (!exiting) return;
    const timerId = setTimeout(() => setShowIntro(false), 900);
    return () => clearTimeout(timerId);
  }, [exiting]);

  return (
    <>
      {/*
        Page content always renders (server + first paint) so it counts for
        LCP/SEO/no-JS instead of waiting on a client-only sessionStorage
        check. On first visit, TerminalIntro mounts as an opaque full-screen
        overlay on top of it (z-[200]) — the content underneath is already
        painted, just visually covered until the intro finishes.
      */}
      <Navbar />
      <main id="main-content">
        {/* Hero is the LCP element — rendered directly, no scroll-reveal
            animation, so it never sits at opacity:0 waiting on an
            IntersectionObserver before it counts as painted. */}
        <Hero />
        {/* Not wrapped in AnimatedSection: kept losing this section's
            scroll-in fade after ruling out the AnimatedSection+ssr:false
            double-layering theory (see SkillsSlider's dynamic() import
            above for the current experiment). */}
        <ErrorBoundary><SkillsSlider /></ErrorBoundary>
        <ErrorBoundary><AnimatedSection variant="launch"  delay={0.05}><ProjectsGrid /></AnimatedSection></ErrorBoundary>
        <ErrorBoundary><AnimatedSection variant="reveal"  delay={0.05}><Timeline /></AnimatedSection></ErrorBoundary>
        <ErrorBoundary><AnimatedSection variant="fadeUp"  delay={0.05}><GitHubActivity data={github} /></AnimatedSection></ErrorBoundary>
        <AnimatedSection variant="flip"    delay={0.05}><Contact /></AnimatedSection>
      </main>
      <AnimatedSection variant="fadeUp"  delay={0.05}><Footer /></AnimatedSection>
      {showIntro && <TerminalIntro onDone={handleIntroDone} exiting={exiting} />}
    </>
  );
}
