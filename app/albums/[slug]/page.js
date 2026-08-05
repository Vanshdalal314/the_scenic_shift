import { getAlbumMeta, getAlbumPhotos } from "@/lib/photos";
import AlbumContent from "@/components/AlbumContent";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const album = await getAlbumMeta(slug);
  if (!album) return {};
  return { title: `${album.title} | Vansh D` };
}

export default async function AlbumPage({ params }) {
  const { slug } = await params;
  const album = await getAlbumMeta(slug);
  if (!album) return notFound();

  const photos = await getAlbumPhotos(slug);

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
        <AlbumContent photos={photos} albumTitle={album.title} />
      </div>
    </div>
  );
}
