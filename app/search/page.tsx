import SearchPageClient from "@/components/search/SearchPageClient";

type SearchType = "movie" | "series" | "actor" | "director";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
}

function getInitialType(type?: string): SearchType {
  if (
    type === "movie" ||
    type === "series" ||
    type === "actor" ||
    type === "director"
  ) {
    return type;
  }

  return "movie";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <SearchPageClient
      initialQuery={params.q ?? ""}
      initialType={getInitialType(params.type)}
    />
  );
}

export const metadata = {
  title: "Search - Movies, Series, Actors, and Directors",
  description:
    "Search movies, series, actors, and directors across the catalog.",
};
