import MovieCard from "@/components/MovieCard";
import { getRecentlyAddedMovies } from "@/api/db";
import Link from "next/link";

export default async function RecentlyAddedPage() {
  // Get the last 50 recently added movies
  const recentlyAddedMovies = await getRecentlyAddedMovies(50);

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
          Recently Added to List
        </h1>

        {recentlyAddedMovies.length > 0 ? (
          <>
            <p className="text-zinc-400 mb-8">
              Showing {recentlyAddedMovies.length} most recently added movies
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyAddedMovies.map((movie) => (
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-zinc-400 text-xl mb-2">
              No movies in your list yet
            </p>
            <p className="text-zinc-500">
              Add movies to your list and they&apos;ll appear here!
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
