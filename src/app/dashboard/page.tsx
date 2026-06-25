'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { UserProfileWidget } from '@/features/dashboard/UserProfileWidget';
import { WeatherWidget } from '@/features/dashboard/WeatherWidget';
import { NotesWidget } from '@/features/dashboard/NotesWidget';
import { CountdownWidget } from '@/features/dashboard/CountdownWidget';
import { NewsWidget } from '@/features/dashboard/NewsWidget';
import { ROUTES } from '@/constants/routes';
import { MIN_CATEGORIES } from '@/constants/categories';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const widgetVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 24 },
  },
};

const quickServices = [
  { id: 'weather', label: 'Weather', emoji: '🌤️', color: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.22)' },
  { id: 'news', label: 'News', emoji: '📰', color: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.22)' },
  { id: 'movies', label: 'Movies', emoji: '🎬', color: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.22)' },
  { id: 'notes', label: 'Notes', emoji: '📝', color: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.22)' },
  { id: 'timer', label: 'Timer', emoji: '⏱️', color: 'rgba(20,184,166,0.10)', border: 'rgba(20,184,166,0.22)' },
  { id: 'profile', label: 'Profile', emoji: '👤', color: 'rgba(56,189,248,0.10)', border: 'rgba(56,189,248,0.22)' },
];

function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getTimeEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 5) return '🌙';
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  return '🌆';
}

export default function DashboardPage() {
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
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-violet-500/10 border-b-violet-500 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0];

  return (
    <div className="relative min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">

      {/* ── Background Glow Orbs ── */}
      <div
        className="blob absolute top-[-120px] left-[-80px] w-[420px] h-[420px] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="blob-slow absolute top-[200px] right-[-100px] w-[350px] h-[350px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)', animationDelay: '-3s' }}
        aria-hidden="true"
      />
      <div
        className="blob-slow absolute bottom-[-60px] left-[30%] w-[300px] h-[300px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.5) 0%, transparent 70%)', animationDelay: '-6s' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-7"
        >
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl" aria-hidden="true">{getTimeEmoji()}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                  Good {getTimeOfDay()},{' '}
                  <span className="gradient-text">{firstName}</span>
                </h1>
              </div>
              <p className="text-white/38 text-sm pl-9">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' · '}
                <LiveClock />
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-xs font-semibold">{selected.length} interests</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-xs font-semibold">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Services Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mb-7"
        >
          <div className="services-strip">
            {quickServices.map((s, i) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => {
                  const el = document.getElementById(`widget-${s.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-white/75 hover:text-white flex-shrink-0 transition-colors duration-200"
                style={{
                  background: s.color,
                  border: `1px solid ${s.border}`,
                }}
                aria-label={`Jump to ${s.label}`}
              >
                <span className="text-base" aria-hidden="true">{s.emoji}</span>
                {s.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Bento Widget Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {/* Weather — wide hero (xl: 2 cols) */}
          <motion.div
            id="widget-weather"
            variants={widgetVariants}
            className="xl:col-span-2"
          >
            <WeatherWidget />
          </motion.div>

          {/* Profile — tall right column */}
          <motion.div
            id="widget-profile"
            variants={widgetVariants}
            className="md:row-span-2 xl:row-span-1"
          >
            <UserProfileWidget />
          </motion.div>

          {/* Notes — wide */}
          <motion.div
            id="widget-notes"
            variants={widgetVariants}
            className="xl:col-span-1"
          >
            <NotesWidget />
          </motion.div>

          {/* Countdown */}
          <motion.div
            id="widget-timer"
            variants={widgetVariants}
            className="xl:col-span-1"
          >
            <CountdownWidget />
          </motion.div>

          {/* News — full width bottom */}
          <motion.div
            id="widget-news"
            variants={widgetVariants}
            className="md:col-span-2 xl:col-span-3"
          >
            <NewsWidget />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
