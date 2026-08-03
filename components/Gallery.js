"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { shimmerBlurDataURL } from "@/lib/photos";
import { useReveal } from "@/components/Reveal";

function PhotoTile({ photo, index, onClick }) {
  const reveal = useReveal((index % 6) * 60);
  const isVideo = photo.resource_type === "video";

  return (
    <button
      ref={reveal.ref}
      style={reveal.style}
      onClick={onClick}
      className={`block w-full break-inside-avoid relative rounded-lg overflow-hidden group ${reveal.className}`}
    >
      {isVideo ? (
        <>
          <video
            src={photo.src}
            className="w-full h-auto object-cover"
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <svg
              className="w-10 h-10 text-white drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </>
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={800}
          height={1000}
          placeholder="blur"
          blurDataURL={shimmerBlurDataURL()}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </button>
  );
}

export default function Gallery({ photos }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, prev, next]);

  async function handleDownload(photo) {
    try {
      const res = await fetch(photo.src);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const ext = photo.resource_type === "video" ? "mp4" : "jpg";
      link.download = photo.caption
        ? `${photo.caption.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${ext}`
        : `download.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Sorry, download failed. Try again.");
    }
  }

  return (
    <>
      <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
        {photos.map((photo, i) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            index={i}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={close}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white/70 hover:text-white text-2xl"
            onClick={close}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            className="flex flex-col items-center justify-center max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {photos[activeIndex].resource_type === "video" ? (
              <video
                src={photos[activeIndex].src}
                className="max-w-full object-contain rounded"
                style={{ maxHeight: "calc(100vh - 140px)" }}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={photos[activeIndex].src}
                alt={photos[activeIndex].alt}
                className="max-w-full object-contain rounded"
                style={{ maxHeight: "calc(100vh - 140px)" }}
              />
            )}
            <div className="flex items-center justify-center gap-3 mt-3 flex-shrink-0">
              {photos[activeIndex].caption && (
                <p className="text-white/60 text-sm mr-2">
                  {photos[activeIndex].caption}
                </p>
              )}
              <button
                onClick={() => handleDownload(photos[activeIndex])}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Download"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              <button
                onClick={async () => {
                  if (navigator.share) {
                    navigator.share({
                      url: photos[activeIndex].src,
                      title: photos[activeIndex].caption,
                    });
                  } else {
                    navigator.clipboard.writeText(photos[activeIndex].src);
                    alert("Link copied!");
                  }
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Share"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100 2.684m0-2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
