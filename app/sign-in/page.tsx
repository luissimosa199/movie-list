import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getServerSession } from "@/lib/auth-session";

type SignInPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getServerSession();
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/profile";

  if (session) {
    redirect(redirectTo);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
        <AuthForm mode="sign-in" redirectTo={redirectTo} />
      </div>
    </main>
  );
}
