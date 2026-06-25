'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { CATEGORIES, MIN_CATEGORIES, Category } from '@/constants/categories';
import { CategoryCard } from './CategoryCard';
import { ROUTES } from '@/constants/routes';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
  },
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export function CategoryGrid() {
  const router = useRouter();
  const { selected, toggleCategory } = useCategoriesStore();

  const remaining = Math.max(0, MIN_CATEGORIES - selected.length);
  const canContinue = selected.length >= MIN_CATEGORIES;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* ── LEFT PANEL ── */}
      <div className="w-72 flex-shrink-0 flex flex-col justify-between p-8 border-r border-white/6">
        <div>
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span
              className="text-2xl font-bold"
              style={{
                color: '#4ade80',
                fontFamily: '"Outfit", cursive',
                letterSpacing: '0.02em',
              }}
            >
              Super app
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-black text-white leading-tight font-display">
              Choose your<br />entertainment<br />category
            </h1>
          </motion.div>

          {/* Selected chips */}
          <div className="mb-6">
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2"
                  aria-label="Selected categories"
                  aria-live="polite"
                >
                  {selected.map((cat) => (
                    <motion.button
                      key={cat.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(cat)}
                      aria-label={`Remove ${cat.label}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-75"
                      style={{
                        border: '1.5px solid #4ade80',
                        color: '#4ade80',
                        background: 'transparent',
                      }}
                    >
                      {cat.label}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Validation message */}
          <AnimatePresence>
            {!canContinue && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: '#f87171' }}
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Minimum {MIN_CATEGORIES} category required</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ready indicator */}
          <AnimatePresence>
            {canContinue && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#4ade80' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Ready! Click Next Page.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next Page button — bottom of left panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={canContinue ? { scale: 1.04 } : {}}
            whileTap={canContinue ? { scale: 0.97 } : {}}
            onClick={() => { if (canContinue) router.push(ROUTES.DASHBOARD); }}
            disabled={!canContinue}
            aria-disabled={!canContinue}
            className="w-full py-3 px-6 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed"
            style={canContinue
              ? {
                  background: '#4ade80',
                  color: '#000',
                  boxShadow: '0 0 24px rgba(74,222,128,0.4)',
                }
              : {
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.35)',
                  background: 'transparent',
                }
            }
          >
            Next Page →
          </motion.button>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — Grid ── */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4"
          role="group"
          aria-label="Entertainment category selection"
        >
          {CATEGORIES.map((category: Category) => (
            <motion.div key={category.id} variants={cardVariants}>
              <CategoryCard
                category={category}
                isSelected={selected.some((s) => s.id === category.id)}
                onToggle={toggleCategory}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
