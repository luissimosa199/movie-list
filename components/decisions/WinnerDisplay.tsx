"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import {
  generateConfetti,
  animateConfetti,
  animateCelebrationText,
  ConfettiParticle,
} from "@/utils/rouletteAnimations";

interface WinnerDisplayProps {
  winner: TMDBMovie | null;
  isSpinning: boolean;
  onSpinAgain?: () => void;
  onClearWinner?: () => void;
  spinHistory?: TMDBMovie[];
  className?: string;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  isSpinning,
  onSpinAgain,
  onClearWinner,
  spinHistory = [],
  className = "",
}) => {
  const [confettiParticles, setConfettiParticles] = useState<
    ConfettiParticle[]
  >([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0);

  // Trigger celebration when winner is determined
  useEffect(() => {
    if (winner && !isSpinning) {
      setShowCelebration(true);
      setCelebrationStep(0);

      // Start confetti
      const particles = generateConfetti(60);
      setConfettiParticles(particles);

      // Animate confetti for 4 seconds
      animateConfetti(particles, setConfettiParticles, 4000);

      // Celebration sequence
      setTimeout(() => setCelebrationStep(1), 500);
      setTimeout(() => setCelebrationStep(2), 1500);
      setTimeout(() => setCelebrationStep(3), 2500);

      // Auto-hide celebration after 6 seconds
      setTimeout(() => {
        setShowCelebration(false);
        setCelebrationStep(0);
      }, 6000);
    } else {
      setShowCelebration(false);
      setConfettiParticles([]);
    }
  }, [winner, isSpinning]);

  const getPosterUrl = (movie: TMDBMovie) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;
  };

  const getReleaseYear = (movie: TMDBMovie) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  if (isSpinning) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-lg p-8">
          <div className="text-6xl mb-4 animate-spin">🎪</div>
          <h3 className="text-2xl font-bold text-purple-200 mb-2">
            Spinning the Wheel...
          </h3>
          <p className="text-zinc-400">
            The fates are deciding your next movie!
          </p>

          {/* Spinning animation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!winner) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">
            Ready to Spin?
          </h3>
          <p className="text-zinc-400 text-sm">
            Add movies to your wheel and spin to discover your next watch!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Confetti Overlay */}
      {confettiParticles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg) scale(${
                  particle.size / 6
                })`,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 pointer-events-none">
          <div className="text-center">
            {celebrationStep >= 1 && (
              <div className="text-8xl mb-4 animate-bounce">🏆</div>
            )}
            {celebrationStep >= 2 && (
              <h2 className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
                WINNER!
              </h2>
            )}
            {celebrationStep >= 3 && (
              <p className="text-2xl text-white font-semibold">
                {winner.title}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Winner Card */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/50 rounded-lg p-8 md:p-10 relative overflow-hidden">
        {/* Winner Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          🏆 WINNER
        </div>

        <div className="flex flex-col gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0 mx-auto">
            <div className="w-48 h-72 bg-zinc-800 rounded-lg overflow-hidden relative">
              {getPosterUrl(winner) ? (
                <Image
                  src={getPosterUrl(winner)!}
                  alt={`${winner.title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm">No Poster</p>
                  </div>
                </div>
              )}

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent" />
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-200">
              {winner.title}
            </h2>

            {getReleaseYear(winner) && (
              <p className="text-yellow-300/80 text-lg">
                {getReleaseYear(winner)}
              </p>
            )}

            <div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-semibold">
                    {formatRating(winner.vote_average)}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    ({winner.vote_count} votes)
                  </span>
                </div>
              </div>
            </div>

            {winner.overview && (
              <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl mx-auto">
                {winner.overview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                href={`/movies/${winner.id}?tmdb=true`}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <span>📖</span>
                View Details
              </Link>

              {onSpinAgain && (
                <button
                  onClick={onSpinAgain}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>🎪</span>
                  Spin Again
                </button>
              )}

              {onClearWinner && (
                <button
                  onClick={onClearWinner}
                  className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>✨</span>
                  New Game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spin History */}
      {spinHistory.length > 0 && (
        <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-200 mb-3">
            Recent Spins
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {spinHistory.slice(0, 5).map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="group relative"
              >
                <Link
                  href={`/movies/${movie.id}?tmdb=true`}
                  className="block"
                >
                  <div className="aspect-[2/3] bg-zinc-800 rounded overflow-hidden relative group-hover:ring-2 group-hover:ring-yellow-500 transition-all">
                    {getPosterUrl(movie) ? (
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

                    {/* Index badge */}
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 group-hover:text-white transition-colors">
                    {movie.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {spinHistory.length > 5 && (
            <p className="text-xs text-zinc-500 mt-2 text-center">
              Showing last 5 spins of {spinHistory.length} total
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WinnerDisplay;
