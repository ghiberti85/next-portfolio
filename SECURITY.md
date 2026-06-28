# Security Policy

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue in this project, please report it responsibly by emailing:

**[ghiberti85@gmail.com](mailto:ghiberti85@gmail.com)**

Include in your report:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

You can expect an acknowledgement within **48 hours** and a resolution timeline within **7 days** for confirmed issues.

---

## Supported Versions

This is a personal portfolio. Only the latest version on `main` is actively maintained.

| Branch | Supported |
|---|---|
| `main` | ✅ Yes |
| all others | ❌ No |

---

## Security Architecture

### HTTP Layer (`next.config.ts` + `src/middleware.ts`)

| Control | Implementation |
|---|---|
| Content-Security-Policy | Per-request nonce; no `unsafe-eval` in production; `report-uri /api/csp-report` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options | `SAMEORIGIN` — prevents clickjacking |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Camera, microphone, geolocation disabled |
| frame-ancestors | `'none'` in CSP |

### API Route (`/api/chat`)

| Control | Detail |
|---|---|
| Rate limiting | 20 requests / IP / minute; expired entries evicted to prevent memory growth |
| Role allowlist | Only `"user"` and `"assistant"` accepted — prevents role injection |
| Content length | Messages capped at 2,000 characters each, max 10 messages per request |
| Language allowlist | `lang` restricted to `["en", "pt"]` — never interpolated raw into the LLM prompt |
| CORS | Restricted to `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` in production; fail-closed (403) if no allowed origin matches |
| JSON parse guard | Malformed bodies return 400 before any processing |
| API key guard | Returns 503 when `GROQ_API_KEY` is absent |

### Supply Chain

| Control | Detail |
|---|---|
| GitHub Actions | All three actions (`checkout`, `setup-node`, `cache`) pinned to full SHA |
| Dependabot | Weekly PRs for npm and GitHub Actions updates |
| `npm audit` | Recommended before every release; run `npm audit --audit-level=high` to gate on critical/high only |

### Client Side

- No secrets stored in `localStorage` or `sessionStorage`
- No `dangerouslySetInnerHTML` with user-supplied content
- No `eval()` anywhere in the codebase
- `console.*` calls stripped in production builds (`removeConsole: true`)
