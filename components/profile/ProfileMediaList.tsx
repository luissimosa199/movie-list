"use client";

import { useMemo, useState } from "react";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";
import { Movie, Series, WatchedMovie } from "@/types";

type FeedKind = "latest" | "recent";
type SortOption =
  | "activity-desc"
  | "release-desc"
  | "release-asc"
  | "score-desc"
  | "score-asc";

type MediaItem =
  | { kind: "movie"; item: Movie | WatchedMovie; index: number }
  | { kind: "series"; item: Series; index: number };

type ProfileMediaListProps = {
  kind: FeedKind;
  movies: Array<Movie | WatchedMovie>;
  series: Series[];
};

const NO_GENRE = "__no_genre__";

function timestamp(value: Date | null | undefined) {
  if (!value) return null;

  const valueInMilliseconds = new Date(value).getTime();
  return Number.isNaN(valueInMilliseconds) ? null : valueInMilliseconds;
}

function getReleaseTimestamp(item: MediaItem) {
  return timestamp(
    item.kind === "movie" ? item.item.release_date : item.item.first_air_date
  );
}

function getActivityTimestamp(item: MediaItem, kind: FeedKind) {
  return timestamp(
    kind === "latest"
      ? item.item.watched_at
      : item.item.created_at
  );
}

function getScore(item: MediaItem) {
  return item.item.score ?? null;
}

function getGenres(item: MediaItem) {
  return (item.item.genres ?? [])
    .map((genre) => genre.trim())
    .filter(Boolean);
}

function compareNullable(
  left: number | null,
  right: number | null,
  direction: 1 | -1
) {
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return (left - right) * direction;
}

export default function ProfileMediaList({
  kind,
  movies,
  series,
}: ProfileMediaListProps) {
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<SortOption>(
    kind === "latest" ? "activity-desc" : "activity-desc"
  );

  const items = useMemo<MediaItem[]>(
    () => [
      ...movies.map((item, index) => ({
        kind: "movie" as const,
        item,
        index,
      })),
      ...series.map((item, index) => ({
        kind: "series" as const,
        item,
        index: movies.length + index,
      })),
    ],
    [movies, series]
  );

  const genres = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => getGenres(item).forEach((value) => values.add(value)));
    return Array.from(values).sort((left, right) => left.localeCompare(right));
  }, [items]);

  const filteredItems = useMemo(() => {
    const filtered = genre
      ? items.filter((item) =>
          genre === NO_GENRE
            ? getGenres(item).length === 0
            : getGenres(item).includes(genre)
        )
      : items;

    return [...filtered].sort((left, right) => {
      let comparison = 0;

      if (sort === "activity-desc") {
        comparison = compareNullable(
          getActivityTimestamp(left, kind),
          getActivityTimestamp(right, kind),
          -1
        );
      } else if (sort === "release-desc") {
        comparison = compareNullable(getReleaseTimestamp(left), getReleaseTimestamp(right), -1);
      } else if (sort === "release-asc") {
        comparison = compareNullable(getReleaseTimestamp(left), getReleaseTimestamp(right), 1);
      } else if (sort === "score-desc") {
        comparison = compareNullable(getScore(left), getScore(right), -1);
      } else {
        comparison = compareNullable(getScore(left), getScore(right), 1);
      }

      if (comparison !== 0) return comparison;
      return left.index - right.index;
    });
  }, [genre, items, kind, sort]);

  const hasMissingReleaseDate = items.some((item) => getReleaseTimestamp(item) === null);
  const hasMissingScore = items.some((item) => getScore(item) === null);
  const hasMissingGenres = items.some((item) => getGenres(item).length === 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <label className="grid gap-2 text-sm text-zinc-300">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Genre
            </span>
            <select
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-primary"
            >
              <option value="">All genres</option>
              {genres.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
              {hasMissingGenres && <option value={NO_GENRE}>No genre</option>}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-white outline-none focus:border-primary"
            >
              <option value="activity-desc">Newest first</option>
              <option value="release-desc">Release date: newest</option>
              <option value="release-asc">Release date: oldest</option>
              {kind === "latest" && (
                <>
                  <option value="score-desc">Your score: highest</option>
                  <option value="score-asc">Your score: lowest</option>
                </>
              )}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span>
            Showing {filteredItems.length} of {items.length} titles
          </span>
          {hasMissingReleaseDate && <span>Undated titles stay at the end when sorting by release date.</span>}
          {kind === "latest" && hasMissingScore && <span>Unrated titles stay at the end when sorting by score.</span>}
          {genre && <span>Titles without the selected genre are hidden.</span>}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <ClientGridWrapper>
          {filteredItems.map((entry) =>
            entry.kind === "movie" ? (
              <MovieCard
                key={`movie-${entry.item.id}-${"watch_event_id" in entry.item ? entry.item.watch_event_id : "list"}`}
                movie={entry.item}
                source="db"
                isMovieInDb={entry.item.id}
                watchedMovie={null}
              />
            ) : (
              <SeriesCard
                key={`series-${entry.item.id}`}
                series={entry.item}
                source="db"
                seriesInDb={null}
              />
            )
          )}
        </ClientGridWrapper>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center">
          <p className="text-lg text-zinc-300">No titles match these filters.</p>
          <button
            type="button"
            onClick={() => {
              setGenre("");
              setSort("activity-desc");
            }}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
