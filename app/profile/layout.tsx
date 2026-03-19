import { ReactNode } from "react";
import { requireSession } from "@/lib/auth-session";

type ProfileLayoutProps = {
  children: ReactNode;
};

export default async function ProfileLayout({
  children,
}: ProfileLayoutProps) {
  await requireSession("/profile");

  return children;
}
