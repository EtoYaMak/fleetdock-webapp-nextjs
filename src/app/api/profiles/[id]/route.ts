import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  if (!resolvedParams.id) {
    return NextResponse.json(
      { error: "Profile ID is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    // Removed avatar_url from select since it doesn't exist
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        company_name
      `
      )
      .eq("id", resolvedParams.id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 400 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
