"use client";

import { useState, useMemo } from "react";
import AlbumCard from "@/components/AlbumCard";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Updated" },
  { value: "date_desc", label: "Date Added (Newest)" },
  { value: "date_asc", label: "Date Added (Oldest)" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];

function sortAlbums(albums, sortBy) {
  const sorted = [...albums];
  switch (sortBy) {
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at) -
          new Date(a.updated_at || a.created_at),
      );
    case "date_desc":
      return sorted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    case "date_asc":
      return sorted.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    case "name_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

export default function AlbumGrid({ albums }) {
  const [sortBy, setSortBy] = useState("recent");
  const sortedAlbums = useMemo(
    () => sortAlbums(albums, sortBy),
    [albums, sortBy],
  );

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-4">
        <svg
          className="w-4 h-4 text-black/50 dark:text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9M3 12h5m8-8v16m0 0l-4-4m4 4l4-4"
          />
        </svg>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white px-3 py-1.5 rounded"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {sortedAlbums.map((album, index) => (
          <AlbumCard key={album.slug} album={album} index={index} />
        ))}
      </div>
    </div>
  );
}
