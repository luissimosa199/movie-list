import MovieCardWrapper from "@/components/MovieCardWrapper";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/api/tmdb";
import SearchBar from "@/components/SearchBar";
import DecisionsBanner from "@/components/DecisionsBanner";
export default async function Movies() {
  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <SearchBar />

      {/* Decisions Banner */}
      <div className="container mx-auto py-6">
        <DecisionsBanner />
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Popular Movies
        </h1>
        <ClientGridWrapper>
          {popularMovies.results.map((movie) => (
            <MovieCardWrapper
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </ClientGridWrapper>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Top Rated Movies
        </h1>
        <ClientGridWrapper>
          {topRatedMovies.results.map((movie) => (
            <MovieCardWrapper
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </ClientGridWrapper>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          Upcoming Movies
        </h1>
        <ClientGridWrapper>
          {upcomingMovies.results.map((movie) => (
            <MovieCardWrapper
              key={movie.id}
              movie={movie}
              source="tmdb"
            />
          ))}
        </ClientGridWrapper>
      </div>
      {/*  */}
    </main>
  );
}

export const metadata = {
  title: "Movies – Discover Popular, Top Rated, and Upcoming",
  description: "Discover movies by popularity, rating, and upcoming releases.",
};
