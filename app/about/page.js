import Image from "next/image";

export const metadata = { title: "About | Vansh D Photography" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
          <Image
            src="/Vansh.jpeg"
            alt="Portrait of the photographer"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-light mb-6">About</h1>
        <p className="text-black/70 dark:text-white/70 leading-relaxed mb-4">
          Based in Gujarat, my journey into photography grew out of a constant
          desire to capture everyday moments and scenes that catch my eye. What
          started as simple curiosity has evolved into a personal archive of
          things that feel fascinating to me — ranging from spontaneous daily
          captures to the landscapes and details I discover along the way.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-3">What I Share Here</h2>
        <p className="text-black/70 dark:text-white/70 leading-relaxed mb-4">
          This gallery is a collection of my visual journal. You'll find:
        </p>
        <ul className="text-black/70 dark:text-white/70 leading-relaxed mb-4 space-y-3 list-disc list-inside">
          <li>
            <span className="text-black dark:text-white">
              Daily Photography
            </span>{" "}
            — the quiet, striking, or unusual details of everyday life that
            spark my interest.
          </li>
          <li>
            <span className="text-black dark:text-white">
              Travel Photography
            </span>{" "}
            — visual stories and memories gathered from exploring new places and
            environments.
          </li>
          <li>
            <span className="text-black dark:text-white">The General Feed</span>{" "}
            — a continuous, evolving mix of street scenes, textures, and moments
            that simply stood out through the lens.
          </li>
        </ul>

        <h2 className="text-xl font-medium mt-8 mb-3">Equipment</h2>
        <p className="text-black/70 dark:text-white/70 leading-relaxed mb-4">
          My work is captured using an everyday and adaptable toolkit — the
          Samsung Galaxy S25 Ultra, a Sony Cyber-shot camera, and a reliable
          tripod for stability on the move.
        </p>
        <a
          href="/contact"
          className="inline-block mt-4 border border-black/30 dark:border-white/30 px-5 py-2 text-sm uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
