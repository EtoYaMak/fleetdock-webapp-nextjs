//src/hooks/useBids.ts
import { useState, useEffect, useCallback } from "react";
import { Bid, BidWithProfile } from "@/types/bids";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { NextResponse } from "next/server";

export function useBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState<BidWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false); // Track if bids have been fetched

  //PUBLIC fetch trucker profile via bids.trucker_id
  const fetchTruckerProfile = useCallback(async (truckerId: string) => {
    try {
      if (!truckerId) return;
      if (hasFetched) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", truckerId);

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error as string);
    }
  }, []);
  //PUBLIC all FETCH BIDS
  const fetchAllBids = useCallback(
    async (loadId: string) => {
      try {
        if (hasFetched) return;
        setIsLoading(true);
        const { data, error } = await supabase
          .from("bids")
          .select("*")
          .eq("load_id", loadId);
        if (error) throw error;
        setBids(data as BidWithProfile[]);
        setHasFetched(true);
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    },
    [hasFetched]
  );
  //PUBLIC trucker can place bid on load
  const placeBid = async (loadId: string, bidAmount: number) => {
    try {
      if (!user?.id) return;
      if (hasFetched) return;
      setIsLoading(true);
      const { error } = await supabase.from("bids").insert({
        load_id: loadId,
        trucker_id: user?.id,
        bid_amount: bidAmount,
      });
      if (error) throw error;
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };
  //PRIVATE trucker fetch ALL my bids
  const fetchBids = useCallback(async () => {
    try {
      if (hasFetched) return;
      setIsLoading(true);
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("bids")
        .select("*")
        .eq("trucker_id", user.id);
      if (error) throw error;
      setBids(data);
      setHasFetched(true);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, hasFetched]);

  //PUBLIC fetch Bids For Load.id
  const fetchBidsForLoad = useCallback(
    async (loadId: string) => {
      try {
        if (hasFetched) return;
        setIsLoading(true);
        const { data, error } = await supabase
          .from("bids")
          .select(
            `
        id,
        load_id,
        trucker_id,
        bid_amount,
        bid_status,
        created_at,
        updated_at
      `
          )
          .eq("load_id", loadId)
          .order("bid_amount", { ascending: false });
        if (error) throw error;
        setBids(data as BidWithProfile[]);
        setHasFetched(true);
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    },
    [hasFetched]
  );

  //PRIVATE broker PUT bid status
  const updateBidStatus = async (bidId: string, status: Bid["bid_status"]) => {
    try {
      //get bid status from request
      if (!status || !["accepted", "rejected"].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid bid status. Must be "accepted" or "rejected"' },
          { status: 400 }
        );
      }

      // Update the bid status
      const { error: bidError } = await supabase
        .from("bids")
        .update({ bid_status: status })
        .eq("id", bidId)
        .select()
        .single();

      if (bidError) throw bidError;
    } catch (error) {
      setError(error as string);
    }
  };

  //Private Trucker DELETE my bid for load.id
  const deleteBidforLoad = async (loadId: string) => {
    try {
      const { error } = await supabase
        .from("bids")
        .delete()
        .eq("load_id", loadId)
        .eq("trucker_id", user?.id)
        .single();
      if (error) throw error;
    } catch (error) {
      setError(error as string);
    }
  };
  //hooks
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return {
    bids,
    isLoading,
    error,
    fetchAllBids,
    fetchBids,
    fetchBidsForLoad,
    updateBidStatus,
    deleteBidforLoad,
    fetchTruckerProfile,
    placeBid,
  };
}
