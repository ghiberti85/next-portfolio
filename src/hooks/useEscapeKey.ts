import { useEffect } from "react";

export function useEscapeKey(isActive: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isActive, onClose]);
}
