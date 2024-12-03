import { useState, useEffect, useCallback } from "react";
import { Load, LoadType } from "@/types/loads";
import supabase from "@/lib/supabase";

export function useLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTypes, setLoadTypes] = useState<Record<string, LoadType>>({});
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingAssignments: 0,
    inProgressLoads: 0,
    completedLoads: 0,
  });

  const fetchLoads = useCallback(async () => {
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

      setLoads(transformedLoads);
      updateStats(transformedLoads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch loads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStats = (loadData: Load[]) => {
    setStats({
      activeLoads: loadData.filter((load) => load.status === "available")
        .length,
      pendingAssignments: loadData.filter(
        (load) => load.status === "pending" || load.status === "posted"
      ).length,
      inProgressLoads: loadData.filter((load) => load.status === "in_progress")
        .length,
      completedLoads: loadData.filter((load) => load.status === "completed")
        .length,
    });
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
    fetchLoads();
  }, [fetchLoads]);

  return {
    loads,
    isLoading,
    error,
    stats,
    refetch: fetchLoads,
    loadTypes,
    deleteLoad,
  };
}
