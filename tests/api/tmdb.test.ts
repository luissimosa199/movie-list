import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildDiscoverParams,
  discoverMovies,
  discoverMoviesWithRandom,
  getMovieDetails,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getUpcomingMovies,
  searchAllMedia,
} from "@/api/tmdb";
import { tmdbMovie } from "@/tests/fixtures/catalog";

const tmdbResponse = (results: unknown[], totalPages = 7) => ({
  page: 2,
  results,
  total_pages: totalPages,
  total_results: results.length,
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 200 ? "OK" : "Bad Gateway",
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("TMDB catalog boundary", () => {
  it("requests browse feeds with exact endpoints, auth, pages, and result limits", async () => {
    const results = [tmdbMovie(1, "One"), tmdbMovie(2, "Two"), tmdbMovie(3, "Three")];
    const fetchMock = vi.fn().mockImplementation(async () => jsonResponse(tmdbResponse(results)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPopularMovies(2, 2)).resolves.toMatchObject({ results: results.slice(0, 2) });
    await expect(getTopRatedMovies(3, 1)).resolves.toMatchObject({ results: results.slice(0, 1) });
    await expect(getUpcomingMovies(4, 2)).resolves.toMatchObject({ results: results.slice(0, 2) });
    await expect(getPopularSeries(5, 1)).resolves.toMatchObject({ results: results.slice(0, 1) });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.themoviedb.org/3/movie/popular?page=2",
      "https://api.themoviedb.org/3/movie/top_rated?page=3",
      "https://api.themoviedb.org/3/movie/upcoming?page=4",
      "https://api.themoviedb.org/3/tv/popular?page=5",
    ]);
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: "GET",
      headers: { accept: "application/json", Authorization: "Bearer test-tmdb-token" },
    });
  });

  it("pins detail, multi-search, discovery parameters, and failures", async () => {
    const movie = tmdbMovie(329865, "Arrival");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(movie))
      .mockResolvedValueOnce(jsonResponse(tmdbResponse([movie, tmdbMovie(2, "Two")])))
      .mockResolvedValueOnce(jsonResponse(tmdbResponse([movie, tmdbMovie(2, "Two")])));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getMovieDetails(329865)).resolves.toEqual(movie);
    await expect(searchAllMedia("amy adams", 2, 1)).resolves.toMatchObject({ results: [movie] });
    await expect(
      discoverMovies({ page: 3, limit: 1, with_genres: "18,878", primary_release_year: "2016" })
    ).resolves.toMatchObject({ results: [movie] });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.themoviedb.org/3/movie/329865?append_to_response=credits%2Cvideos",
      "https://api.themoviedb.org/3/search/multi?query=amy+adams&page=2",
      "https://api.themoviedb.org/3/discover/movie?page=3&with_genres=18%2C878&primary_release_year=2016",
    ]);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 502)));
    await expect(getPopularMovies()).rejects.toThrow("Failed to fetch: Bad Gateway");
  });

  it("builds filters and deterministically selects from random discovery", async () => {
    expect(buildDiscoverParams({ genres: [18, 878], yearRange: [2010, 2020], minRating: 7 })).toEqual({
      with_genres: "18,878",
      "primary_release_date.gte": "2010-01-01",
      "primary_release_date.lte": "2020-12-31",
      "vote_average.gte": "7",
      "vote_count.gte": "50",
    });
    const first = tmdbMovie(1, "First");
    const selected = tmdbMovie(2, "Selected");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(tmdbResponse([], 10)))
      .mockResolvedValueOnce(jsonResponse(tmdbResponse([first, selected])));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(Math, "random").mockReturnValueOnce(0.4).mockReturnValueOnce(0.75);
    await expect(discoverMoviesWithRandom({ with_genres: "18" })).resolves.toEqual(selected);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.themoviedb.org/3/discover/movie?with_genres=18&page=1",
      "https://api.themoviedb.org/3/discover/movie?with_genres=18&page=5",
    ]);
  });
});
