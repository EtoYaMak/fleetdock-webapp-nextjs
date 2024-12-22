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
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-xl font-semibold text-primary">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Company Name
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.company_name}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Business Type
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.business_type || "Not specified"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Year Established
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.year_established || "Not specified"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Tax ID
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.tax_id || "Not provided"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licensing Information */}
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-xl font-semibold text-primary">
              Licensing Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                License Number
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.license_number}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Business License
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.business_license_number}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Business License Expiry
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker?.business_license_expiry?.toString() || "Not specified"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-xl font-semibold text-primary">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Address
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.location?.address || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                City
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.location?.city || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                State
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.location?.state || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Country
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.location?.country || "Not provided"}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-xl font-semibold text-primary">
              Business Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Website
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.business_details?.website || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Phone
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.business_details?.phone || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {broker.business_details?.email || "Not provided"}
              </dd>
            </div>
            <div className="bg-input px-4 py-3 rounded-lg border border-border">
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="mt-1 text-sm text-primary">
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
