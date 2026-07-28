"use client";

import { useState, useEffect, useRef } from "react";

export function useLocationSearch(query) {
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([]);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = await res.json();
        setResults(
          data.map((item) => {
            const addr = item.address || {};
            const name =
              addr.city ||
              addr.town ||
              addr.village ||
              item.display_name.split(",")[0];
            return {
              name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            };
          }),
        );
      } catch (err) {
        console.error("Location search failed:", err);
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return results;
}
