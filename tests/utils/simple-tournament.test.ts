// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createTournament,
  createTournamentSummary,
  deleteTournament,
  getCurrentBattle,
  getTournamentProgress,
  loadTournament,
  recordBattleWinner,
  saveTournament,
  validateTournamentMovies,
} from "@/utils/simpleTournament";
import { tmdbMovie } from "@/tests/fixtures/catalog";

afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("simple tournament", () => {
  it("progresses three exact battles to a champion and summary", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const movies = ["Arrival", "Alien", "Inception", "Heat"].map((name, index) => tmdbMovie(index + 1, name));
    let tournament = createTournament(movies, "Friday final");
    expect(getCurrentBattle(tournament)?.movie1.title).toBe("Arrival");
    tournament = recordBattleWinner(tournament, movies[0]);
    expect(getTournamentProgress(tournament).progressPercentage).toBe(33);
    tournament = recordBattleWinner(tournament, movies[2]);
    expect(getCurrentBattle(tournament)?.movie1.title).toBe("Arrival");
    vi.setSystemTime(6_000);
    tournament = recordBattleWinner(tournament, movies[0]);
    expect(tournament.completed).toBe(true);
    expect(tournament.champion?.title).toBe("Arrival");
    expect(getTournamentProgress(tournament)).toEqual({
      completedBattles: 3,
      totalBattles: 3,
      currentRound: 2,
      totalRounds: 2,
      progressPercentage: 100,
    });
    expect(createTournamentSummary(tournament)).toMatchObject({
      champion: { title: "Arrival" },
      defeatedMovies: [{ title: "Alien" }, { title: "Inception" }],
      totalBattles: 2,
      duration: 5_000,
      battlePath: [
        { opponent: { title: "Alien" }, round: 1 },
        { opponent: { title: "Inception" }, round: 2 },
      ],
    });
  });

  it("rejects invalid inputs and winners", () => {
    const movies = [1, 2, 3, 4].map((id) => tmdbMovie(id, `Movie ${id}`));
    expect(validateTournamentMovies(movies.slice(0, 3))).toEqual({
      valid: false,
      error: "Tournament requires at least 4 movies",
    });
    expect(validateTournamentMovies([...movies, tmdbMovie(5, "Five")])).toEqual({
      valid: false,
      error: "Tournament requires an even number of movies",
    });
    expect(validateTournamentMovies([...movies.slice(0, 3), movies[0]])).toEqual({
      valid: false,
      error: "All movies must be unique",
    });
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(() => recordBattleWinner(createTournament(movies), tmdbMovie(99, "Outsider"))).toThrow(
      "Winner must be one of the two battling movies"
    );
  });

  it("round-trips and deletes local-storage persistence", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const tournament = createTournament([1, 2, 3, 4].map((id) => tmdbMovie(id, `Movie ${id}`)));
    saveTournament(tournament);
    expect(loadTournament()).toEqual(tournament);
    deleteTournament(tournament.id);
    expect(loadTournament(tournament.id)).toBeNull();
    expect(localStorage.getItem("current-tournament-id")).toBeNull();
  });
});
