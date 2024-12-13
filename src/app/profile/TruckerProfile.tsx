"use client";
import { memo, useState } from "react";
import { TruckerFormData } from "@/types/trucker";
import { useAuth } from "@/context/AuthContext";
import TruckerProfileForm from "./components/TruckerProfileForm";
import ViewTruckerProfileData from "./components/ViewTruckerProfileData";
import { User } from "@/types/auth";

import { TruckerDetails } from "@/types/trucker";
type TabType = "edit" | "view";

const TruckerProfile = memo(function TruckerProfile({
  user,
  trucker,
  isLoading,
  error,
  createTrucker,
  updateTrucker,
}: {
  user: User;
  trucker: TruckerDetails;
  isLoading: boolean;
  error: string;
  createTrucker: (data: TruckerFormData) => Promise<void>;
  updateTrucker: (data: TruckerFormData) => Promise<void>;
}) {
  //  const { trucker, isLoading, error, createTrucker, updateTrucker } =
  //    useTrucker();
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
    <div className="flex bg-[#111a2e] min-h-screen text-[#f1f0f3] px-4">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a2b47] border-r-2 border-b-2 border-[#4895d0]/30 p-4 rounded-lg backdrop-blur-lg bg-opacity-90 h-fit sticky top-10">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#f1f0f3]">
            Trucker Profile
          </h2>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab("view")}
            className={`w-full px-4 py-2 text-left rounded-lg transition-transform duration-300 ease-in-out ${
              activeTab === "view"
                ? "bg-[#111a2e] text-[#f1f0f3] border-r-2 border-b-2 border-[#4895d0]/50 scale-105"
                : "text-[#f1f0f3] hover:bg-[#4895d0]/10"
            }`}
          >
            View Profile
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`w-full px-4 mt-2 py-2 text-left rounded-lg transition-transform duration-300 ease-in-out ${
              activeTab === "edit"
                ? "bg-[#111a2e] text-[#f1f0f3] border-r-2 border-b-2 border-[#4895d0]/50 scale-105"
                : "text-[#f1f0f3] hover:bg-[#4895d0]/10"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 mt-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg "
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
            <div className="">
              <TruckerProfileForm
                initialData={initialData}
                trucker={trucker}
                user={user as User}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
            {trucker ? (
              <ViewTruckerProfileData trucker={trucker} user={user as User} />
            ) : (
              <div className="text-[#4895d0]">No profile data available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TruckerProfile.displayName = "TruckerProfile";

export default TruckerProfile;
