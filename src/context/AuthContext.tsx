// src/context/AuthContext.tsx
"use client";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  UseContextType,
  SignInType,
  SignUpType,
  getUserRole,
} from "@/types/auth";

export const UserContext = createContext<UseContextType>({} as UseContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to set user with role
  const setUserWithRole = (userData: User | null) => {
    if (userData) {
      setUser({
        ...userData,
        role: getUserRole(userData),
      });
    } else {
      setUser(null);
    }
  };

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string): Promise<User> => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return profile;
  };

  // Fetch user data on mount and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (isMounted && sessionData.session?.user) {
          const profile = await fetchUserProfile(sessionData.session.user.id);
          setUserWithRole({ ...sessionData.session.user, ...profile });
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch user data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUserWithRole({ ...session.user, ...profile });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (data: SignInType) => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("No user data returned");
      }

      const profile = await fetchUserProfile(authData.user.id);
      setUserWithRole({ ...authData.user, ...profile });

      toast({
        title: "Sign In Successful",
        description: "You are now signed in.",
        variant: "success",
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      setError(errorMessage);
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Sign Out Successful",
        description: "You are now signed out.",
        variant: "success",
      });
      router.replace("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign out";
      toast({
        title: "Sign Out Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpType) => {
    try {
      // Email check remains the same
      const { data: existingUsers, error: emailCheckError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", data.email);

      if (existingUsers && existingUsers.length > 0) {
        return {
          success: false,
          error: "This email is already registered",
        };
      }

      const initialStatus = data.selectedTier === 'starter' ? 'active' : 'pending';


      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name,
            phone: data.phone,
            membership_tier: data.selectedTier,
            membership_status: initialStatus,
            stripe_customer_id: null,
            subscription_id: null,
            subscription_end_date: data.subscription_end_date ? data.subscription_end_date.toString() : null,
            role: data.role
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Faidled to sign up",
      };
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (data.session?.user) {
        const profile = await fetchUserProfile(data.session.user.id);
        setUserWithRole({ ...data.session.user, ...profile });
      }

      toast({
        title: "Session Refreshed",
        description: "Your session has been refreshed successfully.",
        variant: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh session";
      toast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, signIn, signOut, signUp, refreshSession }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default UserProvider;