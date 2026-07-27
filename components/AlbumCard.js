"use client";

import Link from "next/link";
import Image from "next/image";
import { useReveal } from "@/components/Reveal";

export default function AlbumCard({ album, index }) {
  const reveal = useReveal(index * 60);

  return (
    <Link
      href={`/albums/${album.slug}`}
      ref={reveal.ref}
      style={reveal.style}
      className={`group relative aspect-square md:aspect-[4/5] overflow-hidden rounded-lg ${reveal.className}`}
    >
      <Image
        src={album.cover}
        alt={album.title}
        fill
        priority={index === 0}
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3 md:p-5">
        <h2 className="text-sm md:text-xl font-medium text-white">
          {album.title}
        </h2>
        <p className="text-xs md:text-sm text-white/70 mt-0.5 md:mt-1 line-clamp-1">
          {album.description}
        </p>
      </div>
    </Link>
  );
}
