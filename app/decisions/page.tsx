import React from "react";
import Link from "next/link";

const DecisionsPage = () => {
  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      {/* Header with back navigation */}
      <div className="container mx-auto mb-8">
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
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
          Back to Movies
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            🎮 Movie Decision Games
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto">
            Can't decide what to watch? Let our interactive games help you
            discover your next favorite movie! Choose your adventure below.
          </p>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* VS Tournament Card */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-800/50 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-red-600/70 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="flex flex-wrap gap-4 transform rotate-12 scale-150">
                <div className="text-3xl">⚔️</div>
                <div className="text-3xl">🥊</div>
                <div className="text-3xl">🏆</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">⚔️</div>
                <h2 className="text-2xl font-bold text-red-200 mb-2">
                  Movie Battles
                </h2>
                <div className="w-16 h-1 bg-red-500 rounded mx-auto mb-4"></div>
              </div>

              <p className="text-zinc-300 text-sm mb-6 text-center leading-relaxed">
                Select movies and battle them head-to-head in epic tournament
                brackets until one champion emerges victorious!
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-red-300">
                  <span>🏆</span>
                  <span>Tournament brackets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-red-300">
                  <span>⚡</span>
                  <span>1v1 battles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-red-300">
                  <span>👑</span>
                  <span>Crown the champion</span>
                </div>
              </div>

              <Link
                href="/decisions/vs"
                className="group w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Start Battle</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Random Recommendation Card */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-800/50 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-600/70 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="flex flex-wrap gap-4 transform -rotate-12 scale-150">
                <div className="text-3xl">🎲</div>
                <div className="text-3xl">🎯</div>
                <div className="text-3xl">✨</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🎲</div>
                <h2 className="text-2xl font-bold text-blue-200 mb-2">
                  Random Discovery
                </h2>
                <div className="w-16 h-1 bg-blue-500 rounded mx-auto mb-4"></div>
              </div>

              <p className="text-zinc-300 text-sm mb-6 text-center leading-relaxed">
                Get perfectly random movie recommendations based on your
                preferences. Sometimes the best discoveries come by chance!
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <span>🎭</span>
                  <span>Filter by genre</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <span>📅</span>
                  <span>Choose year range</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <span>⭐</span>
                  <span>Set rating minimum</span>
                </div>
              </div>

              <Link
                href="/decisions/random"
                className="group w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Surprise Me</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Roulette Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-purple-600/70 relative overflow-hidden md:col-span-2 lg:col-span-1">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="flex flex-wrap gap-4 transform rotate-45 scale-150">
                <div className="text-3xl">🎪</div>
                <div className="text-3xl">🎰</div>
                <div className="text-3xl">🎡</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🎪</div>
                <h2 className="text-2xl font-bold text-purple-200 mb-2">
                  Movie Roulette
                </h2>
                <div className="w-16 h-1 bg-purple-500 rounded mx-auto mb-4"></div>
              </div>

              <p className="text-zinc-300 text-sm mb-6 text-center leading-relaxed">
                Add your favorite movies to the spinning wheel and let fate
                decide! Perfect for movie nights with friends.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-purple-300">
                  <span>🎡</span>
                  <span>Interactive wheel</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-300">
                  <span>🌪️</span>
                  <span>Spin mechanics</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-300">
                  <span>🎬</span>
                  <span>Multiple movies</span>
                </div>
              </div>

              <Link
                href="/decisions/roulette"
                className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Spin the Wheel</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="container mx-auto mt-16 text-center">
        <p className="text-zinc-500 text-sm">
          More games and features coming soon! 🚀
        </p>
      </div>
    </main>
  );
};

export default DecisionsPage;

export const metadata = {
  title: "Movie Decision Games – Battle, Discover, Spin",
  description:
    "Interactive movie decision games: battle movies in tournaments, get random recommendations, or spin the roulette wheel to discover your next favorite film.",
};
