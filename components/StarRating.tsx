"use client";

import { updateMovieScore } from "@/lib/actions";
import React, { useState } from "react";

type StarRatingProps = {
  initialScore: number;
  movieId: number;
};

export default function StarRating({ initialScore, movieId }: StarRatingProps) {
  const [score, setScore] = useState(initialScore);
  const [hoverScore, setHoverScore] = useState(0);

  const handleStarClick = async (index: number) => {
    const newScore = index + 1;
    setScore(newScore);
    try {
      await updateMovieScore(movieId, newScore);
    } catch (error) {
      setScore(initialScore);
      console.error("Error updating movie score:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-1 mt-2"
      role="group"
      aria-label="Movie rating"
    >
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverScore || score);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => setHoverScore(starValue)}
            onMouseLeave={() => setHoverScore(0)}
            className={`p-0.5 transition-colors duration-200 cursor-pointer text-2xl`}
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
    </div>
  );
}
