"use client";

import React, { useState, useEffect } from "react";
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
import { TMDBMovie } from "@/types";
import TournamentSetup from "@/components/decisions/TournamentSetup";
import MovieBattle from "@/components/decisions/MovieBattle";
import TournamentProgress from "@/components/decisions/TournamentProgress";
import TournamentChampion from "@/components/decisions/TournamentChampion";
import DecisionBreadcrumbs from "@/components/decisions/DecisionBreadcrumbs";
import DecisionHero from "@/components/decisions/DecisionHero";
import DiscoverySearchSection from "@/components/DiscoverySearchSection";

type TournamentPhase = "setup" | "battle" | "champion";

const VSBattlePage = () => {
  const [currentPhase, setCurrentPhase] = useState<TournamentPhase>("setup");
  const [tournament, setTournament] = useState<SimpleTournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingTournament = loadTournament();
    if (existingTournament) {
      setTournament(existingTournament);
      setCurrentPhase(existingTournament.completed ? "champion" : "battle");
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

  const heroDescription =
    currentPhase === "setup"
      ? "Build a bracket from your own shortlist and let direct head-to-head matchups force a real decision."
      : currentPhase === "battle"
      ? `Round by round elimination is active in ${
          tournament?.title || "your tournament"
        }. Pick the winner and keep the bracket moving.`
      : `The bracket is complete. Review the winner or run the same field again in a rematch.`;

  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-12">
        <DecisionBreadcrumbs
          items={[
            { href: "/movies", label: "Movies" },
            { href: "/decisions", label: "Decisions" },
            { label: "Movie Battles", active: true },
          ]}
          accentClassName="text-red-300"
        />

        <DecisionHero
          icon="⚔️"
          eyebrow="Movie Battles"
          title="Run the bracket, not the debate."
          description={heroDescription}
          accent="red"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
              State
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-sm font-semibold text-white">Phase</div>
                <div className="mt-1 text-sm text-zinc-400 capitalize">
                  {currentPhase}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="text-sm font-semibold text-white">Tournament</div>
                <div className="mt-1 text-sm text-zinc-400">
                  {tournament?.title || "Not started yet"}
                </div>
              </div>
            </div>
          </div>
        </DecisionHero>

        <DiscoverySearchSection
          eyebrow="Bracket Prep"
          title="Search first when the battle card needs better contenders."
          description="Use the discovery deck as a pre-bracket staging area, then come back to seed the matchups with less tab-hopping."
        />

        {error ? (
          <div className="rounded-[1.5rem] border border-red-500/35 bg-red-950/20 p-4 text-red-200">
            <div className="font-semibold">Tournament Error</div>
            <div className="mt-1 text-sm text-red-300">{error}</div>
          </div>
        ) : null}

        <div className="max-w-7xl">
          {currentPhase === "setup" ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
              <TournamentSetup
                onStartTournament={handleStartTournament}
                loading={loading}
              />
            </div>
          ) : null}

          {currentPhase === "battle" ? (
            !tournament || !currentBattle || !tournamentProgress ? (
              <div className="rounded-[1.75rem] border border-red-500/35 bg-red-950/15 p-6 text-center">
                <div className="text-4xl">✕</div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  Tournament data could not be loaded
                </h2>
                <button
                  onClick={handleNewTournament}
                  className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Start New Tournament
                </button>
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-5 shadow-2xl shadow-black/15 md:p-6">
                  <MovieBattle
                    battle={currentBattle}
                    tournamentProgress={tournamentProgress}
                    onSelectWinner={handleBattleWinner}
                    loading={loading}
                  />
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-panel/70 p-4 shadow-2xl shadow-black/15 md:p-5">
                  <TournamentProgress tournament={tournament} />
                </div>
              </div>
            )
          ) : null}

          {currentPhase === "champion" ? (
            !tournament ? (
              <div className="rounded-[1.75rem] border border-red-500/35 bg-red-950/15 p-6 text-center">
                <div className="text-4xl">✕</div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  No tournament data found
                </h2>
                <button
                  onClick={handleNewTournament}
                  className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Start New Tournament
                </button>
              </div>
            ) : (
              <TournamentChampion
                tournament={tournament}
                onNewTournament={handleNewTournament}
                onRematch={handleRematch}
              />
            )
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default VSBattlePage;
