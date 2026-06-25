'use client';

export function NewsSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse w-full">
      <div className="h-6 w-1/3 bg-white/10 rounded-md mb-4" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#12121D] border border-white/5">
          <div className="w-24 h-24 bg-white/10 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2 py-1">
            <div className="w-full h-5 bg-white/10 rounded-md" />
            <div className="w-4/5 h-5 bg-white/10 rounded-md" />
            <div className="mt-auto w-1/4 h-3 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
