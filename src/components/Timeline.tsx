"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faGraduationCap, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t, { TimelineItemData as TimelineItem } from "@/lib/translations";

function TimelineCard({
  item,
  index,
  onOpen,
  viewMore,
}: {
  item: TimelineItem;
  index: number;
  onOpen: (item: TimelineItem) => void;
  viewMore: string;
}) {
  const isProfessional = item.type === "professional";
  return (
    <div
      className="relative p-4 sm:p-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer glass-card"
      onClick={() => onOpen(item)}
    >
      <div className="flex items-center mb-4">
        <div className={`p-2.5 rounded-full mr-4 ${isProfessional ? "bg-teal-400" : "bg-blue-500"} text-white`}>
          <FontAwesomeIcon icon={isProfessional ? faBriefcase : faGraduationCap} size="lg" />
        </div>
        <h3 className="text-base md:text-lg font-semibold" style={{ color: "var(--color-heading)" }}>
          {item.title}
        </h3>
      </div>
      <ul className="list-disc ml-6 space-y-1" style={{ color: "var(--color-text-muted)" }}>
        <li><span className="font-medium" style={{ color: "var(--color-text)" }}>{item.institution}</span></li>
        <li>{item.period}</li>
        <li><span className="font-medium" style={{ color: "var(--color-text)" }}>{item.location}</span></li>
      </ul>
      <p className="text-sm mt-4 cursor-pointer hover:text-teal-400 transition" style={{ color: "var(--color-text-muted)" }}>
        {viewMore}
      </p>
      {/* index dot for horizontal layout */}
      <div
        className="hidden lg:flex absolute -bottom-[2.35rem] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-teal-400 items-center justify-center text-[10px] font-bold text-teal-400"
        style={{ background: "var(--bg-from)" }}
        aria-hidden="true"
      >
        {index + 1}
      </div>
    </div>
  );
}

export default function Timeline() {
  const { lang } = useLanguage();
  const tr = t[lang].timeline;
  const timelineItems = tr.items;
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section id="timeline" className="py-20 px-0">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        {tr.title}
      </h2>

      {/* ── Mobile: vertical layout ──────────────────────────────────── */}
      <div className="lg:hidden relative flex flex-col items-center max-w-3xl mx-auto px-4">
        <div
          className="absolute h-full w-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{ background: "linear-gradient(to bottom, #14b8a6, rgba(20,184,166,0))" }}
        />
        {timelineItems.map((item, index) => (
          <div
            key={index}
            className={`relative w-full md:w-1/2 mb-12 ${index % 2 === 0 ? "self-start" : "self-end"}`}
          >
            <div className="mx-2 sm:mx-5">
              <TimelineCard item={item} index={index} onOpen={setSelectedItem} viewMore={tr.viewMore} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: horizontal scroll layout ───────────────────────── */}
      <div className="hidden lg:block relative max-w-7xl mx-auto px-12">
        {/* Scroll arrows */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-teal-400 hover:text-white hover:bg-teal-500 transition"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full text-teal-400 hover:text-white hover:bg-teal-500 transition"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="timeline-scroll overflow-x-auto pb-12 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-6 w-max px-4 relative">
            {/* Horizontal line */}
            <div
              className="absolute bottom-8 left-0 h-0.5 w-full"
              style={{ background: "linear-gradient(to right, rgba(20,184,166,0), #14b8a6 10%, #3b82f6 90%, rgba(59,130,246,0))" }}
              aria-hidden="true"
            />

            {timelineItems.map((item, index) => (
              <div key={index} className="w-72 flex-shrink-0 pb-8 relative">
                <TimelineCard item={item} index={index} onOpen={setSelectedItem} viewMore={tr.viewMore} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative p-5 sm:p-8 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--nav-bg)", border: "1px solid var(--card-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 px-2.5 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition transform hover:scale-110 shadow-lg"
            >
              ✕
            </button>
            <h3 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: "var(--color-heading)" }}>
              {selectedItem.title}
            </h3>
            <p className="mb-4" style={{ color: "var(--color-text-muted)" }}>{selectedItem.period}</p>
            <ul className="list-disc ml-5 space-y-2" style={{ color: "var(--color-text)" }}>
              {selectedItem.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
