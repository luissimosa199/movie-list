"use client";

import { TMDBMovie } from "@/types";
import { Movie } from "@/types";
import MarkMovieAsWatchedButton from "./MarkMovieAsWatchedButton";
import MovieCardButton from "./MovieCardButton";
import { useState } from "react";

const MovieCardButtonsSection = ({
  movie,
  isMovieInDb,
  watchedMovie,
}: {
  movie: Movie | TMDBMovie;
  isMovieInDb: number | false;
  watchedMovie?: Movie | null;
}) => {
  const [movieDbId, setMovieDbId] = useState<number | false>(isMovieInDb);

  return (
    <div className="flex gap-4 mt-4">
      <MarkMovieAsWatchedButton
        movie={movie as Movie}
        isMovieInDb={!!movieDbId}
        setIsInDb={(inDb: boolean) => {
          if (!inDb) {
            setMovieDbId(false);
          }
          // Note: We can't set the ID from a boolean, this will be handled by the server action
        }}
        watchedMovie={watchedMovie}
      />
      <MovieCardButton
        movie={movie as TMDBMovie}
        movieDbId={movieDbId}
        setMovieDbId={setMovieDbId}
      />
    </div>
  );
};

export default MovieCardButtonsSection;
