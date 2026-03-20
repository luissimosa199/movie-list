import MovieCardWrapper from "@/components/MovieCardWrapper";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/api/tmdb";
import SearchBar from "@/components/SearchBar";
import DecisionsBanner from "@/components/DecisionsBanner";

const movieSections = [
  {
    eyebrow: "Right Now",
    title: "Popular Movies",
    description: "The titles pulling the most attention across the platform.",
  },
  {
    eyebrow: "Critics & Crowd",
    title: "Top Rated Movies",
    description: "High-scoring picks when you want stronger odds than a random scroll.",
  },
  {
    eyebrow: "Coming Soon",
    title: "Upcoming Movies",
    description: "Fresh releases worth tracking before they disappear into the noise.",
  },
];

export default async function Movies() {
  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();

  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-10 md:space-y-14">
        <section className="relative z-30 overflow-visible rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(10,14,22,0.92))] px-5 py-6 shadow-2xl shadow-black/20 md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500/12 blur-3xl" />
            <div className="absolute right-0 top-8 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] xl:items-end">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                Discovery Deck
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Browse the movies worth your attention first.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                Search immediately when you know the title, or work through live
                slices of popular, top-rated, and upcoming releases without the
                usual endless-scroll mess.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">3 curated lanes</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">Fast title search</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">Grid or compact browsing</span>
                </div>
              </div>
            </div>

            <div className="relative z-30 overflow-hidden rounded-[1.5rem] border border-blue-400/20 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(59,130,246,0.12),rgba(217,70,239,0.14))] p-4 shadow-lg shadow-blue-950/20 md:p-5">
              <div className="absolute inset-0">
                <div className="absolute -right-6 top-0 h-24 w-24 rounded-full bg-fuchsia-500/16 blur-2xl" />
                <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-blue-400/16 blur-2xl" />
              </div>
              <p className="relative z-10 mb-3 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-blue-100/80">
                Find a specific movie
              </p>
              <div className="relative z-10">
                <SearchBar />
              </div>
            </div>
          </div>
        </section>

        <DecisionsBanner className="relative z-10" />

        <section className="space-y-12 md:space-y-16">
          <div>
            <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {movieSections[0].eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  {movieSections[0].title}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                {movieSections[0].description}
              </p>
            </div>
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

          <div className="border-t border-white/8 pt-12 md:pt-14">
            <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {movieSections[1].eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  {movieSections[1].title}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                {movieSections[1].description}
              </p>
            </div>
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

          <div className="border-t border-white/8 pt-12 md:pt-14">
            <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {movieSections[2].eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  {movieSections[2].title}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                {movieSections[2].description}
              </p>
            </div>
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
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Movies - Discover Popular, Top Rated, and Upcoming",
  description: "Discover movies by popularity, rating, and upcoming releases.",
};
