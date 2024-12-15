import React, { memo } from "react";
import PendingBids from "./PendingBids";
import AcceptedBids from "./AcceptedBids";
import RejectedBids from "./RejectedBids";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useAcceptedBids,
  usePendingBids,
  useRejectedBids,
} from "@/hooks/useTruckerDash";
import { Bid } from "@/types/bid";

const MyBids = () => {
  const { acceptedBids, isLoading, error } = useAcceptedBids();
  const {
    pendingBids,
    isLoading: isLoadingPending,
    error: errorPending,
  } = usePendingBids();
  const {
    rejectedBids,
    isLoading: isLoadingRejected,
    error: errorRejected,
  } = useRejectedBids();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
      <div className="space-y-6">
        <PendingBids
          pendingBids={pendingBids as Bid[]}
          isLoading={isLoadingPending}
          error={errorPending}
        />
        <AcceptedBids
          acceptedBids={acceptedBids as Bid[]}
          isLoading={isLoading}
          error={error}
        />
        <RejectedBids
          rejectedBids={rejectedBids as Bid[]}
          isLoading={isLoadingRejected}
          error={errorRejected}
        />
      </div>
    </section>
  );
};

MyBids.displayName = "MyBids";
export default MyBids;
