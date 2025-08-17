import { NextRequest, NextResponse } from "next/server";
import { discoverMoviesWithRandom, buildDiscoverParams } from "@/api/tmdb";
import { RecommendationFilters } from "@/types";

export async function POST(request: NextRequest) {
    try {
        const filters: RecommendationFilters = await request.json();

        // Build discover parameters from filters
        const discoverParams = buildDiscoverParams(filters);

        // Get random movie using TMDB discover API
        const movie = await discoverMoviesWithRandom(discoverParams);

        return NextResponse.json(movie);
    } catch (error) {
        console.error("Error getting random recommendation:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to get movie recommendation";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
