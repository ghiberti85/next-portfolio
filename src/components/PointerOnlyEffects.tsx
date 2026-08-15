"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MouseSpotlight = dynamic(() => import("@/components/MouseSpotlight"));
const CustomCursor = dynamic(() => import("@/components/CustomCursor"));

// Gates the dynamic import itself behind a pointer-device check, so touch
// devices never fetch/parse/hydrate these chunks at all — not just skip
// their effects after mounting.
export default function PointerOnlyEffects() {
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    setIsPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!isPointerFine) return null;

  return (
    <>
      <MouseSpotlight />
      <CustomCursor />
    </>
  );
}
