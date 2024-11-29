import { useState, useEffect } from "react";
import { Load } from "@/types/load";

export function useLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingAssignments: 0,
    inProgressLoads: 0,
    completedLoads: 0,
  });

  const fetchLoads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/loads");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setLoads(data.loads);
      updateStats(data.loads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch loads");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (loadData: Load[]) => {
    setStats({
      activeLoads: loadData.filter((load) => load.status === "available")
        .length,
      pendingAssignments: loadData.filter((load) => load.status === "pending")
        .length,
      inProgressLoads: loadData.filter((load) => load.status === "in_progress")
        .length,
      completedLoads: loadData.filter((load) => load.status === "completed")
        .length,
    });
  };

  const deleteLoad = async (loadId: string) => {
    try {
      const response = await fetch(`/api/loads/${loadId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

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
  }, []);

  return {
    loads,
    isLoading,
    error,
    stats,
    refetch: fetchLoads,
    deleteLoad,
  };
}
