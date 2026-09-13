import SeriesCardWrapper from "@/components/SeriesCardWrapper";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import { getPopularSeries } from "@/api/tmdb";

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

          <div className="relative z-10">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
              Series
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              Keep series organized.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              Browse popular series.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                <span className="text-white">Popular series</span>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                <span className="text-white">Consistent layout</span>
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
