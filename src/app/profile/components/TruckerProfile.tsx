"use client";

import { useAuth } from "@/context/AuthContext";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import ViewVehicles from "./vehicles/ViewVehicles";
import RegisterVehicle from "./vehicles/RegisterVehicle";
import { useState, useEffect } from "react";
import { Vehicle, VehicleType } from "@/types/profile";
import { useProfile } from "@/hooks/useProfile";
interface TruckerProfileProps {
  activeTab: string;
}

const TruckerProfile = ({ activeTab }: TruckerProfileProps) => {
  const { user } = useAuth();
  const { fetchVehicles, fetchVehicleTypes } = useProfile();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const [vehiclesResponse, typesResponse] = await Promise.all([
          fetchVehicles(),
          fetchVehicleTypes(),
        ]);
        setVehicles(vehiclesResponse?.vehicles || []);
        setVehicleTypes(typesResponse?.vehicleTypes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, fetchVehicles, fetchVehicleTypes]);

  const handleVehicleUpdate = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
  };

  const renderTruckerContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-24 h-24 bg-[#4895d0]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-[#4895d0]" />
              </div>
              <h1 className="text-2xl font-bold text-[#f1f0f3]">
                {user?.full_name}
              </h1>
              <p className="text-[#f1f0f3]">Trucker</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#4895d0]/10 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#f1f0f3]">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-[#f1f0f3]" />
                    <div>
                      <p className="text-sm text-[#f1f0f3]">Email</p>
                      <p className="font-medium text-[#f1f0f3]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-[#f1f0f3]" />
                    <div>
                      <p className="text-sm text-[#f1f0f3]">Phone</p>
                      <p className="font-medium text-[#f1f0f3]">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#4895d0]/10 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#f1f0f3]">
                  Account Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#f1f0f3]">Account Status</p>
                    <p className="font-medium capitalize text-[#f1f0f3]">
                      {user?.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#f1f0f3]">Role</p>
                    <p className="font-medium capitalize text-[#f1f0f3]">
                      {user?.role}
                    </p>
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
