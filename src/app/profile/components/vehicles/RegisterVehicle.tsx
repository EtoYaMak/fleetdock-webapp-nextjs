"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTruck } from "react-icons/fi";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";

interface VehicleType {
  id: string;
  name: string;
  capacity: string;
}

interface Vehicle {
  id: string;
  profile_id: string;
  vehicle_type_id: string;
  manufacturer: string;
  model: string;
  year: number;
  license_plate: string;
  insurance_expiry: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

interface RegisterVehicleProps {
  vehicleTypes: VehicleType[];
  onVehicleAdded: (vehicle: Vehicle) => void;
}

const RegisterVehicle = ({
  vehicleTypes,
  onVehicleAdded,
}: RegisterVehicleProps) => {
  const { registerVehicle } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    vehicle_type_id: "",
    license_plate: "",
    manufacturer: "",
    model: "",
    year: new Date().getFullYear(),
    insurance_expiry: undefined as Date | undefined,
    last_maintenance_date: undefined as Date | undefined,
    next_maintenance_date: undefined as Date | undefined,
  });

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= currentYear - 20; year--) {
      years.push(year);
    }
    return years;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formattedData = {
        ...formData,
        insurance_expiry: formData.insurance_expiry
          ? format(formData.insurance_expiry, "yyyy-MM-dd")
          : "",
        last_maintenance_date: formData.last_maintenance_date
          ? format(formData.last_maintenance_date, "yyyy-MM-dd")
          : "",
        next_maintenance_date: formData.next_maintenance_date
          ? format(formData.next_maintenance_date, "yyyy-MM-dd")
          : "",
      };

      const { success, error } = await registerVehicle(formattedData);

      if (error) {
        setMessage({
          type: "error",
          text: error,
        });
        return;
      }

      if (success) {
        setMessage({
          type: "success",
          text: "Vehicle registered successfully!",
        });

        setFormData({
          vehicle_type_id: "",
          license_plate: "",
          manufacturer: "",
          model: "",
          year: new Date().getFullYear(),
          insurance_expiry: undefined,
          last_maintenance_date: undefined,
          next_maintenance_date: undefined,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-t from-[#4895d0]/10 to-[#4895d0]/20 rounded-lg p-6 shadow-lg max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center mb-6">
        <FiTruck className="w-6 h-6 text-[#f1f0f3] mr-2" />
        <h2 className="text-2xl font-bold text-[#f1f0f3]">
          Register New Vehicle
        </h2>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-md mb-6 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Vehicle Type
            </label>
            <Select
              value={formData.vehicle_type_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, vehicle_type_id: value }))
              }
            >
              <SelectTrigger className="w-full p-3 h-12 border border-[#f1f0f3] bg-[#203152] text-[#f1f0f3]">
                <SelectValue placeholder="Select Vehicle Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#203152] text-[#f1f0f3]">
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="py-3">
                    {type.name} ({type.capacity} tons)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              License Plate
            </label>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              className="w-full p-3 border border-[#f1f0f3] rounded-md focus:ring-2 focus:ring-blue-500 bg-[#203152] text-[#f1f0f3]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full p-3 border border-[#f1f0f3] rounded-md focus:ring-2 focus:ring-blue-500 bg-[#203152] text-[#f1f0f3]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-3 border border-[#f1f0f3] rounded-md focus:ring-2 focus:ring-blue-500 bg-[#203152] text-[#f1f0f3]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Year
            </label>
            <Select
              value={formData.year.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, year: parseInt(value) }))
              }
            >
              <SelectTrigger className="w-full p-3 h-12 border border-[#f1f0f3] bg-[#203152] text-[#f1f0f3]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-[#203152] text-[#f1f0f3]">
                {generateYearOptions().map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="p-3"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Insurance Expiry
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full p-3 h-12 border border-[#f1f0f3] bg-[#203152] text-[#f1f0f3] group",
                    !formData.insurance_expiry && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#f1f0f3] group-hover:text-[#4895d0]" />
                  {formData.insurance_expiry ? (
                    format(formData.insurance_expiry, "PPP")
                  ) : (
                    <span className="text-[#f1f0f3] group-hover:text-[#4895d0]">
                      Pick a date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.insurance_expiry}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, insurance_expiry: date }))
                  }
                  className={`bg-[#203152] text-[#f1f0f3]`}
                  classNames={{
                    head_cell:
                      "text-[#4895d0] rounded-md w-8 font-normal text-[0.8rem]",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Last Maintenance Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full p-3 h-12 border border-[#f1f0f3] bg-[#203152] text-[#f1f0f3] group",
                    !formData.last_maintenance_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#f1f0f3] group-hover:text-[#4895d0]" />
                  {formData.last_maintenance_date ? (
                    format(formData.last_maintenance_date, "PPP")
                  ) : (
                    <span className="text-[#f1f0f3] group-hover:text-[#4895d0]">
                      Pick a date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.last_maintenance_date}
                  onSelect={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_maintenance_date: date,
                    }))
                  }
                  className={`bg-[#203152] text-[#f1f0f3]`}
                  classNames={{
                    head_cell:
                      "text-[#4895d0] rounded-md w-8 font-normal text-[0.8rem]",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f1f0f3] mb-2">
              Next Maintenance Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full p-3 h-12 border border-[#f1f0f3] bg-[#203152] text-[#f1f0f3] group",
                    !formData.next_maintenance_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#f1f0f3] group-hover:text-[#4895d0]" />
                  {formData.next_maintenance_date ? (
                    format(formData.next_maintenance_date, "PPP")
                  ) : (
                    <span className="text-[#f1f0f3] group-hover:text-[#4895d0]">
                      Pick a date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.next_maintenance_date}
                  onSelect={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      next_maintenance_date: date,
                    }))
                  }
                  className={`bg-[#203152] text-[#f1f0f3]`}
                  classNames={{
                    head_cell:
                      "text-[#4895d0] rounded-md w-8 font-normal text-[0.8rem]",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          type="submit"
          disabled={isLoading}
          className={`w-full p-4 bg-[#4895d0]/40 text-[#f1f0f3] rounded-md font-medium transition-colors
            ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#4895d0]/70"
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Registering Vehicle...
            </span>
          ) : (
            "Register Vehicle"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RegisterVehicle;
