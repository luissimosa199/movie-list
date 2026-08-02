import SeriesCardWrapper from "@/components/SeriesCardWrapper";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import { getPopularSeries } from "@/api/tmdb";
import SeriesSearchBar from "@/components/SeriesSearchBar";

export default async function SeriesPage() {
  const popularSeries = await getPopularSeries(1, 20);

  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-10 md:space-y-14">
        <section className="relative z-30 overflow-visible rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(10,14,22,0.92))] px-5 py-6 shadow-2xl shadow-black/20 md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute -right-6 top-0 h-40 w-40 rounded-full bg-sky-500/12 blur-3xl" />
            <div className="absolute left-0 top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)] xl:items-end">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                Series
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Keep series organized.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                Search fast, then browse series.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">Popular series</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">TMDB search</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">Consistent layout</span>
                </div>
              </div>
            </div>

            <div className="relative z-[80] overflow-visible rounded-[1.5rem] border border-blue-400/20 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(59,130,246,0.12),rgba(217,70,239,0.14))] p-4 shadow-lg shadow-blue-950/20 focus-within:z-[140] has-[input:not(:placeholder-shown)]:z-[140] md:p-5">
              <div className="absolute inset-0">
                <div className="absolute -right-6 top-0 h-24 w-24 rounded-full bg-fuchsia-500/16 blur-2xl" />
                <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-blue-400/16 blur-2xl" />
              </div>
              <p className="relative z-10 mb-3 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-blue-100/80">
                Search
              </p>
              <div className="relative z-10">
                <SeriesSearchBar />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                Spotlight
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Popular series
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
              Strong starters.
            </p>
          </div>

          <ClientGridWrapper>
            {popularSeries.results.map((series) => (
              <SeriesCardWrapper
                key={series.id}
                series={series}
                source="tmdb"
              />
            ))}
          </ClientGridWrapper>
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Series - Movie Tracker",
  description:
    "Browse popular TV series.",
};
