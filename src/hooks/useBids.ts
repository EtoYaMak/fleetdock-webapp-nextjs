//src/hooks/useBids.ts
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Bid, BidWithProfile } from "@/types/bids";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { NextResponse } from "next/server";

export function useBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState<BidWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs for tracking mount state and fetch status
  const isMounted = useRef(true);
  const hasFetchedRef = useRef(false);
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 5000; // 5 seconds

  // Memoize trucker profile fetch
  const fetchTruckerProfile = useCallback(async (truckerId: string) => {
    if (!truckerId || hasFetchedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", truckerId)
        .single();

      if (profileError) throw profileError;
      if (!isMounted.current) return;

      hasFetchedRef.current = true;
      return data;
    } catch (error) {
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : "Failed to fetch trucker profile");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Optimize fetch all bids with cooldown
  const fetchAllBids = useCallback(async (loadId: string, forceFetch = false) => {
    const now = Date.now();
    if (!forceFetch && now - lastFetchTime.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: bidsError } = await supabase
        .from("bids")
        .select("*, profiles(*)")
        .eq("load_id", loadId)
        .order("created_at", { ascending: false });

      if (bidsError) throw bidsError;
      if (!isMounted.current) return;

      setBids(data as BidWithProfile[]);
      lastFetchTime.current = now;
    } catch (error) {
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : "Failed to fetch bids");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Optimize place bid with proper error handling
  const placeBid = useCallback(async (loadId: string, bidAmount: number) => {
    if (!user?.id) {
      setError("User must be logged in to place a bid");
      return { success: false, error: "User not authenticated" };
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error: bidError } = await supabase.from("bids").insert({
        load_id: loadId,
        trucker_id: user.id,
        bid_amount: bidAmount,
        bid_status: "pending"
      });

      if (bidError) throw bidError;

      // Refresh bids after placing new bid
      await fetchAllBids(loadId, true);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to place bid";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchAllBids]);

  // Optimize update bid status
  const updateBidStatus = useCallback(async (bidId: string, status: Bid["bid_status"]) => {
    if (!["accepted", "rejected"].includes(status)) {
      setError("Invalid bid status");
      return { success: false, error: "Invalid bid status" };
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("bids")
        .update({ bid_status: status })
        .eq("id", bidId);

      if (updateError) throw updateError;
      
      // Update local state
      setBids(prevBids => 
        prevBids.map(bid => 
          bid.id === bidId ? { ...bid, bid_status: status } : bid
        )
      );

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update bid status";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset fetch status when user changes
  useEffect(() => {
    hasFetchedRef.current = false;
    lastFetchTime.current = 0;
  }, [user?.id]);

  // Memoize return value
  return useMemo(() => ({
    bids,
    isLoading,
    error,
    fetchTruckerProfile,
    fetchAllBids,
    placeBid,
    updateBidStatus
  }), [
    bids,
    isLoading,
    error,
    fetchTruckerProfile,
    fetchAllBids,
    placeBid,
    updateBidStatus
  ]);
}
