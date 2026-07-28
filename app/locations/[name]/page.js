import { supabase } from "@/lib/supabase";
import Gallery from "@/components/Gallery";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function LocationPage({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("location", decodedName)
    .order("created_at", { ascending: false });

  if (!photos || photos.length === 0) return notFound();

  const galleryPhotos = photos.map((p) => ({
    id: p.id,
    src: p.src,
    alt: p.caption || decodedName,
    caption: p.caption,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <Link
        href="/locations"
        className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
      >
        &larr; All locations
      </Link>
      <h1 className="text-3xl font-light mt-4">{decodedName}</h1>
      <div className="mt-10">
        <Gallery photos={galleryPhotos} />
      </div>
    </div>
  );
}
