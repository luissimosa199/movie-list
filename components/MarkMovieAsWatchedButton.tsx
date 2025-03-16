"use client";

import { Movie } from "@/types";
import { useState } from "react";
import { markMovieAsWatched } from "@/lib/actions";
import { formatCardDate } from "@/utils";

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

  const handleClick = async () => {
    const now = new Date();
    try {
      setIsWatched(now.toISOString());
      setIsInDb(true);
      await markMovieAsWatched(movie.id, now, isMovieInDb);
    } catch (error) {
      setIsWatched(null);
      setIsInDb(false);
      console.error("Error marking movie as watched:", error);
    }
  };

  return (
    <button
      disabled={!!isWatched}
      onClick={handleClick}
      className="bg-primary hover:bg-primary/90 text-white text-sm py-2 px-4 rounded-md transition-all flex-1 cursor-pointer hover:scale-105 hover:shadow-sm hover:shadow-zinc-800"
    >
      {isWatched
        ? `Watched on ${formatCardDate(isWatched)}`
        : "Mark as Watched"}
    </button>
  );
}
