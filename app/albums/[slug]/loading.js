export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <div className="h-4 w-20 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-8 w-48 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-10" />
      <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-black/5 dark:bg-white/5 rounded-lg animate-pulse break-inside-avoid"
          />
        ))}
      </div>
    </div>
  );
}
