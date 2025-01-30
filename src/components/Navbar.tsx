"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "#hero" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Timeline", href: "#timeline" },
    { name: "Contact", href: "#contact" },
  ];

  const handleScroll = (href: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu if open
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 bg-opacity-80 backdrop-blur-lg bg-gray-900 text-white lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#hero"
          className="text-2xl font-bold "
          onClick={(e) => {
            e.preventDefault();
            handleScroll("#hero");
          }}
        >
          Portfolio
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6">
          {links.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(href);
                }}
                className="hover:text-teal-400 transition-colors"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden flex flex-col space-y-6 px-6 py-6">
          {links.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                handleScroll(href);
              }}
              className="hover:text-gray-400 transition-colors"
            >
              {name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
