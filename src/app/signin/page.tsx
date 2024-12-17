"use client";
import SignInForm from "@/components/auth/SignInForm";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";
export default function SigninPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/loads");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </main>
  );
}
