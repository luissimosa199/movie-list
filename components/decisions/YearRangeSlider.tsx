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
      <div className="space-y-1">
        <label className="text-sm font-medium text-blue-200">Year Range</label>
        <p className="text-xs text-zinc-500">
          Drag the range or use a preset.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">From</label>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={tempRange[0]}
              onChange={(e) => handleInputChange("min", e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 focus:bg-white/10 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">To</label>
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={tempRange[1]}
              onChange={(e) => handleInputChange("max", e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 focus:bg-white/10 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="relative mb-3 mt-4 h-6">
          <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-zinc-700"></div>

          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-500"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          ></div>

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

        <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
          <span>{minYear}</span>
          <span className="font-medium text-blue-200">
            {tempRange[0] === tempRange[1]
              ? tempRange[0]
              : `${tempRange[0]} - ${tempRange[1]}`}
          </span>
          <span>{maxYear}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          <button
            onClick={() => !disabled && onYearRangeChange([2020, currentYear])}
            disabled={disabled}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Recent (2020+)
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([2010, 2019])}
            disabled={disabled}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            2010s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([2000, 2009])}
            disabled={disabled}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            2000s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([1990, 1999])}
            disabled={disabled}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            90s
          </button>
          <button
            onClick={() => !disabled && onYearRangeChange([minYear, maxYear])}
            disabled={disabled}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
