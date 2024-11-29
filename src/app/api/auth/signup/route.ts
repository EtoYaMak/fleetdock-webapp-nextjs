import { NextResponse } from "next/server";
import { signup } from "../actions";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await signup(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
