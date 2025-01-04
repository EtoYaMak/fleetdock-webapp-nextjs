"use client";

import { useState, useEffect } from "react";
//TYPES
import { User } from "@/types/auth";
import { VehicleFormData, VehicleWithType } from "@/types/vehicles";
import { useVehiclesTypes } from "@/hooks/useVehicleTypes";
//UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function RegisterVehicle({
  user,
  onSubmit,
  isLoading,
}: {
  user: User;
  onSubmit: (data: VehicleFormData) => void;
  isLoading: boolean;
}) {
  const { vehiclesTypes, isLoading: typesLoading } = useVehiclesTypes();

  const [formData, setFormData] = useState<VehicleFormData>({
    trucker_id: user.id,
    vehicle_type_id: "",
    license_plate: "",
    manufacturer: "",
    model: "",
    year: 0,
    insurance_expiry: new Date(),
    last_maintenance_date: new Date(),
    next_maintenance_date: new Date(),
    dimensions: { length: 0, width: 0, height: 0 },
    is_active: true,
    verification_status: false,
    verified_at: new Date(),
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        trucker_id: user.id,
      }));
    }
  }, [user]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as VehicleWithType);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Vehicle Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="vehicle_type_id">Vehicle Type</Label>
          <Select
            name="vehicle_type_id"
            value={formData.vehicle_type_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, vehicle_type_id: value }))
            }
          >
            <SelectTrigger className="bg-input border-input">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent className="bg-input border-input">
              {vehiclesTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} - {type.capacity}t
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* License Plate */}
        <div className="space-y-2">
          <Label htmlFor="license_plate">License Plate</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            className="bg-input border-input"
            placeholder="Enter license plate"
          />
        </div>

        {/* Manufacturer */}
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="bg-input border-input"
            placeholder="Enter manufacturer"
          />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="bg-input border-input"
            placeholder="Enter model"
          />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            className="bg-input border-input"
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>Dimensions (meters) L x W x H</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Length"
              type="number"
              value={formData.dimensions?.length || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    length: parseFloat(e.target.value),
                  },
                }))
              }
              className="bg-input border-input"
            />
            <Input
              placeholder="Width"
              type="number"
              value={formData.dimensions?.width || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    width: parseFloat(e.target.value),
                  },
                }))
              }
              className="bg-input border-input"
            />
            <Input
              placeholder="Height"
              type="number"
              value={formData.dimensions?.height || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dimensions: {
                    ...prev.dimensions,
                    height: parseFloat(e.target.value),
                  },
                }))
              }
              className="bg-input border-input"
            />
          </div>
        </div>
      </div>
      {/* Dates Section */}
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label>Insurance Expiry</Label>
          <DatePicker
            value={new Date(formData.insurance_expiry)}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                insurance_expiry: date || new Date(),
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Next Maintenance Date</Label>
          <DatePicker
            value={new Date(formData.next_maintenance_date)}
            onChange={(date) =>
              setFormData((prev) => ({
                ...prev,
                next_maintenance_date: date || new Date(),
              }))
            }
          />
        </div>
      </div>

      {/* Status Toggles */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                is_active: checked as boolean,
              }))
            }
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isLoading ? "Processing..." : "Register Vehicle"}
      </Button>
    </form>
  );
}
