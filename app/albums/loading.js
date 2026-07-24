export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
      <div className="h-10 w-80 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-4 w-96 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square md:aspect-[4/5] bg-black/5 dark:bg-white/5 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
