"use client";

import { useState, useMemo } from "react";
import Gallery from "@/components/Gallery";

export default function AlbumContent({ photos, albumTitle }) {
  const [sortOrder, setSortOrder] = useState("earliest");

  const sortedPhotos = useMemo(() => {
    const sorted = [...photos];
    sorted.sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortOrder === "earliest" ? diff : -diff;
    });
    return sorted;
  }, [photos, sortOrder]);

  const grouped = useMemo(() => {
    return sortedPhotos.reduce((acc, photo) => {
      const key = photo.location || albumTitle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(photo);
      return acc;
    }, {});
  }, [sortedPhotos, albumTitle]);

  if (photos.length === 0) {
    return (
      <p className="text-black/40 dark:text-white/40">
        No photos in this album yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-xs border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white px-3 py-1.5 rounded"
        >
          <option value="earliest">Uploaded: Earliest first</option>
          <option value="latest">Uploaded: Latest first</option>
        </select>
      </div>

      {Object.entries(grouped).map(([location, locationPhotos]) => (
        <div key={location} className="mb-12">
          <h3 className="text-lg font-medium mb-4 text-black/80 dark:text-white/80">
            {location}
          </h3>
          <Gallery photos={locationPhotos} />
        </div>
      ))}
    </div>
  );
}
