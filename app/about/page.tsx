const pillars = [
  {
    number: "01",
    title: "Why it exists",
    body:
      "The app keeps watch history, watchlist ideas, and decision-making in one place so movie and series tracking feels immediate instead of scattered.",
  },
  {
    number: "02",
    title: "What it is not",
    body:
      "It is not a public platform, a monetized catalog, or a social feed. It is a private utility built to stay focused on personal use.",
  },
  {
    number: "03",
    title: "How it is built",
    body:
      "The experience is shaped with Next.js, public movie data, and a dark editorial layout that favors clarity, density, and low-friction browsing.",
  },
];

const facts = [
  {
    label: "Purpose",
    value: "Track movies and series without losing the thread",
  },
  {
    label: "Tone",
    value: "Cinematic, quiet, and intentionally structured",
  },
  {
    label: "Focus",
    value: "Useful pages first, decoration only when it earns its place",
  },
];

const notes = [
  {
    label: "Use case",
    value: "Keep track of what has been watched and what to watch next.",
  },
  {
    label: "Experience",
    value: "Dark surfaces, stronger hierarchy, and a calmer reading rhythm.",
  },
  {
    label: "Data source",
    value: "Public movie APIs and app-specific user actions.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,12,19,0.96))] px-5 py-6 shadow-2xl shadow-black/20 md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-blue-500/12 blur-3xl" />
            <div className="absolute right-0 top-8 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.85fr)] lg:items-end">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                About the project
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                A personal film notebook with a clearer frame.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                This project keeps movie and series tracking in one place so the
                experience feels curated, searchable, and easy to return to. The
                layout is intentionally editorial: enough atmosphere to feel
                finished, enough restraint to stay useful.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2"
                  >
                    <span className="text-zinc-500">{fact.label}: </span>
                    <span className="text-white">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 md:p-6">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                Project frame
              </p>
              <div className="mt-4 space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.label}
                    className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                      {note.label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-300">
                      {note.value}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:gap-5 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.number}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.95),rgba(10,14,22,0.95))] p-5 shadow-xl shadow-black/15 md:p-6"
            >
              <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-blue-500/30 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                    {pillar.number}
                  </p>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-[0.98rem]">
                  {pillar.body}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <article className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6 md:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
              Reading room
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Built for personal use, but presented like a finished product.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              The goal is simple: keep the utility fast enough for everyday use
              while giving the app enough visual structure to feel deliberate.
              That means cleaner spacing, more confident typography, and pages
              that read like part of the same system rather than isolated
              placeholders.
            </p>

            <div className="mt-6 border-t border-white/8 pt-6">
              <p className="text-sm leading-7 text-zinc-400">
                If you are here for the architecture, the important detail is
                the balance between density and calm. The interface should help
                you browse, decide, and come back later without having to relearn
                the layout each time.
              </p>
            </div>
          </article>

          <aside className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,25,38,0.92),rgba(12,16,24,0.92))] p-6 md:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
              Practical notes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
              <li className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                The app does not try to be a social network or a recommendation
                engine for everyone.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                It is optimized around personal logging, browsing, and quick
                decision-making.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                The design stays dark and cinematic so the shell, search, and
                cards all feel related.
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-sm text-zinc-400">
              A compact tool, presented with a little more care.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "About - Movie Tracker",
  description:
    "About this personal movie and series tracker: purpose, boundaries, and technical context.",
};
