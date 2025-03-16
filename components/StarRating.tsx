"use client";

import React, { useState } from "react";

type StarRatingProps = {
  initialScore: number;
  movieId: number;
};

export default function StarRating({ initialScore, movieId }: StarRatingProps) {
  const [score, setScore] = useState(initialScore);
  const [hoverScore, setHoverScore] = useState(0);

  const handleStarClick = (index: number) => {
    const newScore = index + 1;
    setScore(newScore);
    console.log("@", { newScore, movieId });
  };

  return (
    <div
      className="flex items-center gap-1"
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
            className={`p-0.5 transition-colors duration-200 cursor-pointer`}
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
