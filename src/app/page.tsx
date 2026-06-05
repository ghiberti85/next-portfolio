"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsSlider from "@/components/SkillsSlider";
import ProjectsGrid from "@/components/ProjectsGrid";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import TerminalIntro from "@/components/TerminalIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("portfolio-intro-seen");
    if (!seen) {
      setShowIntro(true);
    } else {
      setReady(true);
    }
  }, []);

  const handleIntroDone = () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    setExiting(true);
    setReady(true);
    // Remove terminal from DOM after fade-out completes
    setTimeout(() => setShowIntro(false), 900);
  };

  return (
    <>
      {ready && (
        <div
          style={{
            opacity: showIntro && !exiting ? 0 : 1,
            transition: exiting ? "opacity 0.8s ease 0.2s" : "none",
          }}
        >
          <Navbar />
          <AnimatedSection variant="fadeUp"  delay={0}   ><Hero /></AnimatedSection>
          <AnimatedSection variant="stagger" delay={0.05}><SkillsSlider /></AnimatedSection>
          <AnimatedSection variant="launch"  delay={0.05}><ProjectsGrid /></AnimatedSection>
          <AnimatedSection variant="reveal"  delay={0.05}><Timeline /></AnimatedSection>
          <AnimatedSection variant="flip"    delay={0.05}><Contact /></AnimatedSection>
          <AnimatedSection variant="fadeUp"  delay={0.05}><Footer /></AnimatedSection>
        </div>
      )}
      {showIntro && <TerminalIntro onDone={handleIntroDone} exiting={exiting} />}
    </>
  );
}
