import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Utility to handle Supabase errors
const handleError = (error: any) =>
  NextResponse.json(
    { message: error.message || "An error occurred." },
    { status: 400 }
  );

export async function POST(req: Request) {
  const { email, password, username, phone, role, type } = await req.json();

  // Signin Logic
  if (type === "signin") {
    if (!email || !password) {
      return handleError({
        message: "Email and password are required for signin.",
      });
    }

    const { data: session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return handleError(error);
    }

    // Fetch user's role to redirect them correctly
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user?.id)
      .single();

    if (profileError) {
      return handleError(profileError);
    }

    const redirectTo =
      profile?.role === "trucker" ? "/dashboard/trucker" : "/dashboard/broker";

    return NextResponse.json({ message: "Signin successful.", redirectTo });
  }

  // Signup Logic
  if (type === "signup") {
    if (!email || !password || !username || !phone || !role) {
      return handleError({ message: "All fields are required for signup." });
    }

    try {
      // Step 1: Create user in Supabase Auth
      const { data: user, error: signUpError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Optional: Auto-confirm the email
        });

      if (signUpError) {
        throw signUpError;
      }

      // Step 2: Insert user details into profiles table
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          username,
          phone,
          role,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({
        message: "Signup successful. Please sign in.",
      });
    } catch (error) {
      return handleError(error);
    }
  }

  return handleError({ message: "Invalid request type." });
}
