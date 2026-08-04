"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TMDBMovie, UnifiedSearchResult } from "@/types";
import CatalogSearch from "@/components/search/CatalogSearch";
import { validateTournamentMovies } from "@/utils/simpleTournament";

interface TournamentSetupProps {
  onStartTournament: (movies: TMDBMovie[], title: string) => void;
  loading?: boolean;
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

const TournamentSetup: React.FC<TournamentSetupProps> = ({
  onStartTournament,
  loading = false,
}) => {
  const [selectedMovies, setSelectedMovies] = useState<TMDBMovie[]>([]);
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddMovie = (result: UnifiedSearchResult) => {
    const movie = movieFromSearchResult(result);

    if (selectedMovies.find((selected) => selected.id === movie.id)) {
      return;
    }

    const newMovies = [...selectedMovies, movie];
    setSelectedMovies(newMovies);

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
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Title
        </label>
        <input
          type="text"
          value={tournamentTitle}
          onChange={(e) => setTournamentTitle(e.target.value)}
          placeholder="Optional"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-400 transition-colors focus:outline-none focus:border-red-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Add titles
        </label>

        <CatalogSearch
          className="relative"
          placeholder="Search titles"
          limit={8}
          allowedKinds={["movie"]}
          disabled={loading}
          hideFooter
          onSelect={handleAddMovie}
          compact
        />
      </div>

      {selectedMovies.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Selected titles ({selectedMovies.length})
            </h3>
            <button
              onClick={() => setSelectedMovies([])}
              className="text-sm text-zinc-400 transition-colors hover:text-red-400"
              disabled={loading}
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative group"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
                  {getPosterUrl(movie) ? (
                    <Image
                      src={getPosterUrl(movie)!}
                      alt={`${movie.title} poster`}
                      width={154}
                      height={231}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-xs text-zinc-500">
                      <div>
                        <div className="mb-1 text-2xl">??</div>
                        No Poster
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveMovie(movie.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                    disabled={loading}
                  >
                    x
                  </button>
                </div>

                <div className="mt-2">
                  <h4 className="truncate text-sm font-medium text-white">
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

      {validationError && (
        <div className="rounded-lg border border-red-600/50 bg-red-900/20 p-4">
          <div className="flex items-center gap-2 text-red-200">
            <span className="text-xl">??</span>
            <div>
              <div className="font-semibold">Invalid setup</div>
              <div className="text-sm text-red-300">{validationError}</div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-zinc-300">
          Requirements
        </h3>
        <ul className="space-y-1 text-sm text-zinc-400">
          <li
            className={`flex items-center gap-2 ${
              selectedMovies.length >= 4 ? "text-green-400" : ""
            }`}
          >
            <span>{selectedMovies.length >= 4 ? "?" : "?"}</span>
            At least 4 movies
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
                ? "?"
                : "?"}
            </span>
            Even count
          </li>
        </ul>
      </div>

      {previewMatchups.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Preview
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {previewMatchups.map((matchup, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4"
              >
                <div className="mb-2 text-center">
                  <span className="text-xs text-zinc-400">
                    Battle {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <div className="truncate text-sm font-medium text-white">
                      {matchup.movie1.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {getReleaseYear(matchup.movie1)}
                    </div>
                  </div>
                  <div className="font-bold text-red-400">VS</div>
                  <div className="flex-1 text-center">
                    <div className="truncate text-sm font-medium text-white">
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

      <div className="text-center">
        <button
          onClick={handleStartTournament}
          disabled={!canStart || loading}
          className={`inline-flex items-center gap-2 rounded-lg px-8 py-3 font-semibold transition-all transform ${
            canStart && !loading
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 hover:scale-105"
              : "cursor-not-allowed bg-zinc-700 text-zinc-400"
          }`}
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-white"></div>
              Starting...
            </>
          ) : (
            <>
              <span className="text-xl">??</span>
              Start tournament
              {canStart && (
                <span className="text-sm opacity-80">
                  ({selectedMovies.length} movies)
                </span>
              )}
            </>
          )}
        </button>

        {!canStart && selectedMovies.length > 0 && (
          <p className="mt-2 text-sm text-zinc-400">
            {selectedMovies.length % 2 !== 0
              ? "Add one more title for an even bracket"
              : "Add more titles"}
          </p>
        )}
      </div>
    </div>
  );
};

export default TournamentSetup;

