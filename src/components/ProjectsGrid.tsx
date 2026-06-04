"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface Project {
  title: string;
  image: string;
  description: string;
  github: string;
  live: string;
  tags: string[];
}

// Define projects with deterministic tags
const projects: Project[] = [
  {
    title: "DevInterviewLab",
    image: "https://raw.githubusercontent.com/ghiberti85/devinterviewlab/main/public/og-image.png",
    description: "AI-powered technical interview prep platform. Generate personalized study roadmaps from job descriptions, practice with AI-generated questions, review Flash Topics and track your progress — available in English and Portuguese.",
    github: "https://github.com/ghiberti85/devinterviewlab",
    live: "https://devinterviewlab.vercel.app",
    tags: ["Next.js", "TypeScript", "Supabase", "Groq AI", "PWA", "Radix UI"],
  },
  {
    title: "Interview Command Center",
    image: "https://raw.githubusercontent.com/ghiberti85/interview-command-center/main/public/screenshot.png",
    description: "A personal CRM for managing job interview pipelines — track processes by stage, generate AI-powered recruiter responses and CV adaptations, and manage next steps across multiple open positions simultaneously.",
    github: "https://github.com/ghiberti85/interview-command-center",
    live: "https://interview-command-center.vercel.app",
    tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI", "PWA"],
  },
  {
    title: "Ghiberti UI",
    image: "https://raw.githubusercontent.com/ghiberti85/ui/main/apps/docs/public/screenshot.png",
    description: "A monorepo design system with 5 themed token collections and 30 accessible React components. Built for developers who need a fully themeable, dark-mode-ready component library with CSS custom properties and no runtime dependencies.",
    github: "https://github.com/ghiberti85/ui",
    live: "https://ghiberti-ui.vercel.app",
    tags: ["React", "TypeScript", "Next.js", "Storybook", "Turborepo", "Radix UI"],
  },
  {
    title: "Finanças do Casal",
    image: "https://raw.githubusercontent.com/ghiberti85/financa-casal/main/public/screenshot.png",
    description: "A collaborative personal finance PWA for couples — track shared expenses, income, budgets, credit card statements and recurring bills in real time, with AI-powered spreadsheet import via Claude Sonnet.",
    github: "https://github.com/ghiberti85/financa-casal",
    live: "https://financa-casal.vercel.app",
    tags: ["React", "TypeScript", "Vite", "Supabase", "Claude AI", "PWA"],
  },
  {
    title: "upload.ai",
    image: "https://github.com/ghiberti85/nlw-ai/raw/main/upload-ai-web/public/screenshot.png",
    description: "It's an application that allows uploading videos and, through AI, automatically generates catchy titles and descriptions with good indexing.",
    github: "https://github.com/ghiberti85/nlw-ai",
    live: "",
    tags: ["React", "Typescript", "Vite", "Vercel"],
  },
  {
    title: "Ignite Call",
    image: "https://github.com/ghiberti85/ignite-call/raw/main/public/registration-1.png",
    description: "Full Stack Project with Next.js and React. Seamlessly integrate with Google Calendar to schedule appointments. Simplify time management and enhance communication with this user-friendly scheduling application..",
    github: "https://github.com/ghiberti85/ignite-call",
    live: "https://ignitecall-ghiberti85.vercel.app/",
    tags: ["Next.js", "React", "Typescript"],
  },
  {
    title: "Design System",
    image: "https://github.com/ghiberti85/ignite-design-system/blob/main/design-system.png?raw=true",
    description: "React Design System Mastery: Crafting, Documenting, and Deploying with Storybook and GitHub Actions",
    github: "https://github.com/ghiberti85/ignite-design-system",
    live: "https://ghiberti85.github.io/ignite-design-system/",
    tags: ["React", "Typescript"],
  },
  {
    title: "Coffee Delivery",
    image: "https://github.com/ghiberti85/ignite-coffee-delivery/blob/main/coffee-delivery.png?raw=true",
    description: "This application, despite being simple, is an excellent example to practice the development of Shopping Cart manager.",
    github: "https://github.com/ghiberti85/ignite-coffee-delivery",
    live: "",
    tags: ["React", "Typescript", "Vite"],
  },
  {
    title: "ToDo",
    image: "https://github.com/ghiberti85/ignite-todo-list/blob/main/to-do.png?raw=true",
    description: "This application, despite being simple, is an excellent example to practice the development of CRUD (Create, Read, Update, Delete).",
    github: "https://github.com/ghiberti85/ignite-todo-list",
    live: "",
    tags: ["Typescript", "React", "Vite"],
  },
  {
    title: "Pizza Shop",
    image: "https://github.com/ghiberti85/ignite-pizza-shop-web/raw/main/public/image-3.png",
    description: "The Pizza Shop Web is a dashboard designed for restaurant owners participating in delivery applications.",
    github: "https://github.com/ghiberti85/ignite-pizza-shop-web",
    live: "",
    tags: ["React", "Typescript", "Vite"],
  },
  {
    title: "Be The Hero",
    image: "https://github.com/ghiberti85/omnistack/blob/master/be-the-hero.png?raw=true",
    description: "BeTheHero is a project that aims to connect people who want to make monetary contributions to NGOs (Non-Governmental Organizations) that need help.",
    github: "https://github.com/ghiberti85/omnistack",
    live: "",
    tags: ["React", "Node.js", "React Native"],
  },
  {
    title: "Feedget",
    image: "https://github.com/ghiberti85/nlw-return-impulse/raw/main/Capa.png",
    description: "Available for Web and Mobile applications, Feedget collects feedbacks and storage them into a PostgreSQL database.",
    github: "https://github.com/ghiberti85/nlw-return-impulse",
    live: "",
    tags: ["React", "React Native", "Node.js"],
  },
  {
    title: "Happy",
    image: "https://github.com/ghiberti85/nlw3/blob/master/happy.png?raw=true",
    description: "Happy is a project that aims to facilitate visits to orphanages near you",
    github: "https://github.com/ghiberti85/nlw3/blob/master/web/src/images/happy.png",
    live: "",
    tags: ["Node.js", "Express", "React"],
  },
  {
    title: "move.it",
    image: "https://placehold.co/300x200?text=move.it",
    description: "Move.it came to remind you to exercise always! 💜",
    github: "https://github.com/ghiberti85/moveit-next",
    live: "",
    tags: ["Next.js", "Typescript", "React"],
  },
  {
    title: "Ecoleta",
    image: "https://github.com/ghiberti85/nlw/raw/master/public/assets/Home.svg",
    description: "Ecoleta is a project that aims to connect people to waste collection points efficiently.",
    github: "https://github.com/yourusername/photo-gallery",
    live: "",
    tags: ["Javascript", "Node.js", "React"],
  },
  {
    title: "NLW Esports",
    image: "https://github.com/ghiberti85/nlw-esports/blob/main/nlw-esports.png?raw=true",
    description: "NLW eSports is a project that aims to connect people who want to find partners to play a specific game online.",
    github: "https://github.com/ghiberti85/nlw-esports",
    live: "",
    tags: ["React", "Node.js", "React Native"],
  },
];


export default function ProjectsGrid() {
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Extract unique tags dynamically
  const uniqueTags = Array.from(new Set(projects.flatMap((project) => project.tags)));

  const handleShowMore = () => {
    setVisibleProjects((prev) => (prev === 6 ? projects.length : 6));
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const filteredProjects = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  const isAllProjects = !activeTag;

  return (
    <section id="projects" className="py-20 px-4 lg:px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Projects
      </h2>

      {/* Filter Tags */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        <button
          onClick={() => {
            setActiveTag(null);
            setVisibleProjects(6);
          }}
          className={`px-5 py-1 rounded-full text-sm font-semibold ${
            isAllProjects
              ? "bg-teal-700 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-teal-700 hover:text-white transition"
          }`}
        >
          All Projects
        </button>
        {uniqueTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTag(tag);
              setVisibleProjects(filteredProjects.length);
            }}
            className={`px-5 py-1 rounded-full text-sm font-semibold ${
              activeTag === tag
                ? "bg-teal-700 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-teal-700 hover:text-white transition"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.slice(0, visibleProjects).map((project, index) => (
          <div
            key={index}
            className="group rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl relative"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
            onClick={() => handleOpenModal(project)}
          >
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-teal-700 text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 400px"
                loading="lazy"
                quality={70}
                className="object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-300">
                {project.title}
              </h3>
              <p
                className="text-sm text-gray-400 mt-2 cursor-pointer hover:text-teal-400 transition"
                onClick={() => handleOpenModal(project)}
              >
                View more
              </p>
            </div>
          </div>
        ))}
      </div>

      {isAllProjects && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            {visibleProjects === 6 ? "See More" : "Show Less"}
          </button>
        </div>
      )}

      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-6 bg-gray-900 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                loading="lazy"
                quality={80}
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover object-top"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              {selectedProject.title}
            </h3>
            <p className="text-gray-400 mb-6">{selectedProject.description}</p>
            <div className="flex justify-between">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-500 transition flex items-center"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" className="mr-2" />
                GitHub
              </a>
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition flex items-center"
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    size="lg"
                    className="mr-2"
                  />
                  Live Site
                </a>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 py-1 px-2.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
