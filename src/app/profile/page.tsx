"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SideNav from "./components/SideNav";
import BrokerProfile from "./components/BrokerProfile";
import TruckerProfile from "./components/TruckerProfile";
import { useAuth } from "@/hooks/useAuth";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const { profile } = useAuth();

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  // Listen for URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        {profile?.role === "broker" ? (
          <BrokerProfile activeTab={activeTab} />
        ) : (
          <TruckerProfile activeTab={activeTab} />
        )}
      </div>
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
