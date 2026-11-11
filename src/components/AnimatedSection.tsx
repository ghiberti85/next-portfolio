"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionVariant = "fadeUp" | "stagger" | "launch" | "reveal" | "flip";

const variants: Record<SectionVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 },
    },
  },
  launch: {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  },
  reveal: {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 12, y: 30 },
    show: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
};

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: SectionVariant;
}

// How long to wait for the section to scroll into view before showing it
// anyway. Protects against any failure mode that could otherwise leave a
// section permanently at `opacity: 0` — an async-loaded animation engine
// not ready yet, a degenerate margin calculation on a short section,
// anything not foreseen here. Content must never depend on a single
// mechanism to become visible at all.
const SAFETY_NET_MS = 2500;

export default function AnimatedSection({
  children,
  delay = 0,
  className,
  variant = "fadeUp",
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown) return;

    const el = ref.current;
    const reveal = () => setShown(true);

    let observer: IntersectionObserver | undefined;
    if (el) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        { rootMargin: "-80px" }
      );
      observer.observe(el);
    }

    const timer = setTimeout(reveal, SAFETY_NET_MS);

    return () => {
      observer?.disconnect();
      clearTimeout(timer);
    };
  }, [shown]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const v = variants[variant];

  return (
    <m.div
      ref={ref}
      variants={v}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      transition={{ delay }}
      className={className}
      style={variant === "flip" ? { perspective: 800 } : undefined}
    >
      {children}
    </m.div>
  );
}
