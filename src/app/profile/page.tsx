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
  // Conditionally fetch broker or trucker data based on user role
  const brokerData = user?.role === "broker" ? useBroker() : null;

  const truckerData = user?.role === "trucker" ? useTrucker() : null;

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      {user?.role === "broker" && brokerData && (
        <BrokerProfile
          user={user as User}
          broker={brokerData.broker as BrokerBusiness}
          isLoading={brokerData.isLoading}
          error={brokerData.error as string}
          createBroker={brokerData.createBroker}
          updateBroker={brokerData.updateBroker}
        />
      )}

      {user?.role === "trucker" && truckerData && (
        <TruckerProfile
          user={user as User}
          trucker={truckerData.trucker as TruckerDetails}
          isLoading={truckerData.isLoading}
          error={truckerData.error as string}
          createTrucker={truckerData.createTrucker}
          updateTrucker={truckerData.updateTrucker}
        />
      )}
    </div>
  );
}
