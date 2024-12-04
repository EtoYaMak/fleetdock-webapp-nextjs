"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BrokerDash from "./components/BrokerDash";
import TruckerDash from "./components/TruckerDash";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userRole = user?.role;

  if (userRole === "broker") {
    return <BrokerDash />;
  }

  if (userRole === "trucker") {
    return <TruckerDash />;
  }

  return (
    <div className="min-h-screen bg-[#203152] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#4895d0] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-xl font-medium text-[#f1f0f3] mb-4">
            Invalid Role!
          </h2>
          <p className="text-[#f1f0f3]">
            Your account doesn't have a valid role assigned.
          </p>
        </div>
      </div>
    </div>
  );
}
