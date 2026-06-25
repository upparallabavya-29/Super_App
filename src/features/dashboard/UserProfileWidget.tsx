'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { useNotesStore } from '@/store/notesSlice';
import { Card } from '@/components/ui/Card';

const fieldIcons = {
  Name: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Username: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Email: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Mobile: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
};

export function UserProfileWidget() {
  const { user } = useUserStore();
  const { selected } = useCategoriesStore();
  const { notes } = useNotesStore();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const profileFields = [
    { label: 'Name', value: user.name },
    { label: 'Username', value: `@${user.username}` },
    { label: 'Email', value: user.email },
    { label: 'Mobile', value: user.mobile },
  ];

  const stats = [
    { label: 'Interests', value: selected.length, color: '#818cf8' },
    { label: 'Notes', value: notes.length, color: '#a78bfa' },
  ];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden" glow="indigo">
      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px]"
        style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa, #60a5fa)' }}
        aria-hidden="true"
      />

      {/* Background decorative blob */}
      <div
        className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        aria-hidden="true"
      />

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <motion.div
          whileHover={{ scale: 1.06, rotate: 4 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="relative flex-shrink-0"
        >
          {/* Spinning ring */}
          <div
            className="absolute inset-[-3px] rounded-2xl opacity-60"
            style={{
              background: 'conic-gradient(from 0deg, #6366f1, #a78bfa, #60a5fa, #6366f1)',
              animation: 'spin 4s linear infinite',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-[-1px] rounded-2xl bg-[#08080e]" />
          <div
            className="relative w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-indigo-600/30"
            aria-hidden="true"
          >
            {initials}
          </div>
        </motion.div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-white truncate font-display">{user.name}</h2>
          <p className="text-sm text-white/40 mb-2">@{user.username}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/12 border border-teal-500/22 text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center py-2.5 rounded-xl bg-white/4 border border-white/7"
          >
            <span
              className="text-2xl font-bold font-display"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
            <span className="text-[11px] text-white/40 font-medium mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        className="h-px mb-4 relative z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
      />

      {/* Profile fields */}
      <div className="space-y-2 mb-4 relative z-10 flex-1">
        {profileFields.map((field) => (
          <div
            key={field.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/6 hover:bg-white/[0.06] transition-colors group"
          >
            <span className="text-indigo-400/70 group-hover:text-indigo-400 transition-colors flex-shrink-0">
              {fieldIcons[field.label as keyof typeof fieldIcons]}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">{field.label}</p>
              <p className="text-sm text-white/85 truncate font-medium">{field.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {selected.length > 0 && (
        <div className="relative z-10">
          <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-2">Interests</p>
          <div className="flex flex-wrap gap-1.5" aria-label="Selected categories">
            {selected.slice(0, 8).map((cat) => (
              <motion.span
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/12 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium"
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.label}
              </motion.span>
            ))}
            {selected.length > 8 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/40 font-medium">
                +{selected.length - 8}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
