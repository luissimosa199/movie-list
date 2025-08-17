import React from "react";
import Link from "next/link";

const VSBattlePage = () => {
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
          Tournament-style movie battles where only the strongest films survive!
          Create brackets, face off movies head-to-head, and crown the ultimate
          champion.
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-800/50 rounded-lg p-8 md:p-12">
          {/* Tournament Preview */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-red-200 mb-6">
              🏆 Tournament Features Coming Soon
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">
                      Smart Bracket Generation
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Automatically create balanced tournament brackets from
                      your movie selections
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">
                      Quick Battles
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Fast-paced 1v1 movie comparisons with visual movie cards
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">
                      Battle Statistics
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Track wins, losses, and champion history across all your
                      tournaments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">
                      Championship Mode
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Crown the ultimate champion and see detailed battle
                      progression
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Bracket Preview */}
          <div className="bg-zinc-900/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-200 mb-4 text-center">
              🏆 Tournament Bracket Preview
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="space-y-2">
                <div className="text-red-400 font-medium">Quarterfinals</div>
                <div className="space-y-1 text-zinc-400">
                  <div className="bg-zinc-800 rounded p-2">
                    Movie A vs Movie B
                  </div>
                  <div className="bg-zinc-800 rounded p-2">
                    Movie C vs Movie D
                  </div>
                  <div className="bg-zinc-800 rounded p-2">
                    Movie E vs Movie F
                  </div>
                  <div className="bg-zinc-800 rounded p-2">
                    Movie G vs Movie H
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-orange-400 font-medium">Semifinals</div>
                <div className="space-y-1 text-zinc-400">
                  <div className="bg-zinc-800 rounded p-2">
                    Winner 1 vs Winner 2
                  </div>
                  <div className="bg-zinc-800 rounded p-2">
                    Winner 3 vs Winner 4
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-yellow-400 font-medium">Championship</div>
                <div className="space-y-1 text-zinc-400">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 rounded p-2">
                    👑 Final Battle 👑
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-red-600/20 border border-red-600/50 rounded-lg px-6 py-4 mb-6">
              <span className="text-2xl">🚧</span>
              <div className="text-left">
                <div className="font-semibold text-red-200">
                  Under Development
                </div>
                <div className="text-sm text-zinc-400">
                  Coming in Phase 3 of implementation
                </div>
              </div>
            </div>

            <p className="text-zinc-400 mb-6">
              Get ready to battle your favorite movies in epic tournaments! This
              feature will be available soon.
            </p>

            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Try Other Games</span>
              <svg
                className="w-4 h-4"
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
    </main>
  );
};

export default VSBattlePage;

export const metadata = {
  title: "Movie Battles – Tournament VS Games",
  description:
    "Battle your favorite movies head-to-head in tournament-style brackets. Create epic movie showdowns and crown the ultimate champion film.",
};
