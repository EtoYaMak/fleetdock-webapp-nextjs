import type { User } from "@supabase/supabase-js";

interface VehicleDetails {
  make?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  capacity?: number;
  // Add other vehicle-specific fields as needed
}

interface BrokerDetails {
  license?: string;
  insuranceNumber?: string;
  companyRegistration?: string;
  // Add other broker-specific fields as needed
}

export interface UserProfile {
  id: string;
  updated_at: string | null;
  created_at: string | null;
  username: string | null;
  full_name: string | null;
  email: string;
  role: string;
  phone: string;
  address: string | null;
  company_name: string | null;
  vehicle_details: VehicleDetails | null;
  broker_details: BrokerDetails | null;
  profile_picture: string | null;
  is_active: boolean | null;
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ role: string }>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export type UserRole = "trucker" | "broker" | "admin";

export type RoleContextType = {
  role: UserRole | null;
  isRoleLoading: boolean;
  setUserRole: (role: UserRole) => void;
  isTrucker: boolean;
  isBroker: boolean;
  checkRole: (allowedRoles: UserRole[]) => boolean;
};
