import React, { memo } from "react";
import { User } from "@/types/auth";
import MyBids from "./trucker/MyBids";
import Statistics from "./trucker/Statistics";
import {
  useAcceptedBids,
  usePendingBids,
  useRejectedBids,
} from "@/hooks/useTruckerDash";

const TruckerDashboard = ({ user }: { user: User }) => {
  const { acceptedBids } = useAcceptedBids();
  const { pendingBids } = usePendingBids();
  const { rejectedBids } = useRejectedBids();

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <header className="mb-4">
        <p className="text-lg text-center">
          Here's an overview of your activities.
        </p>
      </header>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Statistics
          acceptedBids={acceptedBids}
          pendingBids={pendingBids}
          rejectedBids={rejectedBids}
        />

        <MyBids />
      </div>
    </div>
  );
};

export default memo(TruckerDashboard);
