import Link from "next/link";
import { getServerSession } from "@/lib/auth-session";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import ViewToggle from "./ViewToggle";
import HeaderMovieSearch from "./HeaderMovieSearch";

export default async function Header() {
  const session = await getServerSession();
  const isSignedIn = Boolean(session);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/65 text-white backdrop-blur-xl">
      <div className="page-frame">
        <nav className="flex min-h-[4.75rem] items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm font-semibold tracking-[0.18em] text-white shadow-lg shadow-black/30">
                ML
              </span>
              <span className="hidden sm:block">
                <span className="block text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
                  Curated Watchlist
                </span>
                <span className="mt-1 block text-sm font-semibold tracking-[0.04em] text-white">
                  Movie List
                </span>
              </span>
            </Link>

            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>

          <HeaderMovieSearch />

          <div className="hidden items-center gap-3 md:flex">
            <AuthButtons isSignedIn={isSignedIn} />
            <ViewToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <MobileMenu isSignedIn={isSignedIn} />
          </div>
        </nav>
      </div>
    </header>
  );
}
