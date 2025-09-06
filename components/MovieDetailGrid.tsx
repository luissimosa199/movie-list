import React from "react";
import { Movie, FullDetailTMDBMovie } from "@/types";

const MovieDetailGrid = ({
  movie,
  source,
}: {
  movie: Movie | FullDetailTMDBMovie;
  source: "tmdb" | "db";
}) => {
  const isTMDBMovie = source === "tmdb";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      {/* Basic Movie Information */}
      {movie.genres && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Genres</h3>
          <p className="text-zinc-300">
            {isTMDBMovie
              ? (movie.genres as { id: number; name: string }[])
                  .map((e) => e.name)
                  .join(", ")
              : (movie.genres as string[]).join(", ")}
          </p>
        </div>
      )}

      {movie.release_date && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">
            Release Date
          </h3>
          <p className="text-zinc-300">
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {movie.runtime && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Runtime</h3>
          <p className="text-zinc-300">{movie.runtime} minutes</p>
        </div>
      )}

      {/* Score/Rating Section */}
      {isTMDBMovie ? (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">
            TMDB Rating
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-zinc-300 ml-1 font-medium">
                {(movie as FullDetailTMDBMovie).vote_average.toFixed(1)}
              </span>
              <span className="text-zinc-500 ml-1">/10</span>
            </div>
            <span className="text-zinc-500 text-sm">
              ({(movie as FullDetailTMDBMovie).vote_count.toLocaleString()}{" "}
              votes)
            </span>
          </div>
        </div>
      ) : (
        (movie as Movie).score && (
          <div>
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Score</h3>
            <div className="flex items-center">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-zinc-300 ml-1 font-medium">
                {(movie as Movie).score}
              </span>
              <span className="text-zinc-500 ml-1">/5</span>
            </div>
          </div>
        )
      )}

      {/* External References */}
      {movie.imdb_id && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">IMDb</h3>
          <a
            href={`https://www.imdb.com/title/${movie.imdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors bg-zinc-800 px-3 py-2 rounded-lg text-sm"
          >
            <span>View on IMDb</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <p className="text-xs text-zinc-500 mt-1">
            IMDb ratings not available via TMDB API
          </p>
        </div>
      )}

      {/* User-specific Data */}
      <div>
        <h3 className="text-sm font-medium text-zinc-500 mb-1">Watch Status</h3>
        <p className="text-zinc-300">
          {!isTMDBMovie && "watched_at" in movie && movie.watched_at
            ? `Watched on ${new Date(movie.watched_at).toLocaleDateString()}`
            : "Not watched yet"}
        </p>
      </div>
    </div>
  );
};

export default MovieDetailGrid;
