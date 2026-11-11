"use client";

import { LazyMotion, domMax } from "framer-motion";
import type { ReactNode } from "react";

// `domMax` is imported eagerly (not via a dynamic import()) on purpose.
// The previous lazy-loaded version fetched the feature bundle as a separate
// chunk after mount; on throttled mobile connections, AnimatedSection's
// `whileInView` (which depends on this bundle to attach its
// IntersectionObserver) could fail to register before the user scrolled a
// below-the-fold section past the viewport, permanently stranding it at
// `opacity: 0` (the `hidden` variant) — reported as "sections stop
// appearing on mobile after the first two." Bundling `domMax` eagerly here
// guarantees it's available the instant any `m.*` component mounts, so
// there's no timing window where the observer isn't live. This gives up the
// code-splitting win LazyMotion existed for (domMax is now part of the main
// bundle, same as importing `motion` directly would be) — reliability wins
// over that marginal, never-conclusively-measured bundle-size saving.
// `strict` is kept so any future `motion.*` usage (vs. `m.*`) still errors
// instead of silently reintroducing the full API a second way.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
