"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import BrokerProfile from "@/app/profile/BrokerProfile";
import TruckerProfile from "@/app/profile/TruckerProfile";
import { User } from "@/types/auth";
export default function ProfilePage() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setRole(user.role); // Set the role based on the authenticated user
    }
  }, [user]);

  if (!role) {
    return <div>Loading...</div>; // Show loading state while determining role
  }

  return (
    <div className="profile-page">
      {role === "broker" ? (
        <BrokerProfile user={user as User} />
      ) : (
        <TruckerProfile user={user as User} />
      )}
    </div>
  );
}
