import React from "react";
import { Movie, TMDBMovie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getFormattedDate, getGenres } from "@/utils";
import { getPosterUrl } from "@/utils";
import { movieExistsInDb } from "@/api/db";
import MovieCardButtonsSection from "./MovieCardButtonsSection";

type MovieCardProps = {
  movie: Movie | TMDBMovie;
  source: "db" | "tmdb";
};

const MovieCard = async ({ movie, source }: MovieCardProps) => {
  const isMovieInDb =
    source === "db" ? movie.id : await movieExistsInDb(movie.id);
  const posterUrl = getPosterUrl(movie, source);
  const genres = getGenres(movie, source);
  const releaseDate =
    source === "db"
      ? (movie as Movie).release_date
      : (movie as TMDBMovie).release_date;

  return (
    <div
      key={movie.id}
      className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="aspect-[2/3] bg-zinc-800 relative">
        <Link
          href={`/movies/${isMovieInDb || movie.id}${
            !isMovieInDb ? "?tmdb=true" : ""
          }`}
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 text-center flex items-center justify-center text-zinc-500">
              No Poster Available
            </div>
          )}
        </Link>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-1">
          {movie.title}
        </h2>
        <p className="text-xs text-zinc-400 mb-3">
          Released: {getFormattedDate(releaseDate, source)}
        </p>

        {source === "tmdb" ? (
          <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
            {(movie as TMDBMovie).overview}
          </p>
        ) : (
          (movie as Movie).overview && (
            <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
              {(movie as Movie).overview}
            </p>
          )
        )}

        {genres && (
          <p className="text-xs text-zinc-400 mb-1">
            <span className="text-zinc-500">Genres:</span> {genres.join(", ")}
          </p>
        )}

        {source === "db" && (movie as Movie).runtime && (
          <p className="text-xs text-zinc-400 mb-1">
            <span className="text-zinc-500">Runtime:</span>{" "}
            {(movie as Movie).runtime} minutes
          </p>
        )}

        {source === "db" && (movie as Movie).score && (
          <p className="text-xs text-zinc-400 mb-4">
            <span className="text-zinc-500">Score:</span>{" "}
            {(movie as Movie).score}
          </p>
        )}

        {source === "tmdb" && (
          <p className="text-xs text-zinc-400 mb-4">
            <span className="text-zinc-500">Rating:</span>{" "}
            {(movie as TMDBMovie).vote_average.toFixed(1)} (
            {(movie as TMDBMovie).vote_count} votes)
          </p>
        )}

        <MovieCardButtonsSection
          movie={movie}
          isMovieInDb={!!isMovieInDb}
        />
      </div>
    </div>
  );
};

export default MovieCard;
