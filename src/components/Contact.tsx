"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ContactCard {
  icon: IconDefinition;
  iconBg: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  linkColor: string;
  external?: boolean;
}

const cards: ContactCard[] = [
  {
    icon: faEnvelope,
    iconBg: "bg-blue-500",
    title: "E-mail",
    description: "Reach me via email for inquiries and opportunities.",
    linkLabel: "Send an Email",
    href: "mailto:ghiberti85@gmail.com",
    linkColor: "hover:text-blue-400",
  },
  {
    icon: faWhatsapp,
    iconBg: "bg-teal-400",
    title: "WhatsApp",
    description: "Chat with me directly on WhatsApp.",
    linkLabel: "Message on WhatsApp",
    href: "https://wa.me/5511996186115?text=Hello%20Fernando,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20talk!",
    linkColor: "hover:text-teal-400",
    external: true,
  },
  {
    icon: faLinkedin,
    iconBg: "bg-blue-500",
    title: "LinkedIn",
    description: "Connect with me on LinkedIn.",
    linkLabel: "Visit my LinkedIn",
    href: "https://www.linkedin.com/in/ghiberti85/",
    linkColor: "hover:text-blue-400",
    external: true,
  },
  {
    icon: faGithub,
    iconBg: "bg-teal-400",
    title: "GitHub",
    description: "Check out my projects on GitHub.",
    linkLabel: "Visit my GitHub",
    href: "https://github.com/ghiberti85",
    linkColor: "hover:text-teal-400",
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 lg:px-4">
      <h2 className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Get in Touch
      </h2>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Text column */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">
            Let&apos;s Collaborate!
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            I am always eager to collaborate on innovative projects, exchange
            creative ideas, and explore new opportunities. Whether you&apos;re
            looking to build a cutting-edge web application, enhance user
            experience, or scale an existing platform, I&apos;d love to be part
            of your journey.
          </p>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">
            Work With Me
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Whether you&apos;re a startup aiming to launch a standout product, a
            business seeking technical expertise, or a fellow developer
            passionate about learning and sharing knowledge, I am always open to
            meaningful conversations. Feel free to reach out — let&apos;s create
            something remarkable together!
          </p>
        </div>

        {/* Cards grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map(({ icon, iconBg, title, description, linkLabel, href, linkColor, external }) => (
            <div
              key={title}
              className="flex flex-col items-center p-6 rounded-lg shadow-lg hover:scale-105 transition-transform text-center"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="flex justify-center mb-4">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${iconBg}`}>
                  <FontAwesomeIcon icon={icon} className="text-2xl text-white" />
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-300 text-center mb-1">{title}</h4>
              <p className="text-gray-400 text-sm text-center mb-4 flex-1">{description}</p>
              <div className="text-center">
                <a
                  href={href}
                  className={`text-sm text-gray-400 transition-colors ${linkColor}`}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {linkLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
