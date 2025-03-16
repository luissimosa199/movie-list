import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Movie } from "@/types";

export async function PATCH(request: Request) {
  try {
    const { id, score } = (await request.json()) as {
      id: number;
      score: number;
    };

    const result = (await prisma.movies.update({
      where: { id },
      data: { score },
    })) as Movie;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating movie score:", error);
    return NextResponse.json(
      { error: "Failed to update movie score" },
      { status: 500 }
    );
  }
}
