import React from "react";
import Link from "next/link";

const RandomRecommendationPage = () => {
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
          <span className="text-blue-400">Random Discovery</span>
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
        <div className="text-6xl mb-4">🎲</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-blue-200">
          Random Discovery
        </h1>
        <div className="w-24 h-1 bg-blue-500 rounded mx-auto mb-6"></div>
        <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto">
          Sometimes the best discoveries come by chance! Get perfectly random
          movie recommendations tailored to your preferences and discover hidden
          gems you might have missed.
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800/50 rounded-lg p-8 md:p-12">
          {/* Features Preview */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-200 mb-6">
              🎯 Smart Random Features Coming Soon
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-1">
                      Genre Filtering
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Choose specific genres or let fate decide across all
                      categories
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-1">
                      Era Selection
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Set year ranges from classic films to the latest releases
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-1">
                      Rating Thresholds
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Set minimum rating requirements to ensure quality
                      recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎪</span>
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-1">
                      Surprise Me Mode
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Completely random selection with no filters for true
                      serendipity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Preview Interface */}
          <div className="bg-zinc-900/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-200 mb-4 text-center">
              🎯 Filter Interface Preview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm">
                  Genres
                </label>
                <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="w-4 h-4 border border-zinc-600 rounded"></div>
                      <span>Action</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="w-4 h-4 border border-zinc-600 rounded"></div>
                      <span>Comedy</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="w-4 h-4 border border-zinc-600 rounded"></div>
                      <span>Drama</span>
                    </div>
                    <div className="text-xs text-zinc-500">+ more genres</div>
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm">
                  Year Range
                </label>
                <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-zinc-400">
                      <span>From: 1950</span>
                      <span>To: 2024</span>
                    </div>
                    <div className="bg-zinc-700 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <label className="text-blue-300 font-medium text-sm">
                  Minimum Rating
                </label>
                <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span>⭐</span>
                      <span>7.0+ IMDb</span>
                    </div>
                    <div className="bg-zinc-700 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button className="bg-blue-600/20 border border-blue-600/50 text-blue-300 px-4 py-2 rounded-lg text-sm">
                🎲 Get Random Movie
              </button>
              <button className="bg-cyan-600/20 border border-cyan-600/50 text-cyan-300 px-4 py-2 rounded-lg text-sm">
                ✨ Surprise Me!
              </button>
              <button className="bg-zinc-700/50 border border-zinc-600 text-zinc-400 px-4 py-2 rounded-lg text-sm">
                🔄 Reset Filters
              </button>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
                <span>🧠</span>
                Smart Recommendations
              </h4>
              <p className="text-zinc-400 text-sm">
                AI-powered suggestions based on your viewing history and
                preferences for truly personalized discoveries.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-600/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                <span>🔄</span>
                Endless Discovery
              </h4>
              <p className="text-zinc-400 text-sm">
                Don't like the first suggestion? Keep rolling for new
                recommendations with your current filter settings.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-600/50 rounded-lg px-6 py-4 mb-6">
              <span className="text-2xl">🚧</span>
              <div className="text-left">
                <div className="font-semibold text-blue-200">
                  Under Development
                </div>
                <div className="text-sm text-zinc-400">
                  Coming in Phase 3 of implementation
                </div>
              </div>
            </div>

            <p className="text-zinc-400 mb-6">
              Get ready to discover your next favorite movie through smart
              random recommendations! This feature will be available soon.
            </p>

            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
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

export default RandomRecommendationPage;

export const metadata = {
  title: "Random Discovery – Smart Movie Recommendations",
  description:
    "Get perfectly random movie recommendations with smart filtering. Discover hidden gems based on your preferences for genre, year, and rating.",
};
