"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SideNav from "./components/SideNav";
import BasicProfile from "./components/BasicProfile";
import RegisterVehicle from "./components/vehicles/RegisterVehicle";
import BrokerProfile from "./components/BrokerProfile";
import TruckerProfile from "./components/TruckerProfile";
import ViewVehicles from "./components/vehicles/ViewVehicles";
import { useAuth } from "@/hooks/useAuth";

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

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vehicles and vehicle types once when profile is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!profile) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch both in parallel
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

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  // Listen for URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleVehicleUpdate = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <BasicProfile />;
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
      case "company":
        return profile?.role === "broker" ? <BrokerProfile /> : null;
      case "trucker":
        return profile?.role === "trucker" ? <TruckerProfile /> : null;
      default:
        return <BasicProfile />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <SideNav activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
}
