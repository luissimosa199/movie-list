import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateSeriesScore } from "@/api/db";
import { getRequestUser } from "@/lib/auth-session";

export async function PATCH(request: Request) {
    try {
        const user = await getRequestUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, score } = (await request.json()) as {
            id: number;
            score: number;
        };

        const result = await updateSeriesScore(user.id, id, score);

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

