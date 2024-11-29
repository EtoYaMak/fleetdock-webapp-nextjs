"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface SignUpData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role: string;
  phone: string;
}

export async function signup(data: SignUpData) {
  const supabase = await createClient();

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
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
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

    return {
      success: true,
      message: "Sign up successful. Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function signin(data: { email: string; password: string }) {
  const supabase = await createClient();

  try {
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    revalidatePath("/", "layout");
    return { success: true, user: authData.user, profile };
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
