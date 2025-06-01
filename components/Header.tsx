import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center md:justify-start items-center gap-6 py-5">
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
            href="/profile"
            className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
          >
            Profile
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
          >
            Contact Us
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
          >
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
