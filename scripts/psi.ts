// Queries the PageSpeed Insights API for the deployed site and prints
// Lighthouse category scores plus every failing audit, for both mobile and
// desktop. Lets agents (and humans) verify a PSI change without pasting the
// URL into the web UI by hand.
//
// Usage:
//   npm run psi                          # production URL, mobile + desktop
//   npm run psi -- --url=https://...     # override the URL (e.g. a preview deploy)
//
// PSI_API_KEY is optional but strongly recommended — the unauthenticated
// quota is low enough to 429 within a handful of requests. Get a free key
// at https://developers.google.com/speed/docs/insights/v5/get-started and
// put it in .env.local.

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { psiApiKey } from "../src/lib/env";

const DEFAULT_URL = "https://fernando-ghiberti.vercel.app/";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;
type Category = (typeof CATEGORIES)[number];
type Strategy = "mobile" | "desktop";

interface Audit {
  id: string;
  title: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
}

interface PsiResponse {
  lighthouseResult?: {
    categories: Record<Category, { score: number | null }>;
    audits: Record<string, Audit>;
  };
  error?: { message: string };
}

function loadDotEnvLocal(): void {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!key || process.env[key] !== undefined) continue;
    process.env[key] = rawValue?.replace(/^["']|["']$/g, "") ?? "";
  }
}

function parseArgs(argv: string[]): { url: string } {
  const urlArg = argv.find((a) => a.startsWith("--url="));
  return { url: urlArg ? urlArg.slice("--url=".length) : DEFAULT_URL };
}

async function runPsi(url: string, strategy: Strategy, apiKey: string | undefined): Promise<PsiResponse> {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  for (const category of CATEGORIES) endpoint.searchParams.append("category", category);
  if (apiKey) endpoint.searchParams.set("key", apiKey);

  const res = await fetch(endpoint.toString());
  const body = (await res.json()) as PsiResponse;
  if (!res.ok || body.error) {
    throw new Error(body.error?.message ?? `PSI request failed with HTTP ${res.status}`);
  }
  return body;
}

function scorePct(score: number | null | undefined): number {
  return Math.round((score ?? 0) * 100);
}

function printReport(strategy: Strategy, result: PsiResponse): void {
  const lh = result.lighthouseResult;
  if (!lh) {
    console.log(`  (no lighthouseResult for ${strategy})`);
    return;
  }

  console.log(`\n=== ${strategy.toUpperCase()} ===`);
  for (const category of CATEGORIES) {
    console.log(`  ${category.padEnd(15)} ${scorePct(lh.categories[category]?.score)}`);
  }

  const failing = Object.values(lh.audits).filter(
    (a) =>
      a.score !== null &&
      a.score < 1 &&
      !["manual", "notApplicable", "informative"].includes(a.scoreDisplayMode)
  );
  if (failing.length === 0) return;

  console.log(`  Failing audits:`);
  for (const audit of failing.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))) {
    const extra = audit.displayValue ? ` — ${audit.displayValue}` : "";
    console.log(`    [${scorePct(audit.score)}] ${audit.title}${extra} (${audit.id})`);
  }
}

async function main(): Promise<void> {
  loadDotEnvLocal();
  const { url } = parseArgs(process.argv.slice(2));
  const apiKey = psiApiKey();
  if (!apiKey) {
    console.warn(
      "No PSI_API_KEY set — running unauthenticated. The PSI API's unauthenticated quota " +
        "is low and may 429. Get a free key at " +
        "https://developers.google.com/speed/docs/insights/v5/get-started and add it to .env.local.\n"
    );
  }

  console.log(`PageSpeed Insights report for ${url}`);

  let hadError = false;
  for (const strategy of ["mobile", "desktop"] as const) {
    try {
      const result = await runPsi(url, strategy, apiKey);
      printReport(strategy, result);
    } catch (err) {
      hadError = true;
      console.error(`\n=== ${strategy.toUpperCase()} ===\n  Error: ${(err as Error).message}`);
    }
  }

  if (hadError) process.exitCode = 1;
}

void main();
