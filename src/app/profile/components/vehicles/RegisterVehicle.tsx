"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { FiTruck, FiCalendar, FiClipboard } from "react-icons/fi";

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

const RegisterVehicle = ({ vehicleTypes, onVehicleAdded }: RegisterVehicleProps) => {
  const { profile } = useAuth();
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
    insurance_expiry: "",
    last_maintenance_date: "",
    next_maintenance_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register vehicle");
      }

      onVehicleAdded(data.vehicle);
      setMessage({ type: "success", text: "Vehicle registered successfully!" });
      setFormData({
        vehicle_type_id: "",
        license_plate: "",
        manufacturer: "",
        model: "",
        year: new Date().getFullYear(),
        insurance_expiry: "",
        last_maintenance_date: "",
        next_maintenance_date: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to register vehicle",
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
      className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <FiTruck className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              name="vehicle_type_id"
              value={formData.vehicle_type_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.capacity} tons)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Plate
            </label>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Expiry
            </label>
            <input
              type="date"
              name="insurance_expiry"
              value={formData.insurance_expiry}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Maintenance Date
            </label>
            <input
              type="date"
              name="last_maintenance_date"
              value={formData.last_maintenance_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Maintenance Date
            </label>
            <input
              type="date"
              name="next_maintenance_date"
              value={formData.next_maintenance_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full p-4 bg-blue-600 text-white rounded-md font-medium 
            ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
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
