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
  score?: number;
  created_at: Date;
  updated_at: Date;
  watched_at: Date | null;
}

// TV Series Types
export interface TMDBSeries {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface FullDetailTMDBSeries extends TMDBSeries {
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
  next_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  } | null;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
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
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
}

export interface Series {
  id: number;
  tmdb_id: number;
  created_at: Date;
  updated_at: Date;
  watched_at?: Date | null;
  name: string;
  overview?: string | null;
  first_air_date: Date;
  last_air_date?: Date | null;
  number_of_episodes?: number | null;
  number_of_seasons?: number | null;
  genres?: string[] | null;
  poster_url?: string | null;
  score?: number | null;
}

export interface CreateSeriesData {
  tmdb_id: number;
  name: string;
  overview: string;
  first_air_date: Date;
  last_air_date?: Date | null;
  number_of_episodes?: number;
  number_of_seasons?: number;
  genres: string[];
  poster_url: string | null;
  score?: number;
  created_at: Date;
  updated_at: Date;
  watched_at: Date | null;
}
