"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import BrokerProfile from "@/app/profile/BrokerProfile";
import TruckerProfile from "@/app/profile/TruckerProfile";
import { User } from "@/types/auth";
import { BrokerBusiness } from "@/types/broker";
import { useBroker } from "@/hooks/useBroker";
import { useTrucker } from "@/hooks/useTrucker";
import { TruckerDetails } from "@/types/trucker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
export default function ProfilePage() {
  const { user } = useAuth();
  // Call hooks unconditionally at the top level
  const {
    broker,
    isLoading: brokerLoading,
    error: brokerError,
    createBroker,
    updateBroker,
  } = useBroker();
  const {
    trucker,
    isLoading: truckerLoading,
    error: truckerError,
    createTrucker,
    updateTrucker,
  } = useTrucker();
  // Conditionally fetch broker or trucker data based on user role
  // Then use the data conditionally
  const profileData =
    user?.role === "broker"
      ? broker
      : user?.role === "trucker"
      ? trucker
      : null;

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      {user?.role === "broker" && (
        <BrokerProfile
          user={user as User}
          broker={broker as BrokerBusiness}
          isLoading={brokerLoading}
          error={brokerError as string}
          createBroker={createBroker}
          updateBroker={updateBroker}
        />
      )}

      {user?.role === "trucker" && profileData && (
        <TruckerProfile
          user={user as User}
          trucker={trucker as TruckerDetails}
          isLoading={truckerLoading}
          error={truckerError as string}
          createTrucker={createTrucker}
          updateTrucker={updateTrucker}
        />
      )}
    </div>
  );
}
