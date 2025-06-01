"use client";

import { addMovie, removeMovie } from "@/lib/actions";
import { TMDBMovie } from "@/types";
import { useTransition } from "react";

const MovieCardButton = ({
  movie,
  movieDbId,
  setMovieDbId,
}: {
  movie: TMDBMovie;
  movieDbId: number | false;
  setMovieDbId: (movieDbId: number | false) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (movieDbId) {
      // Movie is in database, remove it
      const dbId = typeof movieDbId === "number" ? movieDbId : null;

      if (!dbId) {
        console.error("Invalid movie ID for removal");
        return;
      }

      // Optimistic update
      setMovieDbId(false);

      startTransition(async () => {
        try {
          await removeMovie(dbId);
        } catch (error) {
          // Revert on error
          setMovieDbId(dbId);
          console.error("Error removing movie:", error);
        }
      });
    } else {
      // Movie is not in database, add it
      startTransition(async () => {
        try {
          const addedMovie = await addMovie(movie);
          setMovieDbId(addedMovie.id);
        } catch (error) {
          console.error("Error adding movie:", error);
        }
      });
    }
  };

  const isInList = !!movieDbId;
  const buttonText = isInList ? "Remove from List" : "Add to List";

  return (
    <button
      disabled={isPending}
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 disabled:border-zinc-800 text-white disabled:text-zinc-500 text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          {isInList ? "Adding..." : "Removing..."}
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default MovieCardButton;
