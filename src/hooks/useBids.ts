/* 
create table
  public.bids (
    id uuid not null default gen_random_uuid (),
    load_id uuid not null,
    trucker_id uuid not null,
    bid_amount numeric not null,
    bid_status text null default 'pending'::text,
    created_at timestamp without time zone null default now(),
    updated_at timestamp without time zone null default now(),
    constraint bids_pkey1 primary key (id),
    constraint bids_load_id_fkey1 foreign key (load_id) references loads (id) on delete cascade,
    constraint bids_trucker_id_fkey1 foreign key (trucker_id) references profiles (id) on delete cascade
  ) tablespace pg_default;
*/
import { useState, useEffect, useCallback } from "react";
import { Bid, NewBid } from "@/types/bid";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
export const useBids = (loadId?: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch bids for a specific load
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
    async (newBid: NewBid) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bids")
          .insert([{ ...newBid, bid_status: "pending" }])
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

        // The trigger function will handle rejecting other bids
        // We just need to update the UI for the accepted bid
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
          description: "Failed to accept bid",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
          console.log("Received event:", payload.eventType);
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
      channel.unsubscribe();
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
