import { NextResponse } from "next/server";
import { signup } from "../actions";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Processing signup request for:", data.email);

    const result = await signup(data);
    
    if (!result.success) {
      console.error("Signup failed:", {
        error: result.error,
        email: data.email,
        role: data.role
      });
      
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log("Signup successful for:", data.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected signup error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 