import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

export default async function LocationsPage() {
  const { data: photosWithLocation } = await supabase
    .from("photos")
    .select("location")
    .not("location", "is", null);

  const usedLocationNames = [
    ...new Set(
      (photosWithLocation || [])
        .map((p) => p.location)
        .filter((loc) => loc && loc.trim() !== ""),
    ),
  ].sort();

  const { data: untaggedPhotos } = await supabase
    .from("photos")
    .select("album")
    .is("location", null);

  const { data: allAlbums } = await supabase
    .from("albums")
    .select("slug, title");

  const albumsWithUntagged = [
    ...new Set((untaggedPhotos || []).map((p) => p.album)),
  ]
    .map((slug) => allAlbums?.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/"
        className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
      >
        &larr; Back to albums
      </Link>

      <h1 className="text-3xl font-light mt-4 mb-2">Locations</h1>
      <p className="text-black/60 dark:text-white/60 mb-8 max-w-xl">
        Explore where these photos were taken. Tap a place name below to see
        every photo shot there — across all albums.
      </p>

      <div className="flex flex-wrap gap-2">
        {usedLocationNames.map((name) => (
          <Link
            key={name}
            href={`/locations/${encodeURIComponent(name)}`}
            className="text-sm border border-black/20 dark:border-white/20 rounded-full px-4 py-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            {name}
          </Link>
        ))}

        {albumsWithUntagged.map((album) => (
          <Link
            key={album.slug}
            href={`/albums/${album.slug}`}
            className="text-sm border border-black/20 dark:border-white/20 rounded-full px-4 py-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            {album.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
