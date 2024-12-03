"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <main className=" min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#f1f0f3] leading-tight">
            Revolutionize Your Logistics
          </h1>
          <p className="mt-4 text-lg text-[#f1f0f3]">
            Simplify freight management with cutting-edge technology. Whether
            you&apos;re a trucker or a broker, we&apos;ve got you covered.
          </p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-block px-6 py-3 bg-[#4895d0] text-[#f1f0f3] text-lg font-medium rounded-3xl hover:bg-[#4895d0]/80"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
