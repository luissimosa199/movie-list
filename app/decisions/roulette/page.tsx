import React from "react";
import Link from "next/link";

const RouletteGamePage = () => {
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

      {/* Coming Soon Section */}
      <div className="container mx-auto max-w-5xl">
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/50 rounded-lg p-8 md:p-12">
          {/* Roulette Wheel Preview */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-200 mb-6">
              🎡 Interactive Roulette Wheel Coming Soon
            </h2>

            {/* Visual Roulette Mockup */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Wheel Background */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-800/30 to-pink-800/30 border-4 border-purple-600/50 relative overflow-hidden">
                  {/* Wheel Sections */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-700/20 to-pink-700/20 border-2 border-purple-500/30">
                    {/* Sample movie sections */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-1 text-xs text-center">
                        <div className="bg-red-600/30 rounded p-1">Movie A</div>
                        <div className="bg-blue-600/30 rounded p-1">
                          Movie B
                        </div>
                        <div className="bg-green-600/30 rounded p-1">
                          Movie C
                        </div>
                        <div className="bg-yellow-600/30 rounded p-1">
                          Movie D
                        </div>
                        <div className="bg-purple-600/30 rounded p-1">
                          Movie E
                        </div>
                        <div className="bg-pink-600/30 rounded p-1">
                          Movie F
                        </div>
                        <div className="bg-indigo-600/30 rounded p-1">
                          Movie G
                        </div>
                        <div className="bg-orange-600/30 rounded p-1">
                          Movie H
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <span className="text-xl">🎬</span>
                  </div>
                </div>

                {/* Pointer */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎡</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Interactive Wheel
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Beautiful spinning wheel with smooth animations and
                    realistic physics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Custom Movie Lists
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Add any movies you want to the wheel - from your watchlist
                    or popular selections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🌪️</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Realistic Spin Physics
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Watch the wheel spin with realistic momentum and gradually
                    slow down
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Group Decision Making
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Perfect for friend groups or families who can't decide what
                    to watch
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Colorful Sections
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Each movie gets its own colorful section with movie poster
                    thumbnails
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-semibold text-purple-300 mb-1">
                    Winner Highlights
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Dramatic winner reveal with confetti and movie details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interface Preview */}
          <div className="bg-zinc-900/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-200 mb-4 text-center">
              🎮 Game Interface Preview
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Movie Selection Panel */}
              <div className="space-y-4">
                <h4 className="font-medium text-purple-300 text-center">
                  Add Movies to Wheel
                </h4>
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-zinc-700/50 rounded">
                      <div className="w-8 h-12 bg-gradient-to-b from-red-600 to-red-800 rounded text-xs flex items-center justify-center">
                        🎬
                      </div>
                      <span className="text-sm text-zinc-300 flex-1">
                        The Dark Knight
                      </span>
                      <button className="text-red-400 hover:text-red-300 text-xs">
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-zinc-700/50 rounded">
                      <div className="w-8 h-12 bg-gradient-to-b from-blue-600 to-blue-800 rounded text-xs flex items-center justify-center">
                        🎬
                      </div>
                      <span className="text-sm text-zinc-300 flex-1">
                        Inception
                      </span>
                      <button className="text-red-400 hover:text-red-300 text-xs">
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-zinc-700/50 rounded">
                      <div className="w-8 h-12 bg-gradient-to-b from-green-600 to-green-800 rounded text-xs flex items-center justify-center">
                        🎬
                      </div>
                      <span className="text-sm text-zinc-300 flex-1">
                        Pulp Fiction
                      </span>
                      <button className="text-red-400 hover:text-red-300 text-xs">
                        Remove
                      </button>
                    </div>
                    <button className="w-full bg-purple-600/20 border border-purple-600/50 text-purple-300 py-2 rounded text-sm hover:bg-purple-600/30 transition-colors">
                      + Add More Movies
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="space-y-4">
                <h4 className="font-medium text-purple-300 text-center">
                  Spin Controls
                </h4>
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                    🎪 SPIN THE WHEEL!
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-2 px-3 rounded text-sm transition-colors">
                      🔄 Reset Wheel
                    </button>
                    <button className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-2 px-3 rounded text-sm transition-colors">
                      ⚙️ Settings
                    </button>
                  </div>

                  <div className="text-center text-sm text-zinc-400">
                    <div>Spin Speed: Normal</div>
                    <div>Movies on Wheel: 8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎊</div>
              <h4 className="font-semibold text-purple-200 mb-2">
                Winner Celebration
              </h4>
              <p className="text-zinc-400 text-sm">
                Confetti animations and victory sounds when the wheel stops
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-pink-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔊</div>
              <h4 className="font-semibold text-pink-200 mb-2">
                Sound Effects
              </h4>
              <p className="text-zinc-400 text-sm">
                Spinning sounds and winner chimes for immersive experience
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-semibold text-indigo-200 mb-2">
                Mobile Optimized
              </h4>
              <p className="text-zinc-400 text-sm">
                Touch-friendly interface that works great on all devices
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-purple-600/20 border border-purple-600/50 rounded-lg px-6 py-4 mb-6">
              <span className="text-2xl">🚧</span>
              <div className="text-left">
                <div className="font-semibold text-purple-200">
                  Under Development
                </div>
                <div className="text-sm text-zinc-400">
                  Coming in Phase 3 of implementation
                </div>
              </div>
            </div>

            <p className="text-zinc-400 mb-6">
              Get ready to spin your way to movie night decisions! This
              interactive roulette wheel will be available soon.
            </p>

            <Link
              href="/decisions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
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

export default RouletteGamePage;

export const metadata = {
  title: "Movie Roulette – Spin to Decide Your Next Watch",
  description:
    "Add movies to an interactive spinning roulette wheel and let fate decide what to watch next. Perfect for group movie nights and indecisive moments.",
};
