import { Movie, MovieDetail, OmdbSearchResponse } from '@/types/movie.types';

const OMDB_BASE = 'https://www.omdbapi.com';

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  if (!key) throw new Error('OMDB API key not configured');
  return key;
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const key = getApiKey();
  const res = await fetch(
    `${OMDB_BASE}/?s=${encodeURIComponent(query)}&type=movie&page=${page}&apikey=${key}`
  );

  if (!res.ok) {
    throw new Error(`OMDB search failed: ${res.status}`);
  }

  const data: OmdbSearchResponse = await res.json();

  if (data.Response === 'False') {
    // Return empty instead of throwing for "no results" case
    return [];
  }

  return data.Search ?? [];
}

export async function getMovieById(imdbId: string): Promise<MovieDetail> {
  const key = getApiKey();
  const res = await fetch(
    `${OMDB_BASE}/?i=${imdbId}&plot=full&apikey=${key}`
  );

  if (!res.ok) {
    throw new Error(`OMDB movie detail failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }

  return data as MovieDetail;
}

export async function searchMoviesByCategories(searchTerms: string[]): Promise<Movie[]> {
  // Deduplicate and pick random terms to avoid hammering the API
  const shuffled = [...searchTerms].sort(() => Math.random() - 0.5).slice(0, 4);

  const results = await Promise.allSettled(
    shuffled.map((term) => searchMovies(term))
  );

  const allMovies: Movie[] = [];
  const seenIds = new Set<string>();

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      result.value.forEach((movie) => {
        if (!seenIds.has(movie.imdbID) && movie.Poster !== 'N/A') {
          seenIds.add(movie.imdbID);
          allMovies.push(movie);
        }
      });
    }
  });

  return allMovies;
}

// Mock data for development
export function getMockMovies(): Movie[] {
  return [
    { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://image.tmdb.org/t/p/w500/9cqNMLxJAPxebLrK36P96Kz2H4R.jpg', Type: 'movie' },
    { imdbID: 'tt0068646', Title: 'The Godfather', Year: '1972', Poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7ae3OhD1H09930fM.jpg', Type: 'movie' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', Type: 'movie' },
    { imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994', Poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXA.jpg', Type: 'movie' },
    { imdbID: 'tt0137523', Title: 'Fight Club', Year: '1999', Poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSpqUqTh8y0yVf3Y7Gj9.jpg', Type: 'movie' },
    { imdbID: 'tt0167260', Title: 'The Lord of the Rings: The Return of the King', Year: '2003', Poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoDk0L178w72PzK5a7.jpg', Type: 'movie' },
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zNNK452H5D3JkF6d7h4.jpg', Type: 'movie' },
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: 'https://image.tmdb.org/t/p/w500/gEU2QpI6EItf48nmYKVw9M6Ld1J.jpg', Type: 'movie' },
    { imdbID: 'tt0120737', Title: 'The Lord of the Rings: The Fellowship of the Ring', Year: '2001', Poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMMIb52s4s548V42.jpg', Type: 'movie' },
    { imdbID: 'tt0109830', Title: 'Forrest Gump', Year: '1994', Poster: 'https://image.tmdb.org/t/p/w500/yE5d3BUhQnJjJ3Lw6W6s6nB2H0B.jpg', Type: 'movie' },
    { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXQi5H.jpg', Type: 'movie' },
    { imdbID: 'tt0114369', Title: 'Se7en', Year: '1995', Poster: 'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg', Type: 'movie' },
  ];
}
