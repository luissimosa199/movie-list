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
    <div className="grid gap-2">
      <MarkMovieAsWatchedButton
        movie={movie}
        isMovieInDb={!!movieDbId}
        setIsInDb={(inDb: boolean) => {
          if (!inDb) {
            setMovieDbId(false);
          }
          // Note: We can't set the ID from a boolean, this will be handled by the server action
        }}
        watchedMovie={watchedMovie}
        onAddedToDb={(id: number) => setMovieDbId(id)}
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
