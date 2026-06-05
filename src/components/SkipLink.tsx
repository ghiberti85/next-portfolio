"use client";

export default function SkipLink() {
  return (
    <a
      href="#hero"
      style={{
        position: "fixed",
        top: "1rem",
        left: "1rem",
        zIndex: 9999,
        padding: "0.5rem 1rem",
        background: "#14b8a6",
        color: "#fff",
        borderRadius: "0.5rem",
        fontWeight: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transform: "translateY(-200%)",
        transition: "transform 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
      onBlur={(e) => { e.currentTarget.style.transform = "translateY(-200%)"; }}
    >
      Skip to main content
    </a>
  );
}
