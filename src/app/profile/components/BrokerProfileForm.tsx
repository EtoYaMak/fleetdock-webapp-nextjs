import React, { useState } from "react";
import { BrokerFormData } from "@/types/broker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const handleDateChange = (
    field: keyof BrokerFormData,
    value: Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: keyof BrokerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    if (!formData.business_license_expiry) {
      newErrors.business_license_expiry = "Business license expiry is required";
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
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto h-full">
      <div className="grid gap-6">
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
              <div>
                <Label htmlFor="company_name" className="text-muted-foreground">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name || ""}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
                {errors.company_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.company_name}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="business_type"
                  className="text-muted-foreground"
                >
                  Business Type
                </Label>
                <Select
                  value={formData.business_type}
                  onValueChange={(value) =>
                    handleSelectChange("business_type", value)
                  }
                >
                  <SelectTrigger className="mt-2 bg-input border-border text-primary">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="text-primary bg-card border-border">
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole_proprietorship">
                      Sole Proprietorship
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="year_established"
                  className="text-muted-foreground"
                >
                  Year Established
                </Label>
                <Input
                  id="year_established"
                  name="year_established"
                  type="number"
                  value={formData.year_established || ""}
                  onChange={handleChange}
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label htmlFor="tax_id" className="text-muted-foreground">
                  Tax ID
                </Label>
                <Input
                  id="tax_id"
                  name="tax_id"
                  value={formData.tax_id || ""}
                  onChange={handleChange}
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
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
              <div>
                <Label
                  htmlFor="license_number"
                  className="text-muted-foreground"
                >
                  License Number
                </Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number || ""}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
                {errors.license_number && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.license_number}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="business_license_number"
                  className="text-muted-foreground"
                >
                  Business License Number
                </Label>
                <Input
                  id="business_license_number"
                  name="business_license_number"
                  value={formData.business_license_number || ""}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
                {errors.business_license_number && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.business_license_number}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                  Business License Expiry
                </Label>
                <DatePicker
                  value={formData.business_license_expiry}
                  onChange={(date) =>
                    handleDateChange("business_license_expiry", date)
                  }
                  className="bg-input border-border focus:border-primary text-primary"
                  popoverContentClassName="bg-input border-border focus:border-primary text-primary"
                />
                {errors.business_license_expiry && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.business_license_expiry}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card className="border-border shadow-md bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-xl font-semibold text-primary">
                Insurance Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label
                  htmlFor="insurance_policy_number"
                  className="text-muted-foreground"
                >
                  Insurance Policy Number
                </Label>
                <Input
                  id="insurance_policy_number"
                  name="insurance_policy_number"
                  value={formData.insurance_policy_number || ""}
                  onChange={handleChange}
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">
                  Insurance Expiry
                </Label>
                <DatePicker
                  value={formData.insurance_expiry}
                  onChange={(date) =>
                    handleDateChange("insurance_expiry", date)
                  }
                  className="bg-input border-border focus:border-primary text-primary"
                  popoverContentClassName="bg-input border-border focus:border-primary text-primary"
                />
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
              <div>
                <Label
                  htmlFor="location.address"
                  className="text-muted-foreground"
                >
                  Address
                </Label>
                <Input
                  id="location.address"
                  name="location.address"
                  value={formData.location?.address || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label
                  htmlFor="location.city"
                  className="text-muted-foreground"
                >
                  City
                </Label>
                <Input
                  id="location.city"
                  name="location.city"
                  value={formData.location?.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label
                  htmlFor="location.state"
                  className="text-muted-foreground"
                >
                  State
                </Label>
                <Input
                  id="location.state"
                  name="location.state"
                  value={formData.location?.state || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, state: e.target.value },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label htmlFor="location.postal_code">Postal Code</Label>
                <Input
                  id="location.postal_code"
                  name="location.postal_code"
                  value={formData.location?.postal_code || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        postal_code: e.target.value,
                      },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label
                  htmlFor="location.country"
                  className="text-muted-foreground"
                >
                  Country
                </Label>
                <Input
                  id="location.country"
                  name="location.country"
                  value={formData.location?.country || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
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
              <div>
                <Label
                  htmlFor="business_details.website"
                  className="text-muted-foreground"
                >
                  Website
                </Label>
                <Input
                  id="business_details.website"
                  name="business_details.website"
                  value={formData.business_details?.website || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_details: {
                        ...prev.business_details,
                        website: e.target.value,
                      },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label
                  htmlFor="business_details.phone"
                  className="text-muted-foreground"
                >
                  Phone
                </Label>
                <Input
                  id="business_details.phone"
                  name="business_details.phone"
                  value={formData.business_details?.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_details: {
                        ...prev.business_details,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div>
                <Label
                  htmlFor="business_details.email"
                  className="text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="business_details.email"
                  name="business_details.email"
                  type="email"
                  value={formData.business_details?.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_details: {
                        ...prev.business_details,
                        email: e.target.value,
                      },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>

              <div className="md:col-span-2">
                <Label
                  htmlFor="business_details.description"
                  className="text-muted-foreground"
                >
                  Description
                </Label>
                <Input
                  id="business_details.description"
                  name="business_details.description"
                  value={formData.business_details?.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_details: {
                        ...prev.business_details,
                        description: e.target.value,
                      },
                    }))
                  }
                  className="mt-2 bg-input border-border focus:border-primary text-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isLoading} variant="default">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
