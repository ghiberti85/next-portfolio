"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]#$%&*";
const FRAME_MS = 35;
const REVEAL_PER_FRAME = 1.5;

interface DecryptTextProps {
  text: string;
  className?: string;
}

export default function DecryptText({ text, className }: DecryptTextProps) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    setDisplay(text);
    hasPlayed.current = false;
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const scramble = () => {
      let frame = 0;
      const totalFrames = Math.ceil(text.length / REVEAL_PER_FRAME) + 4;
      intervalId = setInterval(() => {
        frame += 1;
        const revealed = Math.floor(frame * REVEAL_PER_FRAME);
        if (frame >= totalFrames) {
          setDisplay(text);
          clearInterval(intervalId);
          return;
        }
        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " " || i < revealed) return char;
              return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? char;
            })
            .join("")
        );
      }, FRAME_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPlayed.current) {
            hasPlayed.current = true;
            scramble();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
