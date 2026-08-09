"use client";

import ClientGridWrapper from "@/components/ClientGridWrapper";
import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";
import { ProfileFeedItem } from "@/types";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProfileFeedProps = {
  items: ProfileFeedItem[];
  feedType: "latest-watched" | "recently-added";
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel: string;
  emptyActionHref: string;
};

type SortOption =
  | "activity"
  | "release-asc"
  | "release-desc"
  | "score-asc"
  | "score-desc";

const getGenresForItem = (item: ProfileFeedItem): string[] => {
  const genres = item.mediaType === "movie" ? item.movie.genres : item.series.genres;

  return (genres ?? []).map((genre) => genre.trim()).filter(Boolean);
};

const getReleaseTimestamp = (item: ProfileFeedItem): number | null => {
  const date = item.mediaType === "movie" ? item.movie.release_date : item.series.first_air_date;

  return date ? new Date(date).getTime() : null;
};

const getScore = (item: ProfileFeedItem): number | null =>
  item.mediaType === "movie" ? item.movie.score ?? null : item.series.score ?? null;

const ProfileFeed = ({
  items,
  feedType,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
}: ProfileFeedProps) => {
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<SortOption>("activity");

  const genres = useMemo(
    () =>
      Array.from(
        new Set(items.flatMap((item) => getGenresForItem(item)))
      ).sort((a, b) => a.localeCompare(b)),
    [items]
  );

  const visibleItems = useMemo(() => {
    const filtered = items.filter(
      (item) => genre === "all" || getGenresForItem(item).includes(genre)
    );

    return filtered
      .map((item, index) => ({ item, index }))
      .sort(({ item: left, index: leftIndex }, { item: right, index: rightIndex }) => {
        if (sort === "activity") {
          return (
            new Date(right.activityDate).getTime() -
              new Date(left.activityDate).getTime() ||
            leftIndex - rightIndex
          );
        }

        const leftValue =
          sort.startsWith("release") ? getReleaseTimestamp(left) : getScore(left);
        const rightValue =
          sort.startsWith("release") ? getReleaseTimestamp(right) : getScore(right);

        if (leftValue === null && rightValue === null) {
          return leftIndex - rightIndex;
        }
        if (leftValue === null) return 1;
        if (rightValue === null) return -1;

        const direction = sort.endsWith("desc") ? -1 : 1;
        return (leftValue - rightValue) * direction || leftIndex - rightIndex;
      })
      .map(({ item }) => item);
  }, [genre, items, sort]);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
        <p className="mb-2 text-xl text-zinc-400">{emptyTitle}</p>
        <p className="text-zinc-500">{emptyDescription}</p>
        <Link
          href={emptyActionHref}
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
        >
          {emptyActionLabel}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex flex-col gap-2 text-sm text-zinc-400">
          Genre
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="min-w-48 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none transition-colors focus:border-primary"
          >
            <option value="all">All genres</option>
            {genres.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-400">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="min-w-56 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none transition-colors focus:border-primary"
          >
            <option value="activity">
              {feedType === "latest-watched" ? "Latest watched" : "Recently added"}
            </option>
            <option value="release-asc">Release date: oldest first</option>
            <option value="release-desc">Release date: newest first</option>
            {feedType === "latest-watched" && (
              <>
                <option value="score-asc">Score: lowest first</option>
                <option value="score-desc">Score: highest first</option>
              </>
            )}
          </select>
        </label>

        <p className="text-sm text-zinc-500 sm:pb-2">
          Showing {visibleItems.length} of {items.length} titles
        </p>
      </div>

      {visibleItems.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="text-lg text-zinc-400">No titles match these filters.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Try selecting All genres or changing the sort options.
          </p>
        </div>
      ) : (
        <ClientGridWrapper>
          {visibleItems.map((item) => {
            if (item.mediaType === "movie") {
              return (
                <MovieCard
                  key={`movie-${item.movie.id}-${"watch_event_id" in item.movie ? item.movie.watch_event_id : "added"}`}
                  movie={item.movie}
                  source="db"
                  isMovieInDb={item.movie.id}
                  watchedMovie={null}
                />
              );
            }

            return (
              <SeriesCard
                key={`series-${item.series.id}`}
                series={item.series}
                source="db"
                seriesInDb={null}
              />
            );
          })}
        </ClientGridWrapper>
      )}
    </div>
  );
};

export default ProfileFeed;
