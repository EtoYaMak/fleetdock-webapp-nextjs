import { NextResponse } from "next/server";
import { signout } from "../actions";

export async function POST() {
  try {
    await signout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    );
  }
} 