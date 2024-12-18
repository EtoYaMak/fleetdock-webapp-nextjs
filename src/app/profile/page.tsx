"use client";

import { useAuth } from "@/context/AuthContext";
import BrokerProfile from "@/app/profile/BrokerProfile";
import TruckerProfile from "@/app/profile/TruckerProfile";
import { User } from "@/types/auth";
import { BrokerBusiness } from "@/types/broker";
import { useBroker } from "@/hooks/useBroker";
import { useTrucker } from "@/hooks/useTrucker";
import { TruckerDetails } from "@/types/trucker";

export default function ProfilePage() {
  const { user } = useAuth();

  // Use a role-specific hook based on user role
  const {
    broker,
    isLoading: brokerLoading,
    error: brokerError,
    createBroker,
    updateBroker,
  } = user?.role === "broker"
    ? useBroker()
    : {
        broker: null,
        isLoading: false,
        error: null,
        createBroker: null,
        updateBroker: null,
      };

  const {
    trucker,
    isLoading: truckerLoading,
    error: truckerError,
    createTrucker,
    updateTrucker,
  } = user?.role === "trucker"
    ? useTrucker()
    : {
        trucker: null,
        isLoading: false,
        error: null,
        createTrucker: null,
        updateTrucker: null,
      };

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
          createBroker={createBroker!}
          updateBroker={updateBroker!}
        />
      )}

      {user?.role === "trucker" && (
        <TruckerProfile
          user={user as User}
          trucker={trucker as TruckerDetails}
          isLoading={truckerLoading}
          error={truckerError as string}
          createTrucker={createTrucker!}
          updateTrucker={updateTrucker!}
        />
      )}
    </div>
  );
}
