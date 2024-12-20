import React, { memo } from "react";
import { usePendingBids } from "@/hooks/useTruckerDash";
import BidCard from "../bids/BidCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Bid } from "@/types/bid";

const PendingBids = ({
  pendingBids,
  isLoading,
  error,
}: {
  pendingBids: Bid[];
  isLoading: boolean;
  error: string | null;
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Pending Bids</h3>
      {pendingBids.length > 0 ? (
        pendingBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
      ) : (
        <p>No pending bids.</p>
      )}
    </div>
  );
};

PendingBids.displayName = "PendingBids";
export default PendingBids;
