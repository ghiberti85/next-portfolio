"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";
import StatsCounter from "@/components/StatsCounter";

const Typewriter = dynamic(() => import("typewriter-effect"), { ssr: false });

export default function Hero() {
  const { lang } = useLanguage();
  const tr = t[lang].hero;
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 pt-24 pb-12 lg:py-16 gap-8 lg:gap-16"
    >
      {/* Left Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center space-y-5 py-8 px-4 rounded-lg shadow-lg glass-card">
        {/* Profile Picture */}
        <div
          className="relative w-40 h-40 rounded-full p-1"
          style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}
        >
          <div className="rounded-full bg-gray-900 p-1">
            <Image
              src="https://github.com/ghiberti85.png"
              alt="Fernando Ghiberti"
              width={160}
              height={160}
              className="rounded-full"
              priority
              loading="eager"
            />
          </div>
        </div>

        <span className="text-4xl font-extrabold leading-none text-center">{tr.greeting}</span>
        <h1
          className="text-3xl lg:text-4xl font-extrabold text-center text-transparent bg-clip-text"
          style={{ backgroundImage: "var(--gradient-accent)" }}
        >
          I&apos;m Fernando Ghiberti
        </h1>
        <p className="text-xl text-center" style={{ color: "var(--color-text)" }}>
          {tr.role}
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 mt-4" style={{ color: "var(--color-text)" }}>
          {[
            { icon: faEnvelope, link: "mailto:ghiberti85@gmail.com", label: "Send an Email" },
            {
              icon: faWhatsapp,
              link: "https://wa.me/5511996186115?text=Hello%20Fernando,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20talk!",
              label: "Chat on WhatsApp",
            },
            { icon: faLinkedin, link: "https://linkedin.com/in/fernando-ghiberti", label: "LinkedIn Profile" },
            { icon: faGithub, link: "https://github.com/ghiberti85", label: "GitHub Profile" },
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

        {/* Download CV */}
        <div className="mt-4">
          <a
            href="/fernando-ghiberti-cv-en.pdf"
            download="Fernando_Ghiberti_CV.pdf"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            <FontAwesomeIcon icon={faFileDownload} className="w-5 h-5" />
            <span>{tr.downloadCV}</span>
          </a>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-2 lg:px-0">
        {/* Mobile typewriter — single pass that settles on the last string:
            an infinite loop keeps mutating text forever, which delays LCP
            finalization and adds perpetual main-thread work on throttled
            mobile CPUs (desktop keeps looping — see desktop instance below). */}
        <h2 className="text-xl font-semibold mb-6 lg:hidden" style={{ color: "var(--color-text)" }}>
          <Typewriter
            key={lang}
            options={{ autoStart: false, loop: false, delay: 75 }}
            onInit={(tw) => {
              tr.typewriterMobile.forEach((s, i) => {
                tw.typeString(s);
                if (i < tr.typewriterMobile.length - 1) {
                  tw.pauseFor(1800).deleteAll();
                }
              });
              tw.start();
            }}
          />
        </h2>

        {/* Desktop typewriter */}
        <h2 className="text-xl lg:text-3xl font-semibold mb-6 hidden lg:block" style={{ color: "var(--color-text)" }}>
          <Typewriter
            options={{ strings: tr.typewriterDesktop, autoStart: true, loop: true, delay: 75 }}
          />
        </h2>

        <p className="text-lg mb-6" style={{ color: "var(--color-text-muted)" }}>
          {tr.description}
        </p>

        <StatsCounter />
      </div>
    </section>
  );
}
