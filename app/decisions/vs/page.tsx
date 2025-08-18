"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TMDBMovie } from "@/types";
import {
  SimpleTournament,
  createTournament,
  getCurrentBattle,
  recordBattleWinner,
  saveTournament,
  loadTournament,
  deleteTournament,
  getTournamentProgress,
} from "@/utils/simpleTournament";

// Components
import TournamentSetup from "@/components/decisions/TournamentSetup";
import MovieBattle from "@/components/decisions/MovieBattle";
import TournamentProgress from "@/components/decisions/TournamentProgress";
import TournamentChampion from "@/components/decisions/TournamentChampion";

type TournamentPhase = "setup" | "battle" | "champion";

const VSBattlePage = () => {
  const [currentPhase, setCurrentPhase] = useState<TournamentPhase>("setup");
  const [tournament, setTournament] = useState<SimpleTournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing tournament on mount
  useEffect(() => {
    const existingTournament = loadTournament();
    if (existingTournament) {
      setTournament(existingTournament);

      if (existingTournament.completed) {
        setCurrentPhase("champion");
      } else {
        setCurrentPhase("battle");
      }
    }
  }, []);

  const handleStartTournament = async (movies: TMDBMovie[], title: string) => {
    setLoading(true);
    setError(null);

    try {
      const newTournament = createTournament(movies, title);
      setTournament(newTournament);
      saveTournament(newTournament);
      setCurrentPhase("battle");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create tournament"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBattleWinner = async (winner: TMDBMovie) => {
    if (!tournament) return;

    setLoading(true);
    setError(null);

    try {
      const updatedTournament = recordBattleWinner(tournament, winner);
      setTournament(updatedTournament);
      saveTournament(updatedTournament);

      // Check if tournament is complete
      if (updatedTournament.completed) {
        setCurrentPhase("champion");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to record battle winner"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewTournament = () => {
    if (tournament) {
      deleteTournament(tournament.id);
    }
    setTournament(null);
    setCurrentPhase("setup");
    setError(null);
  };

  const handleRematch = () => {
    if (!tournament) return;

    try {
      // Create new tournament with same movies
      const rematchTournament = createTournament(
        tournament.movies,
        `${tournament.title} (Rematch)`
      );
      setTournament(rematchTournament);
      saveTournament(rematchTournament);
      setCurrentPhase("battle");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rematch");
    }
  };

  const currentBattle = tournament ? getCurrentBattle(tournament) : null;
  const tournamentProgress = tournament
    ? getTournamentProgress(tournament)
    : null;

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "setup":
        return (
          <TournamentSetup
            onStartTournament={handleStartTournament}
            loading={loading}
          />
        );

      case "battle":
        if (!tournament || !currentBattle || !tournamentProgress) {
          return (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-white mb-2">
                Tournament Error
              </h2>
              <p className="text-zinc-400 mb-4">
                Unable to load tournament data.
              </p>
              <button
                onClick={handleNewTournament}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Start New Tournament
              </button>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            {/* Battle Interface */}
            <MovieBattle
              battle={currentBattle}
              tournamentProgress={tournamentProgress}
              onSelectWinner={handleBattleWinner}
              loading={loading}
            />

            {/* Tournament Progress Sidebar */}
            <div className="lg:fixed lg:top-4 lg:right-4 lg:w-80 lg:max-h-screen lg:overflow-y-auto">
              <TournamentProgress tournament={tournament} />
            </div>
          </div>
        );

      case "champion":
        if (!tournament) {
          return (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-white mb-2">
                No Tournament Data
              </h2>
              <p className="text-zinc-400 mb-4">Tournament data not found.</p>
              <button
                onClick={handleNewTournament}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Start New Tournament
              </button>
            </div>
          );
        }

        return (
          <TournamentChampion
            tournament={tournament}
            onNewTournament={handleNewTournament}
            onRematch={handleRematch}
          />
        );

      default:
        return null;
    }
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
          <span className="text-red-400">Movie Battles</span>
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
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Decisions Hub
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto text-center mb-12">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-red-200">
          Movie Battles
        </h1>
        <div className="w-24 h-1 bg-red-500 rounded mx-auto mb-6"></div>
        <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto">
          {currentPhase === "setup"
            ? "Tournament-style movie battles where only the strongest films survive! Create brackets, face off movies head-to-head, and crown the ultimate champion."
            : currentPhase === "battle"
            ? `Fighting in ${
                tournament?.title || "Movie Tournament"
              } - Choose your champions!`
            : `Tournament Complete! We have a champion in ${
                tournament?.title || "Movie Tournament"
              }!`}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto mb-8">
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-200">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="font-semibold">Tournament Error</div>
                <div className="text-sm text-red-300">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase Content */}
      <div className="container mx-auto max-w-6xl">
        <div className={`${currentPhase === "battle" ? "lg:pr-96" : ""}`}>
          {renderPhaseContent()}
        </div>
      </div>
    </main>
  );
};

export default VSBattlePage;
