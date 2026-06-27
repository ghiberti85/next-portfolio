import { type NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Module-scope singleton — reused across warm serverless instances
let groqClient: Groq | null = null;

// ── Rate limiting ─────────────────────────────────────────────────
// In-memory sliding window — resets per serverless instance.
// Acceptable for a low-traffic portfolio; upgrade to Upstash Redis
// if traffic scales to multiple concurrent instances.
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;        // max requests per IP
const RATE_WINDOW = 60_000;   // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Evict expired entries to prevent unbounded memory growth
  for (const [key, val] of rateMap) {
    if (now > val.reset) rateMap.delete(key);
  }

  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Input constants ───────────────────────────────────────────────
const ALLOWED_ROLES = new Set(["user", "assistant"]);
const MAX_MSG_LENGTH = 2000;
const MAX_MESSAGES = 10;
const ALLOWED_LANGS = new Set(["en", "pt"]);

// ── System prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Fernando Ghiberti's AI assistant on his portfolio website. Answer questions about Fernando concisely and professionally, always in the same language the user writes in (Portuguese or English).

## About Fernando Ghiberti
- **Role**: Senior Fullstack Developer with 10+ years of experience
- **Location**: Brazil
- **Email**: ghiberti85@gmail.com
- **LinkedIn**: linkedin.com/in/fernandoghiberti
- **GitHub**: github.com/ghiberti85

## Skills
Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Storybook
Backend: Node.js, Supabase, PostgreSQL, REST APIs
AI Integration: Groq API, Claude API, OpenAI
Tools: Git, GitHub Actions, Vercel, Jest, React Testing Library, Turborepo, Radix UI, PWA

## Recent Projects
1. **DevInterviewLab** — AI-powered interview prep platform (Next.js, TypeScript, Supabase, Groq AI, PWA, Radix UI)
2. **Interview Command Center** — Real-time interview assistant (React, Vite, Supabase, Claude AI, PWA)
3. **Ghiberti UI** — Component library with Storybook (React, Next.js, Storybook, Turborepo, Radix UI)
4. **Finanças do Casal** — Couples finance manager (React, Vite, Supabase, Claude AI, PWA)

## Professional Background
Fernando is a Senior Fullstack Developer passionate about building high-quality web products with modern technologies. He specializes in React/Next.js frontends with Supabase backends, and has deep experience integrating AI APIs into production applications. He is available for new opportunities.

Answer factual questions about Fernando. If asked something you don't know about him, say you don't have that information and suggest contacting him directly.`;

// ── CORS helper ───────────────────────────────────────────────────
function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const allowed = [siteUrl, vercelUrl].filter(Boolean) as string[];

  // In production, require a configured origin. In development, allow all.
  const isProduction = process.env.NODE_ENV === "production";
  const allowOrigin =
    !origin || (!isProduction && allowed.length === 0) || allowed.includes(origin)
      ? (origin ?? "*")
      : null;

  return allowOrigin
    ? { "Access-Control-Allow-Origin": allowOrigin, "Access-Control-Allow-Methods": "POST, OPTIONS" }
    : null;
}

// ── Preflight ─────────────────────────────────────────────────────
export async function OPTIONS(req: NextRequest) {
  const headers = corsHeaders(req);
  if (!headers) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers });
}

// ── POST /api/chat ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // CORS check
  const cors = corsHeaders(req);
  if (!cors) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const raw = body as Record<string, unknown>;
    const { messages, lang } = raw;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Validate each message: role and content
    for (const msg of messages) {
      const m = msg as Record<string, unknown>;
      if (typeof m.role !== "string" || !ALLOWED_ROLES.has(m.role)) {
        return NextResponse.json({ error: "Invalid message role" }, { status: 400 });
      }
      if (typeof m.content !== "string" || m.content.length > MAX_MSG_LENGTH) {
        return NextResponse.json({ error: "Invalid message content" }, { status: 400 });
      }
    }

    // Validate lang — default to "en" if invalid/missing
    const safeLang = typeof lang === "string" && ALLOWED_LANGS.has(lang) ? lang : "en";

    const langInstruction =
      safeLang === "pt"
        ? "\n\nIMPORTANT: The user has the site in Portuguese. Always respond in Brazilian Portuguese."
        : "\n\nIMPORTANT: The user has the site in English. Always respond in English.";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    if (!groqClient) {
      groqClient = new Groq({ apiKey });
    }

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langInstruction },
        ...(messages as { role: "user" | "assistant"; content: string }[]).slice(-MAX_MESSAGES),
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response.";
    return NextResponse.json({ reply }, { headers: cors });
  } catch (err) {
    if (err instanceof Error && "status" in err) {
      const status = (err as Error & { status: number }).status;
      if (status === 429) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      if (status >= 500) return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
