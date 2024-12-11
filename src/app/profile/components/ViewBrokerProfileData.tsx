import React from "react";
import { BrokerBusiness } from "@/types/broker";

interface ViewBrokerProfileDataProps {
  broker: BrokerBusiness | null;
}

export default function ViewBrokerProfileData({
  broker,
}: ViewBrokerProfileDataProps) {
  if (!broker) return null;

  return (
    <div className="space-y-6">
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Company Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Company Name</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {broker.company_name}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              License Number
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {broker.license_number}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Business License
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {broker.business_license_number}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Tax ID</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3]">
              {broker.tax_id || "Not provided"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Status Information */}
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Status Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Verification Status
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] uppercase">
              {broker.verification_status}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Business Type
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] uppercase">
              {broker.business_type || "Not specified"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
