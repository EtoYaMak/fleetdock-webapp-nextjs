//src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from "react";
import {
  BrokerProfile,
  CompanyProfile,
  TruckerProfile,
  Vehicle,
} from "@/types/profile";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
export function useProfile() {
  const { user } = useAuth();
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(
    null
  );
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [truckerProfile, setTruckerProfile] = useState<TruckerProfile | null>(
    null
  );
  const [vehicleProfile, setVehicleProfile] = useState<Vehicle | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data: brokerData, error: brokerError } = await supabase
        .from("broker_businesses")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (brokerError) throw brokerError;
      setBrokerProfile(brokerData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  //Update Broker Profile
  const updateBrokerBusiness = async (businessData: Partial<BrokerProfile>) => {
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from("broker_businesses")
        .update(businessData)
        .eq("profile_id", user?.id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update business",
      };
    }
  };

  //fetch vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      if (!user?.id) return;
      const { data: vehicles, error } = await supabase
        .from("vehicles")
        .select(
          `
        *,
        vehicle_types (
          name,
          capacity
        )
      `
        )
        .eq("profile_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      return { vehicles, error };
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch vehicles"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  //fetch vehicle types
  const fetchVehicleTypes = useCallback(async () => {
    try {
      const { data: vehicleTypes, error } = await supabase
        .from("vehicle_types")
        .select("*");
      return { vehicleTypes, error };
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch vehicle types"
      );
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    brokerProfile,
    companyProfile,
    truckerProfile,
    vehicleProfile,
    isLoading,
    error,
    updateBrokerBusiness,
    fetchProfile,
    fetchVehicles,
    fetchVehicleTypes,
  };
}
