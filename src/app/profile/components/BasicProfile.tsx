"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import BrokerProfile from "./BrokerProfile";
import TruckerProfile from "./TruckerProfile";

const BasicProfile = () => {
  const { user, loading: isLoading, error } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="basic-profile">
      {user.role === "broker" ? (
        <BrokerProfile
          activeTab="profile"
          isLoading={isLoading}
          error={error}
        />
      ) : user.role === "trucker" ? (
        <TruckerProfile activeTab="profile" />
      ) : (
        <div className="text-center text-gray-600">Invalid user role</div>
      )}
    </div>
  );
};

export default BasicProfile;
