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
import DecisionBreadcrumbs from "@/components/decisions/DecisionBreadcrumbs";
import DecisionHero from "@/components/decisions/DecisionHero";

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

  useEffect(() => {
    if (spinHistory.length > 0) {
      localStorage.setItem(
        "roulette-history",
        JSON.stringify(spinHistory.slice(0, 10))
      );
    }
  }, [spinHistory]);

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

      if (selectedMovies.length > 0) {
        const segments = generateWheelSegments(selectedMovies);
        const winnerMovie = determineWinner(finalAngle, segments);

        if (winnerMovie) {
          setWinner(winnerMovie);

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

  const getRecentWinners = () => spinHistory.slice(0, 5).map((entry) => entry.winner);

  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-12">
        <DecisionBreadcrumbs
          items={[
            { href: "/movies", label: "Movies" },
            { href: "/decisions", label: "Decisions" },
            { label: "Movie Roulette", active: true },
          ]}
          accentClassName="text-purple-300"
        />

        <DecisionHero
          icon="🎪"
          eyebrow="Movie Roulette"
          title="Load the wheel and let it settle the room."
          description="This mode is best when you already have contenders. Add movies, charge the spin, and let the wheel land the choice without another round of group indecision."
          accent="purple"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
              Status
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-sm font-semibold text-white">Wheel</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {selectedMovies.length}/12 movies loaded
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-sm font-semibold text-white">Game state</div>
                <div className="mt-1 text-sm capitalize text-zinc-400">
                  {gameState}
                </div>
              </div>
            </div>
          </div>
        </DecisionHero>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
              <MovieSelector
                selectedMovies={selectedMovies}
                onMoviesChange={handleMoviesChange}
                maxMovies={12}
                disabled={isSpinning}
              />
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 text-center shadow-2xl shadow-black/15 md:p-6">
              <h2 className="text-2xl font-semibold text-purple-200">
                The Wheel of Fate
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                More charge means more drama. Once the spin starts, the wheel owns
                the result.
              </p>

              <RouletteWheel
                ref={wheelRef}
                movies={selectedMovies}
                isSpinning={isSpinning}
                winner={winner}
                className="mt-6 mb-6"
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

          <div className="xl:col-span-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
              <WinnerDisplay
                winner={winner}
                isSpinning={isSpinning}
                onSpinAgain={handleSpinAgain}
                onClearWinner={handleClearWinner}
                spinHistory={getRecentWinners()}
              />
            </div>
          </div>
        </div>

        {spinHistory.length > 0 ? (
          <section className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  History
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Spin history
                </h2>
              </div>
              <button
                onClick={() => {
                  setSpinHistory([]);
                  localStorage.removeItem("roulette-history");
                }}
                className="text-sm text-zinc-400 transition-colors hover:text-red-400"
              >
                Clear history
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {spinHistory.slice(0, 6).map((entry, index) => (
                <div
                  key={`${entry.winner.id}-${entry.timestamp}`}
                  className="rounded-2xl border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-center gap-3">
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
                    className="mt-4 inline-flex text-sm text-purple-300 transition-colors hover:text-purple-200"
                  >
                    View details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default RouletteGamePage;
