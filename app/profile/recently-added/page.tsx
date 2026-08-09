import { getRecentlyAddedProfileFeed } from "@/api/db";
import DiscoverySearchSection from "@/components/DiscoverySearchSection";
import ProfileFeed from "@/components/ProfileFeed";
import { requireUser } from "@/lib/auth-session";
import { ProfileFeedItem } from "@/types";
import Link from "next/link";

export default async function RecentlyAddedPage() {
  const user = await requireUser("/profile/recently-added");
  const { movies, series } = await getRecentlyAddedProfileFeed(user.id);
  const items: ProfileFeedItem[] = [
    ...movies.map((movie) => ({
      mediaType: "movie" as const,
      movie,
      activityDate: movie.created_at,
    })),
    ...series.map((seriesItem) => ({
      mediaType: "series" as const,
      series: seriesItem,
      activityDate: seriesItem.created_at,
    })),
  ];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="container mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <Link
            href="/profile"
            className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>

        <h1 className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
          Recently added
        </h1>

        <DiscoverySearchSection
          className="mb-10"
          eyebrow="Lookup"
          title="Search while reviewing additions."
          description="Jump to another title without losing place."
        />

        <ProfileFeed
          items={items}
          feedType="recently-added"
          emptyTitle="No titles in your list yet"
          emptyDescription="Add movies or series to your list and they will appear here."
          emptyActionLabel="Browse movies"
          emptyActionHref="/movies"
        />
      </div>
    </main>
  );
}
