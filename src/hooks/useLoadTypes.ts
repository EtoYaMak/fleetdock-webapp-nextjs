import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { LoadType } from "@/types/loads";

export function useLoadTypes() {
  const [loadTypes, setLoadTypes] = useState<LoadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLoadTypes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("load_types")
          .select("*")
          .order("name");

        if (error) throw error;

        if (isMounted) {
          setLoadTypes(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch load types"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLoadTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loadTypes, isLoading, error };
}
