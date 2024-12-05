//src/hooks/useProfile.ts
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BrokerProfile } from "@/types/profile";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
  const { user } = useAuth();
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track component mount state and fetch status
  const isMounted = useRef(true);
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 5000; // 5 seconds

  // Memoize fetch profile function
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    const now = Date.now();
    if (now - lastFetchTime.current < FETCH_COOLDOWN) return;

    lastFetchTime.current = now;
    setIsLoading(true);

    try {
      if (user?.role === "broker") {
        const { data: brokerData, error: brokerError } = await supabase
          .from("broker_businesses")
          .select("*")
          .eq("profile_id", user.id)
          .single();

        if (brokerError) throw brokerError;
        setBrokerProfile(brokerData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role]);
  // Add focus event handler
  const handleFocus = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchTime.current >= FETCH_COOLDOWN) {
      lastFetchTime.current = now;
      fetchProfile();
    }
  }, [fetchProfile]);
  // Memoize update broker business function
  const updateBrokerBusiness = useCallback(
    async (businessData: Partial<BrokerProfile>) => {
      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      try {
        setIsLoading(true);
        setError(null);

        const { error: updateError } = await supabase
          .from("broker_businesses")
          .update(businessData)
          .eq("profile_id", user.id);

        if (updateError) throw updateError;

        // Refresh profile after update
        await fetchProfile();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update business";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, fetchProfile]
  );

  // Memoize fetch vehicles function
  const fetchVehicles = useCallback(async () => {
    if (!user?.id) return { vehicles: [], error: "User not authenticated" };

    try {
      setError(null);
      const { data: vehicles, error: vehiclesError } = await supabase
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

      if (vehiclesError) throw vehiclesError;
      return { vehicles, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch vehicles";
      setError(errorMessage);
      return { vehicles: [], error: errorMessage };
    }
  }, [user?.id]);

  // Memoize fetch vehicle types function
  const fetchVehicleTypes = useCallback(async () => {
    try {
      setError(null);
      const { data: vehicleTypes, error: typesError } = await supabase
        .from("vehicle_types")
        .select("*");

      if (typesError) throw typesError;
      return { vehicleTypes, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch vehicle types";
      setError(errorMessage);
      return { vehicleTypes: [], error: errorMessage };
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchProfile();

    // Add focus event listener
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      isMounted.current = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProfile, handleFocus]);

  // Memoize return value
  return useMemo(
    () => ({
      brokerProfile,
      isLoading,
      error,
      updateBrokerBusiness,
      fetchProfile,
      fetchVehicles,
      fetchVehicleTypes,
    }),
    [
      brokerProfile,
      isLoading,
      error,
      updateBrokerBusiness,
      fetchProfile,
      fetchVehicles,
      fetchVehicleTypes,
    ]
  );
}
