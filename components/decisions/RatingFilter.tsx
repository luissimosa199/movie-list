"use client";

import React from "react";

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  onRatingChange,
  disabled = false,
}) => {
  const filledStar = "\u2605";
  const emptyStar = "\u2606";

  const getStarCount = (rating: number) => {
    return Math.round(rating / 2);
  };

  const renderStars = (rating: number) => {
    const starCount = getStarCount(rating);

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < starCount ? "text-yellow-500" : "text-zinc-600"
            }`}
          >
            {index < starCount ? filledStar : emptyStar}
          </span>
        ))}
      </div>
    );
  };

  const presetRatings = [
    { value: 0, label: "Any rating", description: "Include all movies" },
    { value: 6.0, label: "Good (6.0+)", description: "Well-received movies" },
    { value: 7.0, label: "Great (7.0+)", description: "Highly rated movies" },
    {
      value: 8.0,
      label: "Excellent (8.0+)",
      description: "Exceptional movies",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-blue-200">
          Minimum Rating
        </label>
        <p className="text-xs text-zinc-500">
          Filter to stronger picks without overconstraining the result.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
        <div className="mb-4 rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <div className="mb-1 text-2xl font-semibold text-blue-200">
            {minRating === 0 ? "Any" : minRating.toFixed(1)}
          </div>
          {minRating > 0 ? (
            <div className="mb-2 flex items-center justify-center">
              {renderStars(minRating)}
            </div>
          ) : null}
          <div className="text-xs text-zinc-400">
            {minRating === 0
              ? "No rating filter"
              : `${minRating.toFixed(1)}/10.0 IMDb minimum`}
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) =>
              !disabled && onRatingChange(parseFloat(e.target.value))
            }
            disabled={disabled}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>0</span>
            <span>2.5</span>
            <span>5.0</span>
            <span>7.5</span>
            <span>10</span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {presetRatings.map((preset) => {
            const isActive = minRating === preset.value;

            return (
              <button
                key={preset.value}
                onClick={() => !disabled && onRatingChange(preset.value)}
                disabled={disabled}
                className={`rounded-2xl border px-3 py-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isActive
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-100"
                    : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                }`}
              >
                <div className="text-sm font-medium">{preset.label}</div>
                <div className="mt-1 text-xs text-zinc-400">
                  {preset.description}
                </div>
                {preset.value > 0 ? (
                  <div className="mt-2">{renderStars(preset.value)}</div>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t border-white/8 pt-4">
          <div className="grid gap-2 text-xs text-zinc-400">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>{`8.0+ ${filledStar.repeat(5)}`}</span>
              <span>Masterpieces</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>{`7.0+ ${filledStar.repeat(4)}${emptyStar}`}</span>
              <span>Great movies</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>{`6.0+ ${filledStar.repeat(3)}${emptyStar.repeat(2)}`}</span>
              <span>Good entertainment</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>{`<6.0 ${filledStar.repeat(2)}${emptyStar.repeat(3)}`}</span>
              <span>Mixed reviews</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            #ef4444 0%,
            #f97316 25%,
            #eab308 50%,
            #22c55e 75%,
            #22c55e 100%
          );
        }

        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            #ef4444 0%,
            #f97316 25%,
            #eab308 50%,
            #22c55e 75%,
            #22c55e 100%
          );
        }
      `}</style>
    </div>
  );
};

export default RatingFilter;
