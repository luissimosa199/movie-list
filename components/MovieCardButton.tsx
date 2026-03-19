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
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 disabled:border-zinc-800 text-white disabled:text-zinc-500 text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          {pendingText}
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default MovieCardButton;
