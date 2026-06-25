'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Category } from '@/constants/categories';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: (category: Category) => void;
}

export function CategoryCard({ category, isSelected, onToggle }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      onClick={() => onToggle(category)}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      aria-pressed={isSelected}
      aria-label={`${category.label} category${isSelected ? ' (selected)' : ''}`}
      className="relative w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ aspectRatio: '4/3' }}
    >
      {/* Card base color */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: category.color }}
      />

      {/* Movie image */}
      {!imgError ? (
        <Image
          src={category.image}
          alt={category.label}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback: gradient + emoji */
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
          <span className="text-5xl drop-shadow-lg">{category.emoji}</span>
        </div>
      )}

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

      {/* Category label — top-left */}
      <div className="absolute top-2.5 left-3 z-10">
        <span className="text-white font-bold text-sm drop-shadow-md leading-tight">
          {category.label}
        </span>
      </div>

      {/* Selected border glow */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              border: `3px solid ${category.borderColor}`,
              boxShadow: `0 0 0 2px ${category.borderColor}55, inset 0 0 20px ${category.borderColor}22`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Selected dim overlay */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: `${category.borderColor}18` }}
          />
        )}
      </AnimatePresence>

      {/* Checkmark badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            style={{ backgroundColor: category.borderColor }}
            aria-hidden="true"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
