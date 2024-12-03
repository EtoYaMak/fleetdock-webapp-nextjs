import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  company_name: string;
}

export interface UseContextType {
  user: User | null;
  loading: boolean;
  error: any;
  signIn: (data: SignInType) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpType) => Promise<void>;
}

export interface SignInType {
  email: string;
  password: string;
}

export interface SignUpType {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
}
