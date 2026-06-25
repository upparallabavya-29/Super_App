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
    { imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0068646', Title: 'The Godfather', Year: '1972', Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0110912', Title: 'Pulp Fiction', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0137523', Title: 'Fight Club', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0167260', Title: 'The Lord of the Rings: The Return of the King', Year: '2003', Poster: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0120737', Title: 'The Lord of the Rings: The Fellowship of the Ring', Year: '2001', Poster: 'https://m.media-amazon.com/images/M/MV5BNyEyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0109830', Title: 'Forrest Gump', Year: '1994', Poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', Type: 'movie' },
    { imdbID: 'tt0114369', Title: 'Se7en', Year: '1995', Poster: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMy00OTk4LTg3NWUtNjZmZTRlZjVkZWY2XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', Type: 'movie' },
  ];
}
