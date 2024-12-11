import React, { useState } from "react";
import { TruckerFormData } from "@/types/trucker";

interface TruckerProfileFormProps {
  initialData?: TruckerFormData;
  onSubmit: (data: TruckerFormData) => Promise<void>;
  isLoading: boolean;
}

export default function TruckerProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: TruckerProfileFormProps) {
  const [formData, setFormData] = useState<TruckerFormData>(initialData || {});
  const [errors, setErrors] = useState<
    Partial<Record<keyof TruckerFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof TruckerFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Certifications
          </label>
          <textarea
            name="certifications"
            value={formData.certifications || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            rows={4}
          />
        </div>

        {/* Licenses */}
        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Licenses
          </label>
          <textarea
            name="licenses"
            value={formData.licenses || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            rows={4}
          />
        </div>

        {/* Contact Details */}
        <div>
          <label className="block text-sm font-medium text-[#4895d0]">
            Contact Details
          </label>
          <textarea
            name="contact_details"
            value={formData.contact_details || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] px-3 py-2"
            rows={4}
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
