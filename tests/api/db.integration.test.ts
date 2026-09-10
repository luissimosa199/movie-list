import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addMovieToList,
  addSeriesToList,
  getLatestWatchedMovies,
  getLatestWatchedProfileFeed,
  getMovie,
  getMovieByTmdbId,
  getProfileStats,
  getRecentlyAddedMovies,
  getRecentlyAddedProfileFeed,
  getSeriesByTmdbId,
  markMovieAsWatched,
  markSeriesAsWatched,
  movieExistsInDb,
  removeMovieFromList,
  removeSeriesFromList,
  updateMovieScore,
  updateSeriesScore,
} from "@/api/db";
import { alice, bob } from "@/tests/fixtures/catalog";
import { verifyDisposableDatabase } from "@/tests/setup/database-safety";

const prisma = new PrismaClient();
const NOW = new Date("2026-09-09T12:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(NOW.getTime() - days * DAY);

async function cleanDatabase() {
  await prisma.movie_watch_events.deleteMany();
  await prisma.movies.deleteMany();
  await prisma.series.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  await prisma.user.createMany({ data: [alice, bob] });
  const arrival = await prisma.movies.create({
    data: {
      userId: alice.id,
      tmdb_id: 329865,
      imdb_id: "tt2543164",
      title: "Arrival",
      overview: "A linguist meets visitors.",
      release_date: new Date("2016-11-11"),
      runtime: 116,
      genres: ["Drama", "Sci-Fi"],
      poster_url: "/arrival.jpg",
      score: 5,
      created_at: daysAgo(20),
      updated_at: NOW,
      watched_at: NOW,
    },
  });
  const madMax = await prisma.movies.create({
    data: {
      userId: alice.id,
      tmdb_id: 76341,
      imdb_id: "tt1392190",
      title: "Mad Max",
      overview: "Road war.",
      release_date: new Date("2015-05-15"),
      runtime: 120,
      genres: ["Action", "Sci-Fi"],
      poster_url: "/mad-max.jpg",
      score: 4,
      created_at: daysAgo(10),
      updated_at: daysAgo(2),
      watched_at: daysAgo(2),
    },
  });
  const inception = await prisma.movies.create({
    data: {
      userId: alice.id,
      tmdb_id: 27205,
      imdb_id: "tt1375666",
      title: "Inception",
      overview: "Dreams.",
      release_date: new Date("2010-07-16"),
      runtime: 148,
      genres: ["Action", "Sci-Fi"],
      poster_url: "/inception.jpg",
      created_at: daysAgo(-1),
      updated_at: daysAgo(-1),
      watched_at: null,
    },
  });
  const bobArrival = await prisma.movies.create({
    data: {
      userId: bob.id,
      tmdb_id: 329865,
      title: "Arrival",
      genres: ["Drama"],
      created_at: daysAgo(3),
      updated_at: daysAgo(3),
    },
  });
  await prisma.movie_watch_events.createMany({
    data: [
      { movie_id: arrival.id, userId: alice.id, watched_at: daysAgo(1) },
      { movie_id: arrival.id, userId: alice.id, watched_at: NOW },
      { movie_id: madMax.id, userId: alice.id, watched_at: daysAgo(2) },
    ],
  });
  const watchedSeries = await prisma.series.create({
    data: {
      userId: alice.id,
      tmdb_id: 1396,
      name: "Breaking Bad",
      overview: "Chemistry.",
      first_air_date: new Date("2008-01-20"),
      genres: ["Drama"],
      score: 5,
      watched_at: daysAgo(1),
      created_at: daysAgo(8),
      updated_at: daysAgo(1),
    },
  });
  const unwatchedSeries = await prisma.series.create({
    data: {
      userId: alice.id,
      tmdb_id: 70523,
      name: "Dark",
      overview: "Time travel.",
      first_air_date: new Date("2017-12-01"),
      genres: ["Drama", "Sci-Fi"],
      watched_at: null,
      created_at: daysAgo(-2),
      updated_at: daysAgo(-2),
    },
  });
  return { arrival, madMax, inception, bobArrival, watchedSeries, unwatchedSeries };
}

let databaseVerified = false;

beforeAll(async () => {
  await verifyDisposableDatabase();
  databaseVerified = true;
});

beforeEach(async () => {
  if (!databaseVerified) throw new Error("Disposable database was not verified before destructive test setup");
  vi.useRealTimers();
  await cleanDatabase();
});

afterAll(async () => {
  if (databaseVerified) await cleanDatabase();
  await prisma.$disconnect();
});

describe("database-backed libraries", () => {
  it("adds and looks up owned movies while enforcing per-user duplicates", async () => {
    const data = await seed();
    expect(await getMovie(alice.id, data.arrival.id)).toMatchObject({
      title: "Arrival",
      watched_at: NOW,
      watch_count: 2,
    });
    expect(await getMovie(bob.id, data.arrival.id)).toBeNull();
    expect(await getMovieByTmdbId(alice.id, 329865)).toMatchObject({ id: data.arrival.id });
    expect(await movieExistsInDb(alice.id, 329865)).toBe(data.arrival.id);
    expect(await movieExistsInDb(alice.id, 999999)).toBe(false);

    await expect(
      addMovieToList(alice.id, {
        tmdb_id: 329865,
        title: "Duplicate Arrival",
        overview: "",
        release_date: NOW,
        runtime: 0,
        genres: [],
        poster_url: null,
        score: undefined,
        imdb_id: "",
        created_at: NOW,
        updated_at: NOW,
        watched_at: null,
      })
    ).rejects.toMatchObject({ code: "P2002" });

    const bobCopy = await addMovieToList(bob.id, {
      tmdb_id: 27205,
      title: "Inception",
      overview: "",
      release_date: new Date("2010-07-16"),
      runtime: 148,
      genres: ["Sci-Fi"],
      poster_url: null,
      imdb_id: "tt1375666",
      created_at: NOW,
      updated_at: NOW,
      watched_at: null,
    });
    expect(bobCopy).toMatchObject({ title: "Inception", watch_count: 0 });
    expect(await getMovieByTmdbId(alice.id, 27205)).toMatchObject({ id: data.inception.id });
  });

  it("logs rewatches, updates ratings, protects ownership, and cascades movie events", async () => {
    const data = await seed();
    const thirdWatch = daysAgo(-1);
    await expect(markMovieAsWatched(alice.id, { id: data.arrival.id }, thirdWatch, true)).resolves.toMatchObject({
      watched_at: thirdWatch,
      watch_count: 3,
    });
    await expect(
      markMovieAsWatched(
        alice.id,
        {
          id: 550,
          title: "Fight Club",
          overview: "An insomniac meets a salesman.",
          release_date: new Date("1999-10-15"),
          runtime: 139,
          genres: ["Drama"],
          poster_path: "/fight-club.jpg",
          imdb_id: "tt0137523",
        },
        NOW,
        false
      )
    ).resolves.toMatchObject({
      tmdb_id: 550,
      title: "Fight Club",
      poster_url: "https://image.tmdb.org/t/p/original/fight-club.jpg",
      watched_at: NOW,
      watch_count: 1,
    });
    await expect(updateMovieScore(alice.id, data.arrival.id, 3)).resolves.toMatchObject({ score: 3 });
    await expect(updateMovieScore(bob.id, data.arrival.id, 1)).rejects.toThrow("Movie not found");
    await expect(markMovieAsWatched(bob.id, { id: data.arrival.id }, NOW, true)).rejects.toThrow("Movie not found");
    await expect(removeMovieFromList(bob.id, data.arrival.id)).rejects.toThrow("Movie not found");

    const removed = await removeMovieFromList(alice.id, data.arrival.id);
    expect(removed).toMatchObject({ title: "Arrival", watch_count: 3 });
    expect(await prisma.movie_watch_events.count({ where: { movie_id: data.arrival.id } })).toBe(0);
    expect(await getMovie(bob.id, data.bobArrival.id)).toMatchObject({ title: "Arrival" });
  });

  it("persists series watched state and ratings with per-user isolation", async () => {
    const data = await seed();
    expect(await getSeriesByTmdbId(alice.id, 1396)).toMatchObject({ name: "Breaking Bad", score: 5 });
    expect(await getSeriesByTmdbId(bob.id, 1396)).toBeNull();
    await expect(
      addSeriesToList(alice.id, {
        tmdb_id: 1396,
        name: "Duplicate",
        overview: "",
        first_air_date: NOW,
        genres: [],
        poster_url: null,
        created_at: NOW,
        updated_at: NOW,
        watched_at: null,
      })
    ).rejects.toMatchObject({ code: "P2002" });
    const bobSeries = await addSeriesToList(bob.id, {
      tmdb_id: 1396,
      name: "Breaking Bad",
      overview: "Chemistry.",
      first_air_date: new Date("2008-01-20"),
      genres: ["Drama"],
      poster_url: null,
      created_at: NOW,
      updated_at: NOW,
      watched_at: null,
    });
    await expect(markSeriesAsWatched(alice.id, { id: data.unwatchedSeries.id }, NOW, true)).resolves.toMatchObject({
      name: "Dark",
      watched_at: NOW,
    });
    await expect(updateSeriesScore(alice.id, data.unwatchedSeries.id, 4)).resolves.toMatchObject({ score: 4 });
    await expect(updateSeriesScore(bob.id, data.unwatchedSeries.id, 1)).rejects.toThrow("Series not found");
    await expect(removeSeriesFromList(bob.id, data.unwatchedSeries.id)).rejects.toThrow("Series not found");
    await expect(removeSeriesFromList(alice.id, data.unwatchedSeries.id)).resolves.toMatchObject({ name: "Dark" });
    expect(await getSeriesByTmdbId(bob.id, 1396)).toMatchObject({ id: bobSeries.id });
  });

  it("returns exact watch, recently-added, combined-feed, and movie-only statistics", async () => {
    await seed();
    const watched = await getLatestWatchedMovies(alice.id);
    expect(watched.map(({ title }) => title)).toEqual(["Arrival", "Arrival", "Mad Max"]);
    expect(watched.map(({ watch_count }) => watch_count)).toEqual([2, 2, 1]);
    expect(watched.every(({ watch_event_id }) => Number.isInteger(watch_event_id))).toBe(true);
    expect((await getLatestWatchedMovies(alice.id, 1, 1)).map(({ title }) => title)).toEqual(["Arrival"]);
    expect((await getRecentlyAddedMovies(alice.id)).map(({ title }) => title)).toEqual(["Inception"]);

    const latestFeed = await getLatestWatchedProfileFeed(alice.id);
    expect(latestFeed.movies.map(({ title }) => title)).toEqual(["Arrival", "Arrival", "Mad Max"]);
    expect(latestFeed.series.map(({ name }) => name)).toEqual(["Breaking Bad"]);
    const addedFeed = await getRecentlyAddedProfileFeed(alice.id);
    expect(addedFeed.movies.map(({ title }) => title)).toEqual(["Inception", "Mad Max", "Arrival"]);
    expect(addedFeed.series.map(({ name }) => name)).toEqual(["Dark", "Breaking Bad"]);

    const stats = await getProfileStats(alice.id, NOW);
    expect(stats).toMatchObject({
      totalWatches: 3,
      watchesThisYear: 3,
      watchesThisMonth: 3,
      knownWatchMinutes: 352,
      activeStreakDays: 3,
      topGenres: [
        { genre: "Sci-Fi", count: 3 },
        { genre: "Drama", count: 2 },
        { genre: "Action", count: 1 },
      ],
      rewatches: [{ title: "Arrival", count: 2 }],
      ratings: [{ score: 5, count: 1 }, { score: 4, count: 1 }],
    });
    expect(stats.monthlyActivity).toHaveLength(12);
    expect(stats.monthlyActivity.at(-1)).toEqual({ key: "2026-09", label: "Sep", count: 3, isCurrent: true });
    expect(stats.activityDays).toHaveLength(365);
    expect(stats.activityDays.slice(-3)).toEqual([
      { date: "2026-09-07", count: 1 },
      { date: "2026-09-08", count: 1 },
      { date: "2026-09-09", count: 1 },
    ]);
  });
});
