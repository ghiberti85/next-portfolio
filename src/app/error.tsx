"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // console.error is stripped in production by removeConsole; use this for dev only
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <h2 className="text-2xl font-semibold" style={{ color: "var(--color-heading)" }}>
        Something went wrong
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="text-xs font-mono opacity-50" style={{ color: "var(--color-text-muted)" }}>
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
        style={{ background: "var(--gradient-accent)" }}
      >
        Try again
      </button>
    </div>
  );
}
