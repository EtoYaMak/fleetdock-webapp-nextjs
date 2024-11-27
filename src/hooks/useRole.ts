import { useContext, useState, useEffect } from "react";
import { RoleContext } from "@/context/RoleContext";
import type { RoleContextType, UserRole } from "@/types/auth";

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const useRoleGuard = (allowedRoles: UserRole[]) => {
  const { role, isRoleLoading } = useRole();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isRoleLoading) {
      setHasAccess(role ? allowedRoles.includes(role) : false);
    }
  }, [role, allowedRoles, isRoleLoading]);

  return {
    hasAccess,
    isLoading: isRoleLoading,
  };
};
