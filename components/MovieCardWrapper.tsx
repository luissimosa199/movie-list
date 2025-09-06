import React from "react";
import { Movie, TMDBMovie } from "@/types";
import { movieExistsInDb } from "@/api/db";
import { getMovieWatchedStatus } from "@/lib/actions";
import MovieCard from "./MovieCard";

type MovieCardWrapperProps = {
  movie: Movie | TMDBMovie;
  source: "db" | "tmdb";
};

const MovieCardWrapper = async ({ movie, source }: MovieCardWrapperProps) => {
  const isMovieInDb =
    source === "db" ? movie.id : await movieExistsInDb(movie.id);

  // For TMDB movies, check if they have been watched by the user
  const watchedMovie =
    source === "tmdb" ? await getMovieWatchedStatus(movie.id) : null;

  return (
    <MovieCard
      movie={movie}
      source={source}
      isMovieInDb={isMovieInDb}
      watchedMovie={watchedMovie}
    />
  );
};

export default MovieCardWrapper;
