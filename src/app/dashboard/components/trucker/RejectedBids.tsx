import React from "react";
import { Bid } from "@/types/bid";
import BidCard from "../bids/BidCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const RejectedBids = ({
  rejectedBids,
  isLoading,
  error,
}: {
  rejectedBids: Bid[];
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
      <h3 className="text-xl font-semibold mb-2">Rejected Bids</h3>
      {rejectedBids.length > 0 ? (
        rejectedBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
      ) : (
        <p>No rejected bids.</p>
      )}
    </div>
  );
};

export default RejectedBids;
