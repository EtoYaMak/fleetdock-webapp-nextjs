import { useState, useEffect, useCallback, useMemo } from "react";
import { Load } from "@/types/load";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { notifyLoadStatusChange } from "@/utils/loadNotifications";

export const useLoads = () => {
  const { toast } = useToast();
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch loads from Supabase
  const fetchLoads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: loadError } = await supabase.from("loads").select(`
          *,
          load_types (
            name,
            id
          ),
          vehicle_types (
            name,
            id
          )
        `);

      if (loadError) throw loadError;

      const transformedLoads = (data || []).map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        load_types: load.load_types.id,
        equipment_required_name: load.vehicle_types?.name,
        equipment_required: load.vehicle_types?.id,
      }));

      setLoads(transformedLoads);
    } catch (err) {
      console.error("Load fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch loads");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new load
  const createLoad = useCallback(
    async (newLoad: Load) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("loads").insert([newLoad]);
        toast({
          title: "Load posted successfully",
          variant: "default",
        });
        if (error) throw error;
        setLoads((prevLoads) => [...prevLoads, ...(data || [])]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Update an existing load
  const updateLoad = useCallback(async (updatedLoad: Load) => {
    setLoading(true);
    try {
      console.log("useLoads.ts: updateLoad", updatedLoad);
      const { data, error } = await supabase
        .from("loads")
        .update(updatedLoad)
        .eq("id", updatedLoad.id);
      if (error) throw error;
      setLoads((prevLoads) =>
        prevLoads.map((load) =>
          load.id === updatedLoad.id ? (data ? data[0] : load) : load
        )
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a load
  const deleteLoad = useCallback(async (loadId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("loads").delete().eq("id", loadId);
      if (error) throw error;
      setLoads((prevLoads) => prevLoads.filter((load) => load.id !== loadId));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // When updating a load's status
  const updateLoadStatus = useCallback(
    async (loadId: string, status: string, truckerId: string) => {
      const { error } = await supabase
        .from("loads")
        .update({ status: status })
        .eq("id", loadId);

      if (!error) {
        await notifyLoadStatusChange(truckerId, loadId, status);
      }
    },
    []
  );

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  // Memoize the return object
  return useMemo(
    () => ({
      loads,
      isLoading,
      error,
      createLoad,
      updateLoad,
      deleteLoad,
      updateLoadStatus,
    }),
    [
      loads,
      isLoading,
      error,
      createLoad,
      updateLoad,
      deleteLoad,
      updateLoadStatus,
    ]
  );
};
