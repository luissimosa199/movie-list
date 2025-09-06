import MovieCard from "@/components/MovieCard";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import { getLatestWatchedMovies, getRecentlyAddedMovies } from "@/api/db";
import Link from "next/link";

export default async function ProfilePage() {
  // Get a subset of movies for preview (5 each)
  const latestWatchedMovies = await getLatestWatchedMovies(4);
  const recentlyAddedMovies = await getRecentlyAddedMovies(4);

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          My Profile
        </h1>

        {/* Latest Watched Movies Section */}
        <div className="mb-12">
          <Link
            href="/profile/latest-watched"
            className="inline-block mb-6 group"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
              Latest Watched
              <span className="ml-2 text-lg opacity-60 group-hover:opacity-100">
                →
              </span>
            </h2>
          </Link>

          {latestWatchedMovies.length > 0 ? (
            <ClientGridWrapper>
              {latestWatchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  source="db"
                  isMovieInDb={movie.id}
                  watchedMovie={null}
                />
              ))}
            </ClientGridWrapper>
          ) : (
            <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
              <p className="text-zinc-400 text-lg">No watched movies yet</p>
              <p className="text-zinc-500 text-sm mt-2">
                Start watching movies and they&apos;ll appear here!
              </p>
            </div>
          )}
        </div>

        {/* Recently Added Movies Section */}
        <div className="mb-12">
          <Link
            href="/profile/recently-added"
            className="inline-block mb-6 group"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">
              Recently Added to List
              <span className="ml-2 text-lg opacity-60 group-hover:opacity-100">
                →
              </span>
            </h2>
          </Link>

          {recentlyAddedMovies.length > 0 ? (
            <ClientGridWrapper>
              {recentlyAddedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  source="db"
                  isMovieInDb={movie.id}
                  watchedMovie={null}
                />
              ))}
            </ClientGridWrapper>
          ) : (
            <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
              <p className="text-zinc-400 text-lg">
                No movies in your list yet
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                Add movies to your list and they&apos;ll appear here!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Profile – Movie Tracker",
  description:
    "View your latest watched movies and recently added list in your profile.",
};
