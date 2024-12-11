import React, { useState } from "react";
import { BrokerFormData } from "@/types/broker";

interface BrokerProfileFormProps {
  initialData?: BrokerFormData;
  onSubmit: (data: BrokerFormData) => Promise<void>;
  isLoading: boolean;
}

export default function BrokerProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: BrokerProfileFormProps) {
  const [formData, setFormData] = useState<BrokerFormData>(initialData || {});
  const [errors, setErrors] = useState<
    Partial<Record<keyof BrokerFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof BrokerFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BrokerFormData, string>> = {};

    if (!formData.company_name?.trim()) {
      newErrors.company_name = "Company name is required";
    }
    if (!formData.license_number?.trim()) {
      newErrors.license_number = "License number is required";
    }
    if (!formData.business_license_number?.trim()) {
      newErrors.business_license_number = "Business license number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            required
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            License Number
          </label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            required
          />
          {errors.license_number && (
            <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Business License Number
          </label>
          <input
            type="text"
            name="business_license_number"
            value={formData.business_license_number || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            required
          />
          {errors.business_license_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.business_license_number}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Tax ID
          </label>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#4895d0] text-[#f1f0f3] rounded-md hover:bg-[#4895d0]/90 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
