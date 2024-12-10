import { useState, useEffect, useCallback } from "react";
import { Load, LoadType } from "@/types/load";
import { createClient } from "@/utils/supabase/client";
export const useLoads = () => {
  const supabase = createClient();
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
                )                
            `);

      if (loadError) throw loadError;

      const transformedLoads = (data || []).map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        load_types: load.load_types.id,
      }));

      setLoads(transformedLoads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch loads");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new load
  const createLoad = async (newLoad: Load) => {
    setLoading(true);
    const { data, error } = await supabase.from("loads").insert([newLoad]);
    if (error) {
      setError(error.message);
    } else {
      setLoads((prevLoads) => [...prevLoads, ...(data || [])]);
    }
    setLoading(false);
  };

  // Update an existing load
  const updateLoad = async (updatedLoad: Load) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("loads")
      .update(updatedLoad)
      .eq("id", updatedLoad.id);
    if (error) {
      setError(error.message);
    } else {
      setLoads((prevLoads) =>
        prevLoads.map((load) =>
          load.id === updatedLoad.id ? (data ? data[0] : load) : load
        )
      );
    }
    setLoading(false);
  };

  // Delete a load
  const deleteLoad = async (loadId: string) => {
    setLoading(true);
    const { error } = await supabase.from("loads").delete().eq("id", loadId);
    if (error) {
      setError(error.message);
    } else {
      setLoads((prevLoads) => prevLoads.filter((load) => load.id !== loadId));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  return {
    loads,
    isLoading,
    error,
    createLoad,
    updateLoad,
    deleteLoad,
  };
};
