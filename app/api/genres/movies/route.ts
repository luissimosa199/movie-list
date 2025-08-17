import { NextResponse } from "next/server";
import { getGenres } from "@/api/tmdb";

export async function GET() {
    try {
        const genres = await getGenres();
        return NextResponse.json(genres);
    } catch (error) {
        console.error("Error fetching genres:", error);
        return NextResponse.json(
            { error: "Failed to fetch genres" },
            { status: 500 }
        );
    }
}
