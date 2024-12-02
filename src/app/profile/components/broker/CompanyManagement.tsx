"use client";

import { useState, useEffect } from "react";
import { BrokerBusiness } from "@/types/broker";
import { motion } from "framer-motion";
import { FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { UserProfile } from "@/types/auth";

interface CompanyManagementProps {
  business: BrokerBusiness | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error?: string;
  onUpdate: (
    data: Partial<BrokerBusiness>
  ) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => Promise<void>;
}

export default function CompanyManagement({
  business,
  profile,
  isLoading,
  error: initialError,
  onUpdate,
  onRefresh,
}: CompanyManagementProps) {
  const [formData, setFormData] = useState<Partial<BrokerBusiness>>(business || {});
  const [error, setError] = useState(initialError);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData(business); // Update form data when business data changes
    }
  }, [business]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(undefined);
    setShowSuccess(false);

    const result = await onUpdate(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      setShowSuccess(true);
      await onRefresh(); // Refresh data after successful update
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-start justify-between  mb-6">
        <h2 className="text-2xl font-bold ">Company Management</h2>
        <h2 className="text-lg font-medium">
          {profile?.company_name || "Company Name"}
        </h2>
        {showSuccess && (
          <div className="flex items-center text-green-600">
            <FiCheckCircle className="w-5 h-5 mr-2" />
            <span>Changes saved successfully</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business License Number*
            </label>
            <input
              type="text"
              required
              value={formData.business_license_number || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  business_license_number: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date*
            </label>
            <input
              type="date"
              required
              value={formData.business_license_expiry?.split("T")[0] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  business_license_expiry: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID
            </label>
            <input
              type="text"
              value={formData.tax_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <select
              value={formData.business_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, business_type: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Established
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year_established || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year_established: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Policy Number
            </label>
            <input
              type="text"
              value={formData.insurance_policy_number || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  insurance_policy_number: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Expiry Date
            </label>
            <input
              type="date"
              value={formData.insurance_expiry?.split("T")[0] || ""}
              onChange={(e) =>
                setFormData({ ...formData, insurance_expiry: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Verification Status:{" "}
            <span className="font-medium capitalize">
              {formData.verification_status || "pending"}
            </span>
          </p>
          {formData.verification_date && (
            <p className="text-sm text-gray-600">
              Last Verified:{" "}
              {new Date(formData.verification_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSaving}
          className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 ${
            isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          <FiSave className="w-5 h-5" />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </motion.button>
      </form>
    </div>
  );
}
