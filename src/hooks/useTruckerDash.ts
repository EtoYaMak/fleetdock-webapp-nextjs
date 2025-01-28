import { useState, useEffect, useCallback } from "react";
import { Load } from "@/types/load";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Bid } from "@/types/bid";
import { useAuth } from "@/context/AuthContext";

// Reusable function to fetch bids based on status
const fetchBids = async (status: string, userId: string) => {
  const { data, error } = await supabase
    .from("bids")
    .select(
      `
      *,
      trucker:profiles!bids_trucker_id_fkey1(
        full_name,
        email,
        phone
      )
    `
    )
    .eq("bid_status", status)
    .eq("trucker_id", userId);

  if (error) throw error;
  return data as Bid[];
};

export const useTruckerDash = (filters?: Partial<Load>) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoads = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("loads")
        .select(
          `
          *,
          load_types (
            name,
            id
          )                
        `
        )
        .order("created_at", { ascending: false });

      if (filters?.bid_enabled !== undefined) {
        query = query.eq("bid_enabled", filters.bid_enabled);
      }

      const { data, error } = await query;
      if (error) throw error;

      const transformedLoads = (data || []).map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        load_types: load.load_types.id,
      }));

      setLoads(transformedLoads as Load[]);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch loads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  return {
    loads,
    isLoading,
    error,
    refetch: fetchLoads,
  };
};

export const useBids = () => {
  const [acceptedBids, setAcceptedBids] = useState<Bid[]>([]);
  const [pendingBids, setPendingBids] = useState<Bid[]>([]);
  const [rejectedBids, setRejectedBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAllBids = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [accepted, pending, rejected] = await Promise.all([
        fetchBids("accepted", user.id),
        fetchBids("pending", user.id),
        fetchBids("rejected", user.id),
      ]);

      setAcceptedBids(accepted);
      setPendingBids(pending);
      setRejectedBids(rejected);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch bids",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAllBids();
  }, [fetchAllBids]);

  return {
    acceptedBids,
    pendingBids,
    rejectedBids,
    isLoading,
    error,
    refetch: fetchAllBids,
  };
};

export default useTruckerDash;
