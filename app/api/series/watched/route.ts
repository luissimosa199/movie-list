import { NextResponse } from "next/server";
import { markSeriesAsWatched, getSeriesByTmdbId } from "@/api/db";
import { getSeriesDetails } from "@/api/tmdb";
import type { TMDBSeries } from "@/types";

interface TMDBSeriesDetails extends TMDBSeries {
    genres: Array<{ id: number; name: string }>;
    number_of_episodes: number;
    number_of_seasons: number;
    last_air_date: string | null;
}

export async function PATCH(request: Request) {
    try {
        const { id, now, isSeriesInDb } = (await request.json()) as {
            id: number;
            now: Date;
            isSeriesInDb: boolean;
        };

        if (isSeriesInDb) {
            const dbId = (await getSeriesByTmdbId(id))?.id ?? id;
            const result = await markSeriesAsWatched({ id: dbId }, new Date(now), true);
            return NextResponse.json(result);
        }

        const seriesData = (await getSeriesDetails(id)) as TMDBSeriesDetails;

        const result = await markSeriesAsWatched(
            {
                id: seriesData.id,
                name: seriesData.name,
                overview: seriesData.overview,
                first_air_date: seriesData.first_air_date
                    ? new Date(seriesData.first_air_date)
                    : null,
                last_air_date: seriesData.last_air_date
                    ? new Date(seriesData.last_air_date)
                    : null,
                number_of_episodes: seriesData.number_of_episodes ?? null,
                number_of_seasons: seriesData.number_of_seasons ?? null,
                genres: seriesData.genres?.map((g) => g.name) ?? [],
                poster_path: seriesData.poster_path,
            },
            new Date(now),
            false
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error marking series as watched:", error);
        return NextResponse.json(
            { error: "Failed to mark series as watched" },
            { status: 500 }
        );
    }
}


