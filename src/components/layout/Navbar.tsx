'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { useNotesStore } from '@/store/notesSlice';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

const navLinks = [
  {
    href: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
        />
      </svg>
    ),
  },
  {
    href: ROUTES.ENTERTAINMENT,
    label: 'Entertainment',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { clearCategories } = useCategoriesStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Hide Navbar on onboarding, login, and registration screens
  const hideNavbarPaths = ['/register', '/login', '/categories'];
  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  if (!user) return null;

  const handleLogout = () => {
    clearUser();
    clearCategories();
    setShowMenu(false);
    setShowConfirm(false);
    router.push(ROUTES.REGISTER);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Frosted glass bar */}
      <div
        style={{
          background: 'rgba(8,8,14,0.80)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href={ROUTES.DASHBOARD}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl group"
            >
              <div className="relative w-9 h-9">
                <div
                  className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-600/50 transition-shadow duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                {/* Glow pulse dot */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-[#08080e]" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display font-bold text-white text-[17px] tracking-tight">
                  Super<span className="gradient-text">App</span>
                </span>
                <span className="text-[10px] text-white/30 font-medium tracking-widest uppercase">Dashboard</span>
              </div>
            </Link>

            {/* Center Nav Links */}
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                      isActive
                        ? 'text-white'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.2)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {link.icon}
                      <span className="hidden sm:block">{link.label}</span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                          boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: user info + avatar */}
            <div className="relative flex items-center gap-3">
              {/* User name */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white/90 truncate max-w-[120px] leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-white/35 leading-tight">@{user.username}</p>
              </div>

              {/* Avatar button with animated ring */}
              <button
                onClick={() => setShowMenu((s) => !s)}
                aria-label="User menu"
                aria-expanded={showMenu}
                aria-haspopup="true"
                className="relative w-9 h-9 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080e]"
              >
                {/* Animated glow ring */}
                <span
                  className="absolute inset-[-3px] rounded-full opacity-70"
                  style={{
                    background: 'conic-gradient(from 0deg, #6366f1, #a78bfa, #60a5fa, #6366f1)',
                    animation: 'spin 3s linear infinite',
                  }}
                  aria-hidden="true"
                />
                <span className="absolute inset-[-1px] rounded-full bg-[#08080e]" />
                <span className="relative w-full h-full rounded-full btn-gradient flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {initials}
                </span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                      aria-hidden="true"
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute right-0 top-12 z-20 w-60 glass-medium rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
                      role="menu"
                      aria-label="User options"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3.5 border-b border-white/8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        {[
                          { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: '⊞' },
                          { href: ROUTES.CATEGORIES, label: 'Change Categories', icon: '🎭' },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/8 transition-all duration-150"
                            role="menuitem"
                          >
                            <span aria-hidden="true">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}

                        <div className="h-px bg-white/7 my-1.5 mx-3" />

                        <button
                          onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/8 transition-all duration-150"
                          role="menuitem"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative glass-medium rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
              </div>

              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-rose-500/12 border border-rose-500/25 flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(244,63,94,0.15)]">
                  <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h2 id="logout-title" className="text-base font-bold text-white mb-1.5">
                  Sign out of SuperApp?
                </h2>
                <p className="text-sm text-white/45 leading-relaxed">
                  Your notes and settings are saved locally. You can sign back in anytime.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/7 hover:bg-white/12 text-white text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/18 hover:bg-rose-500/28 border border-rose-500/28 text-rose-400 hover:text-rose-300 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
