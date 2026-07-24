import "./globals.css";
import Header from "@/components/header";

export const metadata = {
  metadataBase: new URL("https://the-scenic-shift.vercel.app"),
  title: "The Scenic Shift | Vansh D Photography",
  description:
    "A collection of landscape, portrait, and street photography by Vansh D.",
  openGraph: {
    title: "The Scenic Shift | Vansh D Photography",
    description:
      "A collection of landscape, portrait, and street photography by Vansh D.",
    url: "https://the-scenic-shift.vercel.app",
    siteName: "The Scenic Shift",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Scenic Shift | Vansh D Photography",
    description:
      "A collection of landscape, portrait, and street photography by Vansh D.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('theme');
                var theme = stored || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-white antialiased transition-colors">
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/10 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/50 dark:text-white/50">
            <span>
              &copy; {new Date().getFullYear()} Vansh Dalal. All rights
              reserved.
            </span>
            <div className="flex gap-6">
              <a
                href="https://instagram.com/v4n5h_d.1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@TheScenicShift-o5o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
