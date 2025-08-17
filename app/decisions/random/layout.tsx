import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Discovery – Smart Movie Recommendations",
  description:
    "Get perfectly random movie recommendations with smart filtering. Discover hidden gems based on your preferences for genre, year, and rating.",
};

export default function RandomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
