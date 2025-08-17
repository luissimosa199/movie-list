"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TMDBMovie } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  animateMovieEntrance,
  animateMovieRemoval,
} from "@/utils/rouletteAnimations";

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface MovieSelectorProps {
  selectedMovies: TMDBMovie[];
  onMoviesChange: (movies: TMDBMovie[]) => void;
  maxMovies?: number;
  disabled?: boolean;
  className?: string;
}

const MovieSelector: React.FC<MovieSelectorProps> = ({
  selectedMovies,
  onMoviesChange,
  maxMovies = 12,
  disabled = false,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search for movies when query changes
  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("query", debouncedQuery);
        params.set("page", "1");
        params.set("limit", "8");

        const response = await fetch(`/api/movies?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data: TMDBResponse = await response.json();
        const results = data.results.slice(0, 8);

        // Filter out movies already selected
        const filteredResults = results.filter(
          (movie) =>
            !selectedMovies.some((selected) => selected.id === movie.id)
        );

        setSearchResults(filteredResults);
        setShowResults(true);
      } catch (err) {
        console.error("Error searching movies:", err);
        setError("Failed to search movies. Please try again.");
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery, selectedMovies]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleAddMovie = (movie: TMDBMovie) => {
    if (selectedMovies.length >= maxMovies) {
      setError(`Maximum ${maxMovies} movies allowed`);
      return;
    }

    if (selectedMovies.some((selected) => selected.id === movie.id)) {
      setError("Movie already added to wheel");
      return;
    }

    const newMovies = [...selectedMovies, movie];
    onMoviesChange(newMovies);

    // Clear search
    setQuery("");
    setShowResults(false);
    setError(null);
    inputRef.current?.blur();
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
    setQuery("");
    setError(null);
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

  // Animate new movies when they're added
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
  }, [selectedMovies.length]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Section */}
      <div>
        <h3 className="text-lg font-semibold text-purple-200 mb-3">
          Add Movies to Wheel
        </h3>

        <div
          className="relative"
          ref={searchContainerRef}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={
                selectedMovies.length >= maxMovies
                  ? `Maximum ${maxMovies} movies reached`
                  : "Search for movies to add..."
              }
              disabled={disabled || selectedMovies.length >= maxMovies}
              className="w-full px-4 py-3 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-zinc-600 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleAddMovie(result)}
                  disabled={disabled}
                  className="flex items-center p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-700 last:border-b-0 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-16 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
                    {getPosterUrl(result) ? (
                      <Image
                        src={getPosterUrl(result)!}
                        alt={`${result.title} poster`}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {result.title}
                    </h4>
                    <p className="text-zinc-400 text-xs">
                      {getReleaseYear(result) || "Unknown Year"}
                    </p>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-1">
                      {result.overview}
                    </p>
                  </div>
                  <div className="ml-2 text-purple-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {showResults &&
            searchResults.length === 0 &&
            !isLoading &&
            query.trim() && (
              <div className="absolute z-50 top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 shadow-lg p-4 text-center text-zinc-400">
                No movies found for "{query}"
              </div>
            )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-red-900/20 border border-red-800/50 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Selected Movies Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-purple-200">
            Selected Movies ({selectedMovies.length}/{maxMovies})
          </h3>

          {selectedMovies.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={disabled}
              className="text-sm text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedMovies.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-zinc-400 mb-2">No movies in your wheel yet</p>
            <p className="text-zinc-500 text-sm">
              Add at least 2 movies to start spinning!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {selectedMovies.map((movie, index) => (
              <div
                key={movie.id}
                data-movie-id={movie.id}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                  {getPosterUrl(movie) ? (
                    <Image
                      src={getPosterUrl(movie)!}
                      alt={`${movie.title} poster`}
                      width={40}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs">
                      🎬
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">
                    {movie.title}
                  </h4>
                  <p className="text-zinc-400 text-xs">
                    {getReleaseYear(movie) || "Unknown Year"}
                  </p>
                </div>

                <div className="text-xs text-zinc-500 mr-2">#{index + 1}</div>

                <button
                  onClick={() => handleRemoveMovie(movie.id)}
                  disabled={disabled}
                  className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove movie"
                >
                  <svg
                    className="w-4 h-4"
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

        {/* Wheel Status */}
        {selectedMovies.length > 0 && (
          <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/50 rounded-lg">
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
                  : "Wheel is full - ready to spin!"}
              </span>

              {selectedMovies.length >= 2 && (
                <span className="text-green-400 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
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
