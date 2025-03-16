"use client";

import { TMDBMovie } from "@/types";
import { Movie } from "@/types";
import MarkMovieAsWatchedButton from "./MarkMovieAsWatchedButton";
import MovieCardButton from "./MovieCardButton";
import { useState } from "react";

const MovieCardButtonsSection = ({
  movie,
  isMovieInDb,
}: {
  movie: Movie | TMDBMovie;
  isMovieInDb: boolean;
}) => {
  const [isInDb, setIsInDb] = useState<boolean>(!!isMovieInDb);

  return (
    <div className="flex gap-4 mt-4">
      <MarkMovieAsWatchedButton
        movie={movie as Movie}
        setIsInDb={setIsInDb}
      />
      {/* TODO: Update MovieCardButton when the movie is marked as watched */}
      <MovieCardButton
        movie={movie as TMDBMovie}
        isMovieInDb={isInDb}
        setIsInDb={setIsInDb}
      />
    </div>
  );
};

export default MovieCardButtonsSection;
