import React from "react";
import { useAcceptedBids } from "@/hooks/useTruckerDash";
import BidCard from "../bids/BidCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Bid } from "@/types/bid";

const AcceptedBids = () => {
  const { acceptedBids, isLoading, error } = useAcceptedBids();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Accepted Bids</h3>
      {acceptedBids.length > 0 ? (
        acceptedBids.map((bid) => <BidCard key={bid.id} bid={bid} />)
      ) : (
        <p>No accepted bids.</p>
      )}
    </div>
  );
};

export default AcceptedBids;
