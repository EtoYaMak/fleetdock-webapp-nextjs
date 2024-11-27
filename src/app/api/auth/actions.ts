"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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
    console.log("Signup data received:", {
      email: data.email,
      username: data.username,
      full_name: data.full_name,
      role: data.role,
      phone: data.phone,
    });

    // First check if email exists
    const { data: existingUser, error: emailCheckError } = await supabase
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
          // Only include essential metadata
          email: data.email, // Include email in metadata
        },
      },
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      throw signUpError;
    }

    if (!authData?.user) {
      throw new Error("No user returned after signup");
    }

    console.log("Auth signup successful. User ID:", authData.user.id);

    // Wait briefly for trigger
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message:
        "Sign up successful. Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Full signup error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function signin(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("Attempting signin for email:", data.email);

    const { error, data: authData } = await supabase.auth.signInWithPassword(data);

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    if (!authData.user) {
      console.error("No user returned after successful auth");
      throw new Error("No user returned after signin");
    }

    console.log("Auth successful, fetching profile for user:", authData.user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw new Error("Could not fetch user profile");
    }

    console.log("Profile fetched successfully:", profile);

    // Make sure we have a role
    if (!profile.role) {
      throw new Error("User profile has no role");
    }

    revalidatePath("/", "layout");
    return { 
      success: true, 
      role: profile.role,
      user: authData.user,
      profile 
    };
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
