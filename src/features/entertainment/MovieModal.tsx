'use client';

import { useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieDetail } from '@/types/movie.types';

interface MovieModalProps {
  movie: MovieDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

function StatPill({ label, value }: { label: string; value: string }) {
  if (!value || value === 'N/A') return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-400/70">{label}</span>
      <span className="text-sm text-white/80 font-medium">{value}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: string }) {
  const score = parseFloat(rating);
  if (isNaN(score)) return null;
  const filled = Math.round(score / 2);
  return (
    <div className="flex items-center gap-1" aria-label={`IMDb rating: ${rating} out of 10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 400 }}
          className={`w-4 h-4 ${i < filled ? 'text-[#F5C518]' : 'text-white/15'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      ))}
      <span className="text-[#F5C518] font-bold text-base ml-1">{rating}</span>
      <span className="text-white/30 text-xs">/10</span>
    </div>
  );
}

function ModalLoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-full animate-pulse" aria-hidden="true">
      <div className="md:w-72 flex-shrink-0 aspect-[2/3] md:aspect-auto md:h-full skeleton" />
      <div className="flex-1 p-8 space-y-4">
        <div className="h-8 w-3/4 skeleton rounded-xl" />
        <div className="h-4 w-1/3 skeleton rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 skeleton rounded-full" />
          ))}
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-3 skeleton rounded" />
          <div className="h-3 skeleton rounded" />
          <div className="h-3 w-4/5 skeleton rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 skeleton rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

export function MovieModal({ movie, isLoading, onClose }: MovieModalProps) {
  const isOpen = isLoading || !!movie;
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';
  const genres = movie?.Genre?.split(', ') ?? [];
  const cast = movie?.Actors?.split(', ') ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={movie?.Title ?? 'Movie Details'}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
            style={{
              background: 'linear-gradient(135deg, rgba(18,18,29,0.98) 0%, rgba(12,12,20,0.99) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition-all duration-200 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-label="Close movie details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isLoading ? (
              <ModalLoadingSkeleton />
            ) : movie ? (
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Left: Poster */}
                <div className="md:w-80 lg:w-96 flex-shrink-0 relative bg-[#0B0B12] md:border-r md:border-white/10">
                  <div className="sticky top-0 w-full aspect-[2/3]">
                    {hasPoster ? (
                      <>
                        {/* Blurred BG */}
                        <Image
                          src={movie.Poster}
                          alt=""
                          fill
                          className="object-cover blur-md scale-110 opacity-40"
                          sizes="384px"
                          aria-hidden="true"
                        />
                        {/* Sharp poster */}
                        <motion.div
                          className="absolute inset-4 sm:inset-6 rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
                        >
                          <Image
                            src={movie.Poster}
                            alt={`Poster for ${movie.Title}`}
                            fill
                            className="object-cover"
                            sizes="336px"
                            priority
                          />
                        </motion.div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
                        <span className="text-7xl" aria-hidden="true">🎬</span>
                      </div>
                    )}

                    {/* IMDb badge overlay */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-4/5">
                      <div className="px-4 py-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-center shadow-xl shadow-black/50">
                        <div className="flex justify-center mb-1">
                          <StarRating rating={movie.imdbRating} />
                        </div>
                        {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                          <p className="text-xs text-white/40">{movie.imdbVotes} votes</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
                    className="space-y-5 pr-4"
                  >
                    {/* Header */}
                    <div className="pr-8">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white font-display leading-tight mb-2">
                        {movie.Title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-white/45">
                        {movie.Year && <span>{movie.Year}</span>}
                        {movie.Runtime && movie.Runtime !== 'N/A' && (
                          <><span aria-hidden="true">·</span><span>{movie.Runtime}</span></>
                        )}
                        {movie.Rated && movie.Rated !== 'N/A' && (
                          <span className="px-2 py-0.5 border border-white/20 rounded text-xs text-white/50">{movie.Rated}</span>
                        )}
                        {movie.Released && movie.Released !== 'N/A' && (
                          <><span aria-hidden="true">·</span><span>{movie.Released}</span></>
                        )}
                      </div>
                    </div>

                    {/* Genre chips */}
                    <div className="flex flex-wrap gap-2">
                      {genres.map((g, i) => (
                        <motion.span
                          key={g}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + i * 0.04, type: 'spring', stiffness: 400 }}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300"
                        >
                          {g}
                        </motion.span>
                      ))}
                    </div>

                    {/* Plot */}
                    {movie.Plot && movie.Plot !== 'N/A' && (
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/60 mb-2">Synopsis</h3>
                        <p className="text-sm text-white/70 leading-relaxed">{movie.Plot}</p>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-white/6" />

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <StatPill label="Director" value={movie.Director} />
                      <StatPill label="Writer" value={movie.Writer ?? 'N/A'} />
                      <StatPill label="Language" value={movie.Language} />
                      <StatPill label="Country" value={movie.Country} />
                      {movie.BoxOffice && <StatPill label="Box Office" value={movie.BoxOffice} />}
                      {movie.Production && <StatPill label="Production" value={movie.Production} />}
                    </div>

                    {/* Cast */}
                    {cast.length > 0 && cast[0] !== 'N/A' && (
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/60 mb-3">Cast</h3>
                        <div className="flex flex-wrap gap-2">
                          {cast.map((actor, i) => (
                            <motion.span
                              key={actor}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.04 }}
                              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-white/65 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              {actor}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Awards */}
                    {movie.Awards && movie.Awards !== 'N/A' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-start gap-3 p-4 rounded-2xl border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(234,179,8,0.04) 100%)',
                          borderColor: 'rgba(245,197,24,0.2)',
                        }}
                      >
                        <span className="text-xl flex-shrink-0" aria-hidden="true">🏆</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5C518]/60 mb-0.5">Awards & Recognition</p>
                          <p className="text-sm text-[#F5C518]/80">{movie.Awards}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* OMDB link */}
                    <a
                      href={`https://www.imdb.com/title/${movie.imdbID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#F5C518]/60 hover:text-[#F5C518] transition-colors"
                      aria-label={`View ${movie.Title} on IMDb`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      View on IMDb
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
