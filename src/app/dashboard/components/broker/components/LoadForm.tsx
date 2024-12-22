"use client";

import { useState } from "react";
import { Load, LoadStatus, Location, Dimensions } from "@/types/load";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSave, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLoadTypes } from "@/hooks/useLoadTypes";
import { useVehiclesTypes } from "@/hooks/useVehicleTypes";
import { useAuth } from "@/context/AuthContext";
interface LoadFormProps {
  initialData?: Partial<Load>;
  onSubmit: (data: Load) => Promise<void>;
  isEdit?: boolean;
}

export default function LoadForm({
  initialData,
  onSubmit,
  isEdit = false,
}: LoadFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { loadTypes, isLoading: loadTypesLoading } = useLoadTypes();
  const { vehiclesTypes, isLoading: vehiclesTypesLoading } = useVehiclesTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Load>>({
    broker_id: user?.id || "",
    load_type_id: initialData?.load_type_id || "",
    temperature_controlled: initialData?.temperature_controlled || false,
    weight_kg: initialData?.weight_kg || 0,
    dimensions:
      initialData?.dimensions ||
      ({
        length: 0,
        width: 0,
        height: 0,
      } satisfies Dimensions),
    pickup_location:
      initialData?.pickup_location ||
      ({
        address: "",
        city: "",
        state: "",
        zip: "",
      } satisfies Location),
    delivery_location:
      initialData?.delivery_location ||
      ({
        address: "",
        city: "",
        state: "",
        zip: "",
      } satisfies Location),
    pickup_date: initialData?.pickup_date || new Date(),
    delivery_date: initialData?.delivery_date || new Date(),
    distance_km: initialData?.distance_km || 0,
    special_instructions: initialData?.special_instructions || "",
    load_status: initialData?.load_status || LoadStatus.POSTED,
    budget_amount: initialData?.budget_amount || 0,
    budget_currency: initialData?.budget_currency || "USD",
    bid_enabled: initialData?.bid_enabled || false,
    bidding_deadline: initialData?.bidding_deadline || null,
    fixed_rate: initialData?.fixed_rate || null,
    equipment_required: initialData?.equipment_required || "",
    truck_type_required: initialData?.truck_type_required || "",
    contact_name: initialData?.contact_name || "",
    contact_phone: initialData?.contact_phone || "",
    contact_email: initialData?.contact_email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData as Load);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDimensionChange = (dim: keyof Dimensions, value: number) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...(prev.dimensions || { length: 0, width: 0, height: 0 }),
        [dim]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-[#f1f0f3]">
      {/* Basic Load Information Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Basic Load Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Load Type
            </label>
            <Select
              disabled={loadTypesLoading}
              value={formData.load_type_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, load_type_id: value }))
              }
            >
              <SelectTrigger className="bg-[#203152] border-[#4895d0]/30">
                <SelectValue placeholder="Select load type" />
              </SelectTrigger>
              <SelectContent className="bg-[#111a2d] border-[#4895d0]/30">
                {loadTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-[#f1f0f3]"
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.temperature_controlled}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    temperature_controlled: !prev.temperature_controlled,
                  }));
                }}
                className="rounded border-border bg-background"
              />
              <label className="text-sm font-medium text-muted-foreground">
                Temperature Controlled
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Cargo Details Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Cargo Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Dimensions (meters)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["length", "width", "height"] as const).map((dim) => (
                <Input
                  key={dim}
                  type="number"
                  placeholder={dim}
                  value={formData.dimensions?.[dim] || 0}
                  onChange={(e) =>
                    handleDimensionChange(dim, parseFloat(e.target.value))
                  }
                  className="bg-[#203152] border border-border placeholder:text-muted-foreground text-white "
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Weight (kg)
            </label>
            <Input
              type="number"
              value={formData.weight_kg}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  weight_kg: parseFloat(e.target.value),
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>
        </div>
      </section>

      {/* Location & Schedule Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Location & Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Pickup Location
              </label>
              <Input
                placeholder="Address"
                value={formData.pickup_location?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pickup_location: {
                      ...(prev.pickup_location || {
                        address: "",
                        city: "",
                        state: "",
                        zip: "",
                      }),
                      address: e.target.value,
                    } satisfies Location,
                  }))
                }
                className="bg-[#203152] border-[#4895d0]/30 mb-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="City"
                  value={formData.pickup_location?.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickup_location: {
                        ...(prev.pickup_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        city: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
                <Input
                  placeholder="State"
                  value={formData.pickup_location?.state || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickup_location: {
                        ...(prev.pickup_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        state: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
                <Input
                  placeholder="ZIP"
                  value={formData.pickup_location?.zip || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickup_location: {
                        ...(prev.pickup_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        zip: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Delivery Location
              </label>
              <Input
                placeholder="Address"
                value={formData.delivery_location?.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_location: {
                      ...(prev.delivery_location || {
                        address: "",
                        city: "",
                        state: "",
                        zip: "",
                      }),
                      address: e.target.value,
                    } satisfies Location,
                  }))
                }
                className="bg-[#203152] border-[#4895d0]/30 mb-2"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="City"
                  value={formData.delivery_location?.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      delivery_location: {
                        ...(prev.delivery_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        city: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
                <Input
                  placeholder="State"
                  value={formData.delivery_location?.state || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      delivery_location: {
                        ...(prev.delivery_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        state: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
                <Input
                  placeholder="ZIP"
                  value={formData.delivery_location?.zip || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      delivery_location: {
                        ...(prev.delivery_location || {
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }),
                        zip: e.target.value,
                      } satisfies Location,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Pickup Date
              </label>
              <DatePicker
                value={formData.pickup_date as Date}
                onChange={(date: Date | undefined) =>
                  setFormData((prev) => ({ ...prev, pickup_date: date }))
                }
                className="bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Delivery Date
              </label>
              <DatePicker
                value={formData.delivery_date as Date}
                onChange={(date: Date | undefined) =>
                  setFormData((prev) => ({ ...prev, delivery_date: date }))
                }
                className="bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Distance (km)
              </label>
              <Input
                type="number"
                value={formData.distance_km}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    distance_km: parseFloat(e.target.value),
                  }))
                }
                className="bg-[#203152] border-[#4895d0]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Pricing Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Pricing Method
            </label>
            <Select
              value={formData.bid_enabled ? "bidding" : "fixed"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  bid_enabled: value === "bidding",
                  fixed_rate: value === "bidding" ? null : prev.fixed_rate,
                  bidding_deadline: value === "bidding" ? new Date() : null,
                }))
              }
            >
              <SelectTrigger className="bg-[#203152] border-[#4895d0]/30">
                <SelectValue placeholder="Select pricing method" />
              </SelectTrigger>
              <SelectContent className="bg-[#111a2d] border-[#4895d0]/30">
                <SelectItem value="fixed" className="text-[#f1f0f3]">
                  Fixed Rate
                </SelectItem>
                <SelectItem value="bidding" className="text-[#f1f0f3]">
                  Bidding
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.bid_enabled ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Bidding Deadline
                </label>
                <DatePicker
                  value={formData.bidding_deadline as Date}
                  onChange={(date: Date | undefined) =>
                    setFormData((prev) => ({
                      ...prev,
                      bidding_deadline: date,
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Budget Amount
                </label>
                <Input
                  type="number"
                  value={formData.budget_amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      budget_amount: parseFloat(e.target.value),
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Fixed Rate
              </label>
              <Input
                type="number"
                value={formData.fixed_rate || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fixed_rate: parseFloat(e.target.value),
                  }))
                }
                className="bg-[#203152] border-[#4895d0]/30"
              />
            </div>
          )}
        </div>
      </section>

      {/* Equipment Requirements Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Equipment Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Equipment Required
            </label>
            <Select
              disabled={vehiclesTypesLoading}
              value={formData.equipment_required}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment_required: value,
                }))
              }
            >
              <SelectTrigger className="bg-[#203152] border-[#4895d0]/30">
                <SelectValue placeholder="Select equipment required" />
              </SelectTrigger>
              <SelectContent className="bg-[#111a2d] border-[#4895d0]/30">
                {vehiclesTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-[#f1f0f3]"
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Truck Type Required
            </label>
            <Select
              disabled={vehiclesTypesLoading}
              value={formData.truck_type_required}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  truck_type_required: value,
                }))
              }
            >
              <SelectTrigger className="bg-[#203152] border-[#4895d0]/30">
                <SelectValue placeholder="Select truck type required" />
              </SelectTrigger>
              <SelectContent className="bg-[#111a2d] border-[#4895d0]/30">
                {vehiclesTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-[#f1f0f3]"
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Contact Name
            </label>
            <Input
              value={formData.contact_name || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_name: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Contact Phone
            </label>
            <Input
              value={formData.contact_phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_phone: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Contact Email
            </label>
            <Input
              type="email"
              value={formData.contact_email || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_email: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Additional Information
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground">
            Special Instructions
          </label>
          <textarea
            value={formData.special_instructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                special_instructions: e.target.value,
              }))
            }
            className="w-full h-32 bg-[#203152] border-[#4895d0]/30 rounded-md p-2"
          />
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          <FiX className="mr-2" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="default"
          className="text-white"
        >
          <FiSave className="mr-2" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Load" : "Create Load"}
        </Button>
      </div>
    </form>
  );
}
