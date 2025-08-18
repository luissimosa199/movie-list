"use client";

import React, { useState, useCallback } from "react";

interface YearRangeSliderProps {
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  disabled?: boolean;
}

const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
  yearRange,
  onYearRangeChange,
  disabled = false,
}) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1950;
  const maxYear = currentYear;

  const [tempRange, setTempRange] = useState<[number, number]>(yearRange);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate percentage positions for the sliders
  const getPercentage = (value: number) => {
    return ((value - minYear) / (maxYear - minYear)) * 100;
  };

  const handleMinYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const newMinYear = parseInt(e.target.value);
      const newRange: [number, number] = [
        newMinYear,
        Math.max(newMinYear, tempRange[1]),
      ];
      setTempRange(newRange);

      if (!isDragging) {
        onYearRangeChange(newRange);
      }
    },
    [disabled, tempRange, isDragging, onYearRangeChange]
  );

  const handleMaxYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const newMaxYear = parseInt(e.target.value);
      const newRange: [number, number] = [
        Math.min(tempRange[0], newMaxYear),
        newMaxYear,
      ];
      setTempRange(newRange);

      if (!isDragging) {
        onYearRangeChange(newRange);
      }
    },
    [disabled, tempRange, isDragging, onYearRangeChange]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    onYearRangeChange(tempRange);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    if (disabled) return;

    const numValue = parseInt(value) || (type === "min" ? minYear : maxYear);
    const clampedValue = Math.max(minYear, Math.min(maxYear, numValue));

    const newRange: [number, number] =
      type === "min"
        ? [clampedValue, Math.max(clampedValue, tempRange[1])]
        : [Math.min(tempRange[0], clampedValue), clampedValue];

    setTempRange(newRange);
    onYearRangeChange(newRange);
  };

  const minPercentage = getPercentage(tempRange[0]);
  const maxPercentage = getPercentage(tempRange[1]);

  return (
    <div className="space-y-3">
      <label className="text-blue-300 font-medium text-sm">Year Range</label>

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        {/* Year Input Fields */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <label className="text-xs text-zinc-400 mb-1">From</label>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={tempRange[0]}
              onChange={(e) => handleInputChange("min", e.target.value)}
              disabled={disabled}
              className="w-20 px-2 py-1 text-sm bg-zinc-700 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-zinc-400 mb-1">To</label>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={tempRange[1]}
              onChange={(e) => handleInputChange("max", e.target.value)}
              disabled={disabled}
              className="w-20 px-2 py-1 text-sm bg-zinc-700 border border-zinc-600 rounded text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Dual Range Slider */}
        <div className="relative h-6 mb-3">
          {/* Track */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-zinc-700 rounded-full"></div>

          {/* Active Track */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          ></div>

          {/* Min Slider */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={tempRange[0]}
            onChange={handleMinYearChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={disabled}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none disabled:opacity-50 slider-thumb-min"
            style={{
              zIndex: tempRange[0] > maxYear - (maxYear - minYear) / 4 ? 2 : 1,
            }}
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={tempRange[1]}
            onChange={handleMaxYearChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={disabled}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer focus:outline-none disabled:opacity-50 slider-thumb-max"
            style={{
              zIndex: tempRange[1] < minYear + (maxYear - minYear) / 4 ? 2 : 1,
            }}
          />
        </div>

        {/* Range Display */}
        <div className="flex justify-between text-xs text-zinc-400">
          <span>{minYear}</span>
          <span className="text-blue-300 font-medium">
            {tempRange[0] === tempRange[1]
              ? tempRange[0]
              : `${tempRange[0]} - ${tempRange[1]}`}
          </span>
          <span>{maxYear}</span>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => !disabled && onYearRangeChange([2020, currentYear])}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Recent (2020+)
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([2010, 2019])}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            2010s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([2000, 2009])}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            2000s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([1990, 1999])}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            90s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([minYear, maxYear])}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            All Years
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb-min::-webkit-slider-thumb,
        .slider-thumb-max::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb-min::-moz-range-thumb,
        .slider-thumb-max::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default YearRangeSlider;
