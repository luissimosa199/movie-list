"use client";

import { Movie } from "@/types";
import { getFormattedDate } from "@/utils";
import { useState } from "react";
import { markMovieAsWatched } from "@/lib/actions";

export default function MarkMovieAsWatchedButton({ movie }: { movie: Movie }) {
  //   console.log("movie.watched_at", movie);
  const [isWatched, setIsWatched] = useState<string | null>(
    typeof movie.watched_at === "string" ? movie.watched_at : null
  );

  const handleClick = async () => {
    const now = new Date();
    try {
      await markMovieAsWatched(movie.id, now);
      setIsWatched(now.toISOString());
    } catch (error) {
      setIsWatched(null);
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
        ? `Watched on ${getFormattedDate(isWatched, "db")}`
        : "Mark as Watched"}
    </button>
  );
}
