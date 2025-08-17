"use client";

import React, { useState, useEffect } from "react";
import { Genre } from "@/types";
import { getGenreList } from "@/utils/randomRecommendation";

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (genres: number[]) => void;
  disabled?: boolean;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onGenreChange,
  disabled = false,
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const genreList = await getGenreList();
        setGenres(genreList);
        setError(null);
      } catch (err) {
        setError("Failed to load genres");
        console.error("Error loading genres:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  const handleGenreToggle = (genreId: number) => {
    if (disabled) return;

    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];

    onGenreChange(newSelectedGenres);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onGenreChange(genres.map((genre) => genre.id));
  };

  const handleClearAll = () => {
    if (disabled) return;
    onGenreChange([]);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="text-blue-300 font-medium text-sm">Genres</label>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="flex items-center justify-center h-20">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <label className="text-blue-300 font-medium text-sm">Genres</label>
        <div className="bg-zinc-800 rounded-lg p-4 border border-red-700">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      </div>
    );
  }

  const allSelected = selectedGenres.length === genres.length;
  const noneSelected = selectedGenres.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-blue-300 font-medium text-sm">Genres</label>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            disabled={disabled || allSelected}
            className="text-xs text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select All
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={handleClearAll}
            disabled={disabled || noneSelected}
            className="text-xs text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="max-h-48 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-3 pr-2">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <label
                  key={genre.id}
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors min-w-0 ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-zinc-700"
                  } ${
                    isSelected ? "bg-blue-600/20 border border-blue-600/50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleGenreToggle(genre.id)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-500"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm leading-tight ${
                      isSelected ? "text-blue-200" : "text-zinc-300"
                    }`}
                  >
                    {genre.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {selectedGenres.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">
              Selected: {selectedGenres.length} genre
              {selectedGenres.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreFilter;
