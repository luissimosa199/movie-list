"use client";

import { addMovie, removeMovie } from "@/lib/actions";
import { TMDBMovie } from "@/types";

const MovieCardButton = ({
  movie,
  isMovieInDb,
  setIsInDb,
}: {
  movie: TMDBMovie;
  isMovieInDb: number | boolean;
  setIsInDb: (isInDb: boolean) => void;
}) => {
  return (
    <button
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 text-white text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer"
      onClick={() => {
        if (isMovieInDb) {
          setIsInDb(false);
          try {
            removeMovie(isMovieInDb as number);
          } catch (error) {
            setIsInDb(true);
            console.error("Error removing movie:", error);
          }
        } else {
          setIsInDb(true);
          try {
            addMovie(movie as TMDBMovie);
          } catch (error) {
            setIsInDb(false);
            console.error("Error adding movie:", error);
          }
        }
      }}
    >
      {isMovieInDb ? "Remove from List" : "Add to List"}
    </button>
  );
};

export default MovieCardButton;
