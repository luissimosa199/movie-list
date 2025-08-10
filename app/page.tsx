import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import {
  getFavoriteGenres,
  getRecentActivity,
  getTotalWatchedCount,
  getWatchingStreak,
  getMoviesWatchedThisYearCount,
} from "@/api/db";

export default async function Home() {
  const [
    totalWatched,
    favoriteGenres,
    streak,
    recentActivity,
    watchedThisYear,
  ] = await Promise.all([
    getTotalWatchedCount(),
    getFavoriteGenres(3),
    getWatchingStreak(),
    getRecentActivity(4),
    getMoviesWatchedThisYearCount(),
  ]);

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto space-y-12">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="text-zinc-400 text-sm">Total watched</div>
              <div className="text-3xl font-semibold mt-2">{totalWatched}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="text-zinc-400 text-sm">Current streak</div>
              <div className="text-3xl font-semibold mt-2">
                {streak.currentStreakDays} days
              </div>
              <div className="text-zinc-500 text-xs mt-1">
                Longest: {streak.longestStreakDays} days
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="text-zinc-400 text-sm">
                Movies watched this year
              </div>
              <div className="text-3xl font-semibold mt-2">
                {watchedThisYear}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            Favorite genres
          </h2>
          {favoriteGenres.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {favoriteGenres.map((g) => (
                <span
                  key={g.genre}
                  className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm"
                  title={`${g.count} watched`}
                >
                  {g.genre}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">
              Watch movies to see your favorite genres here.
            </p>
          )}
        </section>

        <section className="space-y-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Latest watched
              </h2>
              <Link
                href="/profile/latest-watched"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            {recentActivity.latestWatched.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentActivity.latestWatched.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    source="db"
                  />
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No watched movies yet.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Recently added to list
              </h2>
              <Link
                href="/profile/recently-added"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            {recentActivity.recentlyAdded.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentActivity.recentlyAdded.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    source="db"
                  />
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No movies in your list yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Home – Movie Tracker",
  description:
    "Personal dashboard with your movie stats, favorite genres, and recent activity.",
};
