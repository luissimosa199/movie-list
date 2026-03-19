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
  const filledStar = "\u2605";

  const handleStarClick = async (index: number) => {
    const newScore = index + 1;

    setScore(newScore);

    startTransition(async () => {
      try {
        if ("movieId" in props && typeof props.movieId === "number") {
          await updateMovieScore(props.movieId, newScore);
        } else if ("seriesId" in props && typeof props.seriesId === "number") {
          await updateSeriesScore(props.seriesId, newScore);
        }
      } catch (error) {
        setScore(initialScore);
        console.error("Error updating score:", error);
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center gap-1"
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
            className="cursor-pointer rounded-sm p-0.5 text-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Rate ${starValue} out of 5 stars`}
          >
            <span className={isFilled ? "text-yellow-500" : "text-zinc-500"}>
              {filledStar}
            </span>
          </button>
        );
      })}
      {isPending && (
        <div className="ml-2">
          <div className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-yellow-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
