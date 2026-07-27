import { getAlbumMeta, getAlbumPhotos } from "@/lib/photos";
import Gallery from "@/components/Gallery";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const album = await getAlbumMeta(slug);
  if (!album) return {};
  return { title: `${album.title} | Your Name Photography` };
}

export default async function AlbumPage({ params }) {
  const { slug } = await params;
  const album = await getAlbumMeta(slug);
  if (!album) return notFound();

  const photos = await getAlbumPhotos(slug);

  const grouped = photos.reduce((acc, photo) => {
    const key = photo.location || album.title;
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/"
        className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
      >
        &larr; Back to albums
      </Link>
      <h1 className="text-3xl font-light mt-4">{album.title}</h1>
      <p className="text-black/60 dark:text-white/60 mt-2 max-w-xl">
        {album.description}
      </p>

      <div className="mt-10">
        {photos.length === 0 ? (
          <p className="text-black/40 dark:text-white/40">
            No photos in this album yet.
          </p>
        ) : (
          Object.entries(grouped).map(([location, locationPhotos]) => (
            <div key={location} className="mb-12">
              <h3 className="text-lg font-medium mb-4 text-black/80 dark:text-white/80">
                {location}
              </h3>
              <Gallery photos={locationPhotos} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
