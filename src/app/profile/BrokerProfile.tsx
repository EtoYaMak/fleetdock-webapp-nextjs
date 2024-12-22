"use client";
import { memo, useState } from "react";
import { BrokerFormData, BrokerBusiness } from "@/types/broker";
import { useAuth } from "@/context/AuthContext";
import BrokerProfileForm from "./components/BrokerProfileForm";
import ViewBrokerProfileData from "./components/ViewBrokerProfileData";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Edit2, X, UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const BrokerProfile = memo(function BrokerProfile({
  user,
  broker,
  isLoading,
  error,
  createBroker,
  updateBroker,
}: {
  user: User;
  broker: BrokerBusiness | null;
  isLoading: boolean;
  error: string;
  createBroker: (data: BrokerFormData) => Promise<void>;
  updateBroker: (data: BrokerFormData) => Promise<void>;
}) {
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (data: BrokerFormData) => {
    if (!broker) {
      await createBroker(data);
    } else {
      await updateBroker(data);
    }
    setIsEditing(false);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const initialData = broker
    ? {
        company_name: broker.company_name,
        license_number: broker.license_number,
        business_license_number: broker.business_license_number,
        business_license_expiry: broker.business_license_expiry,
        tax_id: broker.tax_id,
        business_type: broker.business_type,
        year_established: broker.year_established,
        insurance_policy_number: broker.insurance_policy_number,
        insurance_expiry: broker.insurance_expiry,
        location: broker.location,
        business_details: broker.business_details,
      }
    : undefined;

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Sidebar */}
      <div className="w-64 sticky left-0 top-10 mt-10 h-screen p-6">
        <div className="bg-[#1a2b47] border-r-2 border-b-2 border-[#4895d0]/30 p-4 rounded-lg backdrop-blur-lg bg-opacity-90">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#f1f0f3]">
              Broker Profile
            </h2>
          </div>
          <nav>
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
      <div className="flex-1  p-8">
        {broker ? (
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-primary">
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
              <BrokerProfileForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            ) : (
              <ViewBrokerProfileData broker={broker} user={user} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-[1200px] mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-2xl font-semibold text-primary">
                Welcome to FleetDock!
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Oops! Looks like we don't have your broker profile set up yet.
                Let's fix that!
              </p>
            </div>
            {!isEditing ? (
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsEditing(true)}
              >
                <UserPlus />
                Create Your Profile
              </Button>
            ) : (
              <div className="w-full">
                <BrokerProfileForm
                  initialData={initialData}
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

BrokerProfile.displayName = "BrokerProfile";

export default BrokerProfile;
