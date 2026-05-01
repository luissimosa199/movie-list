import Image from "next/image";
import { notFound } from "next/navigation";
import { getPersonDetails } from "@/api/tmdb";
import { FullDetailTMDBPerson, TMDBPersonCredit } from "@/types";
import PersonCreditsList from "@/components/people/PersonCreditsList";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getCreditDate(credit: TMDBPersonCredit) {
  return credit.media_type === "movie"
    ? credit.release_date
    : credit.first_air_date;
}

function getCreditRole(credit: TMDBPersonCredit) {
  return credit.character || credit.job || credit.department || "Credit";
}

function getBirthYear(person: FullDetailTMDBPerson) {
  return person.birthday ? new Date(person.birthday).getFullYear() : null;
}

function sortCreditsLatestFirst(credits: TMDBPersonCredit[]) {
  return [...credits].sort((a, b) => {
    const dateA = getCreditDate(a);
    const dateB = getCreditDate(b);
    const timeA = dateA ? new Date(dateA).getTime() : 0;
    const timeB = dateB ? new Date(dateB).getTime() : 0;
    return timeB - timeA;
  });
}

function getUniqueCredits(credits: TMDBPersonCredit[]) {
  const uniqueCredits = new Map<string, TMDBPersonCredit>();

  for (const credit of credits) {
    const key = `${credit.media_type}-${credit.id}`;
    const existingCredit = uniqueCredits.get(key);

    if (!existingCredit) {
      uniqueCredits.set(key, credit);
      continue;
    }

    const existingRole = getCreditRole(existingCredit);
    const nextRole = getCreditRole(credit);
    if (existingRole === "Credit" && nextRole !== "Credit") {
      uniqueCredits.set(key, credit);
    }
  }

  return Array.from(uniqueCredits.values());
}

export default async function PersonPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams?.id || isNaN(Number(resolvedParams.id))) {
    notFound();
  }

  const personId = Number(resolvedParams.id);
  const person = (await getPersonDetails(personId)) as FullDetailTMDBPerson;

  if (!person) {
    notFound();
  }

  const birthYear = getBirthYear(person);
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;
  const allCredits = sortCreditsLatestFirst(
    getUniqueCredits([
      ...(person.combined_credits?.cast ?? []),
      ...(person.combined_credits?.crew ?? []),
    ])
  );
  const actorCredits = sortCreditsLatestFirst(
    getUniqueCredits(person.combined_credits?.cast ?? [])
  );

  return (
    <main className="bg-black text-white min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          <div className="relative aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={`${person.name} profile`}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-zinc-500">
                No Profile Photo
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
              Person
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              {person.name}
            </h1>

            {birthYear && (
              <p className="text-zinc-400 mb-6 text-lg">Born {birthYear}</p>
            )}

            {person.biography && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Biography</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {person.biography}
                </p>
              </div>
            )}

            <PersonCreditsList
              allCredits={allCredits}
              actorCredits={actorCredits}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
