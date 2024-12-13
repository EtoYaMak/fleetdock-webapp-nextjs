"use client";
import { useState } from "react";
import BrokerProfileForm from "./components/BrokerProfileForm";
import ViewBrokerProfileData from "./components/ViewBrokerProfileData";
import { BrokerBusiness, BrokerFormData } from "@/types/broker";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/auth";
type TabType = "edit" | "view";

export default function BrokerProfile({
  user,
  broker,
  isLoading,
  error,
  createBroker,
  updateBroker,
}: {
  user: User;
  broker: BrokerBusiness;
  isLoading: boolean;
  error: string;
  createBroker: (data: BrokerFormData) => Promise<void>;
  updateBroker: (data: BrokerFormData) => Promise<void>;
}) {
  // const { broker, isLoading, error, createBroker, updateBroker } = useBroker();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("view");

  const handleSubmit = async (data: BrokerFormData) => {
    if (!broker) {
      await createBroker(data);
    } else {
      await updateBroker(data);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const initialData = broker
    ? {
        ...broker,
      }
    : undefined;

  return (
    <div className="flex bg-[#203152] min-h-screen text-[#f1f0f3] px-4">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a2b47] border-r border-[#4895d0]/30 p-4 rounded-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#f1f0f3]">
            Broker Profile
          </h2>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab("view")}
            className={`w-full px-4 py-2 text-left ${
              activeTab === "view"
                ? "bg-[#4895d0]/20 text-[#4895d0] border-l-4 border-[#4895d0]"
                : "text-[#f1f0f3] hover:bg-[#4895d0]/10"
            }`}
          >
            View Profile
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`w-full px-4 py-2 text-left ${
              activeTab === "edit"
                ? "bg-[#4895d0]/20 text-[#4895d0] border-l-4 border-[#4895d0]"
                : "text-[#f1f0f3] hover:bg-[#4895d0]/10"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10"
          >
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === "edit" ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <div className="bg-[#1a2b47] border border-[#4895d0]/30 rounded-lg">
              <BrokerProfileForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
            {broker ? (
              <ViewBrokerProfileData broker={broker} user={user as User} />
            ) : (
              <div className="text-[#4895d0]">No profile data available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
