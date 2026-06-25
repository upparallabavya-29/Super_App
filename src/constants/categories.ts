export interface Category {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  color: string;         // solid card background color
  borderColor: string;  // selection border color
  image: string;        // representative movie/show image from TMDB
  searchTerms: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'action',
    label: 'Action',
    emoji: '⚡',
    gradient: 'from-orange-500 to-red-600',
    color: '#e8420a',
    borderColor: '#ff6b2b',
    image: '/action_movie.png',
    searchTerms: ['action', 'war', 'fight'],
  },
  {
    id: 'drama',
    label: 'Drama',
    emoji: '🎭',
    gradient: 'from-purple-400 to-indigo-500',
    color: '#b39cd0',
    borderColor: '#a78bfa',
    image: '/drama_movie.png',
    searchTerms: ['drama', 'life', 'story'],
  },
  {
    id: 'romance',
    label: 'Romance',
    emoji: '💖',
    gradient: 'from-green-500 to-emerald-600',
    color: '#16a34a',
    borderColor: '#4ade80',
    image: '/romance_movie.png',
    searchTerms: ['romance', 'love', 'heart'],
  },
  {
    id: 'thriller',
    label: 'Thriller',
    emoji: '🔪',
    gradient: 'from-sky-400 to-blue-600',
    color: '#2563eb',
    borderColor: '#60a5fa',
    image: '/thriller_movie.png',
    searchTerms: ['thriller', 'crime', 'mystery'],
  },
  {
    id: 'western',
    label: 'Western',
    emoji: '🤠',
    gradient: 'from-amber-700 to-red-900',
    color: '#92400e',
    borderColor: '#d97706',
    image: '/western_movie.png',
    searchTerms: ['western', 'cowboy', 'frontier'],
  },
  {
    id: 'horror',
    label: 'Horror',
    emoji: '💀',
    gradient: 'from-violet-600 to-purple-900',
    color: '#5b21b6',
    borderColor: '#a78bfa',
    image: '/horror_movie.png',
    searchTerms: ['horror', 'fear', 'dark'],
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    emoji: '🧙',
    gradient: 'from-pink-500 to-fuchsia-700',
    color: '#db2777',
    borderColor: '#f472b6',
    image: '/fantasy_movie.png',
    searchTerms: ['fantasy', 'magic', 'dragon'],
  },
  {
    id: 'music',
    label: 'Music',
    emoji: '🎵',
    gradient: 'from-red-500 to-rose-700',
    color: '#dc2626',
    borderColor: '#f87171',
    image: '/music_movie.png',
    searchTerms: ['music', 'musical', 'concert'],
  },
  {
    id: 'scifi',
    label: 'Fiction',
    emoji: '🚀',
    gradient: 'from-green-600 to-teal-700',
    color: '#059669',
    borderColor: '#34d399',
    image: '/scifi_movie.png',
    searchTerms: ['sci-fi', 'space', 'future'],
  },
];

export const MIN_CATEGORIES = 3;
