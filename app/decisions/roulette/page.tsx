"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import {
  determineWinner,
  generateWheelSegments,
} from "@/utils/roulettePhysics";
import MovieSelector from "@/components/decisions/MovieSelector";
import RouletteWheel from "@/components/decisions/RouletteWheel";
import RouletteControls from "@/components/decisions/RouletteControls";
import WinnerDisplay from "@/components/decisions/WinnerDisplay";

interface RouletteHistory {
  winner: TMDBMovie;
  timestamp: number;
  movies: TMDBMovie[];
}

const RouletteGamePage = () => {
  const [selectedMovies, setSelectedMovies] = useState<TMDBMovie[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<TMDBMovie | null>(null);
  const [spinHistory, setSpinHistory] = useState<RouletteHistory[]>([]);
  const [gameState, setGameState] = useState<
    "setup" | "ready" | "spinning" | "winner"
  >("setup");

  const wheelRef = useRef<{
    spin: (totalRotation: number, duration: number) => void;
  }>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("roulette-history");
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSpinHistory(history);
      } catch (error) {
        console.error("Error loading roulette history:", error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (spinHistory.length > 0) {
      localStorage.setItem(
        "roulette-history",
        JSON.stringify(spinHistory.slice(0, 10))
      ); // Keep last 10
    }
  }, [spinHistory]);

  // Update game state based on current conditions
  useEffect(() => {
    if (isSpinning) {
      setGameState("spinning");
    } else if (winner) {
      setGameState("winner");
    } else if (selectedMovies.length >= 2) {
      setGameState("ready");
    } else {
      setGameState("setup");
    }
  }, [selectedMovies.length, isSpinning, winner]);

  const handleMoviesChange = useCallback(
    (movies: TMDBMovie[]) => {
      setSelectedMovies(movies);
      // Clear winner when movies change
      if (winner) {
        setWinner(null);
      }
    },
    [winner]
  );

  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
    setWinner(null);
  }, []);

  const handleSpinEnd = useCallback(
    (finalAngle: number) => {
      setIsSpinning(false);

      // Determine winner based on final wheel position
      if (selectedMovies.length > 0) {
        const segments = generateWheelSegments(selectedMovies);
        const winnerMovie = determineWinner(finalAngle, segments);

        if (winnerMovie) {
          setWinner(winnerMovie);

          // Add to history
          const newHistoryEntry: RouletteHistory = {
            winner: winnerMovie,
            timestamp: Date.now(),
            movies: [...selectedMovies],
          };

          setSpinHistory((prev) => [newHistoryEntry, ...prev]);
        }
      }
    },
    [selectedMovies]
  );

  const handleSpin = useCallback(
    (totalRotation: number, duration: number) => {
      if (wheelRef.current) {
        wheelRef.current.spin(totalRotation, duration);

        // Handle spin end after duration
        setTimeout(() => {
          handleSpinEnd(totalRotation % 360);
        }, duration);
      }
    },
    [handleSpinEnd]
  );

  const handleSpinAgain = useCallback(() => {
    setWinner(null);
    setGameState(selectedMovies.length >= 2 ? "ready" : "setup");
  }, [selectedMovies.length]);

  const handleClearWinner = useCallback(() => {
    setWinner(null);
    setSelectedMovies([]);
    setGameState("setup");
  }, []);

  const getRecentWinners = () => {
    return spinHistory.slice(0, 5).map((entry) => entry.winner);
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
          <span className="text-purple-400">Movie Roulette</span>
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
        <div className="text-6xl mb-4">🎪</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-purple-200">
          Movie Roulette
        </h1>
        <div className="w-24 h-1 bg-purple-500 rounded mx-auto mb-6"></div>
        <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto">
          Add your favorite movies to the spinning wheel and let fate decide
          your next watch! Perfect for movie nights when nobody can agree on
          what to watch.
        </p>
      </div>

      {/* Game Content */}
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Selection */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <MovieSelector
              selectedMovies={selectedMovies}
              onMoviesChange={handleMoviesChange}
              maxMovies={12}
              disabled={isSpinning}
              className="mb-6"
            />

            {/* Quick Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-200 mb-3">
                Game Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Movies on wheel:</span>
                  <span className="text-white">{selectedMovies.length}/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total spins:</span>
                  <span className="text-white">{spinHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Game state:</span>
                  <span
                    className={`
                    ${gameState === "setup" ? "text-yellow-400" : ""}
                    ${gameState === "ready" ? "text-green-400" : ""}
                    ${gameState === "spinning" ? "text-blue-400" : ""}
                    ${gameState === "winner" ? "text-purple-400" : ""}
                  `}
                  >
                    {gameState.charAt(0).toUpperCase() + gameState.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Roulette Wheel */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-200 mb-4">
                The Wheel of Fate
              </h2>

              <RouletteWheel
                ref={wheelRef}
                movies={selectedMovies}
                isSpinning={isSpinning}
                winner={winner}
                onSpinComplete={handleSpinEnd}
                className="mb-6"
              />

              <RouletteControls
                movies={selectedMovies}
                isSpinning={isSpinning}
                onSpin={handleSpin}
                onSpinStart={handleSpinStart}
                disabled={selectedMovies.length < 2}
              />
            </div>
          </div>

          {/* Right Column - Winner Display & History */}
          <div className="lg:col-span-1 order-3">
            <WinnerDisplay
              winner={winner}
              isSpinning={isSpinning}
              onSpinAgain={handleSpinAgain}
              onClearWinner={handleClearWinner}
              spinHistory={getRecentWinners()}
              className="mb-6"
            />

            {/* Game Instructions */}
            {gameState === "setup" && (
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-3">
                  How to Play
                </h3>
                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">1️⃣</span>
                    <p>Search and add 2-12 movies to your wheel</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">2️⃣</span>
                    <p>Hold the spin button to charge up power</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">3️⃣</span>
                    <p>Release to spin - longer hold = stronger spin!</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">4️⃣</span>
                    <p>Watch the wheel decide your movie fate!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pro Tips */}
            {gameState === "ready" && !winner && (
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-3">
                  🎯 Pro Tips
                </h3>
                <div className="space-y-2 text-sm text-zinc-300">
                  <p>• Hold the spin button longer for more dramatic spins</p>
                  <p>• Try different speed settings for varied experiences</p>
                  <p>• Use keyboard spacebar for quick spinning</p>
                  <p>• Share your winner with friends!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Spin History (Full Width) */}
        {spinHistory.length > 0 && (
          <div className="mt-12 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-200">
                Spin History
              </h2>
              <button
                onClick={() => {
                  setSpinHistory([]);
                  localStorage.removeItem("roulette-history");
                }}
                className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spinHistory.slice(0, 6).map((entry, index) => (
                <div
                  key={`${entry.winner.id}-${entry.timestamp}`}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{index === 0 ? "🏆" : "🎬"}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white line-clamp-1">
                        {entry.winner.title}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {new Date(entry.timestamp).toLocaleDateString()} •{" "}
                        {entry.movies.length} movies
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/movies/${entry.winner.id}?tmdb=true`}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>

            {spinHistory.length > 6 && (
              <p className="text-center text-zinc-500 text-sm mt-4">
                Showing latest 6 of {spinHistory.length} total spins
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default RouletteGamePage;
