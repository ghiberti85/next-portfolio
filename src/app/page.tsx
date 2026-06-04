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
    setShowIntro(false);
    setReady(true);
  };

  return (
    <>
      {showIntro && <TerminalIntro onDone={handleIntroDone} />}
      {ready && (
        <>
          <Navbar />
          <AnimatedSection delay={0}><Hero /></AnimatedSection>
          <AnimatedSection delay={0.05}><SkillsSlider /></AnimatedSection>
          <AnimatedSection delay={0.05}><ProjectsGrid /></AnimatedSection>
          <AnimatedSection delay={0.05}><Timeline /></AnimatedSection>
          <AnimatedSection delay={0.05}><Contact /></AnimatedSection>
          <AnimatedSection delay={0.05}><Footer /></AnimatedSection>
        </>
      )}
    </>
  );
}
