import { notFound } from "next/navigation";
import Image from "next/image";
import { getMovie } from "@/api/db";
import MovieDetailGrid from "@/components/MovieDetailGrid";
import { getMovieDetails } from "@/api/tmdb";
import { FullDetailTMDBMovie } from "@/types";
import { getPosterUrl } from "@/utils";
import MovieCardButtonsSection from "@/components/MovieCardButtonsSection";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tmdb?: string;
  }>;
}

export default async function MoviePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  if (!resolvedParams?.id || isNaN(Number(resolvedParams.id))) {
    notFound();
  }

  const movieId = Number(resolvedParams.id);
  const isTmdb = resolvedSearchParams.tmdb === "true";

  const movie = isTmdb
    ? ((await getMovieDetails(movieId)) as FullDetailTMDBMovie)
    : await getMovie(movieId);

  if (!movie) {
    notFound();
  }

  const posterUrl = getPosterUrl(movie, isTmdb ? "tmdb" : "db");

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="relative aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
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
              {movie.title}
            </h1>

            {isTmdb && (movie as FullDetailTMDBMovie).tagline && (
              <p className="text-xl text-zinc-400 mb-4 italic">
                {(movie as FullDetailTMDBMovie).tagline}
              </p>
            )}

            {movie.release_date && (
              <p className="text-zinc-400 mb-6">
                Released: {new Date(movie.release_date).toLocaleDateString()}
              </p>
            )}

            {movie.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            <MovieDetailGrid
              movie={movie}
              source={isTmdb ? "tmdb" : "db"}
            />

            {/* Add new buttons */}

            <MovieCardButtonsSection
              movie={movie}
              isMovieInDb={!isTmdb}
            />

            {/* <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition-colors font-medium">
                Watch Now
              </button>
              <button className="bg-transparent border border-zinc-700 hover:border-zinc-600 text-white py-3 px-6 rounded-md transition-colors">
                {isTmdb ? "Add to List" : "Remove from List"}
              </button>
            </div> */}
            {/* TODO: Add new buttons */}
          </div>
        </div>
      </div>
    </main>
  );
}
