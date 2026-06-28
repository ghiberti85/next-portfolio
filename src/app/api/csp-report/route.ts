import { type NextRequest, NextResponse } from "next/server";

const MAX_BODY = 4096;
const ALLOWED_TYPES = new Set(["application/csp-report", "application/json"]);

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const baseType = contentType.split(";")[0]?.trim() ?? "";
  if (!ALLOWED_TYPES.has(baseType)) {
    return new NextResponse(null, { status: 415 });
  }

  try {
    const text = await req.text();
    if (text.length > MAX_BODY) {
      return new NextResponse(null, { status: 413 });
    }
    const report = JSON.parse(text) as unknown;
    const violation =
      (report as Record<string, unknown>)["csp-report"] ?? report;
    console.error("[CSP Violation]", JSON.stringify(violation));
  } catch {
    // Malformed JSON — silently ignored; still return 204 so browsers don't retry
  }

  return new NextResponse(null, { status: 204 });
}
