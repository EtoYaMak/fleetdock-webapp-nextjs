"use client";
import { memo, useState } from "react";
import { TruckerFormData } from "@/types/trucker";
import { useAuth } from "@/context/AuthContext";
import TruckerProfileForm from "./components/TruckerProfileForm";
import ViewTruckerProfileData from "./components/ViewTruckerProfileData";
import { User } from "@/types/auth";
import { TruckerDetails } from "@/types/trucker";
import ViewTruckerVehicles from "./components/ViewTruckerVehicles";
import { Button } from "@/components/ui/button";
import { Edit2, X, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const TruckerProfile = memo(function TruckerProfile({
  user,
  trucker,
  isLoading,
  error,
  createTrucker,
  updateTrucker,
}: {
  user: User;
  trucker: TruckerDetails | null;
  isLoading: boolean;
  error: string;
  createTrucker: (data: TruckerFormData) => Promise<void>;
  updateTrucker: (data: TruckerFormData) => Promise<void>;
}) {
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);

  const handleSubmit = async (data: TruckerFormData) => {
    if (!trucker) {
      await createTrucker(data);
    } else {
      await updateTrucker(data);
    }
    setIsEditing(false);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
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
    <div className="flex min-h-screen bg-[#111a2e] relative">
      {/* Sidebar */}
      <div className="w-64 sticky left-0 top-10 mt-10 h-screen p-6">
        <div className="bg-[#1a2b47] border-r-2 border-b-2 border-[#4895d0]/30 p-4 rounded-lg backdrop-blur-lg bg-opacity-90">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#f1f0f3]">
              Trucker Profile
            </h2>
          </div>
          <nav className="space-y-2">
            {trucker && (
              <button
                onClick={() => setShowVehicles(!showVehicles)}
                className={`w-full px-4 py-2 text-left rounded-lg transition-transform duration-300 ease-in-out ${
                  showVehicles
                    ? "text-[#f1f0f3] hover:bg-[#4895d0]/10"
                    : "text-[#f1f0f3] hover:bg-[#4895d0]/10"
                }`}
              >
                {showVehicles ? "My Profile" : "My Vehicles"}
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {trucker ? (
          <div className="max-w-[1200px] mx-auto">
            {showVehicles ? (
              <ViewTruckerVehicles
                trucker={trucker}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-[#f1f0f3]">
                    Profile Details
                  </h1>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    className="flex items-center gap-2 bg-[#4895d0] hover:brightness-125 text-white hover:text-white border border-[#4895d0]/30 hover:bg-[#4895d0]"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4" /> Cancel Edit
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4" /> Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <TruckerProfileForm
                    initialData={initialData}
                    trucker={trucker}
                    user={user}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                ) : (
                  <ViewTruckerProfileData trucker={trucker} user={user} />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-[1200px] mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-[#f1f0f3]">
                Welcome to FleetDock!
              </h2>
              <p className="text-[#4895d0] text-lg max-w-md">
                Oops! Looks like we don't have your trucker profile set up yet.
                Let's fix that!
              </p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-[#4895d0] hover:bg-[#4895d0]/90 text-white px-8 py-6 text-lg"
              >
                <UserPlus className="h-5 w-5" />
                Create Your Profile
              </Button>
            ) : (
              <div className="w-full">
                <TruckerProfileForm
                  initialData={initialData}
                  trucker={null}
                  user={user}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TruckerProfile.displayName = "TruckerProfile";

export default TruckerProfile;
