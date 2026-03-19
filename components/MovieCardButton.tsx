"use client";

import { addMovie, removeMovie } from "@/lib/actions";
import { TMDBMovie } from "@/types";
import { useState } from "react";

const MovieCardButton = ({
  movie,
  movieDbId,
  setMovieDbId,
}: {
  movie: TMDBMovie;
  movieDbId: number | false;
  setMovieDbId: (movieDbId: number | false) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );
  const isInList = !!movieDbId;

  const handleClick = async () => {
    if (movieDbId) {
      const dbId = typeof movieDbId === "number" ? movieDbId : null;

      if (!dbId) {
        console.error("Invalid movie ID for removal");
        return;
      }

      setIsLoading(true);
      setMovieDbId(false);
      setPendingAction("remove");

      try {
        await removeMovie(dbId);
      } catch (error) {
        setMovieDbId(dbId);
        console.error("Error removing movie:", error);
      } finally {
        setPendingAction(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setPendingAction("add");

      try {
        const addedMovie = await addMovie(movie);
        setMovieDbId(addedMovie.id);
      } catch (error) {
        console.error("Error adding movie:", error);
      } finally {
        setPendingAction(null);
        setIsLoading(false);
      }
    }
  };

  const buttonText = isInList ? "Remove from List" : "Add to List";
  const pendingText =
    pendingAction === "remove" ? "Removing..." : "Adding...";

  return (
    <button
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium leading-tight text-white transition-colors hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:border-white/6 disabled:text-zinc-500"
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
          {pendingText}
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default MovieCardButton;
