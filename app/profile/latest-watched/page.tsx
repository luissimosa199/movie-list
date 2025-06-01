import MovieCard from "@/components/MovieCard";
import { getLatestWatchedMovies } from "@/api/db";
import Link from "next/link";

export default async function LatestWatchedPage() {
  // Get the last 50 watched movies
  const latestWatchedMovies = await getLatestWatchedMovies(50);

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Back button and header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Profile
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Latest Watched Movies
        </h1>

        {latestWatchedMovies.length > 0 ? (
          <>
            <p className="text-zinc-400 mb-8">
              Showing {latestWatchedMovies.length} most recently watched movies
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestWatchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  source="db"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-12 text-center border border-zinc-800">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-zinc-400 text-xl mb-2">No watched movies yet</p>
            <p className="text-zinc-500">
              Start watching movies and they&apos;ll appear here!
            </p>
            <Link
              href="/movies"
              className="inline-block mt-6 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition-colors font-medium"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
