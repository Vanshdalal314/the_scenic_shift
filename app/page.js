import { getAlbums, getAlbumCover } from "@/lib/photos";
import AlbumGrid from "@/components/AlbumGrid";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
  const albums = await getAlbums();
  const albumsWithCovers = await Promise.all(
    albums.map(async (album) => ({
      ...album,
      cover: await getAlbumCover(album.slug),
    })),
  );

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-2xl md:text-2xl font-light tracking-tight">
            Photography by <span className="font-semibold">Vansh D</span>
          </h2>
          <p className="mt-4 text-black/60 dark:text-white/60 max-w-xl">
            A collection of my work. Browse the albums below, or get in touch
            about prints and bookings.
          </p>
        </div>

        <Link
          href="/locations"
          className="inline-flex w-fit items-center gap-2 text-sm border border-black/20 dark:border-white/20 rounded-full px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Explore by place</span>
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <AlbumGrid albums={albumsWithCovers} />
      </section>
    </div>
  );
}
