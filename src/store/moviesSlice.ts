import { create } from 'zustand';
import { Movie, MovieDetail, MovieStatus } from '@/types/movie.types';

interface MoviesState {
  movies: Movie[];
  selectedMovie: MovieDetail | null;
  status: MovieStatus;
  detailStatus: MovieStatus;
  error: string | null;
  searchedTerms: string[];
  setMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: MovieDetail | null) => void;
  setStatus: (status: MovieStatus) => void;
  setDetailStatus: (status: MovieStatus) => void;
  setError: (error: string | null) => void;
  addSearchedTerm: (term: string) => void;
}

export const useMoviesStore = create<MoviesState>()((set, get) => ({
  movies: [],
  selectedMovie: null,
  status: 'idle',
  detailStatus: 'idle',
  error: null,
  searchedTerms: [],
  setMovies: (movies) => set({ movies, status: 'success', error: null }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setStatus: (status) => set({ status }),
  setDetailStatus: (status) => set({ detailStatus: status }),
  setError: (error) => set({ error, status: 'error' }),
  addSearchedTerm: (term) => {
    const terms = get().searchedTerms;
    if (!terms.includes(term)) set({ searchedTerms: [...terms, term] });
  },
}));
