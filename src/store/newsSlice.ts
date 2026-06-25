import { create } from 'zustand';
import { NewsArticle, NewsStatus } from '@/types/news.types';

interface NewsState {
  articles: NewsArticle[];
  status: NewsStatus;
  error: string | null;
  currentIndex: number;
  setArticles: (articles: NewsArticle[]) => void;
  setStatus: (status: NewsStatus) => void;
  setError: (error: string | null) => void;
  nextArticle: () => void;
  prevArticle: () => void;
  setCurrentIndex: (index: number) => void;
}

export const useNewsStore = create<NewsState>()((set, get) => ({
  articles: [],
  status: 'idle',
  error: null,
  currentIndex: 0,
  setArticles: (articles) => set({ articles, status: 'success', error: null, currentIndex: 0 }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),
  nextArticle: () => {
    const { articles, currentIndex } = get();
    if (articles.length === 0) return;
    set({ currentIndex: (currentIndex + 1) % articles.length });
  },
  prevArticle: () => {
    const { articles, currentIndex } = get();
    if (articles.length === 0) return;
    set({ currentIndex: (currentIndex - 1 + articles.length) % articles.length });
  },
  setCurrentIndex: (index) => set({ currentIndex: index }),
}));
