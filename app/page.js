import { getAlbums, getAlbumCover } from "@/lib/photos";
import AlbumGrid from "@/components/AlbumGrid";

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
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <h2 className="text-2xl md:text-2xl font-light tracking-tight">
          Photography by <span className="font-semibold">Vansh D</span>
        </h2>
        <p className="mt-4 text-black/60 dark:text-white/60 max-w-xl">
          A collection of my work. Browse the albums below, or get in touch
          about prints and bookings.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <AlbumGrid albums={albumsWithCovers} />
      </section>
    </div>
  );
}
