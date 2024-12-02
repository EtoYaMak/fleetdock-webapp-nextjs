import { NextResponse, NextRequest } from "next/server";
import type { BidStatus } from "@/types/bids";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams.id) {
      return NextResponse.json(
        { error: "Bid ID is required" },
        { status: 400 }
      );
    }
    const supabase = await createClient();
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bid status from request
    const { bid_status }: { bid_status: BidStatus } = await request.json();
    if (!bid_status || !["accepted", "rejected"].includes(bid_status)) {
      return NextResponse.json(
        { error: 'Invalid bid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      );
    }

    // Update the bid status
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .update({ bid_status })
      .eq("id", resolvedParams.id)
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
