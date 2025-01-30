"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Contact() {
  return (
    <section id="contact" className="py-16 px-4 lg:px-4 text-center">
      <h2 className="text-4xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Get in Touch
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Additional Content First on Mobile */}
        <div className="text-center lg:text-left max-w-lg order-1 lg:order-none">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Let&apos;s Collaborate!</h3>
          <p className="text-gray-400 mb-4">
          I am always eager to collaborate on innovative projects, exchange creative ideas, and explore new opportunities. Whether you&apos;re looking to build a cutting-edge web application, enhance user experience, or scale an existing platform, I&apos;d love to be part of your journey. Let&apos;s work together to craft exceptional digital solutions that make an impact.
          </p>
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Work With Me</h3>
          <p className="text-gray-400 mb-4">
          Whether you&apos;re a startup aiming to launch a standout product, a business seeking technical expertise, or a fellow developer passionate about learning and sharing knowledge, I am always open to meaningful conversations. I believe in building high-quality, scalable applications with a focus on performance and user experience. Feel free to reach out, and let&apos;s create something remarkable together!
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 order-2 lg:order-none">
          {/* Email Card */}
          <div 
            className="p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500">
                <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-300">E-mail</h4>
            <p className="text-gray-400 text-sm mb-4">Reach me via email for inquiries and opportunities.</p>
            <a
              href="mailto:ghiberti85@gmail.com"
              className="text-gray-400 hover:text-blue-400"
            >
              Send an Email
            </a>
          </div>

          {/* WhatsApp Card */}
          <div 
            className="p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-800">
                <FontAwesomeIcon icon={faWhatsapp} className="text-3xl text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-300">WhatsApp</h4>
            <p className="text-gray-400 text-sm mb-4">Chat with me directly on WhatsApp.</p>
            <a
              href="https://wa.me/5511996186115?text=Hello%20Fernando,%20I%20found%20your%20portfolio%20and%20I'd%20like%20to%20talk!"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-teal-400"
            >
              Message on WhatsApp
            </a>
          </div>

          {/* LinkedIn Card */}
          <div 
            className="p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500">
                <FontAwesomeIcon icon={faLinkedin} className="text-3xl text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-300">LinkedIn</h4>
            <p className="text-gray-400 text-sm mb-4">Connect with me on LinkedIn.</p>
            <a
              href="https://www.linkedin.com/in/ghiberti85/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400"
            >
              Visit my LinkedIn
            </a>
          </div>

          {/* GitHub Card */}
          <div 
            className="p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-800">
                <FontAwesomeIcon icon={faGithub} className="text-3xl text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-300">GitHub</h4>
            <p className="text-gray-400 text-sm mb-4">Check out my projects on GitHub.</p>
            <a
              href="https://github.com/ghiberti85"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-teal-500"
            >
              Visit my GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
