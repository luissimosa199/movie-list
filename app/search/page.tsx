import CatalogSearchPage from "@/components/search/CatalogSearchPage";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return <CatalogSearchPage initialQuery={params.q ?? ""} />;
}

export const metadata = {
  title: "Search - Movie Tracker",
  description: "Search movies, series, actors, and directors.",
};
