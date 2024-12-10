"use client";

import { memo, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import BrokerDashboard from "./components/BrokerDashboard";
import TruckerDashboard from "./components/TruckerDashboard";
const InvalidRole = memo(function InvalidRole() {
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
});

const Dashboard = memo(function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" color="border-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  const roleComponents = {
    broker: <BrokerDashboard />,
    trucker: <TruckerDashboard />,
  };

  return (
    roleComponents[user.role as keyof typeof roleComponents] || <InvalidRole />
  );
});

export default Dashboard;
