import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "@/types/vehicles";
import { supabase } from "@/lib/supabase";

export const useVehiclesTypes = () => {
  const [vehiclesTypes, setVehiclesTypes] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiclesTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error: vehiclesTypesError } = await supabase
        .from("vehicle_types")
        .select("*");

      if (vehiclesTypesError) throw vehiclesTypesError;
      setVehiclesTypes(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch vehicles types"
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchVehiclesTypes();
  }, [fetchVehiclesTypes]);

  return { vehiclesTypes, isLoading, error, fetchVehiclesTypes };
};
