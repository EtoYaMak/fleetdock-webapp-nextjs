import React, { memo } from "react";
import { User } from "@/types/auth";
import AvailableLoads from "./trucker/AvailableLoads";
import MyBids from "./trucker/MyBids";
import Statistics from "./trucker/Statistics";

const TruckerDashboard = ({ user }: { user: User }) => {
  return (
    <div className="p-6 bg-[#111a2e] min-h-screen text-[#f1f0f3]">
      {/* Welcome Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome, {user.full_name}!</h1>
        <p className="text-lg">Here's an overview of your activities.</p>
      </header>

      {/* Statistics Section */}
      <Statistics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Available Loads */}
        <AvailableLoads />

        {/* My Bids */}
        <MyBids />
      </div>
    </div>
  );
};

export default memo(TruckerDashboard);
