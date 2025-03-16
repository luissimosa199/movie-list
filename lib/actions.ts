import { Movie, TMDBMovie } from "@/types";

export async function addMovie(movie: TMDBMovie): Promise<Movie> {
  const response = await fetch("/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    throw new Error("Failed to add movie");
  }

  return response.json();
}

export async function removeMovie(id: number): Promise<Movie> {
  const response = await fetch("/api/movies", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove movie");
  }

  return response.json();
}

export async function markMovieAsWatched(
  id: number,
  now: Date,
  isMovieInDb: boolean
): Promise<Movie> {
  const response = await fetch("/api/movies/watched", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, now, isMovieInDb }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark movie as watched");
  }

  return response.json();
}

export async function updateMovieScore(
  id: number,
  score: number
): Promise<Movie> {
  const response = await fetch("/api/movies/score", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, score }),
  });

  if (!response.ok) {
    throw new Error("Failed to update movie score");
  }

  return response.json();
}
