"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { isTrucker, isBroker } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on role
      if (isTrucker) {
        router.replace("/dashboard/trucker");
      } else if (isBroker) {
        router.replace("/dashboard/broker");
      }
    }
  }, [isLoading, user, isTrucker, isBroker, router]);

  // Show loading state while checking auth
  if (isLoading || user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only show landing page content for non-authenticated users
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Revolutionize Your Logistics
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Simplify freight management with cutting-edge technology. Whether
            you're a trucker or a broker, we've got you covered.
          </p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
