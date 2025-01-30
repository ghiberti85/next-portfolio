"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dynamic from "next/dynamic";

const Typewriter = dynamic(() => import("typewriter-effect"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 py-16 gap-20"
    >
      {/* Left Column */}
      <div
        className="lg:w-1/2 flex flex-col justify-center items-center space-y-6 py-8 px-4 rounded-lg shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Profile Picture */}
        <div
          className="relative w-40 h-40 rounded-full p-1"
          style={{
            background: "linear-gradient(135deg, #9333ea, #3b82f6)",
          }}
        >
          <div className="rounded-full bg-gray-900 p-1">
            <Image
              src="https://github.com/ghiberti85.png"
              alt="Profile Picture"
              width={160}
              height={160}
              className="rounded-full"
              priority
              loading="eager"
            />
          </div>
        </div>

        {/* Info */}
        <span className="text-4xl text-gray-300 font-extrabold leading-none text-center">
          Hi! 👋
        </span>
        <h1
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(135deg, #14b8a6, #6366f1)",
          }}
        >
          I&apos;m Fernando Ghiberti
        </h1>
        <p className="text-xl text-gray-300 text-center">
          Software Engineer | Frontend Expert
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 mt-4 text-gray-300">
          {[
            { icon: faGithub, link: "https://github.com/ghiberti85", label: "GitHub Profile" },
            { icon: faLinkedin, link: "https://linkedin.com/in/fernando-ghiberti", label: "LinkedIn Profile" },
            { icon: faEnvelope, link: "mailto:ghiberti85@gmail.com", label: "Send an Email" },
          ].map(({ icon, link, label }, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:scale-110 hover:text-teal-400 transition-transform duration-300"
            >
              <FontAwesomeIcon icon={icon} className="w-7 h-7" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>

        {/* Download CV Button */}
        <div className="mt-4">
          <a
            href="/resume-fernando-ghiberti.pdf"
            download="Fernando_Ghiberti_CV.pdf"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            <FontAwesomeIcon icon={faFileDownload} className="w-5 h-5" />
            <span>Download CV</span>
          </a>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center text-gray-300 text-center px-4 lg:px-0">
        <h2 className="text-3xl font-semibold mb-6">
          <Typewriter
            options={{
              strings: [
                "Building modern web applications.",
                "Specialist in React and Next.js.",
                "Transforming ideas into reality.",
              ],
              autoStart: true,
              loop: true,
              delay: 75,
            }}
          />
        </h2>
        <p className="text-lg mb-6">
          Crafting high-performance, user-friendly interfaces with a focus on delivering
          exceptional user experiences.
        </p>
      </div>
    </section>
  );
}
