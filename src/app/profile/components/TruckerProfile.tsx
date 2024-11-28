"use client";

import { useAuth } from "@/hooks/useAuth";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

const TruckerProfile = () => {
  const { profile } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <FaUser className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
        <p className="text-gray-600">Trucker</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="font-medium capitalize">
                {profile?.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckerProfile;
