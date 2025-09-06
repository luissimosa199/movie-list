"use client";

import React from "react";
import { Movie, TMDBMovie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getFormattedDate, getGenres } from "@/utils";
import { getPosterUrl } from "@/utils";
import MovieCardButtonsSection from "./MovieCardButtonsSection";
import StarRating from "./StarRating";
import { useViewMode } from "@/stores/viewStore";

type MovieCardProps = {
  movie: Movie | TMDBMovie;
  source: "db" | "tmdb";
  isMovieInDb: number | false;
  watchedMovie: Movie | null;
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  source,
  isMovieInDb,
  watchedMovie,
}) => {
  const viewMode = useViewMode();
  const isCompact = viewMode === "compact";

  const isWatched =
    source === "db"
      ? !!(movie as Movie).watched_at
      : !!watchedMovie?.watched_at;

  const posterUrl = getPosterUrl(movie, source);
  const genres = getGenres(movie, source);
  const releaseDate =
    source === "db"
      ? (movie as Movie).release_date
      : (movie as TMDBMovie).release_date;

  const cardClasses = isCompact
    ? "bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform hover:scale-[1.02] hover:shadow-lg relative flex flex-row gap-4 p-4 h-48 min-[270px]:h-64 min-[420px]:h-64"
    : "bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform hover:scale-[1.02] hover:shadow-lg relative min-h-[500px]";

  return (
    <div
      key={movie.id}
      className={cardClasses}
    >
      {/* Watched indicator overlay */}
      {isWatched && (
        <div className="absolute top-2 right-2 z-10 bg-primary rounded-full p-1">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <div
        className={
          isCompact
            ? "w-28 h-40 min-[270px]:h-44 min-[420px]:h-48 bg-zinc-800 relative rounded flex-shrink-0"
            : "aspect-[2/3] bg-zinc-800 relative"
        }
      >
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
              sizes={
                isCompact
                  ? "112px"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              className={isCompact ? "object-cover rounded" : "object-cover"}
              priority={false}
            />
          ) : (
            <div
              className={`w-full h-full bg-zinc-800 text-center flex items-center justify-center text-zinc-500 ${
                isCompact ? "rounded text-xs" : ""
              }`}
            >
              {isCompact ? "No Poster" : "No Poster Available"}
            </div>
          )}
        </Link>
      </div>

      <div
        className={
          isCompact
            ? "flex-1 flex flex-col justify-between py-3 px-1 min-[270px]:py-4 min-[420px]:py-5"
            : "p-6 flex flex-col justify-between h-full"
        }
      >
        <div>
          <h2
            className={
              isCompact
                ? "text-sm font-semibold mb-1 line-clamp-1"
                : "text-lg font-semibold mb-3 line-clamp-1"
            }
          >
            <Link
              href={`/movies/${isMovieInDb || movie.id}${
                !isMovieInDb ? "?tmdb=true" : ""
              }`}
              className="hover:text-primary transition-colors"
            >
              {movie.title}
            </Link>
          </h2>
          <p
            className={
              isCompact
                ? "text-xs text-zinc-400 mb-2"
                : "text-sm text-zinc-400 mb-3"
            }
          >
            Released: {getFormattedDate(releaseDate, source)}
          </p>

          {!isCompact && (
            <>
              {source === "tmdb" ? (
                <p className="text-sm text-zinc-300 mb-4 line-clamp-3">
                  {(movie as TMDBMovie).overview}
                </p>
              ) : (
                (movie as Movie).overview && (
                  <p className="text-sm text-zinc-300 mb-4 line-clamp-3">
                    {(movie as Movie).overview}
                  </p>
                )
              )}

              {genres && (
                <p className="text-sm text-zinc-400 mb-2 h-8">
                  <span className="text-zinc-500">Genres:</span>{" "}
                  {genres.join(", ")}
                </p>
              )}

              {source === "db" && (movie as Movie).runtime && (
                <p className="text-sm text-zinc-400 mb-2">
                  <span className="text-zinc-500">Runtime:</span>{" "}
                  {(movie as Movie).runtime} minutes
                </p>
              )}
            </>
          )}

          {/* Show score for watched movies regardless of source */}
          {((source === "db" && (movie as Movie).score) ||
            (source === "tmdb" && watchedMovie?.score)) && (
            <p
              className={
                isCompact
                  ? "text-xs text-zinc-400 mb-2"
                  : "text-sm text-zinc-400 mb-3"
              }
            >
              <span className="text-zinc-500">Your Score:</span>{" "}
              {source === "db" ? (movie as Movie).score : watchedMovie?.score}
            </p>
          )}

          {source === "tmdb" && !watchedMovie?.score && (
            <p
              className={
                isCompact
                  ? "text-xs text-zinc-400 mb-2"
                  : "text-sm text-zinc-400 mb-3"
              }
            >
              <span className="text-zinc-500">Rating:</span>{" "}
              {(movie as TMDBMovie).vote_average.toFixed(1)} (
              {(movie as TMDBMovie).vote_count} votes)
            </p>
          )}
        </div>

        <div className={isCompact ? "mt-auto pt-2" : "mt-auto pt-4"}>
          <MovieCardButtonsSection
            movie={movie}
            isMovieInDb={isMovieInDb}
            {...(source === "tmdb" && { watchedMovie })}
          />

          {/* Show star rating for watched movies regardless of source */}
          {((source === "db" && (movie as Movie).watched_at) ||
            (source === "tmdb" && watchedMovie?.watched_at)) && (
            <div className={isCompact ? "mt-2" : "mt-3"}>
              <StarRating
                movieId={source === "db" ? movie.id : watchedMovie!.id}
                initialScore={
                  source === "db"
                    ? (movie as Movie).score || 0
                    : watchedMovie?.score || 0
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MovieCard);
