"use client";

import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiTruck, FiPlus } from "react-icons/fi";
import Link from "next/link";

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

interface ViewVehiclesProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onVehiclesUpdate: (vehicles: Vehicle[]) => void;
}

export default function ViewVehicles({
  vehicles,
  isLoading,
  onVehiclesUpdate,
}: ViewVehiclesProps) {
  const handleDelete = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/vehicles?id=${vehicleId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.error) {
        const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId);
        onVehiclesUpdate(updatedVehicles);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
        <FiTruck className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Vehicles Registered {}
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Get started by registering your first vehicle.
        </p>
        <Link href="/profile?tab=register-vehicle">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Register Your First Vehicle
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Vehicles</h2>
        <Link href="/profile?tab=register-vehicle">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Vehicle
          </motion.button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {vehicle.manufacturer} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-600">{vehicle.year}</p>
              </div>
              <span
                className={`text-sm font-medium capitalize 
                ${
                  vehicle.status === "approved"
                    ? "text-green-500"
                    : vehicle.status === "rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {vehicle.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Type:</span>{" "}
                {vehicle.vehicle_type_id}
              </p>
              <p>
                <span className="font-medium">License Plate:</span>{" "}
                {vehicle.license_plate}
              </p>
              <p>
                <span className="font-medium">Insurance Expiry:</span>{" "}
                {vehicle.insurance_expiry}
              </p>
              <p>
                <span className="font-medium">Last Maintenance Date:</span>{" "}
                {vehicle.last_maintenance_date}
              </p>
              <p>
                <span className="font-medium">Next Maintenance Date:</span>{" "}
                {vehicle.next_maintenance_date}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  /* Implement edit functionality */
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
