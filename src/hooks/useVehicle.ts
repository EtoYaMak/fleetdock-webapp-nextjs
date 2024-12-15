//CRUD for  Vehicle
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { VehicleFormData, VehicleWithType } from "@/types/vehicles";

export const useVehicle = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleWithType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const { data: vehicles, error } = await supabase
        .from("vehicles")
        .select(`* , vehicle_type:vehicle_types(*)`)
        .eq("trucker_id", user.id);

      if (error) throw error;
      setVehicles(vehicles as VehicleWithType[]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  //CRUD for Vehicle
  const createVehicle = async (data: VehicleFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // Extract only the necessary fields for creation
      const { id, vehicle_type, ...createData } = data as any;

      const { error } = await supabase.from("vehicles").insert(createData);

      if (error) throw error;

      // Fetch the newly created vehicle with its relations
      const { data: newVehicle, error: fetchError } = await supabase
        .from("vehicles")
        .select(`*, vehicle_type:vehicle_types(*)`)
        .eq("trucker_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      setVehicles([...vehicles, newVehicle as VehicleWithType]);
    } catch (err) {
      console.error(err);
      setError("Failed to create vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicle = async (data: VehicleWithType) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // Extract only the necessary fields for update
      const { id, vehicle_type, created_at, ...updateData } = data as any;

      const { error } = await supabase
        .from("vehicles")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Fetch the updated vehicle with its relations
      const { data: updatedVehicle, error: fetchError } = await supabase
        .from("vehicles")
        .select(`*, vehicle_type:vehicle_types(*)`)
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === id ? (updatedVehicle as VehicleWithType) : vehicle
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
