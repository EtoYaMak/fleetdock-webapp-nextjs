import type { User } from "@supabase/supabase-js";

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
  vehicle_details: Record<string, any> | null;
  broker_details: Record<string, any> | null;
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
