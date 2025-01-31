/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    modern: true, // ✅ Enables modern JavaScript bundling
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // ✅ Removes console logs in production
  },
  swcMinify: true, // ✅ Uses Next.js's built-in SWC minifier
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "static.cdnlogo.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true, // Enable SVG images
    contentSecurityPolicy: "default-src 'self'; img-src *; media-src *; connect-src *",
  },
};

module.exports = nextConfig;