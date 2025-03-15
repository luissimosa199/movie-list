export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface FullDetailTMDBMovie extends TMDBMovie {
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
}

export interface Movie {
  id: number;
  tmdb_id: number;
  imdb_id: string;
  created_at: Date;
  updated_at: Date;
  watched_at?: Date | null;
  title: string;
  overview?: string | null;
  release_date: Date;
  runtime?: number | null;
  genres?: string[] | null;
  poster_url?: string | null;
  score?: number | null;
}

export interface CreateMovieData {
  tmdb_id: number;
  imdb_id: string;
  title: string;
  overview: string;
  release_date: Date;
  runtime: number;
  genres: string[];
  poster_url: string | null;
  score: number;
  created_at: Date;
  updated_at: Date;
  watched_at: Date | null;
}
