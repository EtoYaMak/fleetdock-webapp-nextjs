"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SideNav from "./components/SideNav";
import BasicProfile from "./components/BasicProfile";
import RegisterVehicle from "./components/vehicles/RegisterVehicle";
import BrokerProfile from "./components/BrokerProfile";
import TruckerProfile from "./components/TruckerProfile";
import ViewVehicles from "./components/vehicles/ViewVehicles";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <BasicProfile />;
      case "vehicles":
        return <ViewVehicles />;
      case "register-vehicle":
        return <RegisterVehicle />;
      case "company":
        return profile?.role === "broker" ? <BrokerProfile /> : null;
      case "trucker":
        return profile?.role === "trucker" ? <TruckerProfile /> : null;
      default:
        return <BasicProfile />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
}
