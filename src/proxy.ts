import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TEMPORARY DIAGNOSTIC (revert after test): script-src nonce replaced with
// 'unsafe-inline' to test whether Next.js's own nonce-detection/injection
// machinery for its internal bootstrap scripts — only active when a
// 'nonce-X' token is present in the CSP header at all — is what triggers
// the React #418 hydration error PSI keeps flagging. This app already had
// one confirmed nonce-related hydration bug (the JSON-LD script, fixed
// earlier), and most Next.js apps don't implement strict per-request CSP
// nonces at all, which would explain why this doesn't show up elsewhere.
// DO NOT merge this to main permanently — it's a real, if temporary,
// weakening of script-src (AGENTS.md security checklist).
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://github.com https://raw.githubusercontent.com https://cdn.jsdelivr.net https://static.cdnlogo.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
