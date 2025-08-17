"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TMDBMovie, RecommendationFilters } from "@/types";
import {
  getDefaultFilters,
  getRandomRecommendation,
  getSurpriseMeRecommendation,
  buildFilterSummary,
  validateFilters,
  RecommendationHistory,
} from "@/utils/randomRecommendation";
import GenreFilter from "@/components/decisions/GenreFilter";
import YearRangeSlider from "@/components/decisions/YearRangeSlider";
import RatingFilter from "@/components/decisions/RatingFilter";
import MovieRecommendationCard from "@/components/decisions/MovieRecommendationCard";

const RandomRecommendationPage = () => {
  // State management
  const [filters, setFilters] = useState<RecommendationFilters>(
    getDefaultFilters()
  );
  const [currentMovie, setCurrentMovie] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [history, setHistory] = useState<TMDBMovie[]>([]);

  // Initialize history from localStorage
  React.useEffect(() => {
    setHistory(RecommendationHistory.load());
  }, []);

  const handleGetRecommendation = useCallback(
    async (useFilters = true) => {
      setLoading(true);
      setError(null);

      try {
        // Validate filters first
        const validation = validateFilters(filters);
        if (!validation.isValid) {
          throw new Error(validation.errors[0]);
        }

        const movie = useFilters
          ? await getRandomRecommendation(filters)
          : await getSurpriseMeRecommendation();

        setCurrentMovie(movie);

        // Save to history
        RecommendationHistory.save(movie);
        setHistory(RecommendationHistory.load());
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get recommendation";
        setError(errorMessage);
        console.error("Error getting recommendation:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const handleFilterChange = {
    genres: (genres: number[]) => setFilters((prev) => ({ ...prev, genres })),
    yearRange: (yearRange: [number, number]) =>
      setFilters((prev) => ({ ...prev, yearRange })),
    minRating: (minRating: number) =>
      setFilters((prev) => ({ ...prev, minRating })),
  };

  const handleResetFilters = () => {
    setFilters(getDefaultFilters());
    setCurrentMovie(null);
    setError(null);
  };

  const handleClearHistory = () => {
    RecommendationHistory.clear();
    setHistory([]);
  };

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto mb-8">
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
          <Link
            href="/movies"
            className="hover:text-white transition-colors"
          >
            Movies
          </Link>
          <span>›</span>
          <Link
            href="/decisions"
            className="hover:text-white transition-colors"
          >
            Decisions
          </Link>
          <span>›</span>
          <span className="text-blue-400">Random Discovery</span>
        </nav>

        <Link
          href="/decisions"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110-2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Decisions Hub
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto text-center mb-12">
        <div className="text-6xl mb-4">🎲</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-200">
          Random Discovery
        </h1>
        <div className="w-24 h-1 bg-blue-500 rounded mx-auto mb-6"></div>
        <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto">
          Sometimes the best discoveries come by chance! Get perfectly random
          movie recommendations tailored to your preferences and discover hidden
          gems you might have missed.
        </p>
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-200">
              Customize Your Discovery
            </h2>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className={`${showFilters ? "block" : "hidden md:block"}`}>
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <GenreFilter
                  selectedGenres={filters.genres}
                  onGenreChange={handleFilterChange.genres}
                  disabled={loading}
                />

                <YearRangeSlider
                  yearRange={filters.yearRange}
                  onYearRangeChange={handleFilterChange.yearRange}
                  disabled={loading}
                />

                <RatingFilter
                  minRating={filters.minRating}
                  onRatingChange={handleFilterChange.minRating}
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleGetRecommendation(true)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                >
                  <span>🎲</span>
                  Get Random Movie
                </button>

                <button
                  onClick={() => handleGetRecommendation(false)}
                  disabled={loading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                >
                  <span>✨</span>
                  Surprise Me!
                </button>

                <button
                  onClick={handleResetFilters}
                  disabled={loading}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>🔄</span>
                  Reset Filters
                </button>
              </div>

              {/* Filter Summary */}
              {(filters.genres.length > 0 ||
                filters.minRating > 0 ||
                filters.yearRange[0] !== 1990 ||
                filters.yearRange[1] !== new Date().getFullYear()) && (
                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <p className="text-sm text-zinc-400 text-center">
                    <span className="text-blue-300">Active filters:</span>{" "}
                    {buildFilterSummary(filters, [])}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation Display */}
        <div className="mb-8">
          <MovieRecommendationCard
            movie={currentMovie}
            loading={loading}
            error={error}
            onGetAnother={() => handleGetRecommendation(true)}
            disabled={loading}
          />
        </div>

        {/* Recommendation History */}
        {history.length > 0 && (
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-200">
                Recent Discoveries
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.map((movie, index) => (
                <Link
                  key={`${movie.id}-${index}`}
                  href={`/movies/${movie.id}?tmdb=true`}
                  className="group"
                >
                  <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden relative group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center">
                        No Poster
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 group-hover:text-white transition-colors">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default RandomRecommendationPage;
