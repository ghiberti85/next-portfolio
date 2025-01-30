/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Added placeholder domain
      },
      {
        protocol: "https",
        hostname: "media0.giphy.com", // Added Giphy domain
        pathname: "/media/**", // Specific path for Giphy
      },
      {
        protocol: "https",
        hostname: "static.cdnlogo.com", // Added CDN Logo domain
      },
    ],
    domains: ["placehold.co", "cdn.jsdelivr.net"],
    dangerouslyAllowSVG: true, // Enable SVG images
    contentSecurityPolicy: "default-src 'self'; img-src *; media-src *; connect-src *",
  },
};

module.exports = nextConfig;
