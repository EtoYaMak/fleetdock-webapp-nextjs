"use client";
import SignInForm from "@/app/components/auth/SignInForm";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/loads");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="bg-[#111a2e] min-h-screen flex items-center justify-center">
      <SignInForm />
    </main>
  );
}
