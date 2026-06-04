"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t, { TimelineItemData as TimelineItem } from "@/lib/translations";


export default function Timeline() {
  const { lang } = useLanguage();
  const tr = t[lang].timeline;
  const timelineItems = tr.items;
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenModal = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="timeline" className="py-20 px-0">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>
      <div className="relative flex flex-col items-center max-w-6xl mx-auto px-4">
        {/* Timeline Line */}
        <div
          className="absolute h-[calc(100%+4rem)] w-1 bg-teal-400 left-1/2 rounded-full transform -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, #14b8a6, rgba(20, 184, 166, 0))",
          }}
        ></div>

        {timelineItems.map((item, index) => (
          <div
            key={index}
            className={`relative w-full md:w-1/2 mb-12 ${
              index % 2 === 0 ? "self-start md:pl-0" : "self-end md:pr-0"
            }`}
          >
            <div
              className="relative max-w-xl p-4 sm:p-6 mx-2 sm:mx-5 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
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
                {tr.viewMore}
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
            className="relative p-5 sm:p-8 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--nav-bg)", border: "1px solid var(--card-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 px-2.5 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: "var(--color-heading)" }}>
              {selectedItem.title}
            </h3>
            <p className="mb-4" style={{ color: "var(--color-text-muted)" }}>{selectedItem.period}</p>
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
