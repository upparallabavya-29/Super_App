'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/types/movie.types';

interface MovieCardProps {
  movie: Movie;
  onClick: (imdbId: string) => void;
  index?: number;
}

function ImdbBadge({ rating }: { rating?: string }) {
  if (!rating || rating === 'N/A') return null;
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5C518]/15 border border-[#F5C518]/30 backdrop-blur-sm">
      <svg className="w-3 h-3 text-[#F5C518]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-[10px] font-bold text-[#F5C518]">{rating}</span>
    </div>
  );
}

export function MovieCard({ movie, onClick, index = 0 }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 24,
        delay: index * 0.04,
      }}
      className="group cursor-pointer perspective-[1000px]"
      aria-label={`${movie.Title} (${movie.Year})`}
    >
      <motion.button
        onClick={() => onClick(movie.imdbID)}
        whileHover={{ scale: 1.05, y: -8, rotateX: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B12] rounded-2xl"
        aria-label={`View details for ${movie.Title}`}
      >
        {/* Poster container */}
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#12121D]">

          {/* Shimmer while loading */}
          {!imageLoaded && hasPoster && (
            <div className="absolute inset-0 skeleton rounded-2xl" aria-hidden="true" />
          )}

          {/* Poster image */}
          {hasPoster ? (
            <Image
              src={movie.Poster}
              alt={`Poster for ${movie.Title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
              <span className="text-5xl mb-2" aria-hidden="true">🎬</span>
              <span className="text-xs text-white/30 text-center px-3 leading-tight">{movie.Title}</span>
            </div>
          )}

          {/* Gradient overlay — always present */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Hover: glow border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-purple-500/0 group-hover:border-purple-500/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 0 0 rgba(168,85,247,0)',
            }}
            whileHover={{
              boxShadow: '0 0 30px 2px rgba(168,85,247,0.25)',
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Top badges row */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-semibold tracking-wide">
              {movie.Year}
            </div>
            {(movie as any).imdbRating && <ImdbBadge rating={(movie as any).imdbRating} />}
          </div>

          {/* Bottom: hover reveal */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-600/80 backdrop-blur-sm border border-purple-400/30">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-white text-xs font-semibold">View Details</span>
            </div>
          </div>
        </div>

        {/* Card info below poster */}
        <div className="pt-3 px-0.5 pb-1">
          <h3 className="text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-purple-300 transition-colors duration-200">
            {movie.Title}
          </h3>
          {movie.Genre && (
            <p className="text-xs text-white/35 mt-0.5 line-clamp-1">
              {movie.Genre.split(', ').slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </motion.button>
    </motion.article>
  );
}
