import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl font-light text-black/20 dark:text-white/20 mb-4">
        404
      </p>
      <h1 className="text-2xl font-light mb-4">Page not found</h1>
      <p className="text-black/50 dark:text-white/50 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-block border border-black/30 dark:border-white/30 px-6 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
