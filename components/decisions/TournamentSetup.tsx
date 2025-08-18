"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { TMDBMovie } from "@/types";
import { validateTournamentMovies } from "@/utils/simpleTournament";
import { useDebounce } from "@/hooks/useDebounce";

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface TournamentSetupProps {
  onStartTournament: (movies: TMDBMovie[], title: string) => void;
  loading?: boolean;
}

const TournamentSetup: React.FC<TournamentSetupProps> = ({
  onStartTournament,
  loading = false,
}) => {
  const [selectedMovies, setSelectedMovies] = useState<TMDBMovie[]>([]);
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search for movies
  React.useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        params.set("query", debouncedQuery);
        params.set("page", "1");
        params.set("limit", "8");

        const response = await fetch(`/api/movies?${params.toString()}`);
        if (!response.ok) throw new Error("Search failed");

        const data: TMDBResponse = await response.json();
        const results = data.results.slice(0, 8);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    };

    searchMovies();
  }, [debouncedQuery]);

  // Handle click outside to close search results
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddMovie = (movie: TMDBMovie) => {
    // Check if movie is already selected
    if (selectedMovies.find((m) => m.id === movie.id)) {
      return;
    }

    const newMovies = [...selectedMovies, movie];
    setSelectedMovies(newMovies);
    setSearchQuery("");
    setShowResults(false);

    // Clear validation error when adding movies
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleRemoveMovie = (movieId: number) => {
    setSelectedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const handleStartTournament = () => {
    const validation = validateTournamentMovies(selectedMovies);

    if (!validation.valid) {
      setValidationError(validation.error!);
      return;
    }

    const title =
      tournamentTitle.trim() || `${selectedMovies.length}-Movie Tournament`;
    onStartTournament(selectedMovies, title);
  };

  const getPosterUrl = (movie: TMDBMovie) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
      : null;
  };

  const getReleaseYear = (movie: TMDBMovie) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "Unknown Year";
  };

  const getPreviewMatchups = () => {
    if (selectedMovies.length < 4 || selectedMovies.length % 2 !== 0) {
      return [];
    }

    const shuffled = [...selectedMovies].sort(() => Math.random() - 0.5);
    const matchups = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      matchups.push({
        movie1: shuffled[i],
        movie2: shuffled[i + 1],
      });
    }

    return matchups;
  };

  const previewMatchups = getPreviewMatchups();
  const canStart =
    selectedMovies.length >= 4 && selectedMovies.length % 2 === 0;

  return (
    <div className="space-y-8">
      {/* Tournament Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Tournament Name (Optional)
        </label>
        <input
          type="text"
          value={tournamentTitle}
          onChange={(e) => setTournamentTitle(e.target.value)}
          placeholder="Enter tournament name..."
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 transition-colors"
          disabled={loading}
        />
      </div>

      {/* Movie Search */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Add Movies to Tournament
        </label>
        <div
          className="relative"
          ref={searchContainerRef}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            placeholder="Search for movies to add..."
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 transition-colors"
            disabled={loading}
          />

          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg mt-1 shadow-lg overflow-hidden">
              {searchResults.map((movie) => {
                const isSelected = selectedMovies.find(
                  (m) => m.id === movie.id
                );
                return (
                  <button
                    key={movie.id}
                    onClick={() => handleAddMovie(movie)}
                    disabled={!!isSelected}
                    className={`w-full flex items-center p-3 text-left transition-colors border-b border-zinc-700 last:border-b-0 ${
                      isSelected
                        ? "bg-zinc-800 cursor-not-allowed opacity-50"
                        : "hover:bg-zinc-800 cursor-pointer"
                    }`}
                  >
                    <div className="w-12 h-16 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
                      {getPosterUrl(movie) ? (
                        <Image
                          src={getPosterUrl(movie)!}
                          alt={`${movie.title} poster`}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">
                        {movie.title}
                      </h3>
                      <p className="text-zinc-400 text-xs">
                        {getReleaseYear(movie)} • ⭐{" "}
                        {movie.vote_average.toFixed(1)}
                      </p>
                      {isSelected && (
                        <p className="text-green-400 text-xs">Already added</p>
                      )}
                    </div>
                    {!isSelected && (
                      <div className="text-red-400 text-xl">+</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Movies */}
      {selectedMovies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Selected Movies ({selectedMovies.length})
            </h3>
            <button
              onClick={() => setSelectedMovies([])}
              className="text-zinc-400 hover:text-red-400 text-sm transition-colors"
              disabled={loading}
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative group"
              >
                <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
                  {getPosterUrl(movie) ? (
                    <Image
                      src={getPosterUrl(movie)!}
                      alt={`${movie.title} poster`}
                      width={154}
                      height={231}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center">
                      <div>
                        <div className="text-2xl mb-1">🎬</div>
                        No Poster
                      </div>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveMovie(movie.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-white truncate">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {getReleaseYear(movie)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-200">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-semibold">Invalid Tournament Setup</div>
              <div className="text-sm text-red-300">{validationError}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Requirements */}
      <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">
          Tournament Requirements
        </h3>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li
            className={`flex items-center gap-2 ${
              selectedMovies.length >= 4 ? "text-green-400" : ""
            }`}
          >
            <span>{selectedMovies.length >= 4 ? "✅" : "❌"}</span>
            Minimum 4 movies
          </li>
          <li
            className={`flex items-center gap-2 ${
              selectedMovies.length > 0 && selectedMovies.length % 2 === 0
                ? "text-green-400"
                : ""
            }`}
          >
            <span>
              {selectedMovies.length > 0 && selectedMovies.length % 2 === 0
                ? "✅"
                : "❌"}
            </span>
            Even number of movies
          </li>
        </ul>
      </div>

      {/* First Round Preview */}
      {previewMatchups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            First Round Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewMatchups.map((matchup, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4"
              >
                <div className="text-center mb-2">
                  <span className="text-xs text-zinc-400">
                    Battle {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-white truncate">
                      {matchup.movie1.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {getReleaseYear(matchup.movie1)}
                    </div>
                  </div>
                  <div className="text-red-400 font-bold">VS</div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-medium text-white truncate">
                      {matchup.movie2.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {getReleaseYear(matchup.movie2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Tournament Button */}
      <div className="text-center">
        <button
          onClick={handleStartTournament}
          disabled={!canStart || loading}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all transform ${
            canStart && !loading
              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white hover:scale-105"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin"></div>
              Starting Tournament...
            </>
          ) : (
            <>
              <span className="text-xl">⚔️</span>
              Start Tournament
              {canStart && (
                <span className="text-sm opacity-80">
                  ({selectedMovies.length} movies)
                </span>
              )}
            </>
          )}
        </button>

        {!canStart && selectedMovies.length > 0 && (
          <p className="text-zinc-400 text-sm mt-2">
            {selectedMovies.length % 2 !== 0
              ? "Add one more movie to create an even number"
              : "Add more movies to start the tournament"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TournamentSetup;
