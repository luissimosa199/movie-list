import { ProfileFeedItem, TMDBMovie } from "@/types";

export const alice = {
  id: "test-user-alice",
  name: "Alice",
  email: "alice@example.test",
};

export const bob = {
  id: "test-user-bob",
  name: "Bob",
  email: "bob@example.test",
};

export function tmdbMovie(id: number, title: string): TMDBMovie {
  return {
    adult: false,
    backdrop_path: `/backdrop-${id}.jpg`,
    genre_ids: [18],
    id,
    original_language: "en",
    original_title: title,
    overview: `${title} overview`,
    popularity: id,
    poster_path: `/poster-${id}.jpg`,
    release_date: "2020-01-02",
    title,
    video: false,
    vote_average: 7.5,
    vote_count: 100 + id,
  };
}

export function profileFeedFixtures(): ProfileFeedItem[] {
  return [
    {
      mediaType: "movie",
      activityDate: new Date("2026-09-03T12:00:00Z"),
      movie: {
        id: 1,
        title: "Arrival",
        overview: null,
        release_date: new Date("2016-11-11"),
        runtime: 116,
        genres: ["Drama", "Sci-Fi"],
        poster_url: null,
        score: 5,
        tmdb_id: 329865,
        imdb_id: "tt2543164",
        created_at: new Date("2026-09-01T12:00:00Z"),
        updated_at: new Date("2026-09-03T12:00:00Z"),
        watched_at: new Date("2026-09-03T12:00:00Z"),
      },
    },
    {
      mediaType: "series",
      activityDate: new Date("2026-09-02T12:00:00Z"),
      series: {
        id: 2,
        tmdb_id: 1396,
        name: "Breaking Bad",
        created_at: new Date("2026-09-02T12:00:00Z"),
        updated_at: new Date("2026-09-02T12:00:00Z"),
        watched_at: null,
        first_air_date: new Date("2008-01-20"),
        genres: ["Drama"],
        score: 4,
      },
    },
    {
      mediaType: "movie",
      activityDate: new Date("2026-09-02T12:00:00Z"),
      movie: {
        id: 3,
        title: "Inception",
        overview: null,
        release_date: null,
        runtime: 148,
        genres: ["Sci-Fi", ""],
        poster_url: null,
        score: null,
        tmdb_id: 27205,
        imdb_id: "tt1375666",
        created_at: new Date("2026-09-02T12:00:00Z"),
        updated_at: new Date("2026-09-02T12:00:00Z"),
        watched_at: null,
      },
    },
  ];
}
