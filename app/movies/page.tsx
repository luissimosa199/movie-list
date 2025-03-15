import MovieCard from "@/components/MovieCard";
import { getLatestWatchedMovies, getRecentlyAddedMovies } from "@/api/db";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/api/tmdb";

export default async function Movies() {
  const latestWatchedMovies = await getLatestWatchedMovies();
  const recentlyAddedMovies = await getRecentlyAddedMovies();

  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Latest Watched
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestWatchedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              source="db"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Recently Added to List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyAddedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              source="db"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Popular Movies
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularMovies.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Top Rated Movies
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topRatedMovies.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Upcoming Movies
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {upcomingMovies.results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </div>
      </div>
      {/*  */}
    </main>
  );
}
