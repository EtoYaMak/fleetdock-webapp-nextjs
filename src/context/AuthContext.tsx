"use client";

import { supabase } from "@/lib/supabase";
import { 
  createContext, 
  memo, 
  useContext, 
  useEffect, 
  useState, 
  useCallback,
  useMemo 
} from "react";
import { SignInType, SignUpType, UseContextType } from "@/types/auth";
import { useRouter } from "next/navigation";

export const UserContext = createContext<UseContextType>({} as UseContextType);

const UserProvider = memo(function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UseContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UseContextType["error"]>(null);

  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const sessionUser = await supabase.auth.getUser();
      
      if (sessionUser.data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.data.user.id)
          .single();

        if (profileError) throw profileError;

        const updatedUser = { ...sessionUser.data.user, ...profile };
        setUser(updatedUser);

        if (profile.role && window.location.pathname === "/") {
          router.push(`/dashboard`);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get user profile");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const signIn = useCallback(async (data: SignInType) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError) throw profileError;
        setUser({ ...authData.user, ...profile });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
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
  }, [router]);

  const signUp = useCallback(async (data: SignUpType) => {
    try {
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

      const { error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) throw signUpError;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sign up",
      };
    }
  }, []);

  useEffect(() => {
    getUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await getUserProfile();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [getUserProfile]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp
  }), [user, loading, error, signIn, signOut, signUp]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
});

export const useAuth = () => useContext(UserContext);

export default UserProvider;
