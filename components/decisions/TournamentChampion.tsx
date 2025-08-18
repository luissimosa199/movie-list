"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import {
  SimpleTournament,
  createTournamentSummary,
  formatDuration,
} from "@/utils/simpleTournament";

interface TournamentChampionProps {
  tournament: SimpleTournament;
  onNewTournament: () => void;
  onRematch: () => void;
}

const TournamentChampion: React.FC<TournamentChampionProps> = ({
  tournament,
  onNewTournament,
  onRematch,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const summary = createTournamentSummary(tournament);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!tournament.champion || !summary) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-white mb-2">No Champion Found</h2>
        <p className="text-zinc-400">
          Something went wrong with the tournament.
        </p>
      </div>
    );
  }

  const champion = tournament.champion;
  const posterUrl = champion.poster_path
    ? `https://image.tmdb.org/t/p/w500${champion.poster_path}`
    : null;

  const getReleaseYear = (movie: TMDBMovie) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "Unknown Year";
  };

  const handleShare = async () => {
    const shareText = `🏆 "${champion.title}" just won my movie tournament! It defeated ${summary.defeatedMovies.length} other movies to claim victory. 🎬`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tournament Champion: ${champion.title}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      // Could show a toast here
    }
  };

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "🏆", "⭐", "🎬", "👑"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {/* Champion Header */}
        <div className="text-center">
          <div className="text-6xl md:text-8xl mb-4">🏆</div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
            Tournament Champion!
          </h1>
          <p className="text-zinc-400 text-lg">{tournament.title}</p>
        </div>

        {/* Champion Movie Display */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-600/50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Poster */}
            <div className="mx-auto">
              <div className="aspect-[2/3] w-64 bg-zinc-800 rounded-lg overflow-hidden relative ring-4 ring-yellow-400 ring-opacity-50">
                {posterUrl && !imageError ? (
                  <Image
                    src={posterUrl}
                    alt={`${champion.title} poster`}
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
                    <div className="w-8 h-8 border-2 border-zinc-600 border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Crown overlay */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="text-4xl">👑</div>
                </div>
              </div>
            </div>

            {/* Champion Details */}
            <div className="md:col-span-2 space-y-4 text-center md:text-left">
              <div>
                <Link href={`/movies/${champion.id}?tmdb=true`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-yellow-200 transition-colors">
                    {champion.title}
                  </h2>
                </Link>
                <p className="text-yellow-300 text-lg">
                  {getReleaseYear(champion)} • ⭐{" "}
                  {champion.vote_average.toFixed(1)}/10
                </p>
              </div>

              {champion.overview && (
                <p className="text-zinc-300 leading-relaxed">
                  {champion.overview}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-yellow-400 font-semibold">
                    Battles Won
                  </div>
                  <div className="text-white text-xl font-bold">
                    {summary.totalBattles}
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-yellow-400 font-semibold">
                    Tournament Time
                  </div>
                  <div className="text-white text-xl font-bold">
                    {formatDuration(summary.duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Path */}
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            🛤️ Path to Victory
          </h3>
          <div className="space-y-3">
            {summary.battlePath.map((battle, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      Defeated {battle.opponent.title}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      Round {battle.round} • {getReleaseYear(battle.opponent)}
                    </div>
                  </div>
                </div>
                <div className="text-green-400 text-xl">⚔️</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Statistics */}
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📊 Tournament Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {tournament.movies.length}
              </div>
              <div className="text-zinc-400 text-sm">Total Movies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {summary.totalBattles}
              </div>
              <div className="text-zinc-400 text-sm">Total Battles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {summary.defeatedMovies.length}
              </div>
              <div className="text-zinc-400 text-sm">Movies Defeated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.ceil(Math.log2(tournament.movies.length))}
              </div>
              <div className="text-zinc-400 text-sm">Rounds</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewTournament}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🆕</span>
            New Tournament
          </button>

          <button
            onClick={onRematch}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            Rematch
          </button>

          <button
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>📤</span>
            Share Result
          </button>

          <Link
            href={`/movies/${champion.id}?tmdb=true`}
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>ℹ️</span>
            View Details
          </Link>
        </div>

        {/* Defeated Movies */}
        {summary.defeatedMovies.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              💀 Defeated Opponents
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {summary.defeatedMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="text-center"
                >
                  <div className="text-zinc-400 text-sm mb-1">#{index + 1}</div>
                  <div className="text-white text-sm font-medium">
                    {movie.title}
                  </div>
                  <div className="text-zinc-500 text-xs">
                    {getReleaseYear(movie)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentChampion;
