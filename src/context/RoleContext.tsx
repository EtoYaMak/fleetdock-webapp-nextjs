"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { RoleContextType, UserRole } from "@/types/auth";

// Export the context
export const RoleContext = createContext<RoleContextType>({
  role: null,
  isRoleLoading: true,
  setUserRole: () => {},
  isTrucker: false,
  isBroker: false,
  checkRole: () => false,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (profile?.role) {
        setRole(profile.role as UserRole);
      } else {
        setRole(null);
      }
      setIsRoleLoading(false);
    }
  }, [profile, isLoading]);

  const setUserRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const isTrucker = role === "trucker";
  const isBroker = role === "broker";

  const checkRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        isRoleLoading,
        setUserRole,
        isTrucker,
        isBroker,
        checkRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

// Move useRole to hooks/useRole.ts
