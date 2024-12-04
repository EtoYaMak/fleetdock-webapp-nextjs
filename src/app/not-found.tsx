"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#203152]/10 to-[#4895d0]/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#4895d0] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-6xl font-bold text-[#f1f0f3] mb-4">404</h2>
          <p className="text-xl text-[#f1f0f3] mb-8">Page not found</p>
          <p className="text-[#f1f0f3] mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            href={user ? "/dashboard" : "/"}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back {user ? "to dashboard" : "home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
