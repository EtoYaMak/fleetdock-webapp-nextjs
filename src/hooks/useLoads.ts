import { useState, useEffect, useCallback } from "react";
import { Load } from "@/types/load";

export function useLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingAssignments: 0,
    completedLoads: 0,
  });

  const fetchLoads = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/loads");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setLoads(data.loads);
      setStats({
        activeLoads: data.loads.filter((l: Load) => l.status === 'available').length,
        pendingAssignments: data.loads.filter((l: Load) => l.status === 'pending').length,
        completedLoads: data.loads.filter((l: Load) => l.status === 'completed').length,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch loads");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshLoads = useCallback(() => {
    fetchLoads();
  }, [fetchLoads]);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  const deleteLoad = useCallback(async (loadId: string) => {
    try {
      const response = await fetch(`/api/loads/${loadId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      await fetchLoads(); // Refresh loads after deletion
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete load",
      };
    }
  }, [fetchLoads]);

  return { loads, isLoading, error, stats, deleteLoad, refreshLoads };
}
