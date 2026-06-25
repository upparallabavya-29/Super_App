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
    { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0068646', Title: 'The Godfather', Year: '1972', Poster: 'https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0137523', Title: 'Fight Club', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0167260', Title: 'The Lord of the Rings: The Return of the King', Year: '2003', Poster: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDJhZWMtODU5NS00NjczLWEyZDYtNGVhZGU4NjNhNmMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFiZWZiZjQzNTY5XkEyXkFqcGc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0120737', Title: 'The Lord of the Rings: The Fellowship of the Ring', Year: '2001', Poster: 'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00NTM4LTlhOTctYjBiMjBiZGI4ZGRiXkEyXkFqcGc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0109830', Title: 'Forrest Gump', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTUtZGMyZmE5N2QyNzU2XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0114369', Title: 'Se7en', Year: '1995', Poster: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMy00OTk4LTg3NWUtNjZmZTRlZjVkZWY2XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', Type: 'movie' },
  ];
}
