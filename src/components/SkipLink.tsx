"use client";

export default function SkipLink() {
  return (
    <a
      href="#hero"
      style={{
        position: "absolute",
        top: "-100px",
        left: "1rem",
        zIndex: 9999,
        padding: "0.5rem 1rem",
        background: "#14b8a6",
        color: "#fff",
        borderRadius: "0.5rem",
        fontWeight: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transition: "top 0.2s",
      }}
      onFocus={(e) => { e.currentTarget.style.top = "1rem"; }}
      onBlur={(e) => { e.currentTarget.style.top = "-100px"; }}
    >
      Skip to main content
    </a>
  );
}
