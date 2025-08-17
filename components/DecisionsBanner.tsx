import React from "react";
import Link from "next/link";

interface DecisionsBannerProps {
  className?: string;
}

const DecisionsBanner: React.FC<DecisionsBannerProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-lg border border-zinc-700 p-6 md:p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-zinc-600 overflow-hidden ${className}`}
    >
      {/* Background gaming pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="flex flex-wrap gap-8 transform rotate-12 scale-150">
          <div className="text-4xl">🎲</div>
          <div className="text-4xl">🆚</div>
          <div className="text-4xl">🎮</div>
          <div className="text-4xl">⚡</div>
          <div className="text-4xl">🎯</div>
          <div className="text-4xl">🎪</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
            <span className="text-2xl">🎲</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Can't Decide What to Watch?
            </h2>
            <span className="text-2xl">🎮</span>
          </div>

          <p className="text-zinc-300 text-sm md:text-base mb-4 max-w-2xl">
            Try our movie decision games! Battle movies head-to-head, get random
            recommendations, or spin the roulette to discover your next favorite
            film.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs md:text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <span>🆚</span>
              <span>VS Battles</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🎯</span>
              <span>Random Picks</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🎪</span>
              <span>Movie Roulette</span>
            </div>
          </div>
        </div>

        {/* Right side - CTA Button */}
        <div className="flex-shrink-0">
          <Link
            href="/decisions"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            aria-label="Start using movie decision games"
          >
            <span className="text-lg">🎲</span>
            <span className="text-sm md:text-base">Start Deciding</span>
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

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DecisionsBanner;
