"use client";

import { Movie } from "@/types";
import { useState } from "react";
import { markMovieAsWatched } from "@/lib/actions";
import { formatCardDate } from "@/utils";
import StarRating from "./StarRating";

export default function MarkMovieAsWatchedButton({
  movie,
  isMovieInDb,
  setIsInDb,
}: {
  movie: Movie;
  isMovieInDb: boolean;
  setIsInDb: (isInDb: boolean) => void;
}) {
  const [isWatched, setIsWatched] = useState<string | null>(() => {
    if (!movie.watched_at) return null;
    return movie.watched_at instanceof Date
      ? movie.watched_at.toISOString()
      : movie.watched_at;
  });
  const [showRating, setShowRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const now = new Date();
    setIsLoading(true);

    try {
      setIsWatched(now.toISOString());
      setIsInDb(true);

      const result = await markMovieAsWatched(movie.id, now, isMovieInDb);

      if (result.shouldShowRating) {
        setShowRating(true);
      }
    } catch (error) {
      setIsWatched(null);
      setIsInDb(false);
      console.error("Error marking movie as watched:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRating && isWatched) {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-primary/20 text-white text-sm py-2 px-4 rounded-md text-center">
          Watched on {formatCardDate(isWatched)}
        </div>
        <StarRating
          movieId={movie.id}
          initialScore={movie.score || 0}
        />
      </div>
    );
  }

  return (
    <button
      disabled={!!isWatched || isLoading}
      onClick={handleClick}
      className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 text-white text-sm py-2 px-4 rounded-md transition-all flex-1 cursor-pointer hover:scale-105 hover:shadow-sm hover:shadow-zinc-800 disabled:cursor-not-allowed disabled:scale-100"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Marking as watched...
        </div>
      ) : isWatched ? (
        `Watched on ${formatCardDate(isWatched)}`
      ) : (
        "Mark as Watched"
      )}
    </button>
  );
}
