'use client';

export function WeatherSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[#12121D] border border-white/5 animate-pulse w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="w-1/3 h-6 bg-white/10 rounded-md" />
        <div className="w-8 h-8 bg-white/10 rounded-full" />
      </div>
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white/10 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="w-24 h-10 bg-white/10 rounded-lg" />
          <div className="w-32 h-4 bg-white/10 rounded-md" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
