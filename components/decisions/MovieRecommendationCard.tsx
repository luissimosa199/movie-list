"use client";

import React, { useState } from "react";
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

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-200 mb-2">
            Finding Your Movie...
          </h3>
          <p className="text-zinc-400 text-sm">
            Searching through thousands of movies to find the perfect match
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-red-800 p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">😞</div>
          <h3 className="text-lg font-semibold text-red-200 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-zinc-400 text-sm mb-4">{error}</p>
          <button
            onClick={onGetAnother}
            disabled={disabled}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-blue-200 mb-2">
            Ready to Discover?
          </h3>
          <p className="text-zinc-400 mb-4">
            Set your preferences and get a personalized movie recommendation
          </p>
          <div className="text-sm text-zinc-500">
            Use the filters above to customize your recommendation
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
          text: `I found this great movie recommendation: ${
            movie.title
          } (${new Date(releaseDate).getFullYear()})`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Check out this movie: ${movie.title} (${new Date(
        releaseDate
      ).getFullYear()}) - ${movie.overview}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      {/* Movie Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Poster */}
        <div className="mx-auto md:mx-0">
          <div className="aspect-[2/3] w-48 bg-zinc-800 rounded-lg overflow-hidden relative">
            <Link href={`/movies/${movie.id}?tmdb=true`}>
              {posterUrl && !imageError ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
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
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-center text-sm">
                  <div>
                    <div className="text-2xl mb-2">🎬</div>
                    No Poster Available
                  </div>
                </div>
              )}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <Link href={`/movies/${movie.id}?tmdb=true`}>
              <h2 className="text-2xl font-bold text-white hover:text-blue-200 transition-colors">
                {movie.title}
              </h2>
            </Link>
            <p className="text-zinc-400 text-sm">
              Released: {getFormattedDate(releaseDate, "tmdb")}
            </p>
          </div>

          {movie.overview && (
            <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {genres && genres.length > 0 && (
              <div>
                <span className="text-zinc-500">Genres:</span>
                <p className="text-zinc-300">{genres.join(", ")}</p>
              </div>
            )}

            <div>
              <span className="text-zinc-500">Rating:</span>
              <p className="text-zinc-300">
                ⭐ {movie.vote_average.toFixed(1)}/10
                <span className="text-zinc-500 ml-1">
                  ({movie.vote_count} votes)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={onGetAnother}
            disabled={disabled}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>🎲</span>
            Get Another
          </button>

          {onAddToWatchlist && (
            <button
              onClick={() => onAddToWatchlist(movie)}
              disabled={disabled}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>➕</span>
              Add to Watchlist
            </button>
          )}

          <Link
            href={`/movies/${movie.id}?tmdb=true`}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>ℹ️</span>
            View Details
          </Link>

          <button
            onClick={handleShare}
            disabled={disabled}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>📤</span>
            Share
          </button>
        </div>
      </div>

      {/* Movie Stats */}
      <div className="border-t border-zinc-800 px-4 py-3 bg-zinc-800/50">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Movie ID: {movie.id}</span>
          <span>Language: {movie.original_language.toUpperCase()}</span>
          <span className="flex items-center gap-1">
            Popularity:
            <span className="text-blue-400">
              {Math.round(movie.popularity)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieRecommendationCard;
