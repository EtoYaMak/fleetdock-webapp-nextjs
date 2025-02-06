// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  phone: string;
  membership_tier: string | null;
  membership_status: string | null;
  stripe_customer_id?: string | null;
  subscription_id?: string | null;
  subscription_end_date?: string | null;
  avatar?: string | null;
  is_active: boolean;
  company_name: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
  email_verified?: boolean | null;
  is_admin?: boolean | null;
  app_metadata: {
    role: string;
  };
}

export interface UseContextType {
  user: User | null;
  loading: boolean;
  error: any;
  refreshSession: () => Promise<void>;
  signIn: (data: SignInType) => Promise<{
    success: boolean;
    error?: string | null;
  }>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpType) => Promise<{
    success: boolean;
    error?: string | null;
  }>;
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
  membership_tier: string;
  membership_status: string;
  stripe_customer_id?: string | null;
  subscription_id?: string | null;
  subscription_end_date?: string | null;
  selectedTier: "starter" | "professional" | "enterprise";
}

// Helper function to get the correct role
export const getUserRole = (user: User): string => {
  return user?.app_metadata?.role;
};
