'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useNews } from '@/hooks/useNews';
import { Card } from '@/components/ui/Card';
import { NewsSkeleton } from './NewsSkeleton';
import { formatTimeAgo, truncate } from '@/utils/formatters';

export function NewsWidget() {
  const {
    articles,
    status,
    currentIndex,
    currentArticle,
    nextArticle,
    prevArticle,
    setCurrentIndex,
    onMouseEnter,
    onMouseLeave,
    refresh,
  } = useNews();

  return (
    <div
      className="relative rounded-[20px] overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(251,191,36,0.12)',
        boxShadow: '0 0 0 1px rgba(251,191,36,0.08), 0 8px 48px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #f87171)' }}
        aria-hidden="true"
      />

      {/* Background radial */}
      <div
        className="absolute top-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-sm">
              📰
            </div>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Live News</h2>
            <span className="status-dot-live" aria-label="Live" role="img" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevArticle}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              aria-label="Previous article"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextArticle}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              aria-label="Next article"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={refresh}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              aria-label="Refresh news"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        {status === 'loading' && <NewsSkeleton />}

        {status !== 'loading' && currentArticle && (
          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-start">
            {/* Article body */}
            <AnimatePresence mode="wait">
              <motion.article
                key={currentIndex}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                aria-live="polite"
                aria-label={`News article: ${currentArticle.title}`}
              >
                {/* Source + time row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/12 border border-amber-500/20 text-amber-300">
                    {currentArticle.source.name}
                  </span>
                  <time className="text-xs text-white/30" dateTime={currentArticle.publishedAt}>
                    {formatTimeAgo(currentArticle.publishedAt)}
                  </time>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white leading-snug mb-2.5 line-clamp-2 font-display">
                  {currentArticle.title}
                </h3>

                {/* Description */}
                {currentArticle.description && (
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4">
                    {truncate(currentArticle.description, 200)}
                  </p>
                )}

                {/* Read more */}
                {currentArticle.url && currentArticle.url !== '#' && (
                  <a
                    href={currentArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    aria-label={`Read full article: ${currentArticle.title}`}
                  >
                    Read full article
                    <svg
                      className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </motion.article>
            </AnimatePresence>

            {/* Thumbnail */}
            <div className="hidden md:block w-44 flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-44 h-32 rounded-xl overflow-hidden"
                >
                  {currentArticle.image ? (
                    <Image
                      src={currentArticle.image}
                      alt={currentArticle.title}
                      fill
                      className="object-cover"
                      sizes="176px"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center">
                      <span className="text-4xl" aria-hidden="true">📰</span>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Article counter */}
              <p className="text-center text-xs text-white/25 font-medium mt-2">
                {currentIndex + 1} / {articles.length}
              </p>
            </div>
          </div>
        )}

        {/* Pagination dots */}
        {articles.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label="Article navigation">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Article ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 h-1.5 bg-amber-400'
                    : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/35'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
