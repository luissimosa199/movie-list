import SeriesCard from "@/components/SeriesCard";
import { getPopularSeries } from "@/api/tmdb";

export default async function SeriesPage() {
  const popularSeries = await getPopularSeries(1, 20);

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight">
          TV Series
        </h1>

        <div className="container mx-auto py-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
            Popular TV Series
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularSeries.results.map((series) => (
              <SeriesCard
                key={series.id}
                series={series}
                source="tmdb"
              />
            ))}
          </div>
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
