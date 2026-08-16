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

const SkillsSlider = dynamic(() => import("@/components/SkillsSlider"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="min-h-[560px]" />,
});

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
        {/* Not wrapped in AnimatedSection: SkillsSlider is the only
            remaining next/dynamic(..., { ssr: false }) boundary in the
            tree (react-slick genuinely needs it, unlike the Typewriter
            fix above). Stacking framer-motion's opacity:0/whileInView
            reveal on top of React's streaming "bail out to client
            rendering" marker for that same node is the leading suspect
            for the React #418 hydration error PSI still flags — it
            never showed up on Hero's Typewriter, which never had this
            double layering. Losing the scroll-in fade for this one
            section is cheap; keeping ssr:false is not (loses the
            deferred-chunk-load benefit that keeps react-slick out of
            the initial bundle). */}
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
