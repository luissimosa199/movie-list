"use client";

import React, { useState, useCallback } from "react";
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
import DecisionBreadcrumbs from "@/components/decisions/DecisionBreadcrumbs";
import DecisionHero from "@/components/decisions/DecisionHero";
import Link from "next/link";
import Image from "next/image";

const RandomRecommendationPage = () => {
  const [filters, setFilters] = useState<RecommendationFilters>(
    getDefaultFilters()
  );
  const [currentMovie, setCurrentMovie] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [history, setHistory] = useState<TMDBMovie[]>([]);

  React.useEffect(() => {
    setHistory(RecommendationHistory.load());
  }, []);

  const handleGetRecommendation = useCallback(
    async (useFilters = true) => {
      setLoading(true);
      setError(null);

      try {
        const validation = validateFilters(filters);
        if (!validation.isValid) {
          throw new Error(validation.errors[0]);
        }

        const movie = useFilters
          ? await getRandomRecommendation(filters)
          : await getSurpriseMeRecommendation();

        setCurrentMovie(movie);
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
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-12">
        <DecisionBreadcrumbs
          items={[
            { href: "/movies", label: "Movies" },
            { href: "/decisions", label: "Decisions" },
            { label: "Random Discovery", active: true },
          ]}
          accentClassName="text-blue-300"
        />

        <DecisionHero
          icon="🎲"
          eyebrow="Random Discovery"
          title="Pull a recommendation without losing control."
          description="Use filters when you want to narrow the field, or ignore them and let the app throw you something unexpected. The goal is speed, not analysis paralysis."
          accent="blue"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
              Modes
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                Filter by genre, year, and rating
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                Save recent discoveries locally
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                Jump straight to the movie details page
              </div>
            </div>
          </div>
        </DecisionHero>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          <section className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Filter Stack
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Customize your discovery
                </h2>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 md:hidden"
              >
                {showFilters ? "Hide filters" : "Show filters"}
              </button>
            </div>

            <div className={`${showFilters ? "block" : "hidden md:block"}`}>
              <div className="rounded-[1.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-950/25 to-cyan-950/20 p-5">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleGetRecommendation(true)}
                    disabled={loading}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    🎲 Get Random Movie
                  </button>

                  <button
                    onClick={() => handleGetRecommendation(false)}
                    disabled={loading}
                    className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✨ Surprise Me
                  </button>

                  <button
                    onClick={handleResetFilters}
                    disabled={loading}
                    className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reset Filters
                  </button>
                </div>

                {(filters.genres.length > 0 ||
                  filters.minRating > 0 ||
                  filters.yearRange[0] !== 1990 ||
                  filters.yearRange[1] !== new Date().getFullYear()) && (
                  <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-zinc-300">
                    <span className="font-medium text-blue-200">Active filters:</span>{" "}
                    {buildFilterSummary(filters, [])}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Recommendation
              </p>
              <div className="mt-4">
                <MovieRecommendationCard
                  movie={currentMovie}
                  loading={loading}
                  error={error}
                  onGetAnother={() => handleGetRecommendation(true)}
                  disabled={loading}
                />
              </div>
            </div>

            {history.length > 0 ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                      History
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      Recent discoveries
                    </h3>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-zinc-400 transition-colors hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {history.map((movie, index) => (
                    <Link
                      key={`${movie.id}-${index}`}
                      href={`/movies/${movie.id}?tmdb=true`}
                      className="group"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/8 bg-zinc-800">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={`${movie.title} poster`}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-center text-xs text-zinc-500">
                            No Poster
                          </div>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-zinc-400 transition-colors group-hover:text-white">
                        {movie.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default RandomRecommendationPage;
