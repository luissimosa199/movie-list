import SeriesCardWrapper from "@/components/SeriesCardWrapper";
import ClientGridWrapper from "@/components/ClientGridWrapper";
import { getPopularSeries } from "@/api/tmdb";
import SeriesSearchBar from "@/components/SeriesSearchBar";

export default async function SeriesPage() {
  const popularSeries = await getPopularSeries(1, 20);

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <SeriesSearchBar />
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          TV Series
        </h1>

        <div className="container mx-auto py-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
            Popular TV Series
          </h2>
          <ClientGridWrapper>
            {popularSeries.results.map((series) => (
              <SeriesCardWrapper
                key={series.id}
                series={series}
                source="tmdb"
              />
            ))}
          </ClientGridWrapper>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Series – Discover Popular TV Series",
  description:
    "Browse and discover popular TV series to add to your watchlist.",
};
