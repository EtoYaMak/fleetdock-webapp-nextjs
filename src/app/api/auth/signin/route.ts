import { NextResponse } from "next/server";
import { signin } from "../actions";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received signin request for:", data.email);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signin(formData);

    console.log("Signin successful, returning data:", {
      role: result.role,
      userId: result.user.id
    });

    return NextResponse.json({ 
      success: true,
      role: result.role,
      user: result.user,
      profile: result.profile
    });
  } catch (error) {
    console.error("Signin route error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const isAuthError = errorMessage.toLowerCase().includes('auth') || 
                       errorMessage.toLowerCase().includes('credentials');

    return NextResponse.json(
      { 
        error: isAuthError ? "Invalid credentials" : "An unexpected error occurred",
        details: errorMessage
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
} 