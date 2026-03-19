import React from "react";

interface DecisionHeroProps {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: "red" | "blue" | "purple";
  children?: React.ReactNode;
}

const accentStyles = {
  red: {
    glowA: "bg-red-500/14",
    glowB: "bg-orange-500/10",
    badge: "border-red-400/20 bg-red-500/10 text-red-200",
  },
  blue: {
    glowA: "bg-blue-500/14",
    glowB: "bg-cyan-500/10",
    badge: "border-blue-400/20 bg-blue-500/10 text-blue-200",
  },
  purple: {
    glowA: "bg-purple-500/14",
    glowB: "bg-pink-500/10",
    badge: "border-purple-400/20 bg-purple-500/10 text-purple-200",
  },
};

export default function DecisionHero({
  icon,
  eyebrow,
  title,
  description,
  accent,
  children,
}: DecisionHeroProps) {
  const theme = accentStyles[accent];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(10,14,22,0.94))] px-5 py-6 shadow-2xl shadow-black/25 md:px-8 md:py-8">
      <div className="absolute inset-0">
        <div className={`absolute -left-10 top-0 h-40 w-40 rounded-full blur-3xl ${theme.glowA}`} />
        <div className={`absolute right-0 top-6 h-36 w-36 rounded-full blur-3xl ${theme.glowB}`} />
      </div>

      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-end">
        <div>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
            {eyebrow}
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border text-3xl ${theme.badge}`}>
              {icon}
            </div>
            <div>
              <h1 className="max-w-4xl text-[2.65rem] font-semibold leading-[0.95] tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>

        {children ? <div className="relative z-10">{children}</div> : null}
      </div>
    </section>
  );
}
