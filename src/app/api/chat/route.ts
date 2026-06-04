import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
