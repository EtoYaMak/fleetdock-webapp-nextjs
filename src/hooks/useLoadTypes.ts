import { useState, useEffect, useCallback } from "react";
import { LoadType } from "@/types/load";
import supabase from "@/lib/supabase";

export const useLoadTypes = () => {
  const [loadTypes, setLoadTypes] = useState<LoadType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoadTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error: loadTypesError } = await supabase
        .from("load_types")
        .select("*");

      if (loadTypesError) throw loadTypesError;
      setLoadTypes(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch load types"
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLoadTypes();
  }, [fetchLoadTypes]);

  return { loadTypes, isLoading, error, fetchLoadTypes };
};
