import { NextResponse } from "next/server";
import { searchPeople } from "@/api/tmdb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const people = await searchPeople(query, page, limit);
    return NextResponse.json(people);
  } catch (error) {
    console.error("Error searching people:", error);
    return NextResponse.json(
      { error: "Failed to search people" },
      { status: 500 }
    );
  }
}
