import { TMDBMovie, RecommendationFilters, Genre } from "@/types";

// Cache for genres to avoid repeated API calls
let genreCache: Genre[] | null = null;

export async function getGenreList(): Promise<Genre[]> {
    if (!genreCache) {
        const response = await fetch("/api/genres/movies");
        if (!response.ok) {
            throw new Error("Failed to fetch genres");
        }
        genreCache = await response.json();
    }
    return genreCache || [];
}

export async function getRandomRecommendation(
    filters: RecommendationFilters
): Promise<TMDBMovie> {
    try {
        const response = await fetch("/api/movies/random", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to get recommendation");
        }

        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error("Error getting random recommendation:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to get movie recommendation. Please try again or adjust your filters.";
        throw new Error(errorMessage);
    }
}

export async function getSurpriseMeRecommendation(): Promise<TMDBMovie> {
    // Get completely random movie with minimal constraints
    const surpriseFilters: RecommendationFilters = {
        genres: [], // No genre restriction
        yearRange: [1950, new Date().getFullYear()], // Wide year range
        minRating: 5.0, // Very low rating threshold for variety
        excludeWatched: false
    };

    return getRandomRecommendation(surpriseFilters);
}

export function getDefaultFilters(): RecommendationFilters {
    const currentYear = new Date().getFullYear();
    return {
        genres: [], // All genres selected by default
        yearRange: [1990, currentYear], // Last ~30 years
        minRating: 6.0, // Good quality baseline
        excludeWatched: false
    };
}

export function validateFilters(filters: RecommendationFilters): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Validate year range
    const [minYear, maxYear] = filters.yearRange;
    const currentYear = new Date().getFullYear();

    if (minYear < 1900 || minYear > currentYear) {
        errors.push("Start year must be between 1900 and current year");
    }

    if (maxYear < minYear || maxYear > currentYear + 5) {
        errors.push("End year must be after start year and not more than 5 years in the future");
    }

    // Validate rating
    if (filters.minRating < 0 || filters.minRating > 10) {
        errors.push("Rating must be between 0 and 10");
    }

    // Validate genres (basic check)
    if (filters.genres.some(id => id < 0)) {
        errors.push("Invalid genre selection");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function buildFilterSummary(filters: RecommendationFilters, genres: Genre[]): string {
    const parts: string[] = [];

    // Genre summary
    if (filters.genres.length === 0) {
        parts.push("All genres");
    } else if (filters.genres.length <= 3) {
        const genreNames = filters.genres
            .map(id => genres.find(g => g.id === id)?.name)
            .filter(Boolean);
        parts.push(genreNames.join(", "));
    } else {
        parts.push(`${filters.genres.length} genres`);
    }

    // Year range summary
    const [minYear, maxYear] = filters.yearRange;
    if (minYear === maxYear) {
        parts.push(`${minYear}`);
    } else {
        parts.push(`${minYear}-${maxYear}`);
    }

    // Rating summary
    if (filters.minRating > 0) {
        parts.push(`${filters.minRating}+ rating`);
    }

    return parts.join(" • ");
}

// History management for showing recent recommendations
export class RecommendationHistory {
    private static readonly STORAGE_KEY = "movie-recommendation-history";
    private static readonly MAX_HISTORY = 5;

    static save(movie: TMDBMovie): void {
        if (typeof window === 'undefined') return;

        try {
            const history = this.load();

            // Remove if already exists to avoid duplicates
            const filtered = history.filter(m => m.id !== movie.id);

            // Add to beginning
            const newHistory = [movie, ...filtered].slice(0, this.MAX_HISTORY);

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
        } catch (error) {
            console.warn("Failed to save recommendation history:", error);
        }
    }

    static load(): TMDBMovie[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn("Failed to load recommendation history:", error);
            return [];
        }
    }

    static clear(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.warn("Failed to clear recommendation history:", error);
        }
    }
}
