import { useState, useEffect, useCallback } from "react";
import { BrokerBusiness, BrokerFormData } from "@/types/broker";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const useBroker = () => {
  const { user } = useAuth();
  const [broker, setBroker] = useState<BrokerBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBroker = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("broker_businesses")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setBroker(null);
          return;
        }
        throw error;
      }
      setBroker(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch broker data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const createBroker = async (data: BrokerFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("broker_businesses")
        .insert({
          profile_id: user.id,
          ...data,
          verification_status: "pending"
        });

      if (error) throw error;
      await fetchBroker();
    } catch (err) {
      console.error(err);
      setError("Failed to create broker profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBroker = async (data: BrokerFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("broker_businesses")
        .update(data)
        .eq("profile_id", user.id);

      if (error) throw error;
      await fetchBroker();
    } catch (err) {
      console.error(err);
      setError("Failed to update broker profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBroker();
    }
  }, [user?.id, fetchBroker]);

  return {
    broker,
    isLoading,
    error,
    createBroker,
    updateBroker,
  };
};
