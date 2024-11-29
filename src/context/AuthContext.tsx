"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import type { AuthContextType, UserProfile, SignUpData } from "@/types/auth";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => ({ role: "" }),
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshProfile = useCallback(
    async (userId: string) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error) {
        console.error("Error refreshing profile:", error);
        setProfile(null);
      }
    },
    [supabase]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { user: initialUser },
        } = await supabase.auth.getUser();
        setUser(initialUser);

        if (initialUser) {
          await refreshProfile(initialUser.id);
        }

        // Subscribe to auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await refreshProfile(currentUser.id);

            if (event === "SIGNED_IN") {
              router.refresh();
            }
          } else {
            setProfile(null);
            if (event === "SIGNED_OUT") {
              router.push("/");
              router.refresh();
            }
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [supabase, router, refreshProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Get the user after sign in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found after sign in");

      // Get the user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Set the user and profile in state
      setUser(user);
      setProfile(profile);

      // Return the role for redirect
      return { role: profile.role };
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name,
            role: data.role,
            phone: data.phone,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      redirect("/");
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile: () =>
          user ? refreshProfile(user.id) : Promise.resolve(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
