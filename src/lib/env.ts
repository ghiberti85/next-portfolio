// Centralised environment-variable access.
//
// Rules:
//  - Server-only vars are exposed as functions so the bundler cannot
//    accidentally inline them into client chunks.
//  - Public vars are plain constants (NEXT_PUBLIC_ prefix already signals
//    that they are safe to ship to the browser).
//  - All access goes through this module — no bare process.env reads
//    scattered across route handlers or components.

const isDev = process.env["NODE_ENV"] !== "production";

// ── Public (browser-safe) ──────────────────────────────────────────
export const SITE_URL =
  process.env["NEXT_PUBLIC_SITE_URL"] ??
  (isDev ? "http://localhost:3000" : "");

// ── Server-only (use inside route handlers / server components) ────
export function groqApiKey(): string | undefined {
  return process.env["GROQ_API_KEY"];
}

export function vercelUrl(): string | undefined {
  return process.env["VERCEL_URL"];
}
