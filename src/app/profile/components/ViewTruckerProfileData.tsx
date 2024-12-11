import React from "react";
import { TruckerDetails } from "@/types/trucker";
import { useProfile } from "@/hooks/useProfile";

interface ViewTruckerProfileDataProps {
  trucker: TruckerDetails;
}

export default function ViewTruckerProfileData({
  trucker,
}: ViewTruckerProfileDataProps) {
  const { profile } = useProfile();

  return (
    <div className="space-y-6">
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Account Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Full Name</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap ">
              {profile?.full_name || "No full name listed"}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Email</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {profile?.email || "No email listed"}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Role</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap capitalize">
              {profile?.role || "No role listed"}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Phone</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap ">
              {profile?.phone || "No phone listed"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Certifications & Licenses
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Certifications
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {trucker.certifications || "No certifications listed"}
            </dd>
          </div>
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">Licenses</dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {trucker.licenses || "No licenses listed"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Contact Information
        </h3>
        <dl className="grid grid-cols-1 gap-4">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Contact Details
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] whitespace-pre-wrap">
              {trucker.contact_details || "No contact details provided"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-[#1a2b47] border border-[#4895d0]/30 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-[#f1f0f3] mb-4">
          Status Information
        </h3>
        <dl className="grid grid-cols-1 gap-4">
          <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
            <dt className="text-sm font-medium text-[#4895d0]">
              Verification Status
            </dt>
            <dd className="mt-1 text-sm text-[#f1f0f3] uppercase">
              {trucker.verification_status}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
