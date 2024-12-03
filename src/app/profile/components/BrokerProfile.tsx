"use client";
//src/app/profile/components/BrokerProfile.tsx
import { useAuth } from "@/context/AuthContext";
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from "react-icons/fa";
import CompanyManagement from "./broker/CompanyManagement";
import { useProfile } from "@/hooks/useProfile";
import { BrokerProfileData } from "@/types/profile";

interface BrokerProfileProps extends BrokerProfileData {
  activeTab: string;
}

const BrokerProfile = ({ activeTab, isLoading, error }: BrokerProfileProps) => {
  const { user } = useAuth();
  const { brokerProfile, updateBrokerBusiness } = useProfile();

  const renderBrokerContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-24 h-24 bg-[#4895d0]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-[#4895d0]" />
              </div>
              <h1 className="text-2xl font-bold text-[#f1f0f3]">
                {user?.full_name}
              </h1>
              <p className="text-[#f1f0f3]">Broker</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-[#4895d0]/10 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#f1f0f3]">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-[#f1f0f3]" />
                    <div>
                      <p className="text-sm text-[#f1f0f3]">Email</p>
                      <p className="font-medium text-[#f1f0f3]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-[#f1f0f3]" />
                    <div>
                      <p className="text-sm text-[#f1f0f3]">Phone</p>
                      <p className="font-medium text-[#f1f0f3]">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-[#4895d0]/10 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#f1f0f3]">
                  Account Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#f1f0f3]">Account Status</p>
                    <p className="font-medium capitalize text-[#f1f0f3]">
                      {user?.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#f1f0f3]">Role</p>
                    <p className="font-medium capitalize text-[#f1f0f3]">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information Card - Updated for BrokerProfile */}
              <div className="bg-[#4895d0]/10 rounded-lg shadow p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-[#f1f0f3]">
                  Company Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaBuilding className="text-[#f1f0f3]" />
                      <div>
                        <p className="text-sm text-[#f1f0f3]">Business Type</p>
                        <p className="font-medium text-[#f1f0f3]">
                          {brokerProfile?.business_type || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "company":
        return (
          <CompanyManagement
            business={brokerProfile}
            isLoading={isLoading}
            error={error}
            onUpdate={updateBrokerBusiness}
          />
        );
      case "licenses":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#f1f0f3]">
              Licenses & Certificates
            </h2>
            {/* Add licenses management content here */}
            <p className="text-[#f1f0f3]">
              License management features coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return renderBrokerContent();
};

export default BrokerProfile;
{
  /* <CompanyManagement
            business={brokerProfile}
            isLoading={isLoading}
            error={error}
            onUpdate={updateBrokerBusiness}
          /> */
}
