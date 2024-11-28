import type { User } from "@supabase/supabase-js";

export type UserRole = "trucker" | "broker" | null;

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
  phone: string;
  is_active: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface RoleContextType {
  role: UserRole;
  isRoleLoading: boolean;
  setUserRole: (role: UserRole) => void;
  isTrucker: boolean;
  isBroker: boolean;
  checkRole: (allowedRoles: UserRole[]) => boolean;
}
