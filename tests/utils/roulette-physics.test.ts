import { describe, expect, it } from "vitest";
import { determineWinner, generateWheelSegments, validateWheelMovies } from "@/utils/roulettePhysics";
import { tmdbMovie } from "@/tests/fixtures/catalog";

describe("roulette selection", () => {
  const movies = [tmdbMovie(1, "Arrival"), tmdbMovie(2, "Inception"), tmdbMovie(3, "Alien")];

  it("builds exact equal segments and resolves wrapped, negative, and boundary angles", () => {
    const segments = generateWheelSegments(movies);
    expect(segments.map(({ startAngle, endAngle, movie }) => [movie.title, startAngle, endAngle])).toEqual([
      ["Arrival", 0, 120],
      ["Inception", 120, 240],
      ["Alien", 240, 360],
    ]);
    expect(determineWinner(0, segments)?.title).toBe("Arrival");
    expect(determineWinner(120, segments)?.title).toBe("Alien");
    expect(determineWinner(-120, segments)?.title).toBe("Inception");
    expect(determineWinner(480, segments)?.title).toBe("Alien");
  });

  it("pins the two-to-twelve title limits", () => {
    expect(validateWheelMovies([movies[0]])).toEqual({
      isValid: false,
      message: "Add at least 2 movies to spin the wheel",
    });
    expect(validateWheelMovies(movies.slice(0, 2))).toEqual({ isValid: true });
    expect(validateWheelMovies(Array.from({ length: 13 }, (_, index) => tmdbMovie(index, `${index}`)))).toEqual({
      isValid: false,
      message: "Maximum 12 movies allowed for optimal wheel visibility",
    });
  });
});
