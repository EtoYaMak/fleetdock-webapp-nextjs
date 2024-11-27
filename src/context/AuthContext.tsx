"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { AuthContextType, UserProfile } from "@/types/auth";

// Export the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        setUser(initialUser);

        if (initialUser) {
          await refreshProfile();
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await refreshProfile();
            } else {
              setProfile(null);
            }

            // Handle specific auth events
            switch (event) {
              case 'SIGNED_IN':
                router.refresh();
                break;
              case 'SIGNED_OUT':
                router.push('/');
                router.refresh();
                break;
              case 'USER_UPDATED':
                setIsLoading(true);
                await refreshProfile();
                setIsLoading(false);
                break;
            }
          }
        );

        setIsLoading(false);

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [supabase, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
