"use client";

import ClientGridWrapper from "@/components/ClientGridWrapper";
import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";
import { ProfileFeedItem } from "@/types";
import {
  filterAndSortProfileFeed,
  listProfileFeedGenres,
  ProfileFeedMediaTypeFilter,
  ProfileFeedSort,
  ProfileFeedWatchedFilter,
} from "@/utils/profileFeed";
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

const ProfileFeed = ({
  items,
  feedType,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
}: ProfileFeedProps) => {
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<ProfileFeedSort>("activity");
  const [mediaType, setMediaType] = useState<ProfileFeedMediaTypeFilter>("all");
  const [watchedFilter, setWatchedFilter] = useState<ProfileFeedWatchedFilter>(
    feedType === "recently-added" ? "not-watched" : "all"
  );

  const genres = useMemo(
    () => listProfileFeedGenres(items),
    [items]
  );

  const visibleItems = useMemo(() => {
    return filterAndSortProfileFeed(items, {
      genre,
      sort,
      mediaType,
      watched: watchedFilter,
    });
  }, [genre, items, sort, mediaType, watchedFilter]);

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
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        {feedType === "recently-added" && (
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
            Watched status
            <div className="flex rounded-lg border border-white/10 bg-zinc-900 p-1">
              {(
                [
                  { value: "not-watched", label: "Not watched" },
                  { value: "watched", label: "Watched" },
                  { value: "all", label: "All" },
                ] as { value: ProfileFeedWatchedFilter; label: string }[]
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setWatchedFilter(option.value)}
                  aria-pressed={watchedFilter === option.value}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    watchedFilter === option.value
                      ? "bg-primary text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="flex flex-col gap-2 text-sm text-zinc-400">
          Type
          <select
            value={mediaType}
            onChange={(event) => setMediaType(event.target.value as ProfileFeedMediaTypeFilter)}
            className="min-w-40 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none transition-colors focus:border-primary"
          >
            <option value="all">Movies & series</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
        </label>

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
            onChange={(event) => setSort(event.target.value as ProfileFeedSort)}
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
