import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: "trucker" | "broker";
  phone: string;
  is_active: boolean;
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
