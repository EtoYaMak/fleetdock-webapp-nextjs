import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all bids for this load
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select("id, bid_amount, bid_status, created_at, trucker_id")
      .eq("load_id", resolvedParams.id)
      .order("bid_amount", { ascending: true });

    if (bidsError) {
      return NextResponse.json({ error: bidsError.message }, { status: 400 });
    }

    // Separate own bid and competing bids
    const ownBid = bids?.find((bid) => bid.trucker_id === user.id) || null;
    const competingBids =
      bids
        ?.filter((bid) => bid.trucker_id !== user.id)
        .map((bid) => ({
          id: bid.id,
          bid_amount: bid.bid_amount,
          created_at: bid.created_at,
          bid_status: bid.bid_status,
        })) || [];

    return NextResponse.json({
      ownBid,
      competingBids,
      totalBids: bids?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
