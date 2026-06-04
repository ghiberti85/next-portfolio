"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById("projects");
      const skillsSection = document.getElementById("skills");

      if (projectsSection && skillsSection) {
        const skillsBottom =
          skillsSection.offsetTop + skillsSection.offsetHeight;

        // Show "Back to Top" button if scrolled past the skills section
        setShowBackToTop(window.scrollY > skillsBottom);
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the event listener
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Back to Top Icon */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 hover:bg-teal-700 hover:text-white transition-transform transform hover:scale-105 shadow-lg"
          aria-label="Back to top"
        >
            <FontAwesomeIcon 
                icon={faArrowUp} 
                size="xl" 
                className="align-middle" 
                style={{ verticalAlign: "-0.15em" }} 
            />
        </button>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-gray-400 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-sm mb-1">
          Developed with <span className="text-teal-400">💚</span> by{" "}
          <span className="font-semibold text-gray-300">Fernando Ghiberti</span>
        </p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Fernando Ghiberti · Built with{" "}
          <span className="text-gray-400">Next.js 15</span> · Deployed on{" "}
          <span className="text-gray-400">Vercel</span>
        </p>
      </footer>
    </>
  );
}
