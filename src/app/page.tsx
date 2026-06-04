import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsSlider from "@/components/SkillsSlider";
import ProjectsGrid from "@/components/ProjectsGrid";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <AnimatedSection delay={0}><Hero /></AnimatedSection>
      <AnimatedSection delay={0.05}><SkillsSlider /></AnimatedSection>
      <AnimatedSection delay={0.05}><ProjectsGrid /></AnimatedSection>
      <AnimatedSection delay={0.05}><Timeline /></AnimatedSection>
      <AnimatedSection delay={0.05}><Contact /></AnimatedSection>
      <AnimatedSection delay={0.05}><Footer /></AnimatedSection>
    </>
  );
}
