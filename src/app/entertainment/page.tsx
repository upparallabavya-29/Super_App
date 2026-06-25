'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { MovieGrid } from '@/features/entertainment/MovieGrid';
import { ROUTES } from '@/constants/routes';
import { MIN_CATEGORIES } from '@/constants/categories';

export default function EntertainmentPage() {
  const router = useRouter();
  const { user, isHydrated } = useUserStore();
  const { selected, isHydrated: catHydrated } = useCategoriesStore();

  useEffect(() => {
    if (!isHydrated || !catHydrated) return;
    if (!user) { router.replace(ROUTES.REGISTER); return; }
    if (selected.length < MIN_CATEGORIES) { router.replace(ROUTES.CATEGORIES); }
  }, [isHydrated, catHydrated, user, selected, router]);

  if (!isHydrated || !catHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Floating Category Badges */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          <span className="text-white/40 text-sm mr-2 font-medium">Your Interests:</span>
          {selected.map((c, i) => (
            <motion.span
              key={c.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.25)' }}
              transition={{
                delay: i * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-xs font-semibold text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:border-purple-400/60"
            >
              <span aria-hidden="true" className="text-sm">{c.emoji}</span>
              {c.label}
            </motion.span>
          ))}
        </motion.div>

        <MovieGrid />
      </div>
    </motion.div>
  );
}
