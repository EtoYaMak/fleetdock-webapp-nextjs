"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { FiUser, FiMail, FiPhone, FiPackage } from "react-icons/fi";

export default function BrokerDashboard() {
  const { profile } = useAuth();
  const { isBroker } = useRole();

  if (!profile || !isBroker) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-blue-600 rounded-t-lg">
            <h3 className="text-lg leading-6 font-medium text-white">
              Broker Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Your personal and account details
            </p>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Basic Info Section */}
              <div className="col-span-2">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <FiUser className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{profile.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiMail className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiPackage className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Type</p>
                      <p className="text-gray-900 capitalize">{profile.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
