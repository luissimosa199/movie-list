"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CastMember } from "@/types";

interface CastSectionProps {
  cast: CastMember[];
}

const CastSection: React.FC<CastSectionProps> = ({ cast }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (cast.length === 0) return null;

  const displayedCast = showAll ? cast : cast.slice(0, 3);
  const hasMoreCast = cast.length > 3;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Cast</h2>
        {hasMoreCast && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors text-sm"
          >
            <span>{showAll ? "Show Less" : "Show More"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                showAll ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCast.map((actor) => (
          <div
            key={actor.id}
            className="flex items-center space-x-3 bg-zinc-800 p-3 rounded-lg"
          >
            {actor.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                alt={actor.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 text-xs">
                  {actor.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-zinc-200 font-medium text-sm truncate">
                {actor.name}
              </p>
              <p className="text-zinc-400 text-xs truncate">
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;
