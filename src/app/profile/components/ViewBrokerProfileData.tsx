import { memo } from "react";
import { BrokerBusiness } from "@/types/broker";
import { User } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";

interface ViewBrokerProfileDataProps {
  broker: BrokerBusiness | null;
  user: User;
}

const ViewBrokerProfileData = memo(function ViewBrokerProfileData({
  broker,
}: ViewBrokerProfileDataProps) {
  if (!broker) return null;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="border-none shadow-md bg-black/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-[#4895d0] rounded-full" />
            <h3 className="text-xl font-semibold text-[#f1f0f3]">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">
                Company Name
              </dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.company_name}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">
                Business Type
              </dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.business_type || "Not specified"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">
                Year Established
              </dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.year_established || "Not specified"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Tax ID</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.tax_id || "Not provided"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licensing Information */}
      <Card className="border-none shadow-md bg-black/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-[#4895d0] rounded-full" />
            <h3 className="text-xl font-semibold text-[#f1f0f3]">
              Licensing Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <dt className="text-sm font-medium text-[#4895d0]">
                Business License Expiry
              </dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker?.business_license_expiry?.toString() || "Not specified"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="border-none shadow-md bg-black/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-[#4895d0] rounded-full" />
            <h3 className="text-xl font-semibold text-[#f1f0f3]">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Address</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.location?.address || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">City</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.location?.city || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">State</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.location?.state || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Country</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.location?.country || "Not provided"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card className="border-none shadow-md bg-black/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-[#4895d0] rounded-full" />
            <h3 className="text-xl font-semibold text-[#f1f0f3]">
              Business Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Website</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.business_details?.website || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Phone</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.business_details?.phone || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">Email</dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.business_details?.email || "Not provided"}
              </dd>
            </div>
            <div className="bg-[#203152] px-4 py-3 rounded-lg border border-[#4895d0]/30">
              <dt className="text-sm font-medium text-[#4895d0]">
                Description
              </dt>
              <dd className="mt-1 text-sm text-[#f1f0f3]">
                {broker.business_details?.description || "Not provided"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ViewBrokerProfileData.displayName = "ViewBrokerProfileData";

export default ViewBrokerProfileData;
