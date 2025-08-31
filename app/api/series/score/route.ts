import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { Series } from "@/types";

export async function PATCH(request: Request) {
    try {
        const { id, score } = (await request.json()) as {
            id: number;
            score: number;
        };

        const result = (await prisma.series.update({
            where: { id },
            data: { score },
        })) as Series;

        // Revalidate cache for affected pages
        revalidatePath("/series");
        revalidatePath(`/series/${id}`);
        revalidatePath("/profile/recently-added");
        revalidatePath("/profile/latest-watched");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating series score:", error);
        return NextResponse.json(
            { error: "Failed to update series score" },
            { status: 500 }
        );
    }
}


