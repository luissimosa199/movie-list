"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { TMDBMovie, UnifiedSearchResult } from "@/types";
import CatalogSearch from "@/components/search/CatalogSearch";
import { animateMovieEntrance, animateMovieRemoval } from "@/utils/rouletteAnimations";

interface MovieSelectorProps {
  selectedMovies: TMDBMovie[];
  onMoviesChange: (movies: TMDBMovie[]) => void;
  maxMovies?: number;
  disabled?: boolean;
  className?: string;
}

const movieFromSearchResult = (result: UnifiedSearchResult): TMDBMovie => ({
  adult: false,
  backdrop_path: "",
  genre_ids: [],
  id: result.id,
  original_language: "en",
  original_title: result.title,
  overview: result.overview ?? "",
  popularity: 0,
  poster_path: result.posterPath ?? "",
  release_date: result.year ? `${result.year}-01-01` : "",
  title: result.title,
  video: false,
  vote_average: result.voteAverage ?? 0,
  vote_count: result.voteCount ?? 0,
});

const MovieSelector: React.FC<MovieSelectorProps> = ({
  selectedMovies,
  onMoviesChange,
  maxMovies = 12,
  disabled = false,
  className = "",
}) => {
  const handleAddMovie = (result: UnifiedSearchResult) => {
    const movie = movieFromSearchResult(result);

    if (selectedMovies.length >= maxMovies) {
      return;
    }

    if (selectedMovies.some((selected) => selected.id === movie.id)) {
      return;
    }

    const newMovies = [...selectedMovies, movie];
    onMoviesChange(newMovies);
  };

  const handleRemoveMovie = (movieId: number) => {
    const movieElement = document.querySelector(
      `[data-movie-id="${movieId}"]`
    ) as HTMLElement;

    if (movieElement) {
      animateMovieRemoval(movieElement, () => {
        const newMovies = selectedMovies.filter(
          (movie) => movie.id !== movieId
        );
        onMoviesChange(newMovies);
      });
    } else {
      const newMovies = selectedMovies.filter((movie) => movie.id !== movieId);
      onMoviesChange(newMovies);
    }
  };

  const handleClearAll = () => {
    onMoviesChange([]);
  };

  const getPosterUrl = (movie: TMDBMovie) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : null;
  };

  const getReleaseYear = (movie: TMDBMovie) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null;
  };

  useEffect(() => {
    const lastMovie = selectedMovies[selectedMovies.length - 1];
    if (lastMovie) {
      const movieElement = document.querySelector(
        `[data-movie-id="${lastMovie.id}"]`
      ) as HTMLElement;
      if (movieElement) {
        animateMovieEntrance(movieElement, 100);
      }
    }
  }, [selectedMovies.length, selectedMovies]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="mb-3 text-lg font-semibold text-purple-200">
          Add titles
        </h3>

        <CatalogSearch
          className="relative"
          placeholder={
            selectedMovies.length >= maxMovies
              ? `Maximum ${maxMovies} movies reached`
              : "Search titles"
          }
          limit={8}
          allowedKinds={["movie"]}
          disabled={disabled || selectedMovies.length >= maxMovies}
          hideFooter
          onSelect={handleAddMovie}
          compact
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-200">
            Selected movies ({selectedMovies.length}/{maxMovies})
          </h3>

          {selectedMovies.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={disabled}
              className="text-sm text-zinc-400 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedMovies.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
            <div className="mb-3 text-4xl">??</div>
            <p className="mb-2 text-zinc-400">No titles yet</p>
            <p className="text-sm text-zinc-500">Add at least 2 to spin.</p>
          </div>
        ) : (
          <div className="max-h-60 space-y-3 overflow-y-auto">
            {selectedMovies.map((movie, index) => (
              <div
                key={movie.id}
                data-movie-id={movie.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 transition-colors hover:bg-zinc-800"
              >
                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
                  {getPosterUrl(movie) ? (
                    <Image
                      src={getPosterUrl(movie)!}
                      alt={`${movie.title} poster`}
                      width={40}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-purple-600 to-pink-600 text-white text-xs">
                      ??
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-white">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {getReleaseYear(movie) || "Unknown Year"}
                  </p>
                </div>

                <div className="mr-2 text-xs text-zinc-500">#{index + 1}</div>

                <button
                  onClick={() => handleRemoveMovie(movie.id)}
                  disabled={disabled}
                  className="rounded p-1 text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Remove movie"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedMovies.length > 0 && (
          <div className="mt-3 rounded-lg border border-purple-800/50 bg-purple-900/20 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300">
                {selectedMovies.length < 2
                  ? `Add ${2 - selectedMovies.length} more movie${
                      2 - selectedMovies.length > 1 ? "s" : ""
                    } to spin`
                  : selectedMovies.length >= 2 &&
                      selectedMovies.length < maxMovies
                    ? `Ready to spin! (Can add ${
                        maxMovies - selectedMovies.length
                      } more)`
                    : "Wheel ready"}
              </span>

              {selectedMovies.length >= 2 && (
                <span className="flex items-center gap-1 text-green-400">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ready
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSelector;

