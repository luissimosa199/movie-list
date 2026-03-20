import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getMovie, movieExistsInDb } from "@/api/db";
import MovieDetailGrid from "@/components/MovieDetailGrid";
import { getMovieDetails } from "@/api/tmdb";
import { FullDetailTMDBMovie, TMDBVideo } from "@/types";
import { getPosterUrl } from "@/utils";
import MovieCardButtonsSection from "@/components/MovieCardButtonsSection";
import CastSection from "@/components/CastSection";
import { getMovieWatchedStatus } from "@/lib/actions";
import { getCurrentUser, requireUser } from "@/lib/auth-session";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tmdb?: string;
  }>;
}

function compareTrailerCandidates(a: TMDBVideo, b: TMDBVideo) {
  if (a.official !== b.official) {
    return a.official ? -1 : 1;
  }

  const publishedAtA = a.published_at ? new Date(a.published_at).getTime() : 0;
  const publishedAtB = b.published_at ? new Date(b.published_at).getTime() : 0;
  if (publishedAtA !== publishedAtB) {
    return publishedAtB - publishedAtA;
  }

  return b.size - a.size;
}

function getFeaturedTrailer(videos?: TMDBVideo[]) {
  if (!videos?.length) {
    return null;
  }

  const youtubeVideos = videos.filter(
    (video) => video.site === "YouTube" && video.key
  );

  if (!youtubeVideos.length) {
    return null;
  }

  const trailers = youtubeVideos
    .filter((video) => video.type === "Trailer")
    .sort(compareTrailerCandidates);
  if (trailers.length) {
    return trailers[0];
  }

  const teasers = youtubeVideos
    .filter((video) => video.type === "Teaser")
    .sort(compareTrailerCandidates);
  if (teasers.length) {
    return teasers[0];
  }

  return [...youtubeVideos].sort(compareTrailerCandidates)[0];
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
    const user = await getCurrentUser();
    const userId = user?.id ?? null;

    if (!isTmdb && !userId) {
      return {
        title: "Movie Details",
        description: "Sign in to view your saved movie details.",
      };
    }

    let movie: FullDetailTMDBMovie | Awaited<ReturnType<typeof getMovie>>;
    if (isTmdb) {
      movie = (await getMovieDetails(movieId)) as FullDetailTMDBMovie;
    } else {
      movie = await getMovie(userId!, movieId);
    }

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
  const user = isTmdb ? await getCurrentUser() : await requireUser(`/movies/${movieId}`);

  let movie: FullDetailTMDBMovie | Awaited<ReturnType<typeof getMovie>>;
  if (isTmdb) {
    movie = (await getMovieDetails(movieId)) as FullDetailTMDBMovie;
  } else {
    movie = await getMovie(user!.id, movieId);
  }

  if (!movie) {
    notFound();
  }

  // Check if movie is in database
  const isMovieInDb = isTmdb
    ? user
      ? await movieExistsInDb(user.id, movieId)
      : false
    : movie.id;

  // For TMDB movies, check if they have been watched by the user
  const watchedMovie = isTmdb && user ? await getMovieWatchedStatus(movieId) : null;

  // For database movies, fetch TMDB data for cast/crew information
  let tmdbData: FullDetailTMDBMovie | null = null;
  if (!isTmdb && "tmdb_id" in movie && movie.tmdb_id) {
    try {
      tmdbData = await getMovieDetails(movie.tmdb_id);
    } catch (error) {
      console.error("Failed to fetch TMDB data for cast/crew:", error);
    }
  }

  const posterUrl = getPosterUrl(movie, isTmdb ? "tmdb" : "db");
  const trailerSource = isTmdb ? (movie as FullDetailTMDBMovie) : tmdbData;
  const availableVideos = trailerSource?.videos?.results ?? [];
  const featuredTrailer = getFeaturedTrailer(availableVideos);
  const embedUrl = featuredTrailer
    ? `https://www.youtube-nocookie.com/embed/${featuredTrailer.key}`
    : null;

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
            {(() => {
              // Get credits from either TMDB movie or fetched TMDB data
              const credits = isTmdb
                ? (movie as FullDetailTMDBMovie).credits
                : tmdbData?.credits;

              if (!credits) return null;

              return (
                <div className="mb-8">
                  {/* Director */}
                  {(() => {
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
                    const cast = credits?.cast?.slice(0, 9) || [];

                    return <CastSection cast={cast} />;
                  })()}
                </div>
              );
            })()}

            <section className="mb-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.88),rgba(7,10,18,0.96))] shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
              <div className="border-b border-white/8 px-5 py-4 md:px-6">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  Featured Video
                </p>
                <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Trailer
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                      A quick look at the film before you commit to list actions
                      or a rewatch.
                    </p>
                  </div>
                  {featuredTrailer ? (
                    <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-red-200">
                      {featuredTrailer.official
                        ? "Official trailer"
                        : featuredTrailer.type}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-4 md:p-6">
                {embedUrl ? (
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/40 shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
                    <div className="aspect-video">
                      <iframe
                        src={embedUrl}
                        title={`${movie.title} trailer`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex flex-col gap-2 border-t border-white/8 bg-white/[0.03] px-4 py-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {featuredTrailer?.name || "Trailer"}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          YouTube embed selected from TMDB videos
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {featuredTrailer?.published_at
                          ? `Published ${new Date(
                              featuredTrailer.published_at
                            ).toLocaleDateString()}`
                          : "Playback uses the most suitable available video"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-black/25 px-5 py-8 text-center md:px-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M15.75 10.5 10.5 7.5v9l5.25-3Zm6 1.5c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25 21.75 6.615 21.75 12Z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      No embeddable trailer available
                    </h3>
                    <p className="mt-2 max-w-xl mx-auto text-sm leading-6 text-zinc-400">
                      {availableVideos.length > 0
                        ? "TMDB returned video entries for this movie, but none were usable as a YouTube trailer or teaser embed."
                        : "TMDB does not currently provide trailer or teaser video data for this title."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <MovieDetailGrid
              movie={movie}
              source={isTmdb ? "tmdb" : "db"}
            />

            {/* Add new buttons */}

            <MovieCardButtonsSection
              movie={movie}
              isMovieInDb={isMovieInDb}
              watchedMovie={watchedMovie}
              className="sm:max-w-lg sm:grid-cols-2"
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
