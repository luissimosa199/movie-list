import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Discovery – Smart Movie Recommendations",
  description:
    "Random picks with filters.",
};

export default function RandomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
