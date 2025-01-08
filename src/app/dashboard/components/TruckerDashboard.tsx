import React, { memo } from "react";
import { User } from "@/types/auth";
import MyBids from "./trucker/MyBids";
import Statistics from "./trucker/Statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAcceptedBids,
  usePendingBids,
  useRejectedBids,
} from "@/hooks/useTruckerDash";
import { useProfile } from "@/hooks/useProfile";
import { FiTruck, FiClock, FiCheck, FiX } from "react-icons/fi";
import { membershipTiers } from "@/config/membershipTiers";

const TruckerDashboard = ({ user }: { user: User }) => {
  const { acceptedBids } = useAcceptedBids();
  const { pendingBids } = usePendingBids();
  const { rejectedBids } = useRejectedBids();
  const { profile } = useProfile();

  // Get tier limits
  const tierLimits = profile?.membership_tier
    ? membershipTiers.trucker[
        profile.membership_tier as keyof typeof membershipTiers.trucker
      ].features
    : null;

  const formatLimit = (used: number, limit: number | string) => {
    if (limit === "unlimited") return `${used} / Unlimited`;
    return `${used} / ${limit}`;
  };

  // Calculate stats
  const stats = [
    {
      title: "Total Bids",
      value: pendingBids.length + acceptedBids.length + rejectedBids.length,
      icon: <FiTruck className="h-4 w-4" />,
      description: "All time bids placed",
    },
    {
      title: "Active Bids",
      value: acceptedBids.length,
      icon: <FiCheck className="h-4 w-4" />,
      description:
        acceptedBids.length === tierLimits?.active_loads ? (
          <span>
            ⚠️ {acceptedBids.length} / {tierLimits.active_loads}{" "}
          </span>
        ) : (
          formatLimit(acceptedBids.length, tierLimits?.active_loads || 0)
        ),
    },
    {
      title: "Pending Bids",
      value: pendingBids.length,
      icon: <FiClock className="h-4 w-4" />,
      description: "Awaiting response",
    },
    {
      title: "Rejected Bids",
      value: rejectedBids.length,
      icon: <FiX className="h-4 w-4" />,
      description: "Not accepted",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.full_name}!
        </h2>
      </div> */}

      {/* Membership Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Tier</p>
            <p className="text-2xl font-semibold capitalize">
              {profile?.membership_tier
                ? profile.membership_tier
                : "Loading..."}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Bids Available</p>
            <span className="text-2xl font-semibold">
              {tierLimits ? (
                <div>
                  {acceptedBids.length +
                    pendingBids.length +
                    rejectedBids.length ===
                  tierLimits.bids_per_month ? (
                    <span>
                      ⚠️{" "}
                      {acceptedBids.length +
                        pendingBids.length +
                        rejectedBids.length}{" "}
                      / {tierLimits.bids_per_month}{" "}
                      <p className="text-sm">(Limit Reached)</p>{" "}
                      <p className="text-sm">
                        You cannot place anymore bids.
                      </p>
                    </span>
                  ) : (
                    formatLimit(
                      acceptedBids.length +
                        pendingBids.length +
                        rejectedBids.length,
                      tierLimits.bids_per_month
                    )
                  )}
                </div>
              ) : (
                "Loading..."
              )}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active Loads</p>
            <span className="text-2xl font-semibold">
              {tierLimits ? (
                <div>
                  {acceptedBids.length === tierLimits.active_loads ? (
                    <span>
                      ⚠️ {acceptedBids.length} / {tierLimits.active_loads}{" "}
                      <p className="text-sm">(Limit Reached)</p>{" "}
                      <p className="text-xs text-primary font-light font-mono">
                        Your <i>PENDING</i> bids will not be accepted.
                      </p>
                    </span>
                  ) : (
                    formatLimit(acceptedBids.length, tierLimits.active_loads)
                  )}
                </div>
              ) : (
                "Loading..."
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Statistics
            acceptedBids={acceptedBids}
            pendingBids={pendingBids}
            rejectedBids={rejectedBids}
          />
        </div>

        <div className="col-span-3">
          <MyBids />
        </div>
      </div>
    </div>
  );
};

export default TruckerDashboard;
