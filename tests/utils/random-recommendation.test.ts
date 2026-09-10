// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RecommendationHistory,
  buildFilterSummary,
  getDefaultFilters,
  getRandomRecommendation,
  validateFilters,
} from "@/utils/randomRecommendation";
import { tmdbMovie } from "@/tests/fixtures/catalog";

afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe("random recommendations", () => {
  it("validates filters and builds exact user summaries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T12:00:00Z"));
    expect(getDefaultFilters()).toEqual({
      genres: [],
      yearRange: [1990, 2026],
      minRating: 6,
      excludeWatched: false,
    });
    expect(
      validateFilters({ genres: [-1], yearRange: [1899, 2032], minRating: 11 })
    ).toEqual({
      isValid: false,
      errors: [
        "Start year must be between 1900 and current year",
        "End year must be after start year and not more than 5 years in the future",
        "Rating must be between 0 and 10",
        "Invalid genre selection",
      ],
    });
    expect(
      buildFilterSummary(
        { genres: [18, 878], yearRange: [2010, 2020], minRating: 7 },
        [{ id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }]
      )
    ).toBe("Drama, Science Fiction • 2010-2020 • 7+ rating");
  });

  it("posts exact filters and returns the concrete selected movie", async () => {
    const movie = tmdbMovie(329865, "Arrival");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(movie), { status: 200, headers: { "Content-Type": "application/json" } })
    );
    vi.stubGlobal("fetch", fetchMock);
    const filters = { genres: [18], yearRange: [2015, 2020] as [number, number], minRating: 7 };
    await expect(getRandomRecommendation(filters)).resolves.toEqual(movie);
    expect(fetchMock).toHaveBeenCalledWith("/api/movies/random", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
  });

  it("deduplicates and bounds persisted recommendation history", () => {
    for (let id = 1; id <= 6; id += 1) RecommendationHistory.save(tmdbMovie(id, `Movie ${id}`));
    RecommendationHistory.save(tmdbMovie(3, "Movie 3"));
    expect(RecommendationHistory.load().map(({ id }) => id)).toEqual([3, 6, 5, 4, 2]);
    RecommendationHistory.clear();
    expect(RecommendationHistory.load()).toEqual([]);
  });
});
