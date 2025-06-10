"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

interface TimelineItem {
  title: string;
  period: string;
  type: "professional" | "education";
  institution: string;
  location: string;
  details: string[];
}

const timelineData: TimelineItem[] = [
  {
    title: "Senior Software Engineer | Tech Lead",
    period: "2022 - Present",
    type: "professional",
    institution: "+A Educação",
    location: "São Paulo, Brazil (Remote)",
    details: [
      "Reduced loading time by 38% across institutional websites through a complete front-end rebuild using Next.js (SSR), Tailwind CSS, and lazy loading strategies.",
      "Created a reusable Design System in React + Tailwind documented in Storybook, accelerating screen delivery by 50% and ensuring UI consistency.",
      "Developed an automated diagnostics dashboard by integrating Google PageSpeed API and OpenAI API, enabling real-time SEO, accessibility, and performance feedback.",
      "Standardized SPA promotional modules and cut down campaign delivery time by 42%, supporting seasonal marketing peaks.",
      "Improved form conversion by 27% and reduced abandonment rate by 25% using Formik, Yup, Axios, and intl-tel-input with dynamic validation and Google Tag Manager integration.",
    ],
  },
  {
    title: "Software Engineer",
    period: "2020 - 2022",
    type: "professional",
    institution: "EBANX",
    location: "Curitiba, Brazil (Hybrid)",
    details: [
      "Accelerated delivery of promotional landing pages by 32% through the creation of a modular front-end framework in React and Tailwind, supported by Docker and GitHub Actions pipelines.",
      "Reduced bugs by 45% and increased code reusability via Storybook-based component library tailored for marketing variations.",
      "Improved engagement reporting by 40% by automating the dataLayer and real-time event tracking via Google Tag Manager.",
      "Achieved a 28% gain in PageSpeed metrics (LCP and TBT) using server-side rendering with Next.js, WebP image optimization, and modular lazy loading.",
    ],
  },
  {
    title: "Fullstack Developer",
    period: "2018 - Present",
    type: "professional",
    institution: "Freelance & Personal Projects",
    location: "Remote",
    details: [
      "Developed institutional and e-commerce websites with an average PageSpeed Insight score of 93+ and up to 28% higher conversion rates using Next.js and Tailwind CSS.",
      "Engineered robust back-end systems with 99.9% uptime using Node.js, TypeScript, PostgreSQL, MongoDB, and GraphQL within Clean Architecture principles.",
      "Maintained high deployment confidence with >85% test coverage and zero production-critical bugs, leveraging GitHub Actions for automated testing pipelines (Jest and Cypress).",
      "Implemented dynamic meta tags, JSON-LD, and sitemap configurations to achieve advanced technical SEO optimizations.",
    ],
  },
  {
    title: "Especialization in Software Engineering",
    period: "2024 - 2025",
    type: "education",
    institution: "Universidade Estudual de Campinas - UNICAMP",
    location: "Campinas, Brazil",
    details: [
      "Object-Oriented Analysis and Design: Expertise in designing robust software architectures using object-oriented principles.",
      "Software Validation and Verification: Skilled in testing methodologies to ensure software quality and reliability.",
      "Database Modeling and Design: Proficient in creating and optimizing data models for efficient storage and retrieval.",
      "Service-Oriented Architecture (SOA): Knowledge of implementing scalable, service-based software solutions.",
    ],
  },
  {
    title: "MBA in Full Stack Development",
    period: "2019 - 2020",
    type: "education",
    institution: "XP Educação",
    location: "Belo Horizonte, Brazil",
    details: [
      "Full-Stack Web Development: Mastered end-to-end web application development, including front-end and back-end technologies.",
      "Front-End Proficiency: Advanced skills in building responsive and user-friendly interfaces using modern frameworks and tools.",
      "Back-End Expertise: Developed server-side applications with Node.js, focusing on scalable and efficient solutions.",
      "Agile Project Management: Applied Kanban methodologies for effective project organization and team collaboration.",
    ],
  },
  {
    title: "First Certificate in English",
    period: "2016 - 2017",
    type: "education",
    institution: "Cambridge Assessment English Exams",
    location: "London, United Kingdom",
    details: [
      "Advanced Reading Skills: Developed the ability to comprehend complex texts and identify detailed information across various topics.",
      "Effective Writing Proficiency: Gained expertise in crafting clear, coherent, and well-structured written communication for different purposes.",
      "Listening and Comprehension: Improved listening skills for understanding a wide range of spoken materials, from interviews to academic discussions.",
      "Speaking Fluency: Mastered the art of clear and confident oral communication in English, including interactive and formal conversations.",
    ],
  },
  {
    title: "Automation & Control Engineering",
    period: "2006 - 2014",
    type: "education",
    institution: "Instituto Mauá de Tecnologia",
    location: "São Caetano do Sul, Brazil",
    details: [
      "Robotics and Automation: Gained expertise in designing and implementing automated systems and robotic solutions for industrial applications.",
      "Control Systems: Developed skills in analyzing and optimizing control processes to enhance efficiency and system performance.",
      "Electrical and Electronic Systems: Proficient in designing and troubleshooting complex electrical and electronic circuits for automation.",
      "Programming and Simulation: Hands-on experience in programming and simulating automation systems using tools like MATLAB and PLCs.",
      "Award-Winning Final Project: Led a group final project that won the ABB Award for Best Final Graduation Project, showcasing innovation and excellence in automation engineering.",
    ],
  },
];

export default function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const handleOpenModal = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="timeline" className="py-20 px-0">
      <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Journey
      </h2>
      <div className="relative flex flex-col items-center">
        {/* Timeline Line */}
        <div
          className="absolute h-[calc(100%+4rem)] w-1 bg-teal-400 left-1/2 rounded-full transform -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, #14b8a6, rgba(20, 184, 166, 0))",
          }}
        ></div>

        {timelineData.map((item, index) => (
          <div
            key={index}
            className={`relative w-full md:w-1/2 mb-12 ${
              index % 2 === 0 ? "self-start md:pl-0" : "self-end md:pr-0"
            }`}
          >
            <div
              className="relative max-w-xl p-6 mx-5 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onClick={() => handleOpenModal(item)}
            >
              {/* Title and Icon */}
              <div className="flex items-center mb-4">
                <div
                  className={`p-2.5 rounded-full mr-4 ${
                    item.type === "professional"
                      ? "bg-teal-400 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      item.type === "professional"
                        ? faBriefcase
                        : faGraduationCap
                    }
                    size="lg"
                  />
                </div>
                <h3 className="text-xl md:text-xl font-semibold text-gray-300">
                  {item.title}
                </h3>
              </div>
              {/* Period, Institution and Location */}
              <ul className="text-gray-400 list-disc ml-6 space-y-1 mt-6">
                <li>
                  <span className="font-medium text-gray-300">
                    {item.institution}
                  </span>
                </li>
                <li>{item.period}</li>
                <li>
                  <span className="font-medium text-gray-300">
                    {item.location}
                  </span>
                </li>
              </ul>
              {/* View More */}
              <p
                className="text-base text-gray-400 mt-4 mx-2.5 cursor-pointer hover:text-teal-400 transition"
                onClick={() => handleOpenModal(item)}
              >
                View more
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-8 bg-gray-900 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 px-2.5 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-300 mb-4">
              {selectedItem.title}
            </h3>
            <p className="text-gray-400 mb-4">{selectedItem.period}</p>
            <ul className="text-gray-300 list-disc ml-5 space-y-2">
              {selectedItem.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
