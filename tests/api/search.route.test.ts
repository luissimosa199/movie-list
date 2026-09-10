import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/search/route";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 200 ? "OK" : "Unavailable",
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("catalog search route", () => {
  it("returns an exact empty response without contacting TMDB", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(new Request("http://localhost/api/search?q=%20%20"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes movies, series, actors, and directors into exact app links", async () => {
    const results = [
      { media_type: "movie", id: 1, title: "Arrival", release_date: "2016-11-11", overview: "Language", poster_path: "/a.jpg", vote_average: 8, vote_count: 900 },
      { media_type: "tv", id: 2, name: "Dark", first_air_date: "2017-12-01", overview: null, poster_path: null, vote_average: 8.4, vote_count: 700 },
      { media_type: "person", id: 3, name: "Amy Adams", known_for_department: "Acting", profile_path: "/amy.jpg" },
      { media_type: "person", id: 4, name: "Denis Villeneuve", known_for_department: "Directing", profile_path: null },
    ];
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ page: 2, results, total_pages: 4, total_results: 44 })
    );
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(new Request("http://localhost/api/search?query=arrival&page=2&limit=4"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      page: 2,
      total_pages: 4,
      total_results: 44,
      results: [
        { kind: "movie", id: 1, title: "Arrival", year: 2016, overview: "Language", posterPath: "/a.jpg", href: "/movies/1?tmdb=true", voteAverage: 8, voteCount: 900 },
        { kind: "series", id: 2, title: "Dark", year: 2017, overview: null, posterPath: null, href: "/series/2?tmdb=true", voteAverage: 8.4, voteCount: 700 },
        { kind: "actor", id: 3, title: "Amy Adams", year: null, overview: null, posterPath: "/amy.jpg", href: "/people/3", voteAverage: null, voteCount: null },
        { kind: "director", id: 4, title: "Denis Villeneuve", year: null, overview: null, posterPath: null, href: "/people/4", voteAverage: null, voteCount: null },
      ],
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.themoviedb.org/3/search/multi?query=arrival&page=2"
    );
  });

  it("uses safe pagination fallbacks and returns the route's exact 500 error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 503));
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET(new Request("http://localhost/api/search?q=x&page=-2&limit=0"));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Failed to search catalog" });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.themoviedb.org/3/search/multi?query=x&page=1"
    );
  });
});
