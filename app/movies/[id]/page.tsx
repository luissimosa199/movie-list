import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getMovie, movieExistsInDb } from "@/api/db";
import MovieDetailGrid from "@/components/MovieDetailGrid";
import { getMovieDetails } from "@/api/tmdb";
import { FullDetailTMDBMovie } from "@/types";
import { getPosterUrl } from "@/utils";
import MovieCardButtonsSection from "@/components/MovieCardButtonsSection";
import CastSection from "@/components/CastSection";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tmdb?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedParams?.id || isNaN(Number(resolvedParams.id))) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
    };
  }

  const movieId = Number(resolvedParams.id);
  const isTmdb = resolvedSearchParams.tmdb === "true";

  try {
    const movie = isTmdb
      ? ((await getMovieDetails(movieId)) as FullDetailTMDBMovie)
      : await getMovie(movieId);

    if (!movie) {
      return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
      };
    }

    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "";

    const title = `${movie.title}${
      releaseYear ? ` (${releaseYear})` : ""
    } - Movie Details`;
    const description = movie.overview
      ? movie.overview.length > 160
        ? `${movie.overview.substring(0, 157)}...`
        : movie.overview
      : `Watch ${movie.title}${
          releaseYear ? ` (${releaseYear})` : ""
        } and discover amazing movies.`;

    const posterUrl = getPosterUrl(movie, isTmdb ? "tmdb" : "db");
    const fullPosterUrl = posterUrl?.startsWith("http")
      ? posterUrl
      : posterUrl
      ? `https://image.tmdb.org/t/p/w500${posterUrl}`
      : null;

    // Generate keywords from genres
    const keywords = ["movie", "film", "cinema", "watch"];
    if (isTmdb && "genres" in movie && movie.genres) {
      keywords.push(
        ...movie.genres.map((g) =>
          typeof g === "string" ? g.toLowerCase() : g.name.toLowerCase()
        )
      );
    } else if (!isTmdb && "genres" in movie && movie.genres) {
      keywords.push(
        ...movie.genres.map((g) =>
          typeof g === "string" ? g.toLowerCase() : g.name.toLowerCase()
        )
      );
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://your-domain.com" // Replace with your actual domain
        : "http://localhost:3000";

    const currentUrl = `${baseUrl}/movies/${movieId}${
      isTmdb ? "?tmdb=true" : ""
    }`;

    return {
      title,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: "Movie List App" }],
      creator: "Movie List App",
      publisher: "Movie List App",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title,
        description,
        url: currentUrl,
        siteName: "Movie List",
        type: "video.movie",
        images: fullPosterUrl
          ? [
              {
                url: fullPosterUrl,
                width: 500,
                height: 750,
                alt: `${movie.title} poster`,
              },
            ]
          : [],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: fullPosterUrl ? [fullPosterUrl] : [],
        creator: "@yourtwitterhandle", // Replace with your Twitter handle
      },
      alternates: {
        canonical: currentUrl,
      },
      other: {
        "movie:release_date": movie.release_date
          ? typeof movie.release_date === "string"
            ? movie.release_date
            : movie.release_date.toISOString().split("T")[0]
          : "",
        "movie:duration":
          isTmdb && "runtime" in movie ? `${movie.runtime} minutes` : "",
        "movie:rating":
          isTmdb && "vote_average" in movie
            ? movie.vote_average?.toString() || ""
            : "",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Movie Details",
      description: "Discover amazing movies and add them to your watchlist.",
    };
  }
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

  // Check if movie is in database
  const isMovieInDb = isTmdb ? await movieExistsInDb(movieId) : movie.id;

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

            {movie.release_date && (
              <p className="text-zinc-400 mb-4 text-lg">
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            {isTmdb && (movie as FullDetailTMDBMovie).tagline && (
              <p className="text-xl text-zinc-400 mb-4 italic">
                {(movie as FullDetailTMDBMovie).tagline}
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

            {/* Cast and Crew Information */}
            {isTmdb && (movie as FullDetailTMDBMovie).credits && (
              <div className="mb-8">
                {/* Director */}
                {(() => {
                  const credits = (movie as FullDetailTMDBMovie).credits;
                  const directors =
                    credits?.crew
                      ?.filter((member) => member.job === "Director")
                      .slice(0, 3) || [];

                  if (directors.length === 0) return null;

                  return (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">
                        {directors.length === 1 ? "Director" : "Directors"}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {directors.map((director) => (
                          <span
                            key={director.id}
                            className="text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full text-sm"
                          >
                            {director.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Cast */}
                {(() => {
                  const credits = (movie as FullDetailTMDBMovie).credits;
                  const cast = credits?.cast?.slice(0, 9) || [];
                  
                  return <CastSection cast={cast} />;
                })()}
              </div>
            )}

            <MovieDetailGrid
              movie={movie}
              source={isTmdb ? "tmdb" : "db"}
            />

            {/* Add new buttons */}

            <MovieCardButtonsSection
              movie={movie}
              isMovieInDb={isMovieInDb}
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
