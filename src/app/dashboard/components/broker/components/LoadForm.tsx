"use client";

import { useState } from "react";
import { Load, LoadStatus } from "@/types/load";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSave, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoadTypes } from "@/hooks/useLoadTypes";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Load>>({
    broker_id: user?.id || "",
    load_type_id: initialData?.load_type_id || "",
    temperature_controlled: initialData?.temperature_controlled || false,
    weight_kg: initialData?.weight_kg || 0,
    dimensions: initialData?.dimensions || { length: 0, width: 0, height: 0 },
    pickup_location: initialData?.pickup_location || {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    delivery_location: initialData?.delivery_location || {
      address: "",
      city: "",
      state: "",
      zip: "",
    },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-[#f1f0f3]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Load Type</label>
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
              <SelectContent className="bg-[#203152] border-[#4895d0]/30">
                {loadTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              Temperature Controlled
            </label>
            <input
              type="checkbox"
              checked={formData.temperature_controlled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  temperature_controlled: e.target.checked,
                }))
              }
              className="rounded border-[#4895d0]/30 bg-[#203152]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              {["length", "width", "height"].map((dim) => (
                <Input
                  key={dim}
                  type="number"
                  placeholder={dim}
                  value={formData.dimensions?.[dim] || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        [dim]: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="bg-[#203152] border-[#4895d0]/30"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Pickup Date
            </label>
            <DatePicker
              value={formData.pickup_date as Date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, pickup_date: date }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Date
            </label>
            <DatePicker
              value={formData.delivery_date as Date}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, delivery_date: date }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
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
              <SelectContent>
                <SelectItem value="fixed">Fixed Rate</SelectItem>
                <SelectItem value="bidding">Bidding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.bid_enabled ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bidding Deadline
                </label>
                <DatePicker
                  value={formData.bidding_deadline as Date}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, bidding_deadline: date }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
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
              <label className="block text-sm font-medium mb-1">
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Equipment Required
            </label>
            <Input
              value={formData.equipment_required}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment_required: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Truck Type Required
            </label>
            <Input
              value={formData.truck_type_required || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  truck_type_required: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
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
            <label className="block text-sm font-medium mb-1">
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
            <label className="block text-sm font-medium mb-1">
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Special Instructions
            </label>
            <Input
              value={formData.special_instructions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  special_instructions: e.target.value,
                }))
              }
              className="bg-[#203152] border-[#4895d0]/30"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="bg-[#203152] border-[#4895d0]/30 text-[#f1f0f3] hover:bg-[#203152]/90"
        >
          <FiX className="mr-2" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4895d0] text-[#f1f0f3] hover:bg-[#4895d0]/90"
        >
          <FiSave className="mr-2" />
          {isSubmitting ? "Saving..." : isEdit ? "Update Load" : "Create Load"}
        </Button>
      </div>
    </form>
  );
}
