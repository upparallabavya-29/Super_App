export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  Genre?: string;
}

export interface MovieDetail extends Movie {
  Plot: string;
  Director: string;
  Writer: string;
  Actors: string;
  Runtime: string;
  Genre: string;
  imdbRating: string;
  imdbVotes: string;
  Language: string;
  Country: string;
  Awards: string;
  BoxOffice?: string;
  Rated: string;
  Released: string;
  Production?: string;
}

export type MovieStatus = 'idle' | 'loading' | 'success' | 'error';

export interface OmdbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: 'True' | 'False';
  Error?: string;
}
