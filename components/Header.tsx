import Link from "next/link";
import ViewToggle from "./ViewToggle";
import AuthButtons from "./AuthButtons";
import { getServerSession } from "@/lib/auth-session";

export default async function Header() {
  const session = await getServerSession();

  return (
    <header className="bg-black text-white border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-5">
          <div className="flex justify-center md:justify-start items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/series"
              className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
            >
              Series
            </Link>
            <Link
              href="/movies"
              className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
            >
              Movies
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <AuthButtons isSignedIn={Boolean(session)} />
            <ViewToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
