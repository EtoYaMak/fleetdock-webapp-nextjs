import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, LoadResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<LoadResponse>>> {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }

    // Get user's role from user metadata
    const userRole = user.user_metadata?.role;

    let query = supabase
      .from("loads")
      .select("*")
      .eq("id", resolvedParams.id);

    // If broker, only allow viewing their own loads
    if (userRole === "broker") {
      query = query.eq("broker_id", user.id);
    }
    // If trucker, allow viewing any load
    
    const { data: load, error } = await query.single();

    if (error) {
      return NextResponse.json(
        { error: "Load not found", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { load }, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching load:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();
    const data = await request.json();

    // Get the user's ID from the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: load, error } = await supabase
      .from("loads")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resolvedParams.id)
      .eq("broker_id", user.id) // Ensure the user owns this load
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ load });
  } catch (error) {
    console.error("Error updating load:", error);
    return NextResponse.json(
      { error: "Failed to update load" },
      { status: 500 }
    );
  }
}
