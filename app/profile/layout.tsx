import { ReactNode } from "react";
import { requireUser } from "@/lib/auth-session";

type ProfileLayoutProps = {
  children: ReactNode;
};

export default async function ProfileLayout({
  children,
}: ProfileLayoutProps) {
  await requireUser("/profile");

  return children;
}
