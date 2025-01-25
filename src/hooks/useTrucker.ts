//CRUD for trucker
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { TruckerDetails, TruckerFormData } from "@/types/trucker";

export const useTrucker = () => {
  const { user } = useAuth();
  const [trucker, setTrucker] = useState<TruckerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [truckers, setTruckers] = useState<TruckerDetails[]>([]);

  const fetchTrucker = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      if (user.role === "admin") {
        const { data, error } = await supabase
          .from("trucker_details")
          .select("*");
        setTruckers(data ?? []);
      } else {
        const { data, error } = await supabase
          .from("trucker_details")
          .select("*")
          .eq("profile_id", user.id)
          .single();
        setTrucker(data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trucker data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const createTrucker = async (data: TruckerFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("trucker_details").insert({
        profile_id: user.id,
        ...data,
        verification_status: "pending",
      });

      if (error) throw error;
      await fetchTrucker();
    } catch (err) {
      console.error(err);
      setError("Failed to create trucker profile");
    } finally {
      setIsLoading(false);
    }
  };
  const updateTrucker = async (data: TruckerFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("trucker_details")
        .update(data)
        .eq("profile_id", user.id);

      if (error) throw error;
      await fetchTrucker();
    } catch (err) {
      console.error(err);
      setError("Failed to update trucker profile");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchTrucker();
    }
  }, [user?.id, fetchTrucker]);

  return {
    trucker,
    truckers,
    isLoading,
    error,
    createTrucker,
    updateTrucker,
  };
};
