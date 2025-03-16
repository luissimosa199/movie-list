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
          <p className="text-zinc-300">
            {(movie as FullDetailTMDBMovie).vote_average.toFixed(1)} / 10
            <span className="text-zinc-500 ml-2">
              ({(movie as FullDetailTMDBMovie).vote_count} votes)
            </span>
          </p>
        </div>
      ) : (
        (movie as Movie).score && (
          <div>
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Score</h3>
            <p className="text-zinc-300">{(movie as Movie).score} / 5</p>
          </div>
        )
      )}

      {/* External References */}
      {movie.imdb_id && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-1">IMDB</h3>
          <a
            href={`https://www.imdb.com/title/${movie.imdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            View on IMDB
          </a>
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
