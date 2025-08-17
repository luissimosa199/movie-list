import { TMDBMovie, TMDBSeries, FullDetailTMDBMovie, FullDetailTMDBSeries, Genre, DiscoverParams } from "@/types";

type QueryParams = Record<string, string | number>;

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_TOKEN as string;

const headers: HeadersInit = {
  accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

function buildQueryString(params: QueryParams): string {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  return query ? `?${query}` : "";
}

async function fetchFromTMDB<T>(
  endpoint: string,
  queryParams: QueryParams = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}${buildQueryString(queryParams)}`;
  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
}

export async function getMovieDetails(id: number): Promise<FullDetailTMDBMovie> {
  return fetchFromTMDB<FullDetailTMDBMovie>(`/movie/${id}`);
}

export async function searchMovies(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  return fetchFromTMDB<TMDBResponse<TMDBMovie>>("/search/movie", {
    query,
    page,
    per_page: limit,
  });
}

export async function discoverMovies(params: {
  page?: number;
  limit?: number;
  with_genres?: string; // comma-separated TMDB genre IDs
  primary_release_year?: string;
  'vote_average.gte'?: string;
}): Promise<TMDBResponse<TMDBMovie>> {
  const { page = 1, limit = 10, ...rest } = params;
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    "/discover/movie",
    { page, ...rest }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getMovieEndpoint(
  endpoint: string,
  queryParams: QueryParams = {}
): Promise<TMDBResponse<TMDBMovie>> {
  return fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    `/movie/${endpoint}`,
    queryParams
  );
}

export async function getPopularMovies(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    "/movie/popular",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getTopRatedMovies(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    "/movie/top_rated",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getUpcomingMovies(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    "/movie/upcoming",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

//

export async function getSimilarMovies(
  movieId: number,
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    `/movie/${movieId}/similar`,
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getMovieRecommendations(
  movieId: number,
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBMovie>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    `/movie/${movieId}/recommendations`,
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

// TV Series API Functions
export async function getSeriesDetails(id: number): Promise<FullDetailTMDBSeries> {
  return fetchFromTMDB<FullDetailTMDBSeries>(`/tv/${id}`);
}

export async function searchSeries(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBSeries>> {
  return fetchFromTMDB<TMDBResponse<TMDBSeries>>("/search/tv", {
    query,
    page,
    per_page: limit,
  });
}

export async function getPopularSeries(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBSeries>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBSeries>>(
    "/tv/popular",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getTopRatedSeries(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBSeries>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBSeries>>(
    "/tv/top_rated",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getOnTheAirSeries(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBSeries>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBSeries>>(
    "/tv/on_the_air",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

export async function getAiringTodaySeries(
  page: number = 1,
  limit: number = 10
): Promise<TMDBResponse<TMDBSeries>> {
  const response = await fetchFromTMDB<TMDBResponse<TMDBSeries>>(
    "/tv/airing_today",
    { page }
  );
  return {
    ...response,
    results: response.results.slice(0, limit),
  };
}

// Random Recommendation Functions

export async function getGenres(): Promise<Genre[]> {
  interface GenreResponse {
    genres: Genre[];
  }
  const response = await fetchFromTMDB<GenreResponse>("/genre/movie/list");
  return response.genres;
}

export async function getRandomMoviePage(params: DiscoverParams): Promise<number> {
  // First, get total pages from a discover call
  const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
    "/discover/movie",
    { ...params, page: 1 }
  );

  // Generate random page number between 1 and total_pages (max 500 as per TMDB limit)
  const maxPage = Math.min(response.total_pages, 500);
  return Math.floor(Math.random() * maxPage) + 1;
}

export async function discoverMoviesWithRandom(params: DiscoverParams): Promise<TMDBMovie> {
  try {
    // Get a random page
    const randomPage = await getRandomMoviePage(params);

    // Fetch movies from that random page
    const response = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      "/discover/movie",
      { ...params, page: randomPage }
    );

    if (response.results.length === 0) {
      throw new Error("No movies found for the given criteria");
    }

    // Return a random movie from the page
    const randomIndex = Math.floor(Math.random() * response.results.length);
    return response.results[randomIndex];
  } catch (error) {
    // Fallback: try with broader criteria
    console.warn("Random movie fetch failed, trying fallback:", error);

    // Remove rating constraint for fallback
    const fallbackParams = { ...params };
    delete fallbackParams['vote_average.gte'];

    const fallbackResponse = await fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      "/discover/movie",
      fallbackParams
    );

    if (fallbackResponse.results.length === 0) {
      throw new Error("No movies found even with fallback criteria");
    }

    const randomIndex = Math.floor(Math.random() * fallbackResponse.results.length);
    return fallbackResponse.results[randomIndex];
  }
}

export function buildDiscoverParams(filters: {
  genres: number[];
  yearRange: [number, number];
  minRating: number;
}): DiscoverParams {
  const params: DiscoverParams = {};

  // Add genres filter
  if (filters.genres.length > 0) {
    params.with_genres = filters.genres.join(',');
  }

  // Add year range filters
  const [minYear, maxYear] = filters.yearRange;
  params['primary_release_date.gte'] = `${minYear}-01-01`;
  params['primary_release_date.lte'] = `${maxYear}-12-31`;

  // Add minimum rating filter
  if (filters.minRating > 0) {
    params['vote_average.gte'] = filters.minRating.toString();
    // Also add vote count requirement to ensure quality ratings
    params['vote_count.gte'] = '50';
  }

  return params;
}
