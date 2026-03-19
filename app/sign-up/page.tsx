import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getServerSession } from "@/lib/auth-session";

type SignUpPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession();
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/profile";

  if (session) {
    redirect(redirectTo);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
        <AuthForm mode="sign-up" redirectTo={redirectTo} />
      </div>
    </main>
  );
}
