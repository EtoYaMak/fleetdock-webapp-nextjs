"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );
  const { user, loading } = useAuth();
  if (!user) redirect("/");


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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
