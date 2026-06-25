'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WeatherSkeleton } from './WeatherSkeleton';
import { formatTemperature } from '@/utils/formatters';

const weatherIconMap: Record<string, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
  Smoke: '💨',
  Dust: '💨',
  Sand: '💨',
  Ash: '💨',
  Squall: '💨',
  Tornado: '🌪️',
};

const weatherGlowMap: Record<string, string> = {
  Clear: 'rgba(251,191,36,0.14)',
  Clouds: 'rgba(148,163,184,0.1)',
  Rain: 'rgba(56,189,248,0.14)',
  Drizzle: 'rgba(56,189,248,0.1)',
  Thunderstorm: 'rgba(139,92,246,0.14)',
  Snow: 'rgba(186,230,253,0.12)',
  default: 'rgba(99,102,241,0.12)',
};

const weatherBorderMap: Record<string, string> = {
  Clear: 'rgba(251,191,36,0.2)',
  Clouds: 'rgba(148,163,184,0.14)',
  Rain: 'rgba(56,189,248,0.2)',
  Drizzle: 'rgba(56,189,248,0.15)',
  Thunderstorm: 'rgba(139,92,246,0.2)',
  Snow: 'rgba(186,230,253,0.18)',
  default: 'rgba(99,102,241,0.18)',
};

const weatherAccentMap: Record<string, string> = {
  Clear: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
  Clouds: 'linear-gradient(90deg, #94a3b8, #64748b)',
  Rain: 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
  Drizzle: 'linear-gradient(90deg, #7dd3fc, #38bdf8)',
  Thunderstorm: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
  Snow: 'linear-gradient(90deg, #bae6fd, #7dd3fc)',
  default: 'linear-gradient(90deg, #6366f1, #a78bfa)',
};

function getWeatherIcon(condition: string): string {
  return weatherIconMap[condition] ?? '🌡️';
}

function getGlow(condition: string): string {
  return weatherGlowMap[condition] ?? weatherGlowMap.default;
}

function getBorder(condition: string): string {
  return weatherBorderMap[condition] ?? weatherBorderMap.default;
}

function getAccent(condition: string): string {
  return weatherAccentMap[condition] ?? weatherAccentMap.default;
}

export function WeatherWidget() {
  const { data, status, error, city, handleSearch, fetchByGeolocation, refresh } = useWeather();
  const [inputCity, setInputCity] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      handleSearch(inputCity.trim());
      setInputCity('');
      setShowSearch(false);
    }
  };

  const condition = data?.condition ?? 'default';

  return (
    <div
      className="h-full relative rounded-[20px] overflow-hidden transition-all duration-500"
      style={{
        background: `rgba(255,255,255,0.04)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${getBorder(condition)}`,
        boxShadow: `0 0 0 1px ${getBorder(condition)}, 0 8px 48px ${getGlow(condition)}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Condition-reactive background gradient */}
      <div
        className="absolute inset-0 opacity-40 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 0%, ${getGlow(condition).replace(')', ', 2)').replace('rgba', 'rgba')} 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: getAccent(condition) }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: getGlow(condition), border: `1px solid ${getBorder(condition)}` }}
            >
              🌍
            </div>
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Weather</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchByGeolocation}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              title="Use my location"
              aria-label="Use my location"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              aria-label="Search city"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={refresh}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white hover:scale-110"
              aria-label="Refresh weather"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={onSubmit}
              className="mb-4 overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  placeholder="Enter city name…"
                  className="flex-1 px-3 py-2 text-sm bg-white/6 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-indigo-500/60 transition-all"
                  autoFocus
                  aria-label="City name"
                />
                <Button type="submit" size="sm" disabled={!inputCity.trim()}>Go</Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Loading */}
        {status === 'loading' && (
          <div className="py-4 flex-1">
            <WeatherSkeleton />
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center py-8 space-y-3 flex-1 flex flex-col items-center justify-center">
            <p className="text-4xl" aria-hidden="true">⚠️</p>
            <p className="text-sm text-rose-400">{error}</p>
            <Button variant="outline" size="sm" onClick={refresh}>Try Again</Button>
          </div>
        )}

        {/* Success */}
        {status === 'success' && data && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            {/* Main weather display */}
            <div className="flex items-center justify-between mb-6 flex-1">
              <div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-6xl font-bold text-white leading-none font-display tracking-tight">
                    {formatTemperature(data.temperature)}
                  </span>
                </div>
                <p className="text-white/60 text-base capitalize font-medium">{data.description}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-white/35 text-sm">{data.city}, {data.country}</span>
                </div>
              </div>

              <motion.span
                className="text-7xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                aria-label={data.condition}
              >
                {getWeatherIcon(data.condition)}
              </motion.span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Feels Like', value: formatTemperature(data.feelsLike), icon: '🌡️' },
                { label: 'Humidity', value: `${data.humidity}%`, icon: '💧' },
                { label: 'Wind', value: `${data.windSpeed} m/s`, icon: '💨' },
                { label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`, icon: '👁️' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors text-center"
                >
                  <span className="text-sm" aria-hidden="true">{stat.icon}</span>
                  <p className="text-sm font-bold text-white leading-tight">{stat.value}</p>
                  <p className="text-[10px] text-white/35 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Idle */}
        {status === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-5xl">🌍</div>
            <div className="text-center">
              <p className="text-white/50 text-sm font-medium">Search for a city</p>
              <p className="text-white/25 text-xs mt-1">or use your current location</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchByGeolocation}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
