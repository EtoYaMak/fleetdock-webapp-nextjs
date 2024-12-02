import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get load ID from request
    const { load_id }: { load_id: string } = await request.json();
    if (!load_id) {
      return NextResponse.json(
        { error: "Load ID is required" },
        { status: 400 }
      );
    }

    // Insert a bid for the fixed-rate load
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        load_id,
        trucker_id: user.id,
        bid_amount: 0, // The actual amount will be set by the database trigger
        bid_status: "pending",
      })
      .select()
      .single();

    if (bidError) {
      return NextResponse.json({ error: bidError.message }, { status: 400 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
