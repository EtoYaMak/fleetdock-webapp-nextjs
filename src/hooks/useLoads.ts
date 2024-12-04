import { useState, useEffect, useCallback, useRef } from "react";
import { Load, LoadType } from "@/types/loads";
import supabase from "@/lib/supabase";

export function useLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingAssignments: 0,
    completedLoads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTypes] = useState<Record<string, LoadType>>({});

  // Use ref to track if the component is mounted
  const isMounted = useRef(true);

  // Track last fetch time to prevent too frequent updates
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 5000; // 5 seconds

  const fetchLoads = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setIsLoading(true);

      // Fetch loads with load type information using a join
      const { data, error: loadError } = await supabase.from("loads").select(`
          *,
          load_types (
            name,
            id
          )
        `);

      if (loadError) throw loadError;

      // Transform the data to merge load_type name into each load
      const transformedLoads = (data || []).map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        // Remove the nested load_types object if you don't need it
        load_types: undefined,
      }));

      if (isMounted.current) {
        setLoads(transformedLoads);
        // Update stats based on the loads
        setStats(calculateStats(transformedLoads));
        lastFetchTime.current = now;
      }
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

  const calculateStats = (loadData: Load[]) => {
    return {
      activeLoads: loadData.filter((load) => load.status === "available")
        .length,
      pendingAssignments: loadData.filter(
        (load) => load.status === "pending" || load.status === "posted"
      ).length,
      completedLoads: loadData.filter((load) => load.status === "completed")
        .length,
    };
  };

  const deleteLoad = async (loadId: string) => {
    try {
      await supabase.from("loads").delete().eq("id", loadId);

      setLoads((prevLoads) => prevLoads.filter((load) => load.id !== loadId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete load",
      };
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchLoads();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [fetchLoads]);

  // Only re-fetch on window focus if enough time has passed
  useEffect(() => {
    const handleFocus = () => {
      if (Date.now() - lastFetchTime.current >= FETCH_COOLDOWN) {
        fetchLoads();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchLoads]);

  return {
    loads,
    stats,
    isLoading,
    error,
    refetch: fetchLoads,
    loadTypes,
    deleteLoad,
  };
}
