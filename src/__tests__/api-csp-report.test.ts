/**
 * @jest-environment node
 */
import { POST } from "@/app/api/csp-report/route";
import { NextRequest } from "next/server";

function makeRequest(body: string, contentType = "application/csp-report") {
  return new NextRequest("http://localhost/api/csp-report", {
    method: "POST",
    body,
    headers: { "content-type": contentType },
  });
}

describe("POST /api/csp-report", () => {
  it("returns 204 for a valid CSP report", async () => {
    const body = JSON.stringify({
      "csp-report": { "violated-directive": "script-src", "blocked-uri": "inline" },
    });
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(204);
  });

  it("returns 415 for unsupported content-type", async () => {
    const res = await POST(makeRequest("{}", "text/plain"));
    expect(res.status).toBe(415);
  });

  it("returns 413 when body exceeds the size limit", async () => {
    const body = JSON.stringify({ "csp-report": { data: "x".repeat(5000) } });
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(413);
  });

  it("returns 204 for malformed JSON (silently ignored)", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(204);
  });

  it("returns 204 for application/json content-type", async () => {
    const body = JSON.stringify({ "violated-directive": "style-src" });
    const res = await POST(makeRequest(body, "application/json"));
    expect(res.status).toBe(204);
  });
});
