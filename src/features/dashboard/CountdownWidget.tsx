'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';
import { Card } from '@/components/ui/Card';
import { formatTime } from '@/utils/formatters';

const QUICK_DURATIONS = [
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '25m', seconds: 1500 },
  { label: '30m', seconds: 1800 },
  { label: '1h', seconds: 3600 },
];

const stateConfig = {
  idle: { color: '#6366f1', glow: 'rgba(99,102,241,0.25)', label: null },
  running: { color: '#22c55e', glow: 'rgba(34,197,94,0.25)', label: '● Running' },
  paused: { color: '#fbbf24', glow: 'rgba(251,191,36,0.25)', label: '⏸ Paused' },
  done: { color: '#f87171', glow: 'rgba(248,113,113,0.25)', label: '⏰ Done!' },
};

export function CountdownWidget() {
  const { state, remaining, totalSeconds, progress, start, pause, resume, reset } = useCountdown();
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');
  const [secs, setSecs] = useState('0');
  const [showToast, setShowToast] = useState(false);

  const getTotalInputSeconds = () =>
    (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(secs) || 0);

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    const total = getTotalInputSeconds();
    if (total > 0) start(total);
  };

  useEffect(() => {
    if (state === 'done') {
      setShowToast(true);
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } catch (e) { console.error('Audio failed:', e); }

      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [state]);

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - progress);
  const cfg = stateConfig[state];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden" glow="teal">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px]"
        style={{ background: 'linear-gradient(90deg, #14b8a6, #2dd4bf, #38bdf8)' }}
        aria-hidden="true"
      />

      {/* Background blob */}
      <div
        className="absolute bottom-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }}
        aria-hidden="true"
      />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm shadow-2xl"
            style={{
              background: 'rgba(248,113,113,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(248,113,113,0.3)',
              boxShadow: '0 0 30px rgba(239,68,68,0.25)',
            }}
          >
            <span className="text-xl" aria-hidden="true">⏰</span>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Time's Up!</p>
              <p className="text-xs text-white/55">Timer completed</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-sm">
            ⏱️
          </div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Timer</h2>
        </div>
        {cfg.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: cfg.glow,
              color: cfg.color,
              border: `1px solid ${cfg.glow}`,
            }}
            aria-live="polite"
          >
            {cfg.label}
          </motion.span>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-between gap-3 relative z-10">
        {/* Circular progress ring */}
        <div
          className="relative flex items-center justify-center"
          aria-label={`Timer: ${formatTime(remaining)} remaining`}
        >
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            {/* Track */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
            {/* Progress arc */}
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={cfg.color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                filter: `drop-shadow(0 0 ${state === 'running' ? 8 : 4}px ${cfg.color}88)`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {state === 'done' ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative text-3xl"
                >
                  🎉
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: ['#f87171', '#fbbf24', '#4ade80', '#60a5fa'][i % 4] }}
                      initial={{ x: '-50%', y: '-50%', scale: 0 }}
                      animate={{
                        x: `calc(-50% + ${Math.cos((i * 60 * Math.PI) / 180) * 36}px)`,
                        y: `calc(-50% + ${Math.sin((i * 60 * Math.PI) / 180) * 36}px)`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="time"
                  className="flex flex-col items-center"
                  animate={state === 'running' && remaining <= 10 ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span
                    className="text-xl font-bold text-white font-mono tabular-nums leading-none"
                    style={{ textShadow: state !== 'idle' ? `0 0 16px ${cfg.color}88` : 'none' }}
                  >
                    {formatTime(remaining > 0 ? remaining : (state === 'idle' ? getTotalInputSeconds() : 0))}
                  </span>
                  {state === 'running' && (
                    <span className="text-[10px] font-semibold mt-1 uppercase tracking-widest" style={{ color: cfg.color }}>
                      {Math.round(progress * 100)}%
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input (idle) */}
        {state === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3"
          >
            <form onSubmit={handleStart} className="flex items-center gap-1.5 justify-center">
              {[
                { val: hours, set: setHours, label: 'Hours', max: 23 },
                { val: minutes, set: setMinutes, label: 'Minutes', max: 59 },
                { val: secs, set: setSecs, label: 'Seconds', max: 59 },
              ].map(({ val, set, label, max }, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="digit-box">
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      min="0"
                      max={max}
                      className="w-10 text-center bg-transparent text-white text-sm font-bold font-mono outline-none leading-none"
                      aria-label={label}
                    />
                    <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-wider">{label.slice(0, 2)}</p>
                  </div>
                  {i < 2 && <span className="text-white/25 text-lg font-bold">:</span>}
                </div>
              ))}
            </form>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {QUICK_DURATIONS.map((d) => (
                <motion.button
                  key={d.seconds}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => start(d.seconds)}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-teal-500/12 hover:border-teal-500/25 hover:text-teal-300 transition-all duration-200"
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 w-full">
          {state === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { const t = getTotalInputSeconds(); if (t > 0) start(t); }}
              disabled={getTotalInputSeconds() <= 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(20,184,166,0.3)',
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Start
            </motion.button>
          )}
          {state === 'running' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={pause}
              className="flex-1 py-2.5 rounded-xl bg-white/8 text-white font-semibold text-sm border border-white/10 hover:bg-white/14 transition-all"
            >
              ⏸ Pause
            </motion.button>
          )}
          {state === 'paused' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={resume}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', boxShadow: '0 4px 16px rgba(20,184,166,0.3)' }}
            >
              ▶ Resume
            </motion.button>
          )}
          {state === 'done' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { reset(); setShowToast(false); }}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all"
            >
              🔄 New Timer
            </motion.button>
          )}
          {state !== 'idle' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { reset(); setShowToast(false); }}
              className="flex-shrink-0 px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 font-semibold text-sm border border-rose-500/18 hover:bg-rose-500/20 transition-all"
            >
              ✕
            </motion.button>
          )}
        </div>
      </div>
    </Card>
  );
}
