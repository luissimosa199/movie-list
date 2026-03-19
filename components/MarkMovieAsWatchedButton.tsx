"use client";

import { Movie, TMDBMovie } from "@/types";
import { useState } from "react";
import { markMovieAsWatched } from "@/lib/actions";
import { formatCardDate } from "@/utils";
import StarRating from "./StarRating";

export default function MarkMovieAsWatchedButton({
  movie,
  isMovieInDb,
  setIsInDb,
  watchedMovie,
  onAddedToDb,
}: {
  movie: Movie | TMDBMovie;
  isMovieInDb: boolean;
  setIsInDb: (isInDb: boolean) => void;
  watchedMovie?: Movie | null;
  onAddedToDb?: (id: number) => void;
}) {
  const dbMovieId =
    watchedMovie?.id ?? ("tmdb_id" in movie ? movie.id : null);
  const tmdbMovieId = "tmdb_id" in movie ? movie.tmdb_id : movie.id;
  const initialWatchedAt =
    ("watched_at" in movie ? movie.watched_at : null) ||
    watchedMovie?.watched_at;

  const [isWatched, setIsWatched] = useState<string | null>(() => {
    if (!initialWatchedAt) return null;
    return initialWatchedAt instanceof Date
      ? initialWatchedAt.toISOString()
      : initialWatchedAt;
  });
  const [showRating, setShowRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedDbMovieId, setResolvedDbMovieId] = useState<number | null>(
    dbMovieId
  );

  const handleClick = async () => {
    const now = new Date();
    setIsLoading(true);

    try {
      setIsWatched(now.toISOString());
      setIsInDb(true);

      const result = await markMovieAsWatched(
        {
          dbMovieId,
          tmdbMovieId,
        },
        now,
        isMovieInDb
      );

      if (result.shouldShowRating) {
        setResolvedDbMovieId(result.movie.id);
        setShowRating(true);
      }

      if (typeof onAddedToDb === "function") {
        onAddedToDb(result.movie.id);
      }
    } catch (error) {
      setIsWatched(null);
      setIsInDb(false);
      console.error("Error marking movie as watched:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRating && isWatched && resolvedDbMovieId) {
    return (
      <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="rounded-lg bg-primary/20 px-4 py-2 text-center text-sm text-white">
          Watched on {formatCardDate(isWatched)}
        </div>
        <StarRating
          movieId={resolvedDbMovieId}
          initialScore={("score" in movie ? movie.score : 0) || watchedMovie?.score || 0}
        />
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium leading-tight text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Marking as watched...
        </div>
      ) : isWatched ? (
        <span className="flex flex-col items-center gap-0.5 text-center">
          <span>Rewatch</span>
          <span className="text-[0.72rem] font-normal text-white/75">
            Last watched {formatCardDate(isWatched)}
          </span>
        </span>
      ) : (
        "Mark as Watched"
      )}
    </button>
  );
}
