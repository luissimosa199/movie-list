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
        <label className="text-sm font-medium text-blue-200">Genres</label>
        <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-center h-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-blue-200">Genres</label>
        <div className="rounded-[1.25rem] border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-center text-sm text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  const allSelected = selectedGenres.length === genres.length;
  const noneSelected = selectedGenres.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium text-blue-200">Genres</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSelectAll}
            disabled={disabled || allSelected}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            disabled={disabled || noneSelected}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
        <div className="max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <label
                  key={genre.id}
                  className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 transition-colors ${
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"
                  } ${
                    isSelected
                      ? "border-blue-500/30 bg-blue-500/10"
                    : "border-white/10 bg-white/5"
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
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-500"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-white"
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
                    className={`min-w-0 text-sm leading-5 ${
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
          <div className="mt-4 border-t border-white/8 pt-3">
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
