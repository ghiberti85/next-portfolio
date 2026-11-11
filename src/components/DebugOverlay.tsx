"use client";

import { useEffect, useState } from "react";

// On-device diagnostics for bugs that only reproduce on real phones (e.g.
// iOS Safari), where no devtools are at hand. Opt-in via `?debug=1`
// (persists for the tab session); `?debug=0` turns it off. Strings are
// intentionally English-only — this is a developer tool, not site UI.

const STORAGE_KEY = "portfolio-debug";

interface Snapshot {
  ua: string;
  viewport: string;
  scrollY: number;
  scrollingElement: string;
  bodyScrollTop: number;
  docHeight: number;
  introSeen: boolean;
  introMounted: boolean;
  centerElement: string;
  sections: { id: string; top: number; height: number; opacity: string }[];
}

interface TouchStats {
  starts: number;
  moves: number;
  movesPrevented: number;
  lastTarget: string;
}

function describe(el: Element | null): string {
  if (!el) return "none";
  const id = el.id ? `#${el.id}` : "";
  const cls = typeof el.className === "string" && el.className
    ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
    : "";
  return `${el.tagName.toLowerCase()}${id}${cls}`;
}

function takeSnapshot(): Snapshot {
  const sections = Array.from(document.querySelectorAll("main section[id], footer")).map((el) => {
    const rect = el.getBoundingClientRect();
    const reveal = el.closest("[data-scroll-reveal]");
    const opacity = reveal ? getComputedStyle(reveal).opacity : getComputedStyle(el).opacity;
    return {
      id: el.id || el.tagName.toLowerCase(),
      top: Math.round(rect.top),
      height: Math.round(rect.height),
      opacity,
    };
  });

  return {
    ua: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight} (visual ${Math.round(window.visualViewport?.height ?? 0)})`,
    scrollY: Math.round(window.scrollY),
    scrollingElement: `${describe(document.scrollingElement)} top=${Math.round(document.scrollingElement?.scrollTop ?? 0)}`,
    bodyScrollTop: Math.round(document.body.scrollTop),
    docHeight: document.documentElement.scrollHeight,
    introSeen: sessionStorage.getItem("portfolio-intro-seen") === "1",
    introMounted: !!document.querySelector("[data-terminal-intro]"),
    centerElement: describe(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)),
    sections,
  };
}

export default function DebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [touch, setTouch] = useState<TouchStats>({ starts: 0, moves: 0, movesPrevented: 0, lastTarget: "none" });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("debug");
    if (param === "1") sessionStorage.setItem(STORAGE_KEY, "1");
    if (param === "0") sessionStorage.removeItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only opt-in read after hydration
    setEnabled(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const addError = (msg: string) => setErrors((prev) => [...prev.slice(-4), msg]);
    const onError = (e: ErrorEvent) => addError(`${e.message} @ ${e.filename?.split("/").pop()}:${e.lineno}`);
    const onRejection = (e: PromiseRejectionEvent) => addError(`unhandled rejection: ${String(e.reason)}`);
    const onTouchStart = (e: TouchEvent) =>
      setTouch((t) => ({ ...t, starts: t.starts + 1, lastTarget: describe(e.target as Element) }));
    // Registered on window (last in the bubble path), so defaultPrevented
    // reflects whether any listener on the page blocked native scrolling.
    const onTouchMove = (e: TouchEvent) =>
      setTouch((t) => ({ ...t, moves: t.moves + 1, movesPrevented: t.movesPrevented + (e.defaultPrevented ? 1 : 0) }));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const refresh = () => setSnapshot(takeSnapshot());
    refresh();
    const interval = setInterval(refresh, 500);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled || !snapshot) return null;

  const resetIntro = () => {
    sessionStorage.removeItem("portfolio-intro-seen");
    window.location.reload();
  };

  const disable = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setEnabled(false);
  };

  return (
    <div
      data-testid="debug-overlay"
      className="fixed bottom-0 left-0 right-0 z-[300] font-mono text-[10px] leading-tight p-2 overflow-y-auto"
      style={{ maxHeight: "45vh", background: "rgba(0,0,0,0.85)", color: "#a7f3d0" }}
    >
      <div className="flex gap-2 mb-1">
        <button onClick={resetIntro} className="px-2 py-1 rounded bg-teal-700 text-white">reset intro</button>
        <button onClick={disable} className="px-2 py-1 rounded bg-gray-700 text-white">close</button>
      </div>
      <p>{snapshot.ua}</p>
      <p>viewport {snapshot.viewport}</p>
      <p>scrollY {snapshot.scrollY} | {snapshot.scrollingElement} | body.scrollTop {snapshot.bodyScrollTop} | docH {snapshot.docHeight}</p>
      <p>intro seen={String(snapshot.introSeen)} mounted={String(snapshot.introMounted)}</p>
      <p>center: {snapshot.centerElement}</p>
      <p>touch start={touch.starts} move={touch.moves} prevented={touch.movesPrevented} last={touch.lastTarget}</p>
      {snapshot.sections.map((s) => (
        <p key={s.id}>
          {s.id}: top {s.top} h {s.height} opacity {s.opacity}
        </p>
      ))}
      {errors.length > 0 ? (
        errors.map((err, i) => <p key={i} style={{ color: "#fca5a5" }}>ERR {err}</p>)
      ) : (
        <p>no errors</p>
      )}
    </div>
  );
}
