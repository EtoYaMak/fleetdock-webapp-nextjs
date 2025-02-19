"use client";

import { useState } from "react";
import { Load, LoadStatus, Location, Dimensions, PickUpContact, DeliveryContact } from "@/types/load";
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
    weight_unit: initialData?.weight_unit || "kg",
    dimensions:
      initialData?.dimensions ||
      ({
        length: 0,
        width: 0,
        height: 0,
        unit: "m",
      } satisfies Dimensions),
    pickup_location:
      initialData?.pickup_location ||
      ({
        address: "",
        city: "",
        state: "",
        zip: "",
      } satisfies Location),
    pickup_contact:
      initialData?.pickup_contact ||
      ({
        name: "",
        phone: "",
        email: "",
      } satisfies PickUpContact),
    delivery_location:
      initialData?.delivery_location ||
      ({
        address: "",
        city: "",
        state: "",
        zip: "",
      } satisfies Location),
    delivery_contact:
      initialData?.delivery_contact ||
      ({
        name: "",
        phone: "",
        email: "",
      } satisfies DeliveryContact),
    pickup_date: initialData?.pickup_date || new Date(),
    delivery_date: initialData?.delivery_date || new Date(),
    distance_km: initialData?.distance_km || 0,
    distance_unit: initialData?.distance_unit || "km",
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

  const handleDimensionUpdate = (
    key: keyof Dimensions,
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...(prev.dimensions || { length: 0, width: 0, height: 0, unit: "m" }),
        [key]: value,
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
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select load type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {loadTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-foreground"
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
                className="rounded border-primary bg-background"
              />
              <label className="text-sm font-medium text-primary">
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
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground font-semibold">
              Dimensions ({formData.dimensions?.unit})
            </label>
            <div className="flex gap-2">
              {(["length", "width", "height"] as const).map((dim) => (
                <div key={dim} className="flex-1">
                  <label className="block text-sm font-medium text-muted-foreground mb-1 capitalize">
                    {dim}
                  </label>
                  <Input
                    type="text"
                    placeholder={dim}
                    value={formData.dimensions?.[dim] === 0 ? "" : formData.dimensions?.[dim]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || !isNaN(Number(value))) {
                        handleDimensionUpdate(dim, value === "" ? 0 : parseFloat(value));
                      }
                    }}
                    className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
                  />
                </div>
              ))}
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Unit
                </label>
                <Select
                  value={formData.dimensions?.unit}
                  onValueChange={(value) => handleDimensionUpdate("unit", value)}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-muted-foreground">
              Weight ({formData.weight_unit})
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Amount
                </label>
                <Input
                  type="text"
                  placeholder="Amount"
                  value={formData.weight_kg === 0 ? '' : formData.weight_kg}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setFormData((prev) => ({
                        ...prev,
                        weight_kg: value === "" ? 0 : Number(value),
                      }));
                    }
                  }}
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Unit
                </label>
                <Select
                  value={formData.weight_unit}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, weight_unit: value }))
                  }
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="metric-tons">metric tons (1000 kg)</SelectItem>
                    <SelectItem value="short-tons">short tons (2000 lbs)</SelectItem>
                    <SelectItem value="long-tons">long tons (2240 lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
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
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium  text-muted-foreground">
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
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Distance ({formData.distance_unit})
              </label>
              <div className="flex items-center gap-2 w-full">
                <span className="w-2/3">
                  <Input
                    type="text"
                    value={formData.distance_km === null || formData.distance_km === 0 ? "" : formData.distance_km}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || !isNaN(Number(value))) {
                        setFormData((prev) => ({
                          ...prev,
                          distance_km: value === "" ? 0 : Number(value),
                        }));
                      }
                    }}
                    className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
                  />
                </span>
                <span className="w-1/3">
                  <Select
                    value={formData.distance_unit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, distance_unit: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="km">km</SelectItem>
                      <SelectItem value="mi">miles</SelectItem>
                      <SelectItem value="m">meters</SelectItem>
                      <SelectItem value="yd">yards</SelectItem>
                    </SelectContent>
                  </Select>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-card border border-border px-4 py-5 sm:p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary">
          Pricing Details
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="w-fit">
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
              <SelectTrigger className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                <SelectValue placeholder="Select pricing method" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                <SelectItem value="fixed" className="text-foreground">
                  Fixed Rate
                </SelectItem>
                <SelectItem value="bidding" className="text-foreground">
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
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Budget Amount
                </label>
                <Input
                  type="text"
                  value={formData.budget_amount === 0 ? '' : formData.budget_amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setFormData((prev) => ({
                        ...prev,
                        budget_amount: value === "" ? 0 : Number(value),
                      }));
                    }
                  }}
                  className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Fixed Rate
              </label>
              <Input
                type="text"
                value={formData.fixed_rate === null || formData.fixed_rate === 0 ? "" : formData.fixed_rate}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) {
                    setFormData((prev) => ({
                      ...prev,
                      fixed_rate: value === "" ? 0 : Number(value),
                    }));
                  }
                }}
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
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
              <SelectTrigger className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                <SelectValue placeholder="Select equipment required" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                {vehiclesTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-foreground"
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
              <SelectTrigger className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                <SelectValue placeholder="Select truck type required" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border placeholder:text-muted-foreground text-foreground ">
                {vehiclesTypes?.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="text-foreground"
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
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Main Contact Information
          </h2>
          <label htmlFor="contact-information" className="block text-sm font-medium mb-1 text-muted-foreground">
            Contact Information
          </label>
          <div className="flex flex-wrap gap-4 w-full">
            <div className="w-1/4">

              <Input
                value={formData.contact_name || ""}
                placeholder="Name"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_name: e.target.value,
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
              />
            </div>

            <div className="w-1/4">

              <Input
                placeholder="Phone"
                value={formData.contact_phone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_phone: e.target.value,
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
              />
            </div>

            <div className="w-1/4">

              <Input
                type="email"
                placeholder="Email"
                value={formData.contact_email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_email: e.target.value,
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground "
              />
            </div>
          </div>
          {/* Pickup and Delivery Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Pickup Contact
              </label>
              <Input
                placeholder="Name"
                value={formData.pickup_contact?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pickup_contact: {
                      ...(prev.pickup_contact || { name: "", phone: "", email: "" }),
                      name: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
              <Input
                placeholder="Phone"
                value={formData.pickup_contact?.phone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pickup_contact: {
                      ...(prev.pickup_contact || { name: "", phone: "", email: "" }),
                      phone: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.pickup_contact?.email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pickup_contact: {
                      ...(prev.pickup_contact || { name: "", phone: "", email: "" }),
                      email: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Delivery Contact
              </label>
              <Input
                placeholder="Name"
                value={formData.delivery_contact?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_contact: {
                      ...(prev.delivery_contact || { name: "", phone: "", email: "" }),
                      name: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
              <Input
                placeholder="Phone"
                value={formData.delivery_contact?.phone || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_contact: {
                      ...(prev.delivery_contact || { name: "", phone: "", email: "" }),
                      phone: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.delivery_contact?.email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_contact: {
                      ...(prev.delivery_contact || { name: "", phone: "", email: "" }),
                      email: e.target.value,
                    },
                  }))
                }
                className="bg-background border border-border placeholder:text-muted-foreground text-foreground"
              />
            </div>
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
            className="w-full h-32 bg-background border border-border placeholder:text-muted-foreground text-foreground "
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
