import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: 'SuperApp — Your Personal Intelligence Hub',
    template: '%s | SuperApp',
  },
  description:
    'A powerful personal dashboard featuring real-time weather, live news, movie recommendations, notes, and a countdown timer — all in one premium experience.',
  keywords: ['dashboard', 'weather', 'news', 'movies', 'productivity', 'entertainment'],
  authors: [{ name: 'SuperApp Team' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'SuperApp — Your Personal Intelligence Hub',
    description: 'Premium personal dashboard with weather, news, movies and more.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuperApp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
