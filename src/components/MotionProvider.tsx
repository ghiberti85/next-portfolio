"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Importing `motion` directly bakes in framer-motion's full feature set
// (drag, pan, gestures, layout projection) into the main bundle regardless
// of which components actually use them — most of ours only need basic
// opacity/transform animations. LazyMotion + the `m` component (used
// throughout instead of `motion`) defers loading the feature bundle to a
// separate chunk fetched after mount, and `domMax` (rather than the
// smaller `domAnimation`) is required because ProjectsGrid's expand-to-
// modal transition uses `layoutId`, which needs the layout-projection
// feature only `domMax` includes.
const loadFeatures = () => import("framer-motion").then((res) => res.domMax);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
