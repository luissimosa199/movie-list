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
  const watchedAt =
    source === "db"
      ? (movie as Movie).watched_at ?? null
      : watchedMovie?.watched_at ?? null;

  const cardClasses = isCompact
    ? "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,12,18,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_26px_70px_rgba(0,0,0,0.3)]"
    : "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,12,18,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_30px_80px_rgba(0,0,0,0.34)]";

  return (
    <article className={cardClasses}>
      <div
        className={
          isCompact
            ? "flex items-start gap-4 p-4"
            : "flex h-full flex-col"
        }
      >
        <div
          className={
            isCompact
              ? "relative aspect-[2/3] w-20 flex-shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-zinc-800 min-[420px]:w-24"
              : "relative aspect-[2/3] overflow-hidden border-b border-white/10 bg-zinc-800"
          }
        >
          <Link
            href={`/movies/${isMovieInDb || movie.id}${
              !isMovieInDb ? "?tmdb=true" : ""
            }`}
            className="block h-full w-full"
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                fill
                sizes={
                  isCompact
                    ? "(max-width: 640px) 96px"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                }
                className="object-cover"
                priority={false}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-zinc-500">
                <span className={isCompact ? "text-xs" : "text-sm"}>
                  {isCompact ? "No Poster" : "No Poster Available"}
                </span>
              </div>
            )}
          </Link>

          {!isCompact && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          )}

          {isWatched && (
            <div className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/85 backdrop-blur">
              Watched
            </div>
          )}
        </div>

        <div
          className={
            isCompact
              ? "flex min-w-0 flex-1 flex-col gap-3 py-1"
              : "flex min-h-0 flex-1 flex-col p-5"
          }
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2
                className={
                  isCompact
                    ? "min-w-0 text-base font-semibold tracking-tight text-white line-clamp-2"
                    : "min-w-0 text-xl font-semibold tracking-tight text-white line-clamp-2"
                }
              >
                <Link
                  href={`/movies/${isMovieInDb || movie.id}${
                    !isMovieInDb ? "?tmdb=true" : ""
                  }`}
                  className="transition-colors hover:text-primary"
                >
                  {movie.title}
                </Link>
              </h2>
            </div>

            <p
              className={
                isCompact
                  ? "text-xs leading-5 text-zinc-400"
                  : "text-sm leading-6 text-zinc-400"
              }
            >
              {isWatched
                ? `Last watched: ${getFormattedDate(watchedAt, "db")}`
                : `Released: ${getFormattedDate(releaseDate, source)}`}
            </p>

            {source === "db" &&
              !!(movie as Movie).watch_count &&
              (movie as Movie).watch_count! > 1 && (
                <p
                  className={
                    isCompact
                      ? "text-xs text-zinc-500"
                      : "text-sm text-zinc-500"
                  }
                >
                  {(movie as Movie).watch_count} watches logged
                </p>
              )}

            {!isCompact && (
              <>
                {source === "tmdb" ? (
                  <p className="line-clamp-3 text-sm leading-6 text-zinc-300">
                    {(movie as TMDBMovie).overview}
                  </p>
                ) : (
                  (movie as Movie).overview && (
                    <p className="line-clamp-3 text-sm leading-6 text-zinc-300">
                      {(movie as Movie).overview}
                    </p>
                  )
                )}
              </>
            )}

            {!isCompact && genres && (
              <p
                className={
                  isCompact
                    ? "text-xs leading-5 text-zinc-400"
                    : "text-sm leading-6 text-zinc-400"
                }
              >
                <span className="text-zinc-500">Genres:</span> {genres.join(", ")}
              </p>
            )}

            {!isCompact && source === "db" && (movie as Movie).runtime && (
              <p
                className={
                  isCompact
                    ? "text-xs leading-5 text-zinc-400"
                    : "text-sm leading-6 text-zinc-400"
                }
              >
                <span className="text-zinc-500">Runtime:</span>{" "}
                {(movie as Movie).runtime} minutes
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
              {((source === "db" && (movie as Movie).score) ||
                (source === "tmdb" && watchedMovie?.score)) && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="text-zinc-500">Your Score:</span>{" "}
                  {source === "db" ? (movie as Movie).score : watchedMovie?.score}
                </span>
              )}

              {source === "tmdb" && !watchedMovie?.score && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="text-zinc-500">TMDB Rating:</span>{" "}
                  {(movie as TMDBMovie).vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-4">
            <MovieCardButtonsSection
              movie={movie}
              isMovieInDb={isMovieInDb}
              {...(source === "tmdb" && { watchedMovie })}
            />

            {((source === "db" && (movie as Movie).watched_at) ||
              (source === "tmdb" && watchedMovie?.watched_at)) && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
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
    </article>
  );
};

export default React.memo(MovieCard);
