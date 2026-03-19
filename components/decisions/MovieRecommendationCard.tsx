"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import { getPosterUrl, getFormattedDate, getGenres } from "@/utils";

interface MovieRecommendationCardProps {
  movie: TMDBMovie | null;
  loading: boolean;
  error?: string | null;
  onGetAnother: () => void;
  onAddToWatchlist?: (movie: TMDBMovie) => void;
  disabled?: boolean;
}

const MovieRecommendationCard: React.FC<MovieRecommendationCardProps> = ({
  movie,
  loading,
  error,
  onGetAnother,
  onAddToWatchlist,
  disabled = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [movie?.id]);

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
          <h3 className="mb-2 text-lg font-semibold text-blue-200">
            Finding your movie
          </h3>
          <p className="text-sm text-zinc-400">
            Searching through thousands of movies to find the right match.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 p-6">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-red-200">
            Something went wrong
          </h3>
          <p className="mb-4 text-sm text-zinc-300">{error}</p>
          <button
            onClick={onGetAnother}
            disabled={disabled}
            className="rounded-2xl border border-red-500/20 bg-red-500/15 px-4 py-2 text-sm font-medium text-red-100 transition-colors hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-8">
        <div className="text-center">
          <h3 className="mb-2 text-xl font-semibold text-blue-200">
            Ready to discover?
          </h3>
          <p className="mb-4 text-zinc-400">
            Set your preferences and get a personalized movie recommendation.
          </p>
          <div className="text-sm text-zinc-500">
            Use the filters above to shape the result.
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = getPosterUrl(movie, "tmdb");
  const genres = getGenres(movie, "tmdb");
  const releaseDate = movie.release_date;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this movie: ${movie.title}`,
          text: `I found this great movie recommendation: ${movie.title} (${new Date(
            releaseDate
          ).getFullYear()})`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
      return;
    }

    const text = `Check out this movie: ${movie.title} (${new Date(
      releaseDate
    ).getFullYear()}) - ${movie.overview}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <div className="grid gap-6 p-5 md:grid-cols-[14rem_minmax(0,1fr)] md:p-6">
        <div className="mx-auto w-full max-w-[14rem] md:mx-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
            <Link href={`/movies/${movie.id}?tmdb=true`}>
              {posterUrl && !imageError ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 224px"
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoadingComplete={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-zinc-500">
                  No poster available
                </div>
              )}
              {imageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500" />
                </div>
              ) : null}
            </Link>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <Link href={`/movies/${movie.id}?tmdb=true`}>
              <h2 className="text-2xl font-semibold tracking-tight text-white transition-colors hover:text-blue-200">
                {movie.title}
              </h2>
            </Link>
            <p className="text-sm text-zinc-400">
              Released: {getFormattedDate(releaseDate, "tmdb")}
            </p>
          </div>

          {movie.overview ? (
            <p className="max-w-3xl text-sm leading-7 text-zinc-300">
              {movie.overview}
            </p>
          ) : null}

          <div className="grid gap-2 text-sm sm:grid-cols-3">
            {genres && genres.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Genres
                </div>
                <p className="mt-1 text-zinc-200">{genres.join(", ")}</p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Rating
              </div>
              <p className="mt-1 text-zinc-200">
                {movie.vote_average.toFixed(1)}/10
                <span className="ml-1 text-zinc-500">
                  ({movie.vote_count} votes)
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 px-3 py-3">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Language
              </div>
              <p className="mt-1 text-zinc-200">
                {movie.original_language.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 p-4 md:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            onClick={onGetAnother}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Get another
          </button>

          {onAddToWatchlist ? (
            <button
              onClick={() => onAddToWatchlist(movie)}
              disabled={disabled}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to watchlist
            </button>
          ) : null}

          <Link
            href={`/movies/${movie.id}?tmdb=true`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View details
          </Link>

          <button
            onClick={handleShare}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieRecommendationCard;
