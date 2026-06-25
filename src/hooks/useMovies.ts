'use client';

import { useCallback, useEffect } from 'react';
import { useMoviesStore } from '@/store/moviesSlice';
import { useCategoriesStore } from '@/store/categoriesSlice';
import { searchMoviesByCategories, getMovieById, getMockMovies } from '@/services/movies.service';

export function useMovies() {
  const {
    movies,
    selectedMovie,
    status,
    detailStatus,
    error,
    setMovies,
    setSelectedMovie,
    setStatus,
    setDetailStatus,
    setError,
  } = useMoviesStore();

  const { selected: selectedCategories } = useCategoriesStore();

  const fetchMovies = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_OMDB_API_KEY) {
      setMovies(getMockMovies());
      return;
    }

    if (selectedCategories.length === 0) {
      setMovies(getMockMovies());
      return;
    }

    setStatus('loading');
    try {
      const searchTerms = selectedCategories.flatMap((c) => c.searchTerms);
      const results = await searchMoviesByCategories(searchTerms);
      setMovies(results.length > 0 ? results : getMockMovies());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
      setMovies(getMockMovies());
    }
  }, [selectedCategories, setMovies, setStatus, setError]);

  const openMovieDetail = useCallback(async (imdbId: string) => {
    if (!process.env.NEXT_PUBLIC_OMDB_API_KEY) {
      // For mock: find from mock list
      const mock = getMockMovies().find((m) => m.imdbID === imdbId);
      if (mock) {
        setSelectedMovie({
          ...mock,
          Plot: 'A riveting story that has captivated audiences worldwide with its masterful storytelling.',
          Director: 'Famous Director',
          Writer: 'Famous Writer',
          Actors: 'Actor One, Actor Two, Actor Three',
          Runtime: '142 min',
          Genre: 'Drama, Thriller',
          imdbRating: '9.3',
          imdbVotes: '120,450',
          Language: 'English',
          Country: 'USA',
          Awards: 'Won 7 Oscars',
          Rated: 'R',
          Released: '01 Jan 2024',
        });
      }
      return;
    }

    setDetailStatus('loading');
    try {
      const detail = await getMovieById(imdbId);
      setSelectedMovie(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setDetailStatus('idle');
    }
  }, [setSelectedMovie, setDetailStatus, setError]);

  const closeMovieDetail = useCallback(() => {
    setSelectedMovie(null);
  }, [setSelectedMovie]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    selectedMovie,
    status,
    detailStatus,
    error,
    openMovieDetail,
    closeMovieDetail,
    refresh: fetchMovies,
  };
}
