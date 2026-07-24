import { supabase } from "@/lib/supabase";

export async function getAlbums() {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching albums:", error.message);
    return [];
  }
  return data;
}

export async function getAlbumMeta(slug) {
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getAlbumPhotos(slug) {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("album", slug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error.message);
    return [];
  }
  return data.map((p) => ({
    id: p.id,
    src: p.src,
    alt: p.caption || slug,
    caption: p.caption,
    resource_type: p.resource_type,
  }));
}

export async function getAlbumCover(slug) {
  const photos = await getAlbumPhotos(slug);
  return photos[0]?.src || "/file.svg";
}

export function shimmerBlurDataURL() {
  const shimmer = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#1a1a1a"/>
    </svg>`;
  const toBase64 = (str) =>
    typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);
  return `data:image/svg+xml;base64,${toBase64(shimmer)}`;
}