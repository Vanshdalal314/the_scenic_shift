"use client";

import { useState, useMemo } from "react";
import Gallery from "@/components/Gallery";

export default function SortablePhotoGroup({ photos }) {
  const [sortOrder, setSortOrder] = useState("earliest");

  const sortedPhotos = useMemo(() => {
    const sorted = [...photos];
    sorted.sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortOrder === "earliest" ? diff : -diff;
    });
    return sorted;
  }, [photos, sortOrder]);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-xs border border-black/20 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white px-3 py-1.5 rounded"
        >
          <option value="earliest">Uploaded: Earliest first</option>
          <option value="latest">Uploaded: Latest first</option>
        </select>
      </div>
      <Gallery photos={sortedPhotos} />
    </div>
  );
}