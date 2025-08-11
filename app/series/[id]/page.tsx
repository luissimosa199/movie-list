import { notFound } from "next/navigation";
import Image from "next/image";
import { getSeriesDetails } from "@/api/tmdb";
import { FullDetailTMDBSeries } from "@/types";
import { getSeriesPosterUrl } from "@/utils";
import SeriesCardButtonsSection from "@/components/SeriesCardButtonsSection";
import { getSeriesInDbStatus } from "@/lib/actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tmdb?: string;
  }>;
}

export default async function SeriesPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedParams?.id || isNaN(Number(resolvedParams.id))) {
    notFound();
  }

  const seriesId = Number(resolvedParams.id);
  const isTmdb = resolvedSearchParams.tmdb === "true";

  // For now, we only support TMDB series details
  // In the future, we can add database series support
  if (!isTmdb) {
    notFound();
  }

  const series = (await getSeriesDetails(seriesId)) as FullDetailTMDBSeries;
  const dbSeries = await getSeriesInDbStatus(seriesId);

  if (!series) {
    notFound();
  }

  const posterUrl = getSeriesPosterUrl(series, "tmdb");

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="relative aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${series.name} poster`}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-lg">
                No Poster Available
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              {series.name}
            </h1>

            {series.tagline && (
              <p className="text-xl text-zinc-400 mb-4 italic">
                {series.tagline}
              </p>
            )}

            {series.first_air_date && (
              <p className="text-zinc-400 mb-6">
                First Aired:{" "}
                {new Date(series.first_air_date).toLocaleDateString()}
              </p>
            )}

            {series.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {series.overview}
                </p>
              </div>
            )}

            {/* Series Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              {series.genres && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">
                    Genres
                  </h3>
                  <p className="text-zinc-300">
                    {series.genres.map((g) => g.name).join(", ")}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">
                  Seasons
                </h3>
                <p className="text-zinc-300">{series.number_of_seasons}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">
                  Episodes
                </h3>
                <p className="text-zinc-300">{series.number_of_episodes}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">
                  TMDB Rating
                </h3>
                <p className="text-zinc-300">
                  {series.vote_average.toFixed(1)} / 10
                  <span className="text-zinc-500 ml-2">
                    ({series.vote_count} votes)
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">
                  Status
                </h3>
                <p className="text-zinc-300">{series.status}</p>
              </div>

              {series.last_air_date && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">
                    Last Aired
                  </h3>
                  <p className="text-zinc-300">
                    {new Date(series.last_air_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Actions (below details, like movies page) */}
            <SeriesCardButtonsSection
              series={series}
              initialSeriesDbId={dbSeries?.id ?? false}
              watchedSeries={dbSeries ?? null}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
