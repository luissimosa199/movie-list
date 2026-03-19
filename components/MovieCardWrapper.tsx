import React from "react";
import { Movie, TMDBMovie } from "@/types";
import { movieExistsInDb } from "@/api/db";
import { getMovieWatchedStatus } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth-session";
import MovieCard from "./MovieCard";

type MovieCardWrapperProps = {
  movie: Movie | TMDBMovie;
  source: "db" | "tmdb";
};

const MovieCardWrapper = async ({ movie, source }: MovieCardWrapperProps) => {
  const user = await getCurrentUser();
  const isMovieInDb =
    source === "db" ? movie.id : user ? await movieExistsInDb(user.id, movie.id) : false;

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
