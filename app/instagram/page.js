"use client";

import { useEffect, useState } from "react";

const profile = {
  handle: "v4n5h_d.1",
};

const reels = [
  { href: "https://www.instagram.com/reel/DasLJY1x0ZZ/" },
  { href: "https://www.instagram.com/reel/DajlECLCJbI/" },
  { href: "https://www.instagram.com/reel/DaKmK_SiJHH/" },
  { href: "https://www.instagram.com/reel/DU5kWlcAhV_/" },
  { href: "https://www.instagram.com/reel/DTiP7nsgrUF/" },
  { href: "https://www.instagram.com/reel/C-7sYTesCvx/" },
  { href: "https://www.instagram.com/reel/C1uKbb8Iv1w/" },
  { href: "https://www.instagram.com/reel/CyXqpl9Miq4/" },
  { href: "https://www.instagram.com/reel/CrtBk8rLz2r/" },
  { href: "https://www.instagram.com/reel/CpcuWFNjBp-/" },
];

const PAGE_SIZE = 6;

export default function InstagramPage() {
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-6 pb-16 text-center">
      <div className="flex flex-col items-center text-center mb-6">
        <svg
          className="w-8 h-8 mb-2"
          fill="url(#instaGradient)"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient
              id="instaGradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#feda75" />
              <stop offset="25%" stopColor="#fa7e1e" />
              <stop offset="50%" stopColor="#d62976" />
              <stop offset="75%" stopColor="#962fbf" />
              <stop offset="100%" stopColor="#4f5bd5" />
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      </div>

      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 flex-shrink-0">
            <img
              src="/insta_profile.png"
              alt="Vansh Dalal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <p className="font-medium">Vansh Dalal</p>
            <p className="text-sm text-black/50 dark:text-white/50">
              @v4n5h_d.1
            </p>
          </div>
        </div>
        <a
          href="https://instagram.com/v4n5h_d.1"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 transition-colors px-5 py-2 rounded text-sm font-medium"
        >
          Follow
        </a>
      </div>

      <div className="md:hidden grid grid-cols-2 gap-2 mt-10">
        {reels.slice(0, visible).map((reel, i) => (
          <a
            key={i}
            href={reel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden rounded-lg"
            style={{ height: "290px" }}
          >
            <div
              style={{
                width: "326px",
                transform: "scale(0.52)",
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={reel.href}
                data-instgrm-version="14"
                style={{ margin: 0, maxWidth: "326px", width: "326px" }}
              />
            </div>
            {/* Transparent tap layer covering the whole tile */}
            <span className="absolute inset-0" />
          </a>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 justify-items-center">
        {reels.slice(0, visible).map((reel, i) => (
          <blockquote
            key={i}
            className="instagram-media"
            data-instgrm-permalink={reel.href}
            data-instgrm-version="14"
            style={{ margin: 0, maxWidth: "328px", width: "100%" }}
          />
        ))}
      </div>

      {visible < reels.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-10 bg-blue-600 hover:bg-blue-500 transition-colors px-6 py-2 rounded text-sm font-medium"
        >
          Load more
        </button>
      )}
    </div>
  );
}
