import { useState, useEffect } from "react";
import { LoadType } from "@/types/load-type";

export function useLoadTypes() {
  const [loadTypes, setLoadTypes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadTypes = async () => {
      try {
        const response = await fetch("/api/load-types");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const typeMap = data.loadTypes.reduce(
          (acc: Record<string, string>, type: LoadType) => {
            acc[type.id] = type.name;
            return acc;
          },
          {}
        );
        setLoadTypes(typeMap);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch load types"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadTypes();
  }, []);

  return { loadTypes, isLoading, error };
}
