export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          About This Project
        </h1>

        <p className="text-zinc-300 mb-8">
          This is a personal project I created to help me keep track of my movie
          and series watching habits. Like many movie enthusiasts, I found
          myself constantly forgetting what I&apos;d watched, losing track of
          recommendations, or wondering when I last saw a particular film.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            Why I Built This
          </h2>
          <p className="text-zinc-300 mb-4">I wanted a simple, clean way to:</p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Log movies and series as I watch them</li>
            <li>Maintain a watchlist for future viewing</li>
            <li>Track my viewing patterns and preferences</li>
            <li>
              Discover new content based on popular and top-rated selections
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            What This Isn&apos;t
          </h2>
          <p className="text-zinc-300">
            This is purely a personal habit-tracking tool. There&apos;s no
            commercial intent, no monetization, and no data collection beyond
            what&apos;s necessary for the app to function. I&apos;m not selling
            anything, promoting content, or trying to compete with existing
            platforms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            Technical Note
          </h2>
          <p className="text-zinc-300">
            Built as a learning project using Next.js 15, this app helps me
            practice modern web development while solving a real personal need.
            The movie data comes from public APIs, and everything is designed
            with simplicity and functionality in mind.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            Just for Fun
          </h2>
          <p className="text-zinc-300 mb-6">
            If you&apos;re visiting this page, you&apos;ve stumbled upon my
            personal movie journal. Feel free to look around, but remember—this
            is just one person&apos;s way of staying organized with their
            entertainment habits. Nothing more, nothing less.
          </p>
          <hr className="my-8 border-zinc-800" />
          <p className="text-zinc-400 italic">Happy watching!</p>
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "About – Movie Tracker",
  description:
    "About this personal movie and series tracker: goals, non-goals, and technical notes.",
};
