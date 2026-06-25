'use client';

import { motion } from 'framer-motion';
import { useMovies } from '@/hooks/useMovies';
import { MovieCard } from './MovieCard';
import { MovieGridSkeleton, HeroBannerSkeleton } from './MovieSkeletons';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HeroBanner } from './HeroBanner';

// Dynamically import heavy modal
const MovieModal = dynamic(() => import('./MovieModal').then(mod => mod.MovieModal), { 
  ssr: false,
});

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export function MovieGrid() {
  const { movies, selectedMovie, status, detailStatus, openMovieDetail, closeMovieDetail, refresh } = useMovies();

  // Pick the first movie as the featured one for the hero banner,
  // or a highly-rated one if we implement that logic later.
  const featuredMovie = movies.length > 0 ? movies[0] : null;
  const gridMovies = movies.length > 0 ? movies.slice(1) : [];

  return (
    <>
      <div className="space-y-12 pb-16">
        {/* Loading state */}
        {status === 'loading' && (
          <div className="space-y-12">
            <HeroBannerSkeleton />
            <MovieGridSkeleton />
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl bg-red-500/5 border border-red-500/10"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <span className="text-4xl" aria-hidden="true">⚠️</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Connection Lost</h3>
            <p className="text-white/60 max-w-md mb-8">
              We couldn't reach the movie database. Please check your connection and try again.
            </p>
            <button
              onClick={refresh}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Success state */}
        {(status === 'success' || status === 'idle') && movies.length > 0 && (
          <>
            {/* Hero Banner (Featured Movie) */}
            {/* For hero banner we need the full details, but if we don't have them yet, we just use the search result data */}
            {/* The HeroBanner component will render what it can */}
            <HeroBanner movie={featuredMovie as any} onViewDetails={openMovieDetail} />

            {/* Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
                  <span className="w-1.5 h-6 rounded-full bg-purple-500" aria-hidden="true" />
                  Recommended For You
                </h2>
              </div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                role="list"
                aria-label="Recommended movies"
              >
                {gridMovies.map((movie, index) => (
                  <div key={movie.imdbID} role="listitem">
                    <MovieCard movie={movie} onClick={openMovieDetail} index={index} />
                  </div>
                ))}
              </motion.div>
            </div>
          </>
        )}

        {/* Empty state */}
        {status === 'success' && movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 px-4 text-center rounded-3xl bg-white/5 border border-white/5"
          >
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-4xl" aria-hidden="true">🍿</span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">No Movies Found</h3>
            <p className="text-white/60 max-w-md mb-8">
              We couldn't find any movies matching your selected genres. Try exploring different categories.
            </p>
            <button
              onClick={refresh}
              className="px-8 py-3 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/15 transition-colors"
            >
              Refresh Recommendations
            </button>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <Suspense fallback={null}>
        <MovieModal
          movie={selectedMovie}
          isLoading={detailStatus === 'loading'}
          onClose={closeMovieDetail}
        />
      </Suspense>
    </>
  );
}
