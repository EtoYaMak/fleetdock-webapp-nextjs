// src/app/signup/page.tsx
"use client";
import SignUpForm from "@/components/auth/SignUpForm";
import Loading from "./loading";
import { Suspense } from "react";
import { useState, useEffect } from "react";
export default function SignupPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <main className="min-h-screen flex items-center justify-center relative">
        {isClient ? <SignUpForm /> : <Loading />}
      </main>
    </Suspense>
  );
}
