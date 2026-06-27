import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Fernando Ghiberti",
};

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center"
      style={{ background: "linear-gradient(135deg, var(--bg-from, #0f172a), var(--bg-to, #1e293b))" }}
    >
      <h1
        className="text-8xl font-extrabold text-transparent bg-clip-text"
        style={{ backgroundImage: "var(--gradient-accent, linear-gradient(135deg, #14b8a6, #3b82f6))" }}
      >
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-300">Page not found</h2>
      <p className="text-sm text-gray-400 max-w-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
        style={{ background: "var(--gradient-accent, linear-gradient(135deg, #14b8a6, #3b82f6))" }}
      >
        Back to portfolio
      </Link>
    </div>
  );
}
