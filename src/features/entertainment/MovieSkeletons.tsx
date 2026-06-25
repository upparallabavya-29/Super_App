'use client';

export function MovieCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-hidden="true"
    >
      {/* Poster */}
      <div className="aspect-[2/3] rounded-2xl skeleton" />
      {/* Title */}
      <div className="mt-3 h-3.5 rounded-lg skeleton w-4/5" />
      {/* Genre */}
      <div className="mt-2 h-2.5 rounded-lg skeleton w-2/3" />
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div
      className="relative w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden skeleton"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex flex-col justify-end px-8 sm:px-12 pb-12 gap-4 pointer-events-none">
        <div className="h-3 w-24 rounded-full bg-white/5" />
        <div className="h-10 w-96 rounded-xl bg-white/5" />
        <div className="h-4 w-48 rounded-lg bg-white/5" />
        <div className="flex gap-2">
          {[60, 80, 70].map((w, i) => (
            <div key={i} className={`h-6 w-${w} rounded-full bg-white/5`} />
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          <div className="h-11 w-32 rounded-xl bg-white/8" />
          <div className="h-11 w-36 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <MovieCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
