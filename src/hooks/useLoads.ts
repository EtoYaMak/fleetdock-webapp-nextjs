import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Load, LoadType } from "@/types/loads";
import supabase from "@/lib/supabase";

export function useLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTypes] = useState<Record<string, LoadType>>({});

  // Use ref to track component mount state and fetch cooldown
  const isMounted = useRef(true);
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 5000; // 5 seconds

  // Memoize stats calculation
  const stats = useMemo(() => ({
    activeLoads: loads.filter((load) => load.status === "available").length,
    pendingAssignments: loads.filter(
      (load) => load.status === "pending" || load.status === "posted"
    ).length,
    completedLoads: loads.filter((load) => load.status === "completed").length,
  }), [loads]);

  // Optimize fetch loads with better error handling and cooldown
  const fetchLoads = useCallback(async (forceFetch = false) => {
    const now = Date.now();
    if (!forceFetch && now - lastFetchTime.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from("loads")
        .select(`
          *,
          load_types (
            name,
            id
          )
        `);

      if (loadError) throw loadError;

      if (!isMounted.current) return;

      // Transform data only if component is still mounted
      const transformedLoads = data?.map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        load_types: undefined,
      })) || [];

      setLoads(transformedLoads);
      lastFetchTime.current = now;

    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Failed to fetch loads");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Memoize delete function
  const deleteLoad = useCallback(async (loadId: string) => {
    try {
      setError(null);
      const { error } = await supabase.from("loads").delete().eq("id", loadId);
      
      if (error) throw error;

      setLoads((prevLoads) => prevLoads.filter((load) => load.id !== loadId));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete load";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchLoads(true);

    return () => {
      isMounted.current = false;
    };
  }, [fetchLoads]);

  // Window focus handler with cooldown
  useEffect(() => {
    const handleFocus = () => {
      if (Date.now() - lastFetchTime.current >= FETCH_COOLDOWN) {
        fetchLoads();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchLoads]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    loads,
    stats,
    isLoading,
    error,
    refetch: fetchLoads,
    loadTypes,
    deleteLoad,
  }), [loads, stats, isLoading, error, fetchLoads, loadTypes, deleteLoad]);
}
