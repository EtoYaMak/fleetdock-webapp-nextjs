"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SideNav from "./components/SideNav";
import BrokerProfile from "./components/BrokerProfile";
import TruckerProfile from "./components/TruckerProfile";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isLoading: profileLoading, error: profileError } = useProfile();

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url);
    }
  };

  // Listen for URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 min-h-screen">
      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} />
      {user?.role === "broker" ? (
        <BrokerProfile
          activeTab={activeTab}
          isLoading={profileLoading}
          error={profileError}
        />
      ) : (
        <TruckerProfile activeTab={activeTab} />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
