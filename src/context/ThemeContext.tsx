"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

interface ToggleOrigin {
  x: number;
  y: number;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: ToggleOrigin) => void;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    setTheme(next);
  };

  const toggleTheme = (origin?: ToggleOrigin) => {
    const next = theme === "dark" ? "light" : "dark";
    const doc = document as DocumentWithViewTransition;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      applyTheme(next);
      return;
    }

    const root = document.documentElement;
    root.style.setProperty("--theme-reveal-x", `${origin?.x ?? window.innerWidth / 2}px`);
    root.style.setProperty("--theme-reveal-y", `${origin?.y ?? 0}px`);
    doc.startViewTransition(() => {
      flushSync(() => applyTheme(next));
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
