import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsSlider from "@/components/SkillsSlider";
import ProjectsGrid from "@/components/ProjectsGrid";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SkillsSlider />
      <ProjectsGrid />
      <Timeline />
      <Contact />
      <Footer />
    </>
  );
}
