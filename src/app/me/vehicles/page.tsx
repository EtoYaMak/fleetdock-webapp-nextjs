"use client";

import { useProfileSidebar } from "../layout";
import { useVehicle } from "@/hooks/useVehicle";
import { useState } from "react";
import { VehicleFormData, VehicleWithType } from "@/types/vehicles";
import { VehiclesList } from "@/app/me/vehicles/components/VehiclesList";
import { EmptyVehiclesCard } from "@/app/me/vehicles/components/EmptyVehiclesCard";
import RegisterVehicle from "@/app/me/components/RegisterVehicle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export default function Vehicles() {
  const { auth } = useProfileSidebar();
  const { createVehicle, vehicles, deleteVehicle } = useVehicle();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterVehicle, setShowRegisterVehicle] = useState(false);

  if (!auth.user || auth.user.role !== "trucker") {
    return null;
  }

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      setIsLoading(true);
      await createVehicle(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (vehicle: VehicleWithType) => {
    await deleteVehicle(vehicle.id as string);
  };
  return (
    <div className=" max-w-7xl mx-auto py-6 min-h-screen">
      <div className="flex items-center justify-between mb-6 h-full">
        <h1 className="text-2xl font-semibold text-primary">
          Registered Vehicles ({vehicles.length})
        </h1>
        <Button
          className="w-40"
          onClick={() => setShowRegisterVehicle(!showRegisterVehicle)}
        >
          {showRegisterVehicle ? "Close" : "Register Vehicle"}
        </Button>
      </div>
      <div
        className={cn(
          "flex flex-1 items-start gap-4 overflow-hidden transition-all duration-300 h-full",
          showRegisterVehicle
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <RegisterVehicle
          user={auth.user}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
      {vehicles.length === 0 ? (
        <EmptyVehiclesCard />
      ) : (
        <VehiclesList
          vehicles={vehicles}
          onDelete={handleDelete}
          onEdit={(vehicle) => {
            // Handle edit functionality
            console.log("Edit vehicle:", vehicle);
          }}
        />
      )}
    </div>
  );
}
