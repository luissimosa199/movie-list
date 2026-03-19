"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/about", label: "About" },
];

type NavLinksProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks({
  mobile = false,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className={mobile ? "space-y-2" : "flex items-center gap-2"}>
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={
              mobile
                ? `flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium ${
                    active
                      ? "border-primary/35 bg-primary/12 text-white"
                      : "border-white/8 bg-white/4 text-zinc-300 hover:border-white/16 hover:bg-white/8 hover:text-white"
                  }`
                : `rounded-full px-3 py-2 text-sm font-medium tracking-[0.04em] ${
                    active
                      ? "bg-white/10 text-white shadow-sm shadow-black/20"
                      : "text-zinc-400 hover:bg-white/6 hover:text-white"
                  }`
            }
          >
            <span>{item.label}</span>
            {mobile ? (
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Go
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
