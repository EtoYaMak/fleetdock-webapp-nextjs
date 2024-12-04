"use client";

import { supabase } from "@/lib/supabase";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { SignInType, SignUpType, UseContextType } from "@/types/auth";
import { useRouter } from "next/navigation";
export const UserContext = createContext<UseContextType>({} as UseContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UseContextType["user"]>(null);
  const [loading, setLoading] = useState<UseContextType["loading"]>(false);
  const [error, setError] = useState<UseContextType["error"]>(null);

  useEffect(() => {
    setLoading(true);
    console.log("UserProvider mounted");

    if (user) {
      setLoading(false);
      return;
    }

    const getUserProfile = async () => {
      console.log("Fetching user profile");

      const sessionUser = await supabase.auth.getUser();
      if (sessionUser.data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.data.user.id)
          .single();

        setUser({ ...sessionUser.data.user, ...profile });

        if (profile.role && window.location.pathname === "/") {
          router.push(`/dashboard`);
        }
      }
      setLoading(false);
    };

    getUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        getUserProfile();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [user]);

  const signIn = async (data: SignInType) => {
    try {
      setLoading(true);
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) throw authError;

      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        setUser({ ...authData.user, ...profile });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpType) => {
    await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, signIn, signOut, signUp }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default memo(UserProvider);
