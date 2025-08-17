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
  const getStarCount = (rating: number) => {
    return Math.round(rating / 2); // Convert 10-point scale to 5-star scale
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
            ★
          </span>
        ))}
      </div>
    );
  };

  const presetRatings = [
    { value: 0, label: "Any Rating", description: "Include all movies" },
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
      <label className="text-blue-300 font-medium text-sm">
        Minimum Rating
      </label>

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        {/* Current Rating Display */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-blue-200 mb-1">
            {minRating === 0 ? "Any" : minRating.toFixed(1)}
          </div>
          {minRating > 0 && (
            <div className="flex items-center justify-center mb-2">
              {renderStars(minRating)}
            </div>
          )}
          <div className="text-xs text-zinc-400">
            {minRating === 0
              ? "No rating filter"
              : `${minRating.toFixed(1)}/10.0 IMDb minimum`}
          </div>
        </div>

        {/* Slider */}
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
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Scale markers */}
          <div className="flex justify-between text-xs text-zinc-500 mt-2">
            <span>0</span>
            <span>2.5</span>
            <span>5.0</span>
            <span>7.5</span>
            <span>10</span>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {presetRatings.map((preset) => {
            const isActive = minRating === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => !disabled && onRatingChange(preset.value)}
                disabled={disabled}
                className={`p-3 rounded-lg border text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-blue-500 bg-blue-600/20 text-blue-200"
                    : "border-zinc-600 bg-zinc-700/50 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700"
                }`}
              >
                <div className="font-medium text-sm mb-1">{preset.label}</div>
                <div className="text-xs text-zinc-400">
                  {preset.description}
                </div>
                {preset.value > 0 && (
                  <div className="mt-2">{renderStars(preset.value)}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Rating Guide */}
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <div className="text-xs text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>8.0+ ★★★★★</span>
              <span>Masterpieces</span>
            </div>
            <div className="flex justify-between">
              <span>7.0+ ★★★★☆</span>
              <span>Great movies</span>
            </div>
            <div className="flex justify-between">
              <span>6.0+ ★★★☆☆</span>
              <span>Good entertainment</span>
            </div>
            <div className="flex justify-between">
              <span>&lt;6.0 ★★☆☆☆</span>
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
