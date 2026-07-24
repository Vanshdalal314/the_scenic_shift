export const metadata = { title: "YouTube | The Scenic Shift" };

export default function YouTubePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 pb-16">
      <div className="flex flex-col items-center text-center mb-8">
        <svg className="w-9 h-9 mb-2" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <h1 className="text-3xl font-light">YouTube</h1>
        <p className="text-black/60 dark:text-white/60 mt-2 max-w-xl">
          A look at my latest video — subscribe on YouTube to catch new uploads.
        </p>
      </div>

      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/odx-eR-q3nw?autoplay=1&mute=1&rel=0"
          title="Featured video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 flex-shrink-0">
            <img
              src="/insta_profile.png"
              alt="Channel logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium">The Scenic Shift</p>
        </div>

        <a
          href="https://youtube.com/@TheScenicShift-o5o?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#CC0000] transition-colors px-4 py-1.5 rounded text-xs font-medium text-white"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="white">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Subscribe
        </a>
      </div>
    </div>
  );
}
