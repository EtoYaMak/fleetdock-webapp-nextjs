import { useState, useEffect, useCallback } from "react";
import { Bid } from "@/types/bid";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
export const useBids = (loadId?: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkAccess } = useFeatureAccess();

  // Fetch bids for a specific load
  const fetchBids = useCallback(async () => {
    if (!loadId) return;

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
        .eq("load_id", loadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBids(data as Bid[]);
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
  }, [loadId, toast]);

  // Create a new bid
  const createBid = useCallback(
    async (newBid: Bid) => {
      setLoading(true);
      try {
        //add bid_status to newBid and remove trucker object
        const { trucker, ...bidData } = newBid;
        const { data, error } = await supabase
          .from("bids")
          .insert([{ ...bidData, bid_status: "pending" }])
          .select()
          .single();

        if (error) throw error;
        setBids((prev) => [data, ...prev]);
        toast({
          title: "Success",
          description: "Bid placed successfully",
        });
        return data;
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to place bid",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Update an existing bid
  const updateBid = useCallback(
    async (id: string, updates: Partial<Bid>) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bids")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        setBids((prev) => prev.map((bid) => (bid.id === id ? data : bid)));
        toast({
          title: "Success",
          description: "Bid updated successfully",
        });
        return data;
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to update bid",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Delete a bid
  const deleteBid = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const { error } = await supabase.from("bids").delete().eq("id", id);
        if (error) throw error;
        setBids((prev) => prev.filter((bid) => bid.id !== id));

        toast({
          title: "Success",
          description: "Bid deleted successfully",
        });
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to delete bid",
          variant: "destructive",
        });
        // Only refresh all bids if there's an error
        await fetchBids();
      } finally {
        setLoading(false);
      }
    },
    [toast, fetchBids]
  );

  // Accept a bid
  const acceptBid = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        // First, get the bid details to check trucker_id
        const { data: bidData, error: bidError } = await supabase
          .from("bids")
          .select("*")
          .eq("id", id)
          .single();

        if (bidError) throw bidError;

        // Check if trucker has reached their active load limit
        const canAcceptMoreLoads = await checkAccess(
          "active_loads",
          bidData.trucker_id
        );
        if (!canAcceptMoreLoads) {
          throw new Error(
            "Trucker has reached their maximum active loads limit"
          );
        }

        // If check passes, proceed with accepting the bid
        const { data, error } = await supabase
          .from("bids")
          .update({ bid_status: "accepted" })
          .eq("id", id)
          .select(
            `
            *,  
            load:loads(broker_id)
          `
          )
          .single();

        if (error) throw error;

        setBids((prev) =>
          prev.map((bid) =>
            bid.id === id ? { ...bid, bid_status: "accepted" } : bid
          )
        );

        toast({
          title: "Success",
          description: "Bid accepted successfully",
        });
        return data;
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description:
            error.message ===
            "Trucker has reached their maximum active loads limit"
              ? "Cannot accept bid: Trucker has reached their maximum active loads limit"
              : "Failed to accept bid",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast, checkAccess]
  );

  // Reject a bid
  const rejectBid = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bids")
          .update({ bid_status: "rejected" })
          .eq("id", id)
          .select(
            `
            *,
            load:loads(broker_id)
          `
          )
          .single();

        if (error) throw error;

        setBids((prev) =>
          prev.map((bid) =>
            bid.id === id ? { ...bid, bid_status: "rejected" } : bid
          )
        );

        toast({
          title: "Success",
          description: "Bid rejected successfully",
        });
        return data;
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to reject bid",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  //undo bid_status to pending
  const undoBidStatus = useCallback(
    async (id: string) => {
      await updateBid(id, { bid_status: "pending" });
    },
    [updateBid]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!loadId) return;

    const channel = supabase.channel(`bids:${loadId}`);

    const subscription = channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setBids((prev) => [payload.new as Bid, ...prev]);
              break;
            case "UPDATE":
              setBids((prev) =>
                prev.map((bid) =>
                  bid.id === (payload.new as Bid).id
                    ? (payload.new as Bid)
                    : bid
                )
              );
              break;
            case "DELETE":
              setBids((prev) =>
                prev.filter((bid) => bid.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadId]);

  // Initial fetch
  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return {
    bids,
    isLoading,
    error,
    fetchBids,
    createBid,
    updateBid,
    deleteBid,
    acceptBid,
    rejectBid,
    undoBidStatus,
  };
};
