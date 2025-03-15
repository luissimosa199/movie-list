import { TMDBMovie } from "@/types";

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

export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  return fetchFromTMDB<TMDBMovie>(`/movie/${id}`);
}

export async function searchMovies(
  query: string,
  queryParams: QueryParams = {}
): Promise<TMDBResponse<TMDBMovie>> {
  return fetchFromTMDB<TMDBResponse<TMDBMovie>>("/search/movie", {
    query,
    ...queryParams,
  });
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
