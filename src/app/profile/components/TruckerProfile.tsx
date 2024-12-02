"use client";

import { useAuth } from "@/hooks/useAuth";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import ViewVehicles from "./vehicles/ViewVehicles";
import RegisterVehicle from "./vehicles/RegisterVehicle";
import { useState, useEffect } from "react";

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

interface TruckerProfileProps {
  activeTab: string;
}

const TruckerProfile = ({ activeTab }: TruckerProfileProps) => {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) {
        setIsLoading(false);
        return;
      }

      try {
        const [vehiclesResponse, typesResponse] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/vehicle-types")
        ]);

        const [vehiclesData, typesData] = await Promise.all([
          vehiclesResponse.json(),
          typesResponse.json()
        ]);
        
        if (vehiclesData.error) {
          console.error("Error in vehicles response:", vehiclesData.error);
          setVehicles([]);
        } else {
          setVehicles(vehiclesData.vehicles || []);
        }

        if (!typesData.error) {
          setVehicleTypes(typesData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const handleVehicleUpdate = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
  };

  const renderTruckerContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
              <p className="text-gray-600">Trucker</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Account Status</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium capitalize">
                      {profile?.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "vehicles":
        return (
          <ViewVehicles 
            vehicles={vehicles} 
            isLoading={isLoading} 
            onVehiclesUpdate={handleVehicleUpdate} 
          />
        );
      case "register-vehicle":
        return (
          <RegisterVehicle 
            vehicleTypes={vehicleTypes}
            onVehicleAdded={(newVehicle) => {
              setVehicles([newVehicle, ...vehicles]);
            }} 
          />
        );
      default:
        return null;
    }
  };

  return renderTruckerContent();
};

export default TruckerProfile;
