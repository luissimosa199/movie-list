"use client";

import React from "react";
import {
  SimpleTournament,
  getRoundBattles,
  getRoundName,
  BattleMatch,
} from "@/utils/simpleTournament";

interface TournamentProgressProps {
  tournament: SimpleTournament;
  className?: string;
}

const TournamentProgress: React.FC<TournamentProgressProps> = ({
  tournament,
  className = "",
}) => {
  const totalRounds = Math.ceil(Math.log2(tournament.movies.length));

  return (
    <div
      className={`bg-zinc-900 border border-zinc-700 rounded-lg p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Tournament Progress
        </h3>
        <p className="text-zinc-400 text-sm">
          {tournament.title} • {tournament.movies.length} Movies
        </p>
      </div>

      {/* Simple Bracket View */}
      <div className="space-y-6">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => {
          const roundBattles = getRoundBattles(tournament, round);
          const roundName = getRoundName(round, totalRounds);

          return (
            <RoundDisplay
              key={round}
              round={round}
              roundName={roundName}
              battles={roundBattles}
              isCurrentRound={round === tournament.currentRound}
              isCompleted={round < tournament.currentRound}
            />
          );
        })}
      </div>

      {/* Champion Display */}
      {tournament.completed && tournament.champion && (
        <div className="mt-6 pt-6 border-t border-zinc-700">
          <div className="text-center">
            <div className="text-4xl mb-2">👑</div>
            <h4 className="text-xl font-bold text-yellow-400 mb-1">Champion</h4>
            <p className="text-white font-semibold">
              {tournament.champion.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface RoundDisplayProps {
  round: number;
  roundName: string;
  battles: BattleMatch[];
  isCurrentRound: boolean;
  isCompleted: boolean;
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({
  round,
  roundName,
  battles,
  isCurrentRound,
  isCompleted,
}) => {
  return (
    <div>
      {/* Round Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isCompleted
              ? "bg-green-500 text-white"
              : isCurrentRound
              ? "bg-red-500 text-white"
              : "bg-zinc-700 text-zinc-400"
          }`}
        >
          {round}
        </div>
        <h4
          className={`font-semibold ${
            isCurrentRound
              ? "text-red-400"
              : isCompleted
              ? "text-green-400"
              : "text-zinc-400"
          }`}
        >
          {roundName}
        </h4>
        <div className="flex-1 h-px bg-zinc-700"></div>
        <span className="text-xs text-zinc-500">
          {battles.filter((b) => b.completed).length}/{battles.length}
        </span>
      </div>

      {/* Battles */}
      <div className="space-y-2 ml-9">
        {battles.map((battle, index) => (
          <BattleDisplay
            key={battle.id}
            battle={battle}
            battleNumber={index + 1}
            isCurrentBattle={
              isCurrentRound &&
              !battle.completed &&
              battles.slice(0, index).every((b) => b.completed)
            }
          />
        ))}

        {battles.length === 0 && (
          <div className="text-zinc-500 text-sm italic">
            Waiting for previous round to complete...
          </div>
        )}
      </div>
    </div>
  );
};

interface BattleDisplayProps {
  battle: BattleMatch;
  battleNumber: number;
  isCurrentBattle: boolean;
}

const BattleDisplay: React.FC<BattleDisplayProps> = ({
  battle,
  battleNumber,
  isCurrentBattle,
}) => {
  const isByeBattle = battle.movie1.id === battle.movie2.id;

  if (isByeBattle) {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Bye {battleNumber}:</span>
          <span className="text-white text-sm font-medium">
            {battle.movie1.title}
          </span>
          <span className="text-green-400 text-sm">advances</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded p-3 ${
        isCurrentBattle
          ? "bg-red-900/20 border-red-600/50"
          : battle.completed
          ? "bg-green-900/20 border-green-600/50"
          : "bg-zinc-800/50 border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Battle {battleNumber}:</span>
            {isCurrentBattle && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                Current
              </span>
            )}
          </div>

          <div className="mt-1 space-y-1">
            <div
              className={`text-sm ${
                battle.completed && battle.winner?.id === battle.movie1.id
                  ? "text-green-400 font-semibold"
                  : "text-zinc-300"
              }`}
            >
              {battle.movie1.title}
            </div>

            <div className="text-xs text-zinc-500">vs</div>

            <div
              className={`text-sm ${
                battle.completed && battle.winner?.id === battle.movie2.id
                  ? "text-green-400 font-semibold"
                  : "text-zinc-300"
              }`}
            >
              {battle.movie2.title}
            </div>
          </div>
        </div>

        <div className="text-right">
          {battle.completed ? (
            <div className="flex items-center gap-1">
              <span className="text-green-400 text-xs">✓</span>
              <span className="text-xs text-zinc-400">Complete</span>
            </div>
          ) : isCurrentBattle ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-400">Fighting</span>
            </div>
          ) : (
            <span className="text-xs text-zinc-500">Pending</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentProgress;
