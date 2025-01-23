"use client";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { SignInType, SignUpType, UseContextType } from "@/types/auth";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
export const UserContext = createContext<UseContextType>({} as UseContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<UseContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UseContextType["error"]>(null);

  const setUserWithRole = (userData: any) => {
    if (userData) {
      setUser({
        ...userData,
        role: userData.app_metadata?.role
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getUserProfile = async () => {
      try {
        const sessionUser = await supabase.auth.getUser();

        if (isMounted && sessionUser.data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sessionUser.data.user.id)
            .single();

          if (isMounted) {
            setUserWithRole({ ...sessionUser.data.user, ...profile });
            setLoading(false);
          }
        } else if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to get user profile"
          );
          setLoading(false);
        }
      }
    };

    if (!user) {
      getUserProfile();
    } else {
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserWithRole(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserWithRole(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

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

      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        setUserWithRole({ ...authData.user, ...profile });
        return { success: true };
      }

      throw new Error("No user data returned");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign in";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Sign Out Successful",
        description: "You are now signed out.",
        variant: "success",
      });
      setUser(null);
      router.replace("/");
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description:
          error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpType) => {
    try {
      // Check if email exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", data.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "This email is already registered",
        };
      }

      // Proceed with signup
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name,
            role: data.role,
            phone: data.phone,
            email: data.email,
          },
        },
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Faidled to sign up",
      };
    }
  };
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      // Fetch the updated user profile again
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session?.user.id)
        .single();

      setUserWithRole({ ...data.session?.user, ...profile });
      toast({
        title: "Session Refreshed",
        description: "Your session has been refreshed successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description:
          error instanceof Error ? error.message : "Failed to refresh session",
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
