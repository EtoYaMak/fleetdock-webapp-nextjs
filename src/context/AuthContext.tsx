"use client";

import { supabase } from "@/lib/supabase";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { SignInType, SignUpType, UseContextType } from "@/types/auth";
import { useRouter } from "next/navigation";
export const UserContext = createContext<UseContextType>({} as UseContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UseContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UseContextType["error"]>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);
      const sessionUser = await supabase.auth.getUser();
      if (sessionUser.data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.data.user.id)
          .single();
        //test
        setUser({ ...sessionUser.data.user, ...profile });
      }
      setLoading(false);
    };

    getUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        getUserProfile();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
