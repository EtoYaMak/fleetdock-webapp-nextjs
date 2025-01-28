import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/auth";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createProfile = async (data: User) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        ...data,
        id: user.id,
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setError("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: User) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error(error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;
      setProfile(null);
    } catch (error) {
      console.error(error);
      setError("Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [getProfile, user]);

  return {
    profile,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    loading,
    error,
  };
};
