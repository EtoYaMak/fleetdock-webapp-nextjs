import { useState, useEffect, useCallback } from "react";
import { Load } from "@/types/load";
import { supabase } from "@/lib/supabase";
import { toast, useToast } from "@/hooks/use-toast";
import { Bid } from "@/types/bid";
import { useAuth } from "@/context/AuthContext";

export const useTruckerDash = (filters?: Partial<Load>) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      const transformedLoads = (data || []).map((load) => ({
        ...load,
        load_type_name: load.load_types?.name,
        load_types: load.load_types.id,
      }));
      if (error) throw error;

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
  }, [filters, toast]);

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

export const useAcceptedBids = () => {
  const [acceptedBids, setAcceptedBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAcceptedBids = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
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
        .eq("bid_status", "accepted")
        .eq("trucker_id", user.id);
      if (error) throw error;
      setAcceptedBids(data as Bid[]);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch accepted bids",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAcceptedBids();
  }, [fetchAcceptedBids]);

  return { acceptedBids, isLoading, error };
};

export const usePendingBids = () => {
  const [pendingBids, setPendingBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPendingBids = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
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
        .eq("bid_status", "pending")
        .eq("trucker_id", user.id);
      if (error) throw error;
      setPendingBids(data as Bid[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPendingBids();
  }, [fetchPendingBids]);

  return { pendingBids, isLoading, error };
};

export const useRejectedBids = () => {
  const [rejectedBids, setRejectedBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRejectedBids = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
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
        .eq("bid_status", "rejected")
        .eq("trucker_id", user.id);
      if (error) throw error;
      setRejectedBids(data as Bid[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRejectedBids();
  }, [fetchRejectedBids]);

  return { rejectedBids, isLoading, error };
};
export default useTruckerDash;
