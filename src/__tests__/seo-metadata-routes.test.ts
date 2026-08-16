/**
 * @jest-environment node
 */
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const PROD_URL = "https://fernando-ghiberti.vercel.app";

describe("robots.ts", () => {
  const result = robots();

  it("allows the site root for all user agents", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  it("disallows API routes from indexing", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ disallow: "/api/" })
    );
  });

  it("references the production sitemap on the correct domain", () => {
    expect(result.sitemap).toBe(`${PROD_URL}/sitemap.xml`);
  });
});

describe("sitemap.ts", () => {
  const entries = sitemap();

  it("returns at least the homepage entry", () => {
    expect(entries.length).toBeGreaterThanOrEqual(1);
  });

  it("uses the production domain and top priority for the homepage", () => {
    const home = entries[0];
    expect(home).toBeDefined();
    expect(home?.url).toBe(PROD_URL);
    expect(home?.priority).toBe(1);
    expect(home?.lastModified).toBeInstanceOf(Date);
  });
});
