// hooks/useCheckEmail.ts
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export async function checkEmailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (error) {
    console.error("Error checking email:", error.message);
    return false;
  }

  return data && data.length > 0;
}

export function useCheckEmail() {
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  const verifyEmail = useCallback(async (email: string) => {
    setLoading(true);
    const exists = await checkEmailExists(email);
    setEmailExists(exists);
    setLoading(false);
  }, []);

  return { emailExists, loading, verifyEmail };
}
