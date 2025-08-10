"use client";

import { updateMovieScore, updateSeriesScore } from "@/lib/actions";
import React, { useState, useTransition } from "react";

type StarRatingProps =
  | { initialScore: number; movieId: number; seriesId?: never }
  | { initialScore: number; seriesId: number; movieId?: never };

export default function StarRating(props: StarRatingProps) {
  const { initialScore } = props as { initialScore: number };
  const [score, setScore] = useState(initialScore);
  const [hoverScore, setHoverScore] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleStarClick = async (index: number) => {
    const newScore = index + 1;

    // Optimistic update
    setScore(newScore);

    startTransition(async () => {
      try {
        if ("movieId" in props && typeof props.movieId === "number") {
          await updateMovieScore(props.movieId, newScore);
        } else if ("seriesId" in props && typeof props.seriesId === "number") {
          await updateSeriesScore(props.seriesId, newScore);
        }
      } catch (error) {
        // Revert on error
        setScore(initialScore);
        console.error("Error updating score:", error);
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center gap-1 mt-2"
      role="group"
      aria-label="Rating"
    >
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverScore || score);

        return (
          <button
            key={index}
            type="button"
            disabled={isPending}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => setHoverScore(starValue)}
            onMouseLeave={() => setHoverScore(0)}
            className={`p-0.5 transition-colors duration-200 cursor-pointer text-2xl disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={`Rate ${starValue} out of 5 stars`}
          >
            <span
              className={`${isFilled ? "text-yellow-500" : "text-zinc-500"}`}
            >
              ★
            </span>
          </button>
        );
      })}
      {isPending && (
        <div className="ml-2">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
