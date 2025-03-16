import { TMDBMovie } from "@/types";
import { Movie } from "@/types";

// Helper function to get the poster URL based on source
export const getPosterUrl = (
  movie: Movie | TMDBMovie,
  source: "db" | "tmdb"
) => {
  if (source === "db") {
    return (movie as Movie).poster_url;
  }
  return (movie as TMDBMovie).poster_path
    ? `https://image.tmdb.org/t/p/w500${(movie as TMDBMovie).poster_path}`
    : null;
};

// Helper function to get the release date based on source
export const getFormattedDate = (
  date: string | Date | null | undefined,
  source: "db" | "tmdb"
) => {
  if (!date) return "No date available";

  const parsedDate =
    source === "db" ? new Date(date as Date) : new Date(date as string);

  return parsedDate.toLocaleDateString();
};

export const formatCardDate = (date: string) => {
  return date.slice(0, 10).split("-").reverse().join("/");
};

// Helper function to get genres based on source
export const getGenres = (movie: Movie | TMDBMovie, source: "db" | "tmdb") => {
  if (source === "db") {
    return (movie as Movie).genres;
  }
  // Note: You might want to map genre_ids to actual genre names for TMDB movies
  return null;
};
