"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AskFernando = dynamic(() => import("@/components/AskFernando"), {
  loading: () => (
    <div
      aria-hidden="true"
      className="fixed bottom-8 left-8 z-50 w-36 h-12 rounded-full animate-pulse"
      style={{ background: "var(--card-bg)" }}
    />
  ),
});
const CommandPalette = dynamic(() => import("@/components/CommandPalette"));
const InteractiveTerminal = dynamic(() => import("@/components/InteractiveTerminal"));

// The three overlays are user-initiated (floating button, Ctrl+K, Ctrl+`).
// Mounting them at hydration evaluates their chunks inside the load window
// and inflates TBT on mobile; deferring to browser idle moves that work
// outside the scored window without changing any interaction.
export default function DeferredOverlays() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <>
      <AskFernando />
      <CommandPalette />
      <InteractiveTerminal />
    </>
  );
}
