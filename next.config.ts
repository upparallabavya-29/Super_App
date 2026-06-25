import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // OMDB movie posters
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/**',
      },
      // GNews article images
      {
        protocol: 'https',
        hostname: '*.gnews.io',
      },
      // Unsplash (mock news images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // OpenWeatherMap icons
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/img/wn/**',
      },
      // Generic image CDNs used by GNews
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Bundle analyzer (set ANALYZE=true to inspect)
  experimental: {},
};

export default nextConfig;
