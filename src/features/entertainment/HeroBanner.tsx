'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MovieDetail } from '@/types/movie.types';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TrailerModal = dynamic(() => import('./TrailerModal').then(mod => mod.TrailerModal), { ssr: false });

interface HeroBannerProps {
  movie: MovieDetail | null;
  onViewDetails: (id: string) => void;
}

function RatingStars({ rating }: { rating: string }) {
  const score = parseFloat(rating);
  if (isNaN(score)) return null;
  const filled = Math.round(score / 2);
  return (
    <div className="flex items-center gap-0.5" aria-label={`IMDb rating ${rating} out of 10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < filled ? 'text-[#F5C518]' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="ml-1 text-[#F5C518] text-sm font-bold">{rating}</span>
      <span className="text-white/40 text-xs ml-0.5">/10</span>
    </div>
  );
}

export function HeroBanner({ movie, onViewDetails }: HeroBannerProps) {
  const [trailerClicked, setTrailerClicked] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  if (!movie) {
    return (
      <div className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden bg-[#12121D] skeleton" aria-hidden="true" />
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== 'N/A';
  const genres = movie.Genre?.split(', ') ?? [];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        ref={containerRef}
        key={movie.imdbID}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden"
        aria-label={`Featured movie: ${movie.Title}`}
      >
        {/* Parallax Image Wrapper */}
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
          {hasPoster && (
            <>
              <Image
                src={movie.Poster}
                alt=""
                fill
                priority
                className="object-cover object-center scale-110 blur-sm"
                sizes="100vw"
                aria-hidden="true"
              />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
                <div className="relative h-full">
                  <Image
                    src={movie.Poster}
                    alt={`Poster for ${movie.Title}`}
                    fill
                    className="object-cover object-top opacity-40"
                    sizes="33vw"
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B12] via-[#0B0B12]/85 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B12] via-transparent to-[#0B0B12]/30 z-0" />

        {/* Cinematic grain overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              initial={{
                x: `${(i * 17) % 100}vw`,
                y: `${(i * 23) % 100}vh`,
                scale: (i % 3) * 0.5 + 0.5,
              }}
              animate={{
                y: [`${(i * 23) % 100}vh`, `${((i * 23) % 100) - 20}vh`],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: (i % 5) + 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              style={{
                width: `${(i % 4) * 2 + 2}px`,
                height: `${(i % 4) * 2 + 2}px`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 sm:px-12 pb-10 sm:pb-14 max-w-3xl pointer-events-none">
          <div className="pointer-events-auto">
            {/* Featured label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-5 h-0.5 bg-purple-500 rounded-full" />
              <span className="text-purple-400 text-xs font-semibold uppercase tracking-[0.2em]">Featured</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 22 }}
              className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3 font-display"
            >
              {movie.Title}
            </motion.h1>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mb-3"
            >
              <span className="text-white/50 text-sm">{movie.Year}</span>
              <span className="w-1 h-1 rounded-full bg-white/25" aria-hidden="true" />
              <span className="text-white/50 text-sm">{movie.Runtime}</span>
              <span className="w-1 h-1 rounded-full bg-white/25" aria-hidden="true" />
              <span className="px-2 py-0.5 rounded-md border border-white/20 text-white/60 text-xs font-medium">
                {movie.Rated}
              </span>
            </motion.div>

            {/* IMDb rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mb-3"
            >
              <RatingStars rating={movie.imdbRating} />
            </motion.div>

            {/* Genre chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {genres.map((g, i) => (
                <motion.span
                  key={g}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/8 border border-white/12 text-white/70 backdrop-blur-sm"
                >
                  {g}
                </motion.span>
              ))}
            </motion.div>

            {/* Plot snippet */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-6 max-w-xl"
              >
                {movie.Plot}
              </motion.p>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: 'spring', stiffness: 240, damping: 22 }}
              className="flex flex-wrap items-center gap-3"
            >
              {/* View Details */}
              <motion.button
                onClick={() => onViewDetails(movie.imdbID)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-lg shadow-purple-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
                aria-label={`View details for ${movie.Title}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Details
              </motion.button>

              {/* Watch Trailer */}
              <motion.button
                onClick={() => setTrailerClicked(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/16 border border-white/15 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Watch trailer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </motion.button>

              {/* Explore Movies */}
              <motion.button
                onClick={() => {
                  window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Explore Movies
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom vignette */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0B0B12] to-transparent pointer-events-none z-0" />
      </motion.section>

      {/* Trailer Modal */}
      <Suspense fallback={null}>
        <TrailerModal
          isOpen={trailerClicked}
          onClose={() => setTrailerClicked(false)}
          movieTitle={movie.Title}
        />
      </Suspense>
    </AnimatePresence>
  );
}
