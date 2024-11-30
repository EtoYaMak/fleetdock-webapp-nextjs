import { NextResponse } from "next/server";
import { signin } from "../actions";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await signin(data);

    if (!result.success) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Signin route error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const isAuthError =
      errorMessage.toLowerCase().includes("auth") ||
      errorMessage.toLowerCase().includes("credentials");

    return NextResponse.json(
      {
        error: isAuthError
          ? "Invalid credentials"
          : "An unexpected error occurred",
        details: errorMessage,
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
