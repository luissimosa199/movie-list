"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import {
  BattleMatch,
  getTournamentProgress,
  getRoundName,
} from "@/utils/simpleTournament";

interface MovieBattleProps {
  battle: BattleMatch;
  tournamentProgress: ReturnType<typeof getTournamentProgress>;
  onSelectWinner: (winner: TMDBMovie) => void;
  onSkipBattle?: () => void;
  loading?: boolean;
}

const MovieBattle: React.FC<MovieBattleProps> = ({
  battle,
  tournamentProgress,
  onSelectWinner,
  onSkipBattle,
  loading = false,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleMovieSelect = (movie: TMDBMovie) => {
    if (loading) return;

    setSelectedMovie(movie);
    setIsConfirming(true);
  };

  const handleConfirmSelection = () => {
    if (selectedMovie) {
      onSelectWinner(selectedMovie);
      // Reset confirmation state after selecting winner
      setSelectedMovie(null);
      setIsConfirming(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedMovie(null);
    setIsConfirming(false);
  };

  const handleSkip = () => {
    if (onSkipBattle) {
      // Randomly select a winner
      const winner = Math.random() > 0.5 ? battle.movie1 : battle.movie2;
      onSelectWinner(winner);
    }
  };

  const getPosterUrl = (movie: TMDBMovie) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null;
  };

  const getReleaseYear = (movie: TMDBMovie) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "Unknown Year";
  };

  const getGenres = (movie: TMDBMovie) => {
    // This is a simplified version - in a real app you'd map genre_ids to names
    return movie.genre_ids?.slice(0, 3).join(", ") || "Unknown";
  };

  const roundName = getRoundName(battle.round, tournamentProgress.totalRounds);
  const battlePosition = battle.position + 1;
  const totalBattlesInRound = Math.ceil(
    tournamentProgress.totalBattles / tournamentProgress.totalRounds
  );

  // Check if this is a bye battle (same movie vs same movie)
  const isByeBattle = battle.movie1.id === battle.movie2.id;

  // Auto-advance bye battles after a short delay
  React.useEffect(() => {
    if (isByeBattle && !loading) {
      const timer = setTimeout(() => {
        // The bye battle is already completed, but we need to trigger a UI update
        // by calling onSelectWinner which will advance to the next battle
        onSelectWinner(battle.movie1);
      }, 2000); // 2 second delay to show the bye message

      return () => clearTimeout(timer);
    }
  }, [isByeBattle, loading, battle.movie1, onSelectWinner]);

  if (isByeBattle) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {battle.movie1.title} Advances!
        </h2>
        <p className="text-zinc-400 mb-6">
          This movie gets a bye to the next round
        </p>
        <div className="text-sm text-zinc-500">
          {roundName} • Battle {battlePosition}
        </div>
        <div className="mt-4">
          <div className="inline-flex items-center gap-2 text-zinc-400 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Advancing automatically...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <div className="text-center">
        <div className="text-4xl mb-4">⚔️</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {roundName} Battle
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
          <span>Battle {battlePosition}</span>
          <span>•</span>
          <span>
            Round {battle.round} of {tournamentProgress.totalRounds}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500"
          style={{ width: `${tournamentProgress.progressPercentage}%` }}
        />
      </div>
      <div className="text-center text-xs text-zinc-400">
        {tournamentProgress.completedBattles} of{" "}
        {tournamentProgress.totalBattles} battles complete
      </div>

      {/* Battle Arena */}
      <div className="relative">
        {/* VS Divider for Mobile */}
        <div className="lg:hidden flex items-center justify-center py-4">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-6 py-3 rounded-lg">
            VS
          </div>
        </div>

        {/* Battle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Movie 1 */}
          <MovieCard
            movie={battle.movie1}
            side="left"
            onSelect={() => handleMovieSelect(battle.movie1)}
            isSelected={selectedMovie?.id === battle.movie1.id}
            disabled={loading || isConfirming}
            getPosterUrl={getPosterUrl}
            getReleaseYear={getReleaseYear}
            getGenres={getGenres}
          />

          {/* Movie 2 */}
          <MovieCard
            movie={battle.movie2}
            side="right"
            onSelect={() => handleMovieSelect(battle.movie2)}
            isSelected={selectedMovie?.id === battle.movie2.id}
            disabled={loading || isConfirming}
            getPosterUrl={getPosterUrl}
            getReleaseYear={getReleaseYear}
            getGenres={getGenres}
          />
        </div>

        {/* VS Divider for Desktop - Centered between the two columns */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-6 py-3 rounded-lg shadow-lg">
            VS
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && selectedMovie && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Confirm Your Choice
            </h3>
            <p className="text-zinc-400 mb-4">
              You selected{" "}
              <span className="text-white font-medium">
                {selectedMovie.title}
              </span>{" "}
              as the winner.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmSelection}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Advancing..." : "Confirm"}
              </button>
              <button
                onClick={handleCancelSelection}
                disabled={loading}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Change Choice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Option */}
      {onSkipBattle && !isConfirming && (
        <div className="text-center">
          <button
            onClick={handleSkip}
            disabled={loading}
            className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors disabled:opacity-50"
          >
            Too hard to choose? Skip and let fate decide
          </button>
        </div>
      )}
    </div>
  );
};

interface MovieCardProps {
  movie: TMDBMovie;
  side: "left" | "right";
  onSelect: () => void;
  isSelected: boolean;
  disabled: boolean;
  getPosterUrl: (movie: TMDBMovie) => string | null;
  getReleaseYear: (movie: TMDBMovie) => string | number;
  getGenres: (movie: TMDBMovie) => string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  side,
  onSelect,
  isSelected,
  disabled,
  getPosterUrl,
  getReleaseYear,
  getGenres,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const posterUrl = getPosterUrl(movie);

  return (
    <div
      className={`relative ${
        side === "left" ? "lg:text-right" : "lg:text-left"
      }`}
    >
      <div
        className={`group cursor-pointer transition-all duration-300 ${
          isSelected
            ? "scale-105 ring-4 ring-green-500 ring-opacity-50"
            : disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105"
        }`}
        onClick={disabled ? undefined : onSelect}
      >
        {/* Movie Poster */}
        <div className="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden mb-4 mx-auto max-w-xs relative">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
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
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-center">
              <div>
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm">No Poster Available</div>
              </div>
            </div>
          )}

          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Selection Overlay */}
          {isSelected && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="bg-green-500 text-white rounded-full p-2">
                <svg
                  className="w-8 h-8"
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
            </div>
          )}

          {/* Hover Effect */}
          {!disabled && !isSelected && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white text-black rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 8.207a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 9.586l2.293-2.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="space-y-2">
          <Link
            href={`/movies/${movie.id}?tmdb=true`}
            className="block"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white hover:text-red-200 transition-colors">
              {movie.title}
            </h3>
          </Link>

          <div className="text-zinc-400 text-sm space-y-1">
            <p>Released: {getReleaseYear(movie)}</p>
            <p>Rating: ⭐ {movie.vote_average.toFixed(1)}/10</p>
            <p>Votes: {movie.vote_count.toLocaleString()}</p>
          </div>

          {movie.overview && (
            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 mt-3">
              {movie.overview}
            </p>
          )}
        </div>

        {/* Vote Button */}
        <div className="mt-6">
          <button
            onClick={onSelect}
            disabled={disabled}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
              isSelected
                ? "bg-green-600 text-white"
                : disabled
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white transform hover:scale-105"
            }`}
          >
            {isSelected ? "✓ Selected" : `Choose ${movie.title}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieBattle;
