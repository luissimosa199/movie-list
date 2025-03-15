"use client";

import { addMovie, removeMovie } from "@/lib/actions";
import { TMDBMovie } from "@/types";

const MovieCardButton = ({
  movie,
  isMovieInDb,
}: {
  movie: TMDBMovie;
  isMovieInDb: boolean;
}) => {
  return (
    <button
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 text-white text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer"
      onClick={() => {
        if (isMovieInDb) {
          removeMovie(movie.id);
        } else {
          addMovie(movie as TMDBMovie);
        }
      }}
    >
      {isMovieInDb ? "Remove from List" : "Add to List"}
    </button>
  );
};

export default MovieCardButton;
