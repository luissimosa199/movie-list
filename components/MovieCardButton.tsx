"use client";

import { addMovie, removeMovie } from "@/lib/actions";
import { TMDBMovie } from "@/types";
import { useState } from "react";

const MovieCardButton = ({
  movie,
  isMovieInDb,
}: {
  movie: TMDBMovie;
  isMovieInDb: number | boolean;
}) => {
  const [isInDb, setIsInDb] = useState<boolean>(!!isMovieInDb);

  return (
    <button
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 text-white text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer"
      onClick={() => {
        if (isMovieInDb) {
          removeMovie(isMovieInDb as number);
          setIsInDb(false);
        } else {
          addMovie(movie as TMDBMovie);
          setIsInDb(true);
        }
      }}
    >
      {isInDb ? "Remove from List" : "Add to List"}
    </button>
  );
};

export default MovieCardButton;
