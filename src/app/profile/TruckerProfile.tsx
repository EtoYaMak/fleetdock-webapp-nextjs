"use client";
import { useState } from "react";
import { TruckerFormData } from "@/types/trucker";
import { useAuth } from "@/context/AuthContext";
import TruckerProfileForm from "./components/TruckerProfileForm";
import ViewTruckerProfileData from "./components/ViewTruckerProfileData";
import { useTrucker } from "@/hooks/useTrucker";
type TabType = "edit" | "view";

export default function TruckerProfile() {
  const { trucker, isLoading, error, createTrucker, updateTrucker } =
    useTrucker();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("view");

  const handleSubmit = async (data: TruckerFormData) => {
    if (!trucker) {
      await createTrucker(data);
    } else {
      await updateTrucker(data);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const initialData = trucker
    ? {
        certifications: trucker.certifications,
        licenses: trucker.licenses,
        contact_details: trucker.contact_details,
        verification_status: trucker.verification_status,
      }
    : undefined;

  return (
    <div className="flex bg-[#203152] min-h-screen text-[#f1f0f3] px-4">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a2b47] border-r border-[#4895d0]/30 p-4 rounded-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#f1f0f3]">
            Trucker Profile
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
              <TruckerProfileForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
            {trucker ? (
              <ViewTruckerProfileData trucker={trucker} />
            ) : (
              <div className="text-[#4895d0]">No profile data available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
