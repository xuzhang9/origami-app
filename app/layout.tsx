import type { Metadata } from 'next';
import './globals.css';
import AuthCheck from '@/components/AuthCheck';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Origami Fun - Learn Paper Folding!',
  description: 'A fun and colorful origami learning app for kids',
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Origami Fun',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthCheck>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-origami-purple via-origami-pink to-origami-blue text-white shadow-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                    <span className="text-4xl">🎨</span>
                    <h1 className="text-2xl md:text-3xl font-bold">Origami Fun!</h1>
                  </Link>

                  <nav className="flex gap-2 md:gap-4">
                    <Link
                      href="/"
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-bold transition text-sm md:text-base"
                    >
                      🏠 Home
                    </Link>
                    <Link
                      href="/favorites"
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-bold transition text-sm md:text-base"
                    >
                      💖 Favorites
                    </Link>
                    <Link
                      href="/settings"
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-bold transition text-sm md:text-base"
                    >
                      ⚙️ Settings
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-origami-blue to-origami-purple text-white py-6 mt-12">
              <div className="container mx-auto px-4 text-center">
                <p className="text-lg font-bold mb-2">Happy Folding! 🎉</p>
                <p className="text-sm opacity-90">
                  Made with ❤️ for young origami artists
                </p>
              </div>
            </footer>
          </div>
        </AuthCheck>
      </body>
    </html>
  );
}
