'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useNewsStore } from '@/store/newsSlice';
import { getTopHeadlines, getMockNews } from '@/services/news.service';

const AUTO_ROTATE_INTERVAL = 4000; // 4 seconds

export function useNews() {
  const {
    articles,
    status,
    error,
    currentIndex,
    setArticles,
    setStatus,
    setError,
    nextArticle,
    prevArticle,
    setCurrentIndex,
  } = useNewsStore();

  const isHoveredRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNews = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_GNEWS_API_KEY) {
      // Use mock data in development
      setArticles(getMockNews());
      return;
    }
    setStatus('loading');
    try {
      const data = await getTopHeadlines('technology', 10);
      setArticles(data);
    } catch {
      // Fallback to mock on error
      setArticles(getMockNews());
    }
  }, [setArticles, setStatus]);

  // Start auto-rotation
  const startRotation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        nextArticle();
      }
    }, AUTO_ROTATE_INTERVAL);
  }, [nextArticle]);

  const stopRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (articles.length > 0) {
      startRotation();
      return () => stopRotation();
    }
  }, [articles.length, startRotation, stopRotation]);

  const onMouseEnter = () => { isHoveredRef.current = true; };
  const onMouseLeave = () => { isHoveredRef.current = false; };

  return {
    articles,
    status,
    error,
    currentIndex,
    currentArticle: articles[currentIndex] ?? null,
    nextArticle,
    prevArticle,
    setCurrentIndex,
    onMouseEnter,
    onMouseLeave,
    refresh: fetchNews,
  };
}
